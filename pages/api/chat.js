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
- Violet Verse content, articles, community events, educational resources
- The Violet Verse platform itself: every page, feature, and team member

== COMPLETE SITE KNOWLEDGE ==

You know everything about violetverse.io. Here is a detailed breakdown of every page:

PAGE: / (Homepage) — violetverse.io
The landing page features a hero video section, a highlighted Art Basel card, the "Future by Melissa" editorial spotlight, "Layers of the Verse" (a curated grid of the latest published articles from all categories), and a "New to Web3?" educational onboarding section for newcomers.

PAGE: /posts — violetverse.io/posts
The article marketplace titled "Layers of the Verse." This is the main content hub where ALL published articles are displayed. Articles span categories like Web3, Fashion, Art, Lifestyle, DeFi, NFTs, Metaverse, and more. Each article has a title, subtitle, category, TLDR summary, cover image, and full body content. Users can browse, discover, and read all Violet Verse articles here.

PAGE: /about — violetverse.io/about
The "About the Violet Verse" community page. Violet Verse, Inc. is a Web3-powered lifestyle content marketplace and software solution for the fashion media community. They are creators, Web3 operators, technologists, innovators, and fashion enthusiasts. Their mission is to document the spirit and personality of technology through immersive storytelling, using proprietary infrastructure.
Team members:
- Melissa Henderson (Founder) — Professional writer and businesswoman with over 10 years of experience in publishing, marketing and developing technology-driven writing products. Writes about blockchain, lifestyle, travel. Holds a BA in Political Science from George Washington University. Based in Miami. Twitter: @melwritesmiami
- Jess (Design Partner) — Passionate about blending creativity and technology, specializing in blockchain and design.
- Avalon (Editorial Partner) — Professional writer with extensive experience in media, communications, and tech. From DJing a morning show to reporting news to working through the pandemic in NYC.
- Morgan (Operations Partner) — Background in beauty and financial industry, procurement and project management. Fell down the crypto rabbit hole in 2022.
Contributors include: Prachi Modi (NYC, serial entrepreneur, blockchain enthusiast), Matthew Mills (Barcelona-based artist), and others.

PAGE: /enterprise — violetverse.io/enterprise
The Enterprise Plan page — "The modern publishing tool for the fashion media community." Violet Verse excels at efficiency, simplifying content creator and member onboarding to under 5 minutes. Key features:
- Tailored Content Creation: SEO optimization, paid and free content discoverability system, switch between private and public access.
- Engage and Expand Your Audience: Community hub with 3-click registration, authenticated membership login, customizable profiles.
- Streamlined Monetization: Secure payment gateway for content and services.
- Web3 Integration: Built on blockchain infrastructure with wallet-based authentication.
The enterprise solution is open source and available on GitHub.

PAGE: /connect — violetverse.io/connect
The wallet connection page. Users connect their crypto wallet (via RainbowKit on the Polygon network) to join the Violet Verse community. Once connected, they're redirected to the Creator Dashboard. Supports MetaMask and other popular wallets.

PAGE: /dashboard — violetverse.io/dashboard
The Creator Dashboard (requires wallet connection). Shows connected wallet address, provides access to content creation tools, article editing, and community management features. This is the hub for contributors and creators.

PAGE: /contact — violetverse.io/contact
Contact page. Users can reach the Violet Verse team at gm@violetverse.io.

PAGE: /resources — violetverse.io/resources
Educational resources about fashion tech and Web3. Features video content including "Introduction to Fashion tech as a career path" with Melissa Henderson discussing fashion tech applications and products with leading voices in the Web3 community. Links to the Violet Verse YouTube playlist for additional content.

PAGE: /stardust — violetverse.io/stardust
The Stardust rewards and points system. Features a community leaderboard that tracks engagement. Members earn Stardust points for participation and contributions to the Violet Verse ecosystem.

PAGE: /vr — violetverse.io/vr
The Violet Verse VR experience. An immersive virtual reality environment hosted on muse.place/violet-verse. Users can explore the Violet Verse world in 3D.

PAGE: /agent — violetverse.io/agent
The live agent dashboard showing a living portrait of who reads Violet Verse. Displays reader archetypes (Lifestyle Enthusiast, Financially Curious, Intellectual), trending topics, hourly activity patterns, and recent reader questions — all shaped by real conversations with the AI agent.

PAGE: /[article-slug] — violetverse.io/[slug]
Individual article pages. Each article has a unique slug URL, cover image, title, subtitle, TLDR, full body content, author info, and category tags.

== ARTICLE SEARCH ==

