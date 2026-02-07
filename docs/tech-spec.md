# Adaptive Customer Intelligence Platform — Technical Specification

**Version:** 1.0
**Date:** 2026-02-07
**Stack:** Next.js 16 (App Router) / TypeScript / MongoDB / Claude (Anthropic) via Vercel AI SDK

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Data Layer — MongoDB](#3-data-layer--mongodb)
4. [Profile Engine](#4-profile-engine)
5. [Dynamic Fit Scoring](#5-dynamic-fit-scoring)
6. [Live Agent](#6-live-agent)
7. [Profile Evolution](#7-profile-evolution)
8. [API Route Specifications](#8-api-route-specifications)
9. [UI Component Specifications](#9-ui-component-specifications)
10. [TypeScript Interfaces](#10-typescript-interfaces)
11. [Accessibility & Performance](#11-accessibility--performance)
12. [Sample Payloads](#12-sample-payloads)

---

## 1. Overview

### 1.1 Purpose

A platform that builds behavioral profiles from MongoDB interaction history, scores customers on outcome-relevant dimensions, and powers a live Claude-based agent that demonstrably adapts its tone, strategy, and approach per customer — reflecting growth and trajectory rather than flat averages.

### 1.2 Core Pillars

| Pillar | Summary |
|---|---|
| **Profile Engine** | Extract temperament, follow-through, sentiment trends, communication style, and life-stage signals from interaction history. |
| **Dynamic Fit Scoring** | Score likelihood-to-pay, responsiveness, best contact method/timing, escalation risk. Scores shift with reasoning. |
| **Live Agent** | Claude-powered agent that references the profile in real time. Demonstrably different behavior depending on who it's talking to. |
| **Profile Evolution** | Handle conflicting signals. A hostile customer who recently turned cooperative reflects growth, not an average. |

### 1.3 Success Criteria

- Given two customers with different profiles, the agent produces observably different opening messages, tone, and negotiation strategies.
- Score changes include a human-readable `reasoning` string explaining what shifted and why.
- A customer who was hostile for 6 months but cooperative for the last 3 weeks has a profile that reflects the cooperative trajectory, not a blended "neutral."
- Agent decisions are auditable: every response includes a log entry explaining which profile traits influenced the behavior.

---

## 2. Architecture

### 2.1 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                       │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Agent Chat   │  │  Profile     │  │  Score Dashboard   │    │
│  │  Interface    │  │  Viewer      │  │  + History         │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
│         │                 │                    │                │
│  ───────┴─────────────────┴────────────────────┴────────────── │
│                     API Route Layer                              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ POST         │  │ GET          │  │ GET                │    │
│  │ /api/agent   │  │ /api/profile │  │ /api/scores        │    │
│  │ /chat        │  │ /[userId]    │  │ /[userId]          │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
│         │                 │                    │                │
│  ───────┴─────────────────┴────────────────────┴────────────── │
│                    Service Layer                                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ AgentService │  │ ProfileEngine│  │  ScoringEngine     │    │
│  │ (Claude SDK) │  │              │  │                    │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
│         │                 │                    │                │
└─────────┴─────────────────┴────────────────────┴────────────────┘
                            │
                    ┌───────┴───────┐
                    │   MongoDB     │
                    │               │
                    │ interactions  │
                    │ profiles      │
                    │ scores        │
                    │ agent_logs    │
                    └───────────────┘
```

### 2.2 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, App Router, TypeScript |
| AI | Claude via Vercel AI SDK (`anthropic/claude-sonnet-4-20250514`) |
| Database | MongoDB (existing interaction data) |
| ODM | Mongoose 8.x |
| Client State | SWR for data fetching/caching |
| UI | shadcn/ui + Tailwind CSS |
| Streaming | Vercel AI SDK `streamText` for real-time agent responses |

### 2.3 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB_NAME` | Database name (default: `customer_intelligence`) |

> Claude is accessed via the Vercel AI Gateway — no separate API key required.

---

## 3. Data Layer — MongoDB

### 3.1 Existing Collection: `interactions`

This is the source-of-truth data. The platform reads from this collection but never writes to it. The schema below describes the expected shape of existing documents.

```typescript
// Collection: interactions
// This is the EXISTING data in MongoDB. We read from it, never write.
{
  _id: ObjectId,
  userId: string,                    // Customer identifier
  agentId: string,                   // Human or AI agent who handled this
  channel: "phone" | "chat" | "email" | "sms",
  timestamp: Date,
  direction: "inbound" | "outbound",

  // Conversation content
  messages: [
    {
      role: "customer" | "agent",
      content: string,
      timestamp: Date
    }
  ],

  // Outcome metadata
  outcome: "resolved" | "escalated" | "abandoned" | "callback_scheduled",
  promisesMade: [
    {
      description: string,           // e.g., "Pay $200 by Friday"
      dueDate: Date,
      fulfilled: boolean | null      // null = pending
    }
  ],

  // Existing tags/metadata
  tags: string[],
  sentiment: number,                 // -1 to 1, if pre-computed
  duration: number                   // seconds
}
```

### 3.2 New Collection: `profiles`

Created and maintained by the Profile Engine. One document per `userId`.

```typescript
// Collection: profiles
{
  _id: ObjectId,
  userId: string,                    // Indexed, unique
  
  // --- Extracted Traits ---
  traits: {
    temperament: {
      current: "hostile" | "guarded" | "neutral" | "cooperative" | "enthusiastic",
      confidence: number,            // 0-1
      history: [
        { value: string, from: Date, to: Date }
      ]
    },

    followThrough: {
      rate: number,                  // 0-1, promises kept / promises made
      totalPromises: number,
      keptPromises: number,
      recentTrend: "improving" | "declining" | "stable",
      lastEvaluated: Date
    },

    sentimentTrend: {
      current: number,               // -1 to 1
      movingAverage30d: number,
      movingAverage90d: number,
      trajectory: "improving" | "declining" | "stable",
      dataPoints: [
        { date: Date, value: number, interactionId: ObjectId }
      ]
    },

    communicationStyle: {
      primary: "terse" | "verbose" | "formal" | "casual" | "emotional" | "analytical",
      averageMessageLength: number,  // words
      preferredChannel: "phone" | "chat" | "email" | "sms",
      respondsToHumor: boolean,
      respondsToEmpathy: boolean,
      respondsToDirectness: boolean
    },

    lifeStageSignals: {
      indicators: string[],          // e.g., ["mentioned new job", "relocating", "financial hardship"]
      inferred: string | null,       // e.g., "career transition", "financial stress"
      lastUpdated: Date
    }
  },

  // --- Behavioral Phases ---
  phases: [
    {
      label: string,                 // e.g., "Hostile phase", "Cooperative phase"
      temperament: string,
      startDate: Date,
      endDate: Date | null,          // null = current phase
      interactionCount: number,
      avgSentiment: number,
      triggerEvent: string | null     // What caused the phase shift
    }
  ],

  // --- Growth Narrative ---
  narrative: string,                 // Auto-generated human-readable summary
  narrativeUpdatedAt: Date,

  // --- Metadata ---
  totalInteractions: number,
  firstInteraction: Date,
  lastInteraction: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```
{ userId: 1 }                        — unique
{ "traits.temperament.current": 1 }  — for cohort queries
{ updatedAt: -1 }                    — for stale profile detection
```

### 3.3 New Collection: `scores`

One document per `userId`. Updated after each interaction.

```typescript
// Collection: scores
{
  _id: ObjectId,
  userId: string,                    // Indexed, unique

  dimensions: {
    likelihoodToPay: {
      score: number,                 // 0-100
      confidence: number,            // 0-1
      reasoning: string,             // "Kept 4/5 recent promises, income signals stable"
      factors: [
        { factor: string, weight: number, contribution: number }
      ]
    },

    responsiveness: {
      score: number,
      confidence: number,
      reasoning: string,
      factors: [...]
    },

    bestContactMethod: {
      recommended: "phone" | "chat" | "email" | "sms",
      confidence: number,
      reasoning: string,             // "Resolves 80% of issues via chat, avg 2min response"
      successRates: {
        phone: number,
        chat: number,
        email: number,
        sms: number
      }
    },

    bestContactTiming: {
      recommended: {
        dayOfWeek: number[],         // 0=Sun, 6=Sat
        hourRange: [number, number], // e.g., [9, 12] for 9am-noon
        timezone: string
      },
      confidence: number,
      reasoning: string
    },

    escalationRisk: {
      score: number,                 // 0-100, higher = more risk
      confidence: number,
      reasoning: string,
      triggers: string[]             // Known escalation triggers for this customer
    },

    frustrationRisk: {
      score: number,
      confidence: number,
      reasoning: string,
      currentState: "calm" | "mildly_frustrated" | "frustrated" | "highly_frustrated",
      recentTriggers: string[]
    }
  },

  // --- Score Changelog ---
  changelog: [
    {
      timestamp: Date,
      dimension: string,
      previousScore: number,
      newScore: number,
      reasoning: string,             // "Dropped from 72 to 58: missed 2 consecutive payment promises"
      triggerInteractionId: ObjectId
    }
  ],

  compositeScore: number,            // Weighted aggregate, 0-100
  lastComputedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```
{ userId: 1 }                                — unique
{ "dimensions.escalationRisk.score": -1 }    — for high-risk queues
{ lastComputedAt: -1 }                       — for stale score detection
```

### 3.4 New Collection: `agent_logs`

Every agent interaction is logged with reasoning for audit.

```typescript
// Collection: agent_logs
{
  _id: ObjectId,
  userId: string,
  sessionId: string,
  timestamp: Date,

  // What the agent decided
  decision: {
    toneUsed: string,                // "empathetic", "direct", "formal"
    strategyUsed: string,            // "de-escalation-first", "efficient-resolution", "rapport-building"
    approachNotes: string,           // Free-text reasoning
    profileTraitsReferenced: string[], // Which traits influenced the decision
    scoresDimensionsReferenced: string[]
  },

  // The actual message
  message: {
    role: "agent",
    content: string
  },

  // Profile snapshot at time of decision (for audit trail)
  profileSnapshotId: ObjectId | null
}
```

### 3.5 MongoDB Connection

```typescript
// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "customer_intelligence",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

## 4. Profile Engine

### 4.1 Purpose

Extract behavioral traits from the `interactions` collection and maintain a living profile document per customer.

### 4.2 Trait Extraction Pipeline

The Profile Engine runs as a service function invoked:
- **On-demand** — when a profile is requested and is stale (>1 hour since last update)
- **Post-interaction** — triggered after a new interaction is closed
- **Batch** — nightly cron for all active customers

#### 4.2.1 Temperament Extraction

**Method:** Aggregate the last N interactions (default: 20, weighted by recency).

```
Input:  messages[].content (customer messages only), outcome, escalation events
Process:
  1. Run sentiment analysis on each customer message via Claude:
     - Prompt: "Classify the temperament of this customer message as one of:
       hostile, guarded, neutral, cooperative, enthusiastic. Return only the label."
  2. Apply recency weighting: interaction_weight = e^(-decay * days_ago)
     - decay constant: 0.05 (half-life ~14 days)
  3. Weighted vote across interactions → current temperament
  4. Compare to previous temperament → detect phase transitions

Output: traits.temperament.current, traits.temperament.confidence, phase transitions
```

#### 4.2.2 Follow-Through Rate

**Method:** Query all `promisesMade` subdocuments for the user.

```
Input:  interactions[].promisesMade[]
Process:
  1. Count total promises, kept promises, broken promises, pending promises
  2. Compute rate = kept / (kept + broken)  [exclude pending]
  3. Compute recentTrend: compare last-30-day rate vs last-90-day rate
     - If 30d > 90d + 0.1 → "improving"
     - If 30d < 90d - 0.1 → "declining"
     - Else → "stable"

Output: traits.followThrough.rate, .recentTrend
```

#### 4.2.3 Sentiment Trend

**Method:** Time-series analysis of per-interaction sentiment.

```
Input:  interactions[].sentiment (pre-computed) OR computed on-the-fly via Claude
Process:
  1. Collect (date, sentiment) pairs for the customer
  2. Compute 30-day and 90-day moving averages
  3. Trajectory:
     - If 30d_avg > 90d_avg + 0.15 → "improving"
     - If 30d_avg < 90d_avg - 0.15 → "declining"
     - Else → "stable"

Output: traits.sentimentTrend.current, .trajectory, .dataPoints
```

#### 4.2.4 Communication Style

**Method:** Statistical analysis of customer messages.

```
Input:  All customer messages across interactions
Process:
  1. Average message length (words) → terse (<15), verbose (>50), else moderate
  2. Formality detection via Claude:
     - "Classify this message set as: formal, casual, emotional, analytical"
  3. Channel preference: mode of interaction[].channel
  4. Response-to-approach analysis:
     - For each interaction, correlate agent approach → outcome
     - "When agent used humor, did customer engage? Y/N"
     - "When agent used empathy, did sentiment improve? Y/N"
     - "When agent was direct, was resolution faster? Y/N"

Output: traits.communicationStyle.*
```

#### 4.2.5 Life-Stage Signals

**Method:** NLP extraction from conversation content.

```
Input:  Customer messages (full text)
Process:
  1. Prompt Claude with last 10 interactions' customer messages:
     "Extract any life-stage signals from these messages. Look for:
      - Job changes, financial stress, relocation, family changes, health issues
      - Seasonal patterns (holidays, tax season)
      Return a JSON array of indicators and an inferred life stage if possible."

Output: traits.lifeStageSignals.indicators[], .inferred
```

### 4.3 Computation Cost Management

- **Claude calls are batched**: Temperament + communication style + life-stage signals are extracted in a single prompt per profile refresh, not per-trait.
- **Caching**: Profile documents serve as cache. The `updatedAt` timestamp controls staleness.
- **Incremental updates**: On post-interaction trigger, only the new interaction's data is analyzed and merged into existing traits. Full recomputation only on nightly batch.

### 4.4 Profile Refresh Logic

```typescript
async function getOrRefreshProfile(userId: string): Promise<Profile> {
  const existing = await ProfileModel.findOne({ userId });

  if (!existing) {
    // First time — full computation
    return await computeFullProfile(userId);
  }

  const hoursSinceUpdate = (Date.now() - existing.updatedAt.getTime()) / 3600000;

  if (hoursSinceUpdate > 1) {
    // Stale — incremental update
    return await incrementalProfileUpdate(userId, existing);
  }

  return existing;
}
```

---

## 5. Dynamic Fit Scoring

### 5.1 Purpose

Score customers on dimensions that matter for outcomes. Scores shift as new data arrives, and every shift includes a clear reasoning string.

### 5.2 Scoring Dimensions

| Dimension | Range | Description |
|---|---|---|
| `likelihoodToPay` | 0-100 | Probability the customer will fulfill a payment commitment |
| `responsiveness` | 0-100 | How quickly and consistently the customer engages |
| `bestContactMethod` | enum | Channel with highest resolution success rate |
| `bestContactTiming` | struct | Day/time window with best response rates |
| `escalationRisk` | 0-100 | Probability of escalation in next interaction |
| `frustrationRisk` | 0-100 | Current frustration level based on recent interactions |

### 5.3 Scoring Algorithm

Each dimension is computed from a weighted factor model:

```
score = Σ (factor_value × factor_weight) / Σ factor_weight
```

#### 5.3.1 Likelihood to Pay

| Factor | Weight | Source |
|---|---|---|
| Promise fulfillment rate (last 90 days) | 0.35 | `profile.traits.followThrough.rate` |
| Promise fulfillment trend | 0.15 | `profile.traits.followThrough.recentTrend` |
| Sentiment trajectory | 0.15 | `profile.traits.sentimentTrend.trajectory` |
| Life-stage financial signals | 0.15 | `profile.traits.lifeStageSignals.inferred` |
| Historical payment pattern (if available) | 0.20 | `interactions` with payment outcomes |

**Confidence** = `min(1, totalDataPoints / 10)` — requires at least 10 data points for full confidence.

#### 5.3.2 Responsiveness

| Factor | Weight | Source |
|---|---|---|
| Avg response time to outbound messages | 0.30 | `interactions` timestamps |
| Response rate (replied / contacted) | 0.30 | `interactions` direction analysis |
| Channel engagement rate | 0.20 | `interactions` per-channel response rates |
| Recent response trend (last 30d vs 90d) | 0.20 | Computed from timestamps |

#### 5.3.3 Escalation Risk

| Factor | Weight | Source |
|---|---|---|
| Current temperament | 0.25 | `profile.traits.temperament.current` |
| Sentiment trajectory | 0.20 | Declining sentiment = higher risk |
| Recent escalation count (last 90d) | 0.25 | `interactions` with `outcome: "escalated"` |
| Known triggers present in context | 0.15 | `profile.phases[].triggerEvent` |
| Frustration risk score | 0.15 | Circular dependency — computed first, fed in |

### 5.4 Score Shift with Reasoning

When a score changes, a changelog entry is generated:

```typescript
async function updateScoreWithChangelog(
  userId: string,
  dimension: string,
  newScore: number,
  previousScore: number,
  interactionId: ObjectId
): Promise<void> {
  const delta = newScore - previousScore;

  if (Math.abs(delta) < 2) return; // Ignore negligible changes

  const reasoning = await generateScoreReasoning(
    userId, dimension, previousScore, newScore, interactionId
  );
  // reasoning example: "Dropped from 72 to 58: missed 2 consecutive
  // payment promises (Dec 15, Jan 3). Follow-through rate declined
  // from 0.8 to 0.6 over last 30 days."

  await ScoreModel.updateOne(
    { userId },
    {
      $set: {
        [`dimensions.${dimension}.score`]: newScore,
        [`dimensions.${dimension}.reasoning`]: reasoning,
        lastComputedAt: new Date(),
      },
      $push: {
        changelog: {
          timestamp: new Date(),
          dimension,
          previousScore,
          newScore,
          reasoning,
          triggerInteractionId: interactionId,
        },
      },
    }
  );
}
```

### 5.5 Reasoning Generation

Score reasoning is generated by Claude with structured input:

```
System: You are a scoring analyst. Given the old score, new score, and the
data that changed, produce a 1-2 sentence explanation of WHY the score shifted.
Be specific — reference dates, counts, and patterns. Do not be vague.

User:
Dimension: likelihoodToPay
Previous: 72
New: 58
Recent changes:
- Promise made on Dec 15 ("Pay $200 by Dec 20"): BROKEN
- Promise made on Jan 3 ("Pay $150 by Jan 10"): BROKEN
- Follow-through rate: 0.8 → 0.6 (30d window)
- Sentiment: stable (no change)
```

---

## 6. Live Agent

### 6.1 Purpose

A Claude-powered agent that references the customer profile in real time and demonstrably behaves differently depending on who it's talking to.

### 6.2 System Prompt Assembly

The agent's system prompt is dynamically constructed before each conversation turn. It is **not** a static prompt — it changes per customer.

```typescript
function buildSystemPrompt(profile: Profile, scores: Scores): string {
  return `You are a customer service agent for [Company].

## CUSTOMER PROFILE — ${profile.userId}

### Temperament
Current: ${profile.traits.temperament.current} (confidence: ${profile.traits.temperament.confidence})
Trajectory: ${profile.phases[profile.phases.length - 1]?.label || "unknown"}

### Communication Style
Style: ${profile.traits.communicationStyle.primary}
Preferred channel: ${profile.traits.communicationStyle.preferredChannel}
Responds to humor: ${profile.traits.communicationStyle.respondsToHumor}
Responds to empathy: ${profile.traits.communicationStyle.respondsToEmpathy}
Responds to directness: ${profile.traits.communicationStyle.respondsToDirectness}

### Follow-Through
Rate: ${profile.traits.followThrough.rate} (${profile.traits.followThrough.recentTrend})
Promises kept: ${profile.traits.followThrough.keptPromises}/${profile.traits.followThrough.totalPromises}

### Life Stage
${profile.traits.lifeStageSignals.inferred || "No signals detected"}
Indicators: ${profile.traits.lifeStageSignals.indicators.join(", ") || "None"}

### Growth Narrative
${profile.narrative}

## SCORES
- Likelihood to pay: ${scores.dimensions.likelihoodToPay.score}/100 — ${scores.dimensions.likelihoodToPay.reasoning}
- Responsiveness: ${scores.dimensions.responsiveness.score}/100
- Escalation risk: ${scores.dimensions.escalationRisk.score}/100 — ${scores.dimensions.escalationRisk.reasoning}
- Frustration risk: ${scores.dimensions.frustrationRisk.score}/100 (${scores.dimensions.frustrationRisk.currentState})
- Known escalation triggers: ${scores.dimensions.escalationRisk.triggers.join(", ") || "None identified"}

## BEHAVIORAL DIRECTIVES

${generateBehavioralDirectives(profile, scores)}

## RULES
1. Never reveal the scoring system or profile data to the customer.
2. Never fabricate information about the customer's account.
3. Log your reasoning for tone and strategy choices in your internal monologue.
4. If escalation risk is above 70, prioritize de-escalation over resolution speed.
5. Match the customer's communication style — if they are terse, be concise; if verbose, be thorough.
6. Reference the growth narrative — if the customer has shown improvement, acknowledge it implicitly through your approach (not explicitly).`;
}
```

### 6.3 Behavioral Differentiation Matrix

The `generateBehavioralDirectives` function produces specific instructions based on the profile:

| Profile State | Tone | Strategy | Approach |
|---|---|---|---|
| **Hostile + declining sentiment** | Calm, validating, no pushback | De-escalation first. Do not discuss payment until rapport is established. | Short sentences. Acknowledge frustration explicitly. Offer concrete next steps. |
| **Hostile + improving trajectory** | Warm but professional | Acknowledge progress implicitly. "I can see we've been working well together recently." | Gradually introduce resolution topics. Don't rush. |
| **Cooperative + high follow-through** | Direct, efficient, respectful | Get to the point. Respect their time. | Offer options, let them choose. Trust their commitments. |
| **Cooperative + low follow-through** | Friendly but structured | Offer smaller, more frequent commitments. Build success patterns. | "Would it help to break this into two smaller payments?" |
| **Guarded + analytical style** | Professional, data-driven | Lead with facts and specifics. Avoid emotional language. | Provide account details upfront. Let them process. |
| **Emotional + financial stress signals** | Empathetic, unhurried | Explore options. Don't pressure. Reference hardship programs if available. | "I want to make sure we find something that works for your situation." |
| **Enthusiastic + high responsiveness** | Upbeat, conversational | Quick resolution. Upsell opportunities if appropriate. | Match their energy. Be personable. |

### 6.4 Implementation — AI SDK Integration

```typescript
// app/api/agent/chat/route.ts
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  // 1. Fetch profile and scores
  const [profile, scores] = await Promise.all([
    getOrRefreshProfile(userId),
    getOrRefreshScores(userId),
  ]);

  // 2. Build dynamic system prompt
  const systemPrompt = buildSystemPrompt(profile, scores);

  // 3. Stream response from Claude
  const result = streamText({
    model: "anthropic/claude-sonnet-4-20250514",
    system: systemPrompt,
    messages,
  });

  // 4. Log agent decision (fire-and-forget)
  logAgentDecision(userId, profile, scores, messages);

  return result.toDataStreamResponse();
}
```

### 6.5 Agent Decision Logging

After each response, log what influenced the agent's behavior:

```typescript
async function logAgentDecision(
  userId: string,
  profile: Profile,
  scores: Scores,
  messages: Message[]
) {
  const lastAgentMessage = messages[messages.length - 1];

  await AgentLogModel.create({
    userId,
    sessionId: generateSessionId(),
    timestamp: new Date(),
    decision: {
      toneUsed: deriveToneFromProfile(profile),
      strategyUsed: deriveStrategyFromProfile(profile, scores),
      approachNotes: `Temperament: ${profile.traits.temperament.current}, ` +
        `Trajectory: ${profile.traits.sentimentTrend.trajectory}, ` +
        `Escalation risk: ${scores.dimensions.escalationRisk.score}`,
      profileTraitsReferenced: getReferencedTraits(profile),
      scoresDimensionsReferenced: getReferencedDimensions(scores),
    },
    message: lastAgentMessage,
  });
}
```

### 6.6 Suggested Response Chips

The chat UI displays contextual suggested chips that change based on the customer profile:

| Profile State | Suggested Chips |
|---|---|
| High escalation risk | "I understand your frustration" / "Let me look into this right away" / "Here's what I can do" |
| High likelihood to pay | "Ready to set up a payment?" / "Here are your options" / "Let's get this resolved" |
| Low responsiveness | "Quick question — " / "Just checking in" / "One thing to note:" |
| Financial stress signals | "Are you aware of our hardship program?" / "We have flexible options" |

---

## 7. Profile Evolution

### 7.1 Purpose

Handle conflicting signals. A hostile customer who recently turned cooperative should reflect growth, not just an average.

### 7.2 Temporal Weighting

All trait computations use exponential decay weighting:

```
weight(interaction) = e^(-λ × days_since_interaction)
```

| Parameter | Value | Effect |
|---|---|---|
| λ (decay constant) | 0.05 | Half-life of ~14 days |
| Minimum weight | 0.01 | Interactions older than ~90 days have negligible weight |
| Maximum lookback | 180 days | Older data is excluded entirely |

**Why this matters**: A customer who was hostile 3 months ago but cooperative for the last 3 weeks will have recent cooperative interactions weighted ~4x more than the hostile ones.

### 7.3 Phase Detection

The system identifies distinct behavioral phases rather than computing rolling averages.

```typescript
interface BehavioralPhase {
  label: string;           // "Hostile phase", "Cooperative phase"
  temperament: string;
  startDate: Date;
  endDate: Date | null;    // null = current
  interactionCount: number;
  avgSentiment: number;
  triggerEvent: string | null;
}
```

**Phase transition detection:**

```
For each interaction (chronological order):
  1. Compute temperament for this interaction
  2. If temperament differs from current phase for 3+ consecutive interactions:
     → Close current phase (set endDate)
     → Open new phase
     → Attempt to identify trigger event:
        - Was there a specific interaction where sentiment sharply changed?
        - Did a life-stage signal appear around the transition?
        - Did a promise outcome (kept/broken) precede the shift?
```

### 7.4 Anti-Averaging Safeguards

The system explicitly avoids flattening behavioral arcs:

| Problem | Safeguard |
|---|---|
| Hostile (6mo) + Cooperative (3wk) = "Neutral" | **Phase-based representation.** The profile shows two distinct phases, not a blended score. The `trajectory` field marks direction. |
| Single bad interaction tanks a good trajectory | **Outlier damping.** A single interaction that deviates >2σ from the 30-day trend is flagged but not allowed to shift the phase. Requires 3 consecutive interactions to trigger a phase change. |
| Old data drowning out recent improvement | **Exponential decay.** λ=0.05 ensures 14-day half-life. 3-month-old hostile interactions carry <5% weight. |
| Averaging sentiment across phases | **Per-phase sentiment.** Each phase has its own `avgSentiment`. The profile's `current` sentiment is from the current phase only. |

### 7.5 Growth Narrative Generation

After each profile update, Claude generates a human-readable narrative:

```
System: You are a behavioral analyst. Given a customer's behavioral phases
and trait history, write a 2-3 sentence narrative that captures their journey.
Emphasize trajectory and growth. Do not average — describe the arc.

User:
Phases:
1. Hostile phase (Jan 1 - Mar 15): 12 interactions, avg sentiment -0.6,
   3 escalations, 0/2 promises kept
2. Guarded phase (Mar 16 - Apr 10): 5 interactions, avg sentiment -0.1,
   0 escalations, 1/1 promise kept
3. Cooperative phase (Apr 11 - present): 8 interactions, avg sentiment 0.5,
   0 escalations, 3/3 promises kept

Current traits:
- Temperament: cooperative (confidence: 0.85)
- Follow-through: 0.8 (improving)
- Sentiment trajectory: improving

Output example:
"This customer had a difficult start — 12 hostile interactions with multiple
escalations and no follow-through on commitments (Jan-Mar). A clear turning
point occurred mid-March, transitioning through a guarded period into
consistent cooperation. Over the last 8 interactions, they've kept all
promises and sentiment has been strongly positive. This is a genuine recovery
arc — the current cooperative behavior should be treated as the baseline,
not the earlier hostility."
```

### 7.6 Conflicting Signal Resolution

When new data contradicts the current profile, the system follows this decision tree:

```
New interaction arrives → Compute interaction-level traits

IF interaction temperament == current phase temperament:
  → Reinforce current phase (increment count, update avg sentiment)

ELIF interaction temperament ≠ current phase AND this is the 1st deviation:
  → Flag as potential outlier
  → Do NOT change phase
  → Add a note: "Possible anomaly on [date] — single hostile interaction
    during cooperative phase"

ELIF interaction temperament ≠ current phase AND 2nd consecutive deviation:
  → Flag as "transition watch"
  → Still do NOT change phase
  → Increase escalation risk score slightly

ELIF interaction temperament ≠ current phase AND 3rd+ consecutive deviation:
  → Trigger phase transition
  → Close current phase, open new phase
  → Attempt trigger event identification
  → Regenerate narrative
  → Recalculate all scores
  → Log changelog entry with full reasoning
```

---

## 8. API Route Specifications

### 8.1 Profile Endpoints

#### `GET /api/profile/[userId]`

Returns the full profile for a customer.

**Response:**
```typescript
{
  profile: Profile;         // Full profile document
  stale: boolean;           // True if profile is >1 hour old
  lastRefreshed: string;    // ISO date
}
```

#### `POST /api/profile/[userId]/refresh`

Force a full profile recomputation.

**Request body:** none

**Response:**
```typescript
{
  profile: Profile;
  computationTime: number;  // ms
  interactionsAnalyzed: number;
}
```

### 8.2 Score Endpoints

#### `GET /api/scores/[userId]`

Returns current scores for a customer.

**Response:**
```typescript
{
  scores: Scores;           // Full scores document
  stale: boolean;
}
```

#### `GET /api/scores/[userId]/history`

Returns score changelog.

**Query params:** `?dimension=likelihoodToPay&limit=50`

**Response:**
```typescript
{
  changelog: ChangelogEntry[];
  total: number;
}
```

### 8.3 Agent Endpoints

#### `POST /api/agent/chat`

Streams an agent response.

**Request body:**
```typescript
{
  userId: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}
```

**Response:** Vercel AI SDK data stream.

#### `GET /api/agent/logs/[userId]`

Returns agent decision logs.

**Query params:** `?limit=20&sessionId=abc`

**Response:**
```typescript
{
  logs: AgentLog[];
  total: number;
}
```

### 8.4 Dashboard Endpoints

#### `GET /api/dashboard/high-risk`

Returns customers with escalation risk > 70.

**Response:**
```typescript
{
  customers: Array<{
    userId: string;
    escalationRisk: number;
    frustrationRisk: number;
    lastInteraction: string;
    narrative: string;
  }>;
}
```

---

## 9. UI Component Specifications

### 9.1 Component Tree

```
app/
├── page.tsx                        → Dashboard (high-risk queue, recent activity)
├── customer/
│   └── [userId]/
│       └── page.tsx                → Customer detail view
│           ├── ProfileCard         → Traits summary, phase timeline
│           ├── ScoreDashboard      → All 6 dimensions with gauges
│           ├── ScoreHistory        → Changelog with reasoning
│           ├── PhaseTimeline       → Visual timeline of behavioral phases
│           ├── GrowthNarrative     → Auto-generated narrative display
│           └── AgentChat           → Live Claude agent chat
├── api/
│   ├── profile/[userId]/route.ts
│   ├── scores/[userId]/route.ts
│   ├── agent/chat/route.ts
│   └── dashboard/route.ts
```

### 9.2 AgentChat Component

```
┌─────────────────────────────────────────────┐
│ Agent Chat — Customer #12345                │
│ Mode: Empathetic | Strategy: De-escalation  │  ← Derived from profile
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ 🟢 Agent: Hi Maria, I appreciate   │    │
│  │ you reaching out today. I can see   │    │
│  │ we've been working well together    │    │
│  │ recently and I want to keep that    │    │
│  │ going. How can I help?              │    │
│  └─────────────────────────────────────┘    │
│                                             │
│         ┌───────────────────────────┐       │
│         │ Customer: I need to       │       │
│         │ discuss my balance        │       │
│         └───────────────────────────┘       │
│                                             │
├─────────────────────────────────────────────┤
│ Suggested: [I understand] [Let me check]    │  ← Profile-aware chips
├─────────────────────────────────────────────┤
│ [Type a message...]              [Send]     │
└─────────────────────────────────────────────┘
```

**Sidebar (visible to human supervisor):**
```
┌──────────────────────────┐
│ LIVE PROFILE CONTEXT     │
│                          │
│ Temperament: Cooperative │
│ (was: Hostile → Jan-Mar) │
│                          │
│ Trajectory: ▲ Improving  │
│                          │
│ Escalation Risk: 35/100  │
│ Pay Likelihood: 68/100   │
│                          │
│ Agent Reasoning:         │
│ "Using warm tone because │
│ customer has shown       │
│ consistent improvement   │
│ over last 8 interactions.│
│ Acknowledging progress   │
│ implicitly."             │
│                          │
│ Phase History:           │
│ ■■■ Hostile (Jan-Mar)    │
│ ■■ Guarded (Mar-Apr)     │
│ ■■■■ Cooperative (Apr+)  │
└──────────────────────────┘
```

### 9.3 ScoreDashboard Component

Displays all 6 score dimensions with:
- **Gauge/dial visualization** — 0-100 scale with color coding (red < 30, yellow 30-60, green > 60; inverted for risk scores)
- **Reasoning string** — displayed below each gauge
- **Trend indicator** — arrow showing direction of recent change
- **Confidence indicator** — opacity/fill of the gauge reflects confidence

### 9.4 PhaseTimeline Component

Horizontal timeline showing behavioral phases:
- Color-coded segments (red=hostile, yellow=guarded, gray=neutral, green=cooperative, blue=enthusiastic)
- Transition markers with trigger event tooltips
- Current phase highlighted
- Hover to see phase details (interaction count, avg sentiment)

### 9.5 ScoreHistory Component

Table/list view of changelog entries:
- Timestamp, dimension, old score, new score, delta (with color), reasoning
- Filterable by dimension
- Sortable by date or magnitude of change

---

## 10. TypeScript Interfaces

```typescript
// ==========================================
// Enums
// ==========================================

export type Temperament =
  | "hostile"
  | "guarded"
  | "neutral"
  | "cooperative"
  | "enthusiastic";

export type Trajectory = "improving" | "declining" | "stable";

export type CommunicationStyle =
  | "terse"
  | "verbose"
  | "formal"
  | "casual"
  | "emotional"
  | "analytical";

export type Channel = "phone" | "chat" | "email" | "sms";

export type InteractionOutcome =
  | "resolved"
  | "escalated"
  | "abandoned"
  | "callback_scheduled";

export type FrustrationState =
  | "calm"
  | "mildly_frustrated"
  | "frustrated"
  | "highly_frustrated";

export type AgentTone =
  | "empathetic"
  | "direct"
  | "formal"
  | "warm"
  | "calm"
  | "professional"
  | "upbeat";

export type AgentStrategy =
  | "de-escalation-first"
  | "efficient-resolution"
  | "rapport-building"
  | "structured-commitment"
  | "data-driven"
  | "exploratory";

// ==========================================
// Profile Types
// ==========================================

export interface Profile {
  _id: string;
  userId: string;
  traits: ProfileTraits;
  phases: BehavioralPhase[];
  narrative: string;
  narrativeUpdatedAt: Date;
  totalInteractions: number;
  firstInteraction: Date;
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileTraits {
  temperament: {
    current: Temperament;
    confidence: number;
    history: Array<{ value: Temperament; from: Date; to: Date }>;
  };
  followThrough: {
    rate: number;
    totalPromises: number;
    keptPromises: number;
    recentTrend: Trajectory;
    lastEvaluated: Date;
  };
  sentimentTrend: {
    current: number;
    movingAverage30d: number;
    movingAverage90d: number;
    trajectory: Trajectory;
    dataPoints: Array<{
      date: Date;
      value: number;
      interactionId: string;
    }>;
  };
  communicationStyle: {
    primary: CommunicationStyle;
    averageMessageLength: number;
    preferredChannel: Channel;
    respondsToHumor: boolean;
    respondsToEmpathy: boolean;
    respondsToDirectness: boolean;
  };
  lifeStageSignals: {
    indicators: string[];
    inferred: string | null;
    lastUpdated: Date;
  };
}

export interface BehavioralPhase {
  label: string;
  temperament: Temperament;
  startDate: Date;
  endDate: Date | null;
  interactionCount: number;
  avgSentiment: number;
  triggerEvent: string | null;
}

// ==========================================
// Score Types
// ==========================================

export interface Scores {
  _id: string;
  userId: string;
  dimensions: ScoreDimensions;
  changelog: ChangelogEntry[];
  compositeScore: number;
  lastComputedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScoreDimension {
  score: number;
  confidence: number;
  reasoning: string;
  factors: Array<{
    factor: string;
    weight: number;
    contribution: number;
  }>;
}

export interface ScoreDimensions {
  likelihoodToPay: ScoreDimension;
  responsiveness: ScoreDimension;
  bestContactMethod: {
    recommended: Channel;
    confidence: number;
    reasoning: string;
    successRates: Record<Channel, number>;
  };
  bestContactTiming: {
    recommended: {
      dayOfWeek: number[];
      hourRange: [number, number];
      timezone: string;
    };
    confidence: number;
    reasoning: string;
  };
  escalationRisk: ScoreDimension & {
    triggers: string[];
  };
  frustrationRisk: ScoreDimension & {
    currentState: FrustrationState;
    recentTriggers: string[];
  };
}

export interface ChangelogEntry {
  timestamp: Date;
  dimension: string;
  previousScore: number;
  newScore: number;
  reasoning: string;
  triggerInteractionId: string;
}

// ==========================================
// Agent Types
// ==========================================

export interface AgentLog {
  _id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  decision: {
    toneUsed: AgentTone;
    strategyUsed: AgentStrategy;
    approachNotes: string;
    profileTraitsReferenced: string[];
    scoresDimensionsReferenced: string[];
  };
  message: {
    role: "agent";
    content: string;
  };
  profileSnapshotId: string | null;
}

// ==========================================
// Interaction Types (existing MongoDB data)
// ==========================================

export interface Interaction {
  _id: string;
  userId: string;
  agentId: string;
  channel: Channel;
  timestamp: Date;
  direction: "inbound" | "outbound";
  messages: Array<{
    role: "customer" | "agent";
    content: string;
    timestamp: Date;
  }>;
  outcome: InteractionOutcome;
  promisesMade: Array<{
    description: string;
    dueDate: Date;
    fulfilled: boolean | null;
  }>;
  tags: string[];
  sentiment: number;
  duration: number;
}
```

---

## 11. Accessibility & Performance

### 11.1 Accessibility

| Requirement | Implementation |
|---|---|
| Screen reader support | All score gauges include `aria-label` with value and reasoning. Phase timeline uses `role="list"` with descriptive `aria-label` per phase. |
| Keyboard navigation | Chat input supports Enter to send, Escape to close. Score cards are tabbable. |
| Color contrast | All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text). Risk scores use both color and icon/label to convey meaning. |
| Live regions | Chat messages use `aria-live="polite"`. Score updates use `aria-live="assertive"` when risk exceeds threshold. |
| Reduced motion | Phase timeline animations respect `prefers-reduced-motion`. Chat slide-in disabled when reduced motion is preferred. |

### 11.2 Performance

| Concern | Strategy |
|---|---|
| Profile computation latency | Profiles are cached in MongoDB. Stale-while-revalidate pattern: serve cached profile immediately, refresh in background if >1 hour old. |
| Claude API latency | Agent chat uses `streamText` for token-by-token streaming. Profile/score computations that use Claude are async background jobs, not blocking UI. |
| MongoDB query performance | All queries use indexed fields (`userId`, `timestamp`). Aggregation pipelines use `$match` early to reduce working set. |
| Bundle size | Agent chat component is lazy-loaded (`next/dynamic`). Score dashboard uses lightweight gauge components, not heavy charting libraries. |
| Real-time updates | SWR with `refreshInterval` for active customer views. No WebSocket required — polling at 30s intervals for score/profile updates during active sessions. |

---

## 12. Sample Payloads

### 12.1 Profile — Hostile-to-Cooperative Customer

```json
{
  "_id": "prof_001",
  "userId": "cust_maria_2847",
  "traits": {
    "temperament": {
      "current": "cooperative",
      "confidence": 0.85,
      "history": [
        { "value": "hostile", "from": "2026-01-01T00:00:00Z", "to": "2026-03-15T00:00:00Z" },
        { "value": "guarded", "from": "2026-03-16T00:00:00Z", "to": "2026-04-10T00:00:00Z" },
        { "value": "cooperative", "from": "2026-04-11T00:00:00Z", "to": null }
      ]
    },
    "followThrough": {
      "rate": 0.8,
      "totalPromises": 5,
      "keptPromises": 4,
      "recentTrend": "improving",
      "lastEvaluated": "2026-02-07T00:00:00Z"
    },
    "sentimentTrend": {
      "current": 0.5,
      "movingAverage30d": 0.45,
      "movingAverage90d": 0.1,
      "trajectory": "improving",
      "dataPoints": [
        { "date": "2026-01-10T00:00:00Z", "value": -0.7, "interactionId": "int_001" },
        { "date": "2026-02-01T00:00:00Z", "value": -0.4, "interactionId": "int_005" },
        { "date": "2026-03-20T00:00:00Z", "value": 0.1, "interactionId": "int_010" },
        { "date": "2026-04-15T00:00:00Z", "value": 0.6, "interactionId": "int_015" },
        { "date": "2026-02-01T00:00:00Z", "value": 0.5, "interactionId": "int_020" }
      ]
    },
    "communicationStyle": {
      "primary": "emotional",
      "averageMessageLength": 42,
      "preferredChannel": "chat",
      "respondsToHumor": false,
      "respondsToEmpathy": true,
      "respondsToDirectness": false
    },
    "lifeStageSignals": {
      "indicators": ["mentioned job loss in January", "new employment mentioned in March"],
      "inferred": "career transition — recovering",
      "lastUpdated": "2026-04-15T00:00:00Z"
    }
  },
  "phases": [
    {
      "label": "Hostile phase",
      "temperament": "hostile",
      "startDate": "2026-01-01T00:00:00Z",
      "endDate": "2026-03-15T00:00:00Z",
      "interactionCount": 12,
      "avgSentiment": -0.6,
      "triggerEvent": "Job loss mentioned in first interaction"
    },
    {
      "label": "Guarded phase",
      "temperament": "guarded",
      "startDate": "2026-03-16T00:00:00Z",
      "endDate": "2026-04-10T00:00:00Z",
      "interactionCount": 5,
      "avgSentiment": -0.1,
      "triggerEvent": "New employment mentioned; first kept promise"
    },
    {
      "label": "Cooperative phase",
      "temperament": "cooperative",
      "startDate": "2026-04-11T00:00:00Z",
      "endDate": null,
      "interactionCount": 8,
      "avgSentiment": 0.5,
      "triggerEvent": null
    }
  ],
  "narrative": "This customer had a difficult start — 12 hostile interactions with multiple escalations and zero follow-through on commitments from January through mid-March, likely driven by a job loss. A clear turning point occurred when they secured new employment in March, transitioning through a guarded period into consistent cooperation. Over the last 8 interactions, they've kept all promises and sentiment has been strongly positive. This is a genuine recovery arc — current cooperative behavior should be treated as the baseline, not the earlier hostility.",
  "totalInteractions": 25,
  "firstInteraction": "2026-01-01T00:00:00Z",
  "lastInteraction": "2026-02-05T00:00:00Z",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-02-07T00:00:00Z"
}
```

### 12.2 Scores — Same Customer

```json
{
  "_id": "score_001",
  "userId": "cust_maria_2847",
  "dimensions": {
    "likelihoodToPay": {
      "score": 68,
      "confidence": 0.75,
      "reasoning": "Kept 4/5 recent promises (80% rate, up from 0% in Q1). New employment signals income recovery. Trend is strongly improving but history of broken commitments in Jan-Feb warrants moderate confidence.",
      "factors": [
        { "factor": "follow_through_rate_90d", "weight": 0.35, "contribution": 28 },
        { "factor": "follow_through_trend", "weight": 0.15, "contribution": 13 },
        { "factor": "sentiment_trajectory", "weight": 0.15, "contribution": 12 },
        { "factor": "life_stage_signals", "weight": 0.15, "contribution": 10 },
        { "factor": "historical_payment", "weight": 0.20, "contribution": 5 }
      ]
    },
    "responsiveness": {
      "score": 72,
      "confidence": 0.8,
      "reasoning": "Responds within 4 hours on chat (preferred channel). Response rate is 90% over last 30 days, up from 50% in January.",
      "factors": [
        { "factor": "avg_response_time", "weight": 0.30, "contribution": 22 },
        { "factor": "response_rate", "weight": 0.30, "contribution": 24 },
        { "factor": "channel_engagement", "weight": 0.20, "contribution": 16 },
        { "factor": "response_trend", "weight": 0.20, "contribution": 10 }
      ]
    },
    "bestContactMethod": {
      "recommended": "chat",
      "confidence": 0.9,
      "reasoning": "Resolves 80% of issues via chat with avg 4-minute response time. Email has 40% response rate. Phone interactions have historically triggered escalations.",
      "successRates": {
        "phone": 0.3,
        "chat": 0.8,
        "email": 0.4,
        "sms": 0.6
      }
    },
    "bestContactTiming": {
      "recommended": {
        "dayOfWeek": [1, 2, 3, 4, 5],
        "hourRange": [10, 14],
        "timezone": "America/New_York"
      },
      "confidence": 0.7,
      "reasoning": "Most responsive on weekday mornings (10am-2pm ET). No weekend interactions in the last 90 days."
    },
    "escalationRisk": {
      "score": 35,
      "confidence": 0.8,
      "reasoning": "Currently cooperative with improving trajectory. Risk is moderate (not low) due to 3 escalations in Q1 history. Known triggers: being transferred between agents, repeating information.",
      "factors": [
        { "factor": "current_temperament", "weight": 0.25, "contribution": 5 },
        { "factor": "sentiment_trajectory", "weight": 0.20, "contribution": 4 },
        { "factor": "recent_escalation_count", "weight": 0.25, "contribution": 15 },
        { "factor": "known_triggers", "weight": 0.15, "contribution": 6 },
        { "factor": "frustration_risk", "weight": 0.15, "contribution": 5 }
      ],
      "triggers": ["being transferred between agents", "repeating account information", "perceived dismissiveness"]
    },
    "frustrationRisk": {
      "score": 25,
      "confidence": 0.8,
      "reasoning": "Low frustration risk. Last 8 interactions were calm and constructive. No frustration signals in recent messages.",
      "factors": [
        { "factor": "recent_sentiment", "weight": 0.40, "contribution": 8 },
        { "factor": "escalation_history", "weight": 0.30, "contribution": 10 },
        { "factor": "message_tone", "weight": 0.30, "contribution": 7 }
      ],
      "currentState": "calm",
      "recentTriggers": []
    }
  },
  "changelog": [
    {
      "timestamp": "2026-02-05T14:30:00Z",
      "dimension": "likelihoodToPay",
      "previousScore": 55,
      "newScore": 68,
      "reasoning": "Rose from 55 to 68: customer kept 3rd consecutive promise (paid $150 on Feb 3, 2 days early). Follow-through rate now at 80% over last 90 days.",
      "triggerInteractionId": "int_020"
    },
    {
      "timestamp": "2026-01-20T10:00:00Z",
      "dimension": "escalationRisk",
      "previousScore": 72,
      "newScore": 50,
      "reasoning": "Dropped from 72 to 50: 5 consecutive interactions without escalation. Temperament shifted from guarded to cooperative. Sentiment improving.",
      "triggerInteractionId": "int_016"
    }
  ],
  "compositeScore": 62,
  "lastComputedAt": "2026-02-07T00:00:00Z",
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-02-07T00:00:00Z"
}
```

### 12.3 Agent Behavior Comparison

**Same scenario, two different customers:**

**Scenario:** Customer messages "I need to discuss my balance."

---

**Customer A: `cust_maria_2847` (Hostile-to-cooperative, emotional style, responds to empathy)**

Agent system prompt directives:
```
- Use warm, empathetic tone
- Acknowledge recent positive trajectory implicitly
- Do not reference past hostility
- Offer options rather than demands
- Match emotional communication style — use feeling words
```

Agent response:
> "Hi Maria, I'm glad you reached out. I'd be happy to go through your balance with you. I can see you've been making great progress recently, so let's figure out the best path forward together. Would you like me to walk through the full breakdown, or is there a specific charge you'd like to focus on?"

---

**Customer B: `cust_james_1192` (Consistently analytical, high responsiveness, direct style)**

Profile: Temperament=neutral, CommunicationStyle=analytical, RespondsToDirectness=true

Agent system prompt directives:
```
- Use direct, professional tone
- Lead with data and specifics
- Skip emotional language
- Be concise — customer values efficiency
- Present information structured, not narrative
```

Agent response:
> "Hi James. Your current balance is $1,247.30. Here's the breakdown:
> - Original: $1,100.00
> - Interest (2.5%): $27.50
> - Late fee (Jan 15): $35.00
> - Payment received (Jan 28): -$200.00
> - Remaining: $962.50 + $284.80 carried
>
> Want to set up a payment plan, or would you prefer to discuss specific line items?"

---

**The difference is observable and traceable:** Each response has an agent log entry documenting which traits and scores influenced the tone and strategy selection.

---

## End of Specification

This document is the complete technical specification for the Adaptive Customer Intelligence Platform. All interfaces, schemas, algorithms, and behavioral rules described here constitute the implementation contract.
