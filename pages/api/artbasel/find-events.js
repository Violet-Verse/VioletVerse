import Anthropic from '@anthropic-ai/sdk'
import { getLoginSession } from '../../../lib/cookie-auth'
import { table } from '../utils/userTable'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PRODUCT_ID = 'artbasel-2025'

async function hasPurchased(session) {
  const records = await table
    .select({ filterByFormula: `{userId} = "${session.issuer}"` })
    .firstPage()
  const purchased = records[0]?.fields?.purchasedContent || ''
  return purchased.split(',').map((s) => s.trim()).includes(PRODUCT_ID)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getLoginSession(req)
  if (!session?.issuer) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const purchased = await hasPurchased(session)
  if (!purchased) {
    return res.status(403).json({ error: 'Purchase required' })
  }

  const { query } = req.body
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query required' })
  }

  const systemPrompt = `You are an Art Basel Miami 2025 event finder. The user has purchased the Art Basel guide and wants to find specific events.

Search Eventbrite, Luma, Partiful, and other event platforms for Art Basel Miami 2025 events that match the user's query. Art Basel Miami Beach 2025 runs December 4–7, 2025.

Return your findings as a JSON array (no other text, just the JSON). Each event object must have:
- name: string
- date: string (e.g. "Dec 5, 2025")
- time: string (e.g. "7:00 PM – 11:00 PM" or "All day")
- location: string (venue name + neighborhood/city)
- price: string (e.g. "Free", "$25", "RSVP required", "By invite")
- url: string (direct link to the event page)
- platform: string (e.g. "Luma", "Eventbrite", "Partiful", "Official")
- description: string (1–2 sentence summary)

If you cannot find specific events, return events you are confident exist based on your knowledge and clearly note which ones are from memory vs. found live. Return between 5 and 15 events. Focus on quality over quantity.`

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Find Art Basel Miami 2025 events matching: "${query}"`,
        },
      ],
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
        },
      ],
    })

    // Extract the final text block
    const textBlock = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')

    // Parse JSON — Claude should return only JSON
    let events
    try {
      // Strip markdown code fences if present
      const cleaned = textBlock.replace(/^```[a-z]*\n?/i, '').replace(/```\s*$/i, '').trim()
      events = JSON.parse(cleaned)
    } catch {
      // Return raw text if parsing fails
      return res.status(200).json({ events: [], raw: textBlock })
    }

    return res.status(200).json({ events })
  } catch (err) {
    console.error('find-events error:', err)
    return res.status(500).json({ error: 'Event search failed' })
  }
}