CRITICAL: You have REAL-TIME access to search the Violet Verse article database. When article search results appear in your context below, they are REAL published articles. You MUST:
1. Reference them by their exact title
2. Include the full URL (e.g., https://violetverse.io/article-slug)
3. Briefly describe what the article covers using the subtitle or TLDR
4. NEVER say "I don't have access to search" or "I can't find specific articles"

If no articles match a specific query, say "I didn't find a specific article on that topic in our library" and suggest browsing violetverse.io/posts or checking back for new content.

== GUIDELINES ==
- Keep responses concise (2-4 sentences for simple questions, more for complex topics)
- Use a friendly, modern tone that matches Violet Verse's brand
- When users ask about a specific topic, ALWAYS check if articles appear in your context and reference them
- For navigation questions, direct users to the exact page with its full URL
- If asked about the team, share specific details about team members
- If asked about something outside your expertise, be honest and redirect gracefully`

// Static page index for searches that don't hit MongoDB
const SITE_PAGES = [
  { name: 'Home', url: 'https://violetverse.io/', keywords: ['home', 'homepage', 'landing', 'hero', 'art basel', 'layers of the verse', 'new to web3'] },
  { name: 'Articles', url: 'https://violetverse.io/posts', keywords: ['articles', 'posts', 'browse', 'read', 'content', 'marketplace', 'blog'] },
  { name: 'About & Team', url: 'https://violetverse.io/about', keywords: ['about', 'team', 'melissa', 'founder', 'jess', 'avalon', 'morgan', 'who', 'mission', 'community'] },
  { name: 'Enterprise Plan', url: 'https://violetverse.io/enterprise', keywords: ['enterprise', 'business', 'brand', 'publishing', 'monetize', 'monetization', 'seo', 'payment', 'plan', 'tool'] },
  { name: 'Connect Wallet', url: 'https://violetverse.io/connect', keywords: ['connect', 'wallet', 'metamask', 'polygon', 'sign up', 'join', 'register', 'login'] },
  { name: 'Creator Dashboard', url: 'https://violetverse.io/dashboard', keywords: ['dashboard', 'creator', 'create', 'write', 'publish', 'edit'] },
  { name: 'Contact', url: 'https://violetverse.io/contact', keywords: ['contact', 'email', 'reach', 'support', 'help', 'gm@violetverse'] },
  { name: 'Resources', url: 'https://violetverse.io/resources', keywords: ['resources', 'learn', 'education', 'video', 'youtube', 'fashion tech', 'career'] },
  { name: 'Stardust Rewards', url: 'https://violetverse.io/stardust', keywords: ['stardust', 'points', 'rewards', 'leaderboard', 'gamification', 'engagement'] },
  { name: 'VR Experience', url: 'https://violetverse.io/vr', keywords: ['vr', 'virtual reality', 'metaverse', '3d', 'immersive', 'muse'] },
  { name: 'Live Agent', url: 'https://violetverse.io/agent', keywords: ['agent', 'reader', 'analytics', 'archetype', 'dashboard'] },
]

function searchPages(query) {
  const lower = query.toLowerCase()
  return SITE_PAGES.filter((page) =>
    page.keywords.some((kw) => lower.includes(kw))
  )
}

async function searchArticles(query) {
  try {
    const db = await connectDatabase()
    if (!db) return []

    // Break the query into meaningful words (3+ chars) for broader matching
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'with', 'that', 'this', 'from', 'they', 'been', 'said', 'each', 'what', 'about', 'their', 'will', 'there', 'when', 'where', 'how', 'does', 'tell', 'show', 'find', 'any', 'some'])
    const words = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !stopWords.has(w))

    if (words.length === 0) return []

    // Build $or conditions: match each word against title, subtitle, tldr, category, body
    const wordConditions = words.map((word) => ({
      $or: [
        { title: { $regex: word, $options: 'i' } },
        { subtitle: { $regex: word, $options: 'i' } },
        { tldr: { $regex: word, $options: 'i' } },
        { category: { $regex: word, $options: 'i' } },
        { body: { $regex: word, $options: 'i' } },
      ],
    }))

    // Also try matching the full query phrase
    const phraseConditions = [
      { title: { $regex: query, $options: 'i' } },
      { subtitle: { $regex: query, $options: 'i' } },
      { tldr: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
    ]

    const articles = await db
      .collection('posts')
      .find({
        hidden: false,
        $or: [...phraseConditions, ...wordConditions],
      })
      .project({ title: 1, subtitle: 1, tldr: 1, category: 1, slug: 1, created: 1 })
      .sort({ created: -1 })
      .limit(8)
      .toArray()

    return articles.map((a) => ({
      title: a.title,
      subtitle: a.subtitle || '',
      tldr: a.tldr || '',
      category: a.category || '',
      slug: a.slug,
      url: `https://violetverse.io/${a.slug}`,
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
      .project({ title: 1, subtitle: 1, tldr: 1, category: 1, slug: 1, created: 1 })
      .sort({ created: -1 })
      .limit(limit)
      .toArray()

    return articles.map((a) => ({
      title: a.title,
      subtitle: a.subtitle || '',
      category: a.category || '',
      slug: a.slug,
      url: `https://violetverse.io/${a.slug}`,
    }))
  } catch (err) {
    console.error('getRecentArticles error:', err?.message)
    return []
  }
}

