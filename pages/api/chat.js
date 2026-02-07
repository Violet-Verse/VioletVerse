import { streamText, convertToModelMessages, consumeStream } from 'ai'
import { xai } from '@ai-sdk/xai'

export const config = {
  maxDuration: 60,
}

const SYSTEM_PROMPT = `You are Violet, the AI guide for Violet Verse — a Web3 lifestyle platform at violetverse.io.

Your personality:
- Warm, knowledgeable, and approachable
- You explain Web3 concepts in clear, accessible language
- You bridge the gap between lifestyle/culture and blockchain technology
- You are concise but thorough — never overwhelming

Your expertise:
- Web3, blockchain, NFTs, DeFi, smart contracts, DAOs
- How luxury brands, fashion, art, and culture intersect with Web3
- Violet Verse content: articles, community events, educational resources
- The Violet Verse platform itself: how to navigate, explore, contribute

Site navigation you can help with:
- /posts — Explore all articles
- /enterprise — Enterprise Plan for brands and businesses
- /about — Community page
- /connect — Connect your wallet to join
- /resources — Web3 educational resources

Guidelines:
- Keep responses concise (2-4 sentences for simple questions, more for complex topics)
- Use a friendly, modern tone that matches Violet Verse's brand
- When relevant, suggest Violet Verse articles or pages the user might find helpful
- If asked about something outside your expertise, be honest and redirect gracefully
- Never make up information about specific articles or content on the site`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body

    const result = streamText({
      model: xai('grok-3-mini-fast'),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    const response = result.toUIMessageStreamResponse()

    // Forward headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    // Stream the response body
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(decoder.decode(value, { stream: true }))
    }

    res.end()
  } catch (error) {
    console.error('Chat API error:', error)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
