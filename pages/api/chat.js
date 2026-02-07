import connectDatabase from '../../lib/mongoClient'

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
- If you know about relevant articles, suggest them
- If asked about something outside your expertise, be honest and redirect gracefully`

async function searchArticles(query, category) {
  try {
    const db = await connectDatabase()
    if (!db) return []

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

    const articles = await db
      .collection('posts')
      .find(filter)
      .project({ title: 1, subtitle: 1, tldr: 1, category: 1, slug: 1, created: 1 })
      .sort({ created: -1 })
      .limit(5)
      .toArray()

    return articles.map((a) => ({
      title: a.title,
      subtitle: a.subtitle || '',
      category: a.category || '',
      slug: a.slug,
      url: `violetverse.io/${a.slug}`,
    }))
  } catch (err) {
    console.error('searchArticles error:', err?.message)
    return []
  }
}

async function getRecentArticles(limit = 5) {
  try {
    const db = await connectDatabase()
    if (!db) return []

    const articles = await db
      .collection('posts')
      .find({ hidden: false })
      .project({ title: 1, subtitle: 1, category: 1, slug: 1, created: 1 })
      .sort({ created: -1 })
      .limit(limit)
      .toArray()

    return articles.map((a) => ({
      title: a.title,
      subtitle: a.subtitle || '',
      category: a.category || '',
      slug: a.slug,
      url: `violetverse.io/${a.slug}`,
    }))
  } catch (err) {
    console.error('getRecentArticles error:', err?.message)
    return []
  }
}

async function buildContextFromDB(userMessage) {
  const lowerMsg = userMessage.toLowerCase()
  let context = ''

  // Search for related articles if the message seems topical
  const topicKeywords = ['article', 'read', 'learn', 'nft', 'web3', 'defi', 'fashion', 'art', 'blockchain', 'crypto', 'brand', 'luxury', 'metaverse', 'dao', 'smart contract', 'wallet', 'token']
  const shouldSearch = topicKeywords.some((kw) => lowerMsg.includes(kw))

  if (shouldSearch || lowerMsg.includes('what') || lowerMsg.includes('tell me') || lowerMsg.includes('how')) {
    const articles = await searchArticles(userMessage, null)
    if (articles.length > 0) {
      context += '\n\nRelevant Violet Verse articles I found:\n'
      articles.forEach((a) => {
        context += `- "${a.title}" (${a.category}) — violetverse.io/${a.slug}\n`
      })
      context += '\nYou can reference these articles in your response when relevant. Always use the exact URLs provided.'
    }
  }

  if (lowerMsg.includes('latest') || lowerMsg.includes('recent') || lowerMsg.includes('new')) {
    const recent = await getRecentArticles(5)
    if (recent.length > 0) {
      context += '\n\nLatest articles on Violet Verse:\n'
      recent.forEach((a) => {
        context += `- "${a.title}" (${a.category}) — violetverse.io/${a.slug}\n`
      })
    }
  }

  return context
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' })
  }

  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    // Get the last user message for context enrichment
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    const userText = lastUserMsg?.content || ''

    // Enrich with MongoDB article context
    const dbContext = await buildContextFromDB(userText)
    const systemWithContext = SYSTEM_PROMPT + dbContext

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }))

    // Call Anthropic API with streaming
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemWithContext,
        messages: anthropicMessages,
        stream: true,
      }),
    })

    if (!anthropicRes.ok) {
      const errorBody = await anthropicRes.text()
      console.error('Anthropic API error:', anthropicRes.status, errorBody)
      return res.status(anthropicRes.status).json({ error: 'AI service error', details: errorBody })
    }

    // Stream SSE back to the client
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const reader = anthropicRes.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue

        if (trimmed.startsWith('data: ')) {
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)

            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              // Send text delta to client
              res.write(`data: ${JSON.stringify({ type: 'delta', text: parsed.delta.text })}\n\n`)
            } else if (parsed.type === 'message_stop') {
              res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            }
          } catch {
            // Skip unparseable lines
          }
        }
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
    res.end()

    // Log interaction to agent_interactions collection (fire and forget)
    try {
      const db = await connectDatabase()
      if (db && userText) {
        const topicMap = {
          'NFT': ['nft', 'nfts', 'non-fungible'],
          'DeFi': ['defi', 'yield', 'liquidity'],
          'Web3': ['web3', 'web 3', 'decentralized'],
          'Blockchain': ['blockchain', 'ledger'],
          'Crypto': ['crypto', 'bitcoin', 'ethereum', 'solana'],
          'Fashion': ['fashion', 'luxury', 'brand', 'style'],
          'Art': ['art', 'artist', 'creative', 'gallery'],
          'Metaverse': ['metaverse', 'virtual'],
          'Education': ['learn', 'explain', 'what is', 'how to', 'guide'],
        }
        const lower = userText.toLowerCase()
        const topics = Object.entries(topicMap)
          .filter(([, kws]) => kws.some((kw) => lower.includes(kw)))
          .map(([t]) => t)
        if (topics.length === 0) topics.push('General')

        db.collection('agent_interactions').insertOne({
          userMessage: userText.slice(0, 500),
          topics,
          timestamp: new Date(),
        }).catch(() => {})
      }
    } catch (_) { /* non-critical */ }
  } catch (error) {
    console.error('Chat API error:', error?.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' })
    } else {
      res.end()
    }
  }
}

export const config = {
  api: {
    bodyParser: true,
    responseLimit: false,
  },
}
