import Anthropic from "@anthropic-ai/sdk";
import { travelLeadsTable } from "../utils/travelLeadsTable";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DESTINATION_CONTEXT = {
    "Sedona AZ": `
Sedona, Arizona is renowned for its stunning red rock formations, world-class spas,
and spiritual vortex sites. Top accommodations include:
- Enchantment Resort: AAA Five Diamond luxury resort nestled in Boynton Canyon, offering spa,
  pools, and panoramic red rock views. Rates typically $600–$1,200/night.
- L'Auberge de Sedona: Boutique creekside resort along Oak Creek with French-inspired
  dining and luxury cabins. Rates typically $400–$900/night.
- Amara Resort & Spa: Boutique hotel with rooftop pool overlooking the red rocks,
  great value option. Rates typically $300–$600/night.
Key experiences: Jeep tours, hiking Cathedral Rock & Bell Rock trails, Pink Jeep Tours,
Airport Mesa sunset views, Tlaquepaque Arts Village shopping, spa treatments, hot air balloon rides.
Best spring break activities: hiking, jeep tours, stargazing, wine tasting in Verde Valley.
Spring weather: highs 65–75°F, perfect for outdoor activities.`,

    "DisneyWorld FL": `
Walt Disney World Resort in Orlando, Florida offers four major theme parks and
world-class resort accommodations. Top accommodations include:
- Disney's Grand Floridian Resort & Spa: Flagship Victorian luxury resort with monorail
  access to Magic Kingdom. Rates typically $600–$1,500/night.
- Disney's BoardWalk Inn: Charming New England-style resort on Crescent Lake near EPCOT.
  Rates typically $350–$700/night.
- Disney's Art of Animation Resort: Themed family suites perfect for families with children,
  great value. Rates typically $200–$450/night.
Key experiences: Magic Kingdom (Cinderella Castle, rides), EPCOT (World Showcase, Guardians coaster),
Hollywood Studios (Star Wars: Galaxy's Edge, Tower of Terror), Animal Kingdom (Pandora),
Disney Springs shopping & dining.
Spring break tips: Purchase park tickets in advance, use Disney Genie+ for Lightning Lane access,
make dining reservations 60 days ahead, arrive at rope drop for shortest waits.
Spring weather: highs 80–85°F, possible afternoon rain showers.`,
};

function buildSystemPrompt(agentId) {
    return `You are a professional travel agent assistant for a licensed InteliTravel travel agent (Agent ID: ${agentId}).
Your job is to create personalized, enticing trip proposals for clients based on their travel inquiry.

You must respond with ONLY a valid JSON object — no markdown, no code fences, no extra text.

The JSON must follow this exact structure:
{
  "greeting": "Warm personalized greeting using client's first name",
  "intro": "2-3 sentence enthusiastic intro about their chosen destination",
  "hotelOptions": [
    {
      "name": "Hotel name",
      "description": "2-3 sentence description of the property",
      "estimatedNightlyRate": "$XXX–$XXX/night",
      "whyItFits": "1 sentence on why this fits their budget/group"
    }
  ],
  "itineraryHighlights": [
    "Day 1: ...",
    "Day 2: ...",
    "Day 3: ..."
  ],
  "estimatedTotalRange": "$X,XXX–$X,XXX total for the trip",
  "agentDisclosure": "Booked through licensed InteliTravel Agent ID: ${agentId}. As your travel agent, I can access exclusive hotel commission rates and ensure your booking is protected.",
  "nextSteps": "Clear call-to-action explaining what happens next — review the options, confirm choice, and send back the credit card authorization form attached to this email.",
  "closing": "Warm professional closing"
}

Always provide exactly 3 hotel options from budget-friendly to premium. Be specific with names, rates, and activities. Tailor recommendations to the party size and budget provided.`;
}

export default async function generateProposal(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { recordId, name, email, destination, travelDates, partySize, budget, specialRequests } = req.body;

    if (!recordId || !name || !email || !destination) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const agentId = process.env.INTELETRAVEL_AGENT_ID || "YOUR-AGENT-ID";
    const destinationContext = DESTINATION_CONTEXT[destination] || "";
    const firstName = name.split(" ")[0];

    try {
        const stream = client.messages.stream({
            model: "claude-opus-4-6",
            max_tokens: 4096,
            thinking: { type: "adaptive" },
            system: buildSystemPrompt(agentId),
            messages: [
                {
                    role: "user",
                    content: `Create a trip proposal for this client inquiry:

Client: ${name} (${email})
Destination: ${destination}
Travel Dates: ${travelDates}
Party Size: ${partySize || "Not specified"}
Budget: ${budget ? `$${budget}` : "Not specified"}
Special Requests: ${specialRequests || "None"}

Destination context to use for recommendations:
${destinationContext}

Generate a personalized proposal with 3 hotel options and a sample itinerary.`,
                },
            ],
        });

        const message = await stream.finalMessage();

        // Extract text block (skip thinking blocks)
        const textBlock = message.content.find((b) => b.type === "text");
        if (!textBlock) throw new Error("No text response from Claude.");

        let proposal;
        try {
            proposal = JSON.parse(textBlock.text);
        } catch {
            // Fallback: try to extract JSON if there's any wrapping text
            const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                proposal = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Failed to parse Claude response as JSON.");
            }
        }

        const proposalText = textBlock.text;

        // Update Airtable record with proposal and status
        await travelLeadsTable.update([
            {
                id: recordId,
                fields: {
                    ProposalText: proposalText,
                    Status: "Proposal Sent",
                },
            },
        ]);

        // Fire-and-forget: send the email
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        fetch(`${baseUrl}/api/travel/send-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, destination, proposal }),
        }).catch((err) => console.error("send-email fetch error:", err));

        return res.status(200).json({ success: true, proposal });
    } catch (err) {
        console.error("generate-proposal error:", err);

        // Mark the record as errored so poll-leads won't retry endlessly
        if (recordId && travelLeadsTable) {
            await travelLeadsTable
                .update([{ id: recordId, fields: { Status: "Error" } }])
                .catch(() => {});
        }

        return res.status(500).json({ error: "Failed to generate proposal." });
    }
}

export const config = {
    api: {
        externalResolver: true,
    },
};