async function buildContextFromDB(userMessage) {
  let context = ''

  // Check if any static pages match the query
  const matchedPages = searchPages(userMessage)
  if (matchedPages.length > 0) {
    context += '\n\n--- RELEVANT SITE PAGES ---\n'
    matchedPages.forEach((p) => {
      context += `- ${p.name}: ${p.url}\n`
    })
    context += '--- END PAGES ---\n'
  }

  // ALWAYS search for articles related to the user's question
  const articles = await searchArticles(userMessage)
  if (articles.length > 0) {
    context += '\n\n--- ARTICLE SEARCH RESULTS (from Violet Verse database) ---\n'
    context += 'These are REAL published articles. Reference them by title and URL in your response:\n\n'
    articles.forEach((a, i) => {
      context += `${i + 1}. "${a.title}"`
      if (a.category) context += ` [${a.category}]`
      context += `\n   URL: ${a.url}`
      if (a.subtitle) context += `\n   Subtitle: ${a.subtitle}`
      if (a.tldr) context += `\n   Summary: ${a.tldr.slice(0, 200)}`
      context += '\n\n'
    })
    context += '--- END SEARCH RESULTS ---\n'
  }

  // Also include recent articles for broader context
  const lowerMsg = userMessage.toLowerCase()
  if (lowerMsg.includes('latest') || lowerMsg.includes('recent') || lowerMsg.includes('new') || lowerMsg.includes('trending') || articles.length === 0) {
    const recent = await getRecentArticles(5)
    if (recent.length > 0) {
      context += '\n\n--- LATEST ARTICLES ON VIOLET VERSE ---\n'
      recent.forEach((a) => {
        context += `- "${a.title}" (${a.category}) — ${a.url}\n`
      })
      context += '--- END LATEST ---\n'
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
          'NFT': ['nft', 'nfts', 'non-fungible', 'token'],
          'DeFi': ['defi', 'yield', 'liquidity', 'swap'],
          'Web3': ['web3', 'web 3', 'decentralized'],
          'Blockchain': ['blockchain', 'ledger', 'consensus'],
          'Crypto': ['crypto', 'bitcoin', 'ethereum', 'solana', 'btc', 'eth'],
          'Fashion': ['fashion', 'luxury', 'brand', 'style', 'clothing', 'designer'],
          'Art': ['art', 'artist', 'creative', 'gallery', 'digital art'],
          'Metaverse': ['metaverse', 'virtual world', 'vr'],
          'Smart Contracts': ['smart contract', 'solidity'],
          'DAO': ['dao', 'governance', 'voting'],
          'Wallet': ['wallet', 'metamask', 'connect wallet'],
          'Gaming': ['game', 'gaming', 'play to earn', 'p2e'],
          'AI': ['ai', 'artificial intelligence', 'machine learning'],
          'Community': ['community', 'discord', 'social'],
          'Education': ['learn', 'education', 'tutorial', 'guide', 'how to', 'explain', 'what is'],
        }
        const lower = userText.toLowerCase()
        const topics = Object.entries(topicMap)
          .filter(([, kws]) => kws.some((kw) => lower.includes(kw)))
          .map(([t]) => t)
        if (topics.length === 0) topics.push('General')

        // Determine archetype from topics
        const financialTopics = ['Web3', 'Crypto', 'DeFi', 'Blockchain', 'NFT', 'DAO', 'Smart Contracts', 'Wallet']
        const lifestyleTopics = ['Fashion', 'Art', 'Metaverse', 'Community', 'Gaming']
        let financial = 0, lifestyle = 0, intellectual = 0
        topics.forEach((t) => {
          if (financialTopics.includes(t)) financial++
          if (lifestyleTopics.includes(t)) lifestyle++
          else intellectual++
        })
        let archetype = 'Intellectual'
        if (lifestyle > financial && lifestyle > intellectual) archetype = 'Lifestyle Enthusiast'
        if (financial > lifestyle && financial > intellectual) archetype = 'Financially Curious'

        db.collection('agent_interactions').insertOne({
          userMessage: userText.slice(0, 500),
          topics,
          archetype,
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
