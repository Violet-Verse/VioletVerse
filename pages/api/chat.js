import { streamText, convertToModelMessages, tool } from 'ai'
import { z } from 'zod'
import connectDatabase from '../../lib/mongoClient'

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

You have access to the Violet Verse article database. When users ask about topics, use the searchArticles tool to find real articles on the site and reference them with their actual titles and links (format: violetverse.io/{slug}).

Guidelines:
- Keep responses concise (2-4 sentences for simple questions, more for complex topics)
- Use a friendly, modern tone that matches Violet Verse's brand
- When relevant, search for and suggest real Violet Verse articles the user might find helpful
- If asked about something outside your expertise, be honest and redirect gracefully
- Never make up article titles or URLs — only reference articles returned by the searchArticles tool
- When sharing article links, format them as: violetverse.io/{slug}`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('[v0] Chat API called')

  try {
    const { messages } = req.body
    console.log('[v0] Received messages count:', messages?.length)

    if (!messages || !Array.isArray(messages)) {
      console.log('[v0] Invalid messages format')
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    const convertedMessages = await convertToModelMessages(messages)
    console.log('[v0] Converted messages count:', convertedMessages.length)

    const result = streamText({
      model: 'anthropic/claude-sonnet-4-20250514',
      system: SYSTEM_PROMPT,
      messages: convertedMessages,
      tools: {
        searchArticles: tool({
          description: 'Search Violet Verse articles by keyword, topic, or category. Use this when the user asks about a topic that might have related articles on the site.',
          inputSchema: z.object({
            query: z.string().describe('The search query — a keyword, topic, or phrase to search for in article titles, subtitles, and categories'),
            category: z.string().nullable().describe('Optional category filter, e.g. "Web3", "Fashion", "Art", "DeFi", "NFTs"'),
          }),
          execute: async ({ query, category }) => {
            console.log('[v0] searchArticles called with:', { query, category })
            try {
              const db = await connectDatabase()
              if (!db) return { articles: [], message: 'Database unavailable' }

              const collection = db.collection('posts')

              const filter = {
                hidden: false,
                $or: [
                  { title: { $regex: query, $options: 'i' } },
                  { subtitle: { $regex: query, $options: 'i' } },
                  { tldr: { $regex: query, $options: 'i' } },
                  { category: { $regex: query, $options: 'i' } },
                ],
              }

              if (category) {
                filter.category = { $regex: category, $options: 'i' }
              }

              const articles = await collection
                .find(filter)
                .project({
                  title: 1,
                  subtitle: 1,
                  tldr: 1,
                  category: 1,
                  slug: 1,
                  created: 1,
                })
                .sort({ created: -1 })
                .limit(5)
                .toArray()

              console.log('[v0] searchArticles found:', articles.length)
              return {
                articles: articles.map((a) => ({
                  title: a.title,
                  subtitle: a.subtitle || '',
                  tldr: a.tldr || '',
                  category: a.category || '',
                  slug: a.slug,
                  date: a.created,
                  url: `violetverse.io/${a.slug}`,
                })),
                count: articles.length,
              }
            } catch (error) {
              console.error('[v0] searchArticles error:', error)
              return { articles: [], message: 'Error searching articles' }
            }
          },
        }),
        getRecentArticles: tool({
          description: 'Get the most recent articles published on Violet Verse. Use this when the user wants to know what is new or trending.',
          inputSchema: z.object({
            limit: z.number().nullable().describe('Number of articles to return, defaults to 5'),
          }),
          execute: async ({ limit }) => {
            console.log('[v0] getRecentArticles called with limit:', limit)
            try {
              const db = await connectDatabase()
              if (!db) return { articles: [], message: 'Database unavailable' }

              const collection = db.collection('posts')
              const articles = await collection
                .find({ hidden: false })
                .project({
                  title: 1,
                  subtitle: 1,
                  category: 1,
                  slug: 1,
                  created: 1,
                })
                .sort({ created: -1 })
                .limit(limit || 5)
                .toArray()

              console.log('[v0] getRecentArticles found:', articles.length)
              return {
                articles: articles.map((a) => ({
                  title: a.title,
                  subtitle: a.subtitle || '',
                  category: a.category || '',
                  slug: a.slug,
                  date: a.created,
                  url: `violetverse.io/${a.slug}`,
                })),
                count: articles.length,
              }
            } catch (error) {
              console.error('[v0] getRecentArticles error:', error)
              return { articles: [], message: 'Error fetching articles' }
            }
          },
        }),
        getArticlesByCategory: tool({
          description: 'Get articles filtered by a specific category. Use this when the user asks about a specific topic area.',
          inputSchema: z.object({
            category: z.string().describe('The category to filter by, e.g. "Web3", "Fashion", "Art", "DeFi"'),
          }),
          execute: async ({ category }) => {
            console.log('[v0] getArticlesByCategory called with:', category)
            try {
              const db = await connectDatabase()
              if (!db) return { articles: [], message: 'Database unavailable' }

              const collection = db.collection('posts')
              const articles = await collection
                .find({
                  hidden: false,
                  category: { $regex: category, $options: 'i' },
                })
                .project({
                  title: 1,
                  subtitle: 1,
                  category: 1,
                  slug: 1,
                  created: 1,
                })
                .sort({ created: -1 })
                .limit(5)
                .toArray()

              console.log('[v0] getArticlesByCategory found:', articles.length)
              return {
                articles: articles.map((a) => ({
                  title: a.title,
                  subtitle: a.subtitle || '',
                  category: a.category || '',
                  slug: a.slug,
                  date: a.created,
                  url: `violetverse.io/${a.slug}`,
                })),
                count: articles.length,
              }
            } catch (error) {
              console.error('[v0] getArticlesByCategory error:', error)
              return { articles: [], message: 'Error fetching articles' }
            }
          },
        }),
      },
      maxSteps: 3,
    })

    console.log('[v0] streamText initiated, piping response...')

    // Set SSE headers for Pages Router
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    // Use toUIMessageStream and pipe chunks to the Node.js response
    const stream = result.toUIMessageStream()

    const reader = stream.getReader()
    const encoder = new TextEncoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('[v0] Stream complete')
          break
        }
        // value is a UIMessageChunk, we need to send it as SSE
        // toUIMessageStream returns Uint8Array chunks already formatted as SSE
        res.write(value)
      }
    } catch (streamError) {
      console.error('[v0] Stream reading error:', streamError)
    }

    res.end()
  } catch (error) {
    console.error('[v0] Chat API error:', error?.message || error)
    console.error('[v0] Error stack:', error?.stack)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error?.message })
    }
  }
}
