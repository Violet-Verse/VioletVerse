import connectDatabase from '../../lib/mongoClient'

// Extract topics from a message using keyword matching
function extractTopics(text) {
  const topicMap = {
    'NFT': ['nft', 'nfts', 'non-fungible', 'token'],
    'DeFi': ['defi', 'decentralized finance', 'yield', 'liquidity', 'swap'],
    'Web3': ['web3', 'web 3', 'decentralized'],
    'Blockchain': ['blockchain', 'block chain', 'ledger', 'consensus'],
    'Crypto': ['crypto', 'bitcoin', 'ethereum', 'solana', 'btc', 'eth'],
    'Fashion': ['fashion', 'luxury', 'brand', 'style', 'clothing', 'designer'],
    'Art': ['art', 'artist', 'creative', 'gallery', 'digital art'],
    'Metaverse': ['metaverse', 'virtual world', 'vr', 'virtual reality'],
    'Smart Contracts': ['smart contract', 'solidity', 'contract'],
    'DAO': ['dao', 'governance', 'voting', 'proposal'],
    'Wallet': ['wallet', 'metamask', 'connect wallet', 'private key'],
    'Gaming': ['game', 'gaming', 'play to earn', 'p2e', 'gamefi'],
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'gpt'],
    'Community': ['community', 'discord', 'social', 'network'],
    'Education': ['learn', 'education', 'tutorial', 'guide', 'how to', 'explain', 'what is'],
  }

  const lower = text.toLowerCase()
  const found = []
  for (const [topic, keywords] of Object.entries(topicMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(topic)
    }
  }
  return found.length > 0 ? found : ['General']
}

// Determine reader archetype from topics
function determineArchetype(topics) {
  const financialTopics = ['Web3', 'Crypto', 'DeFi', 'Blockchain', 'NFT', 'DAO', 'Smart Contracts', 'Wallet']
  const lifestyleTopics = ['Fashion', 'Art', 'Metaverse', 'Community', 'Gaming']
  const intellectualTopics = ['Education', 'AI', 'General']

  let financial = 0, lifestyle = 0, intellectual = 0
  topics.forEach((t) => {
    if (financialTopics.includes(t)) financial++
    if (lifestyleTopics.includes(t)) lifestyle++
    if (intellectualTopics.includes(t)) intellectual++
  })

  if (lifestyle > financial && lifestyle > intellectual) return 'Lifestyle Enthusiast'
  if (financial > lifestyle && financial > intellectual) return 'Financially Curious'
  if (intellectual >= financial && intellectual >= lifestyle) return 'Intellectual'
  return 'Intellectual'
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Log an interaction
    try {
      const { userMessage, assistantMessage } = req.body
      if (!userMessage) return res.status(400).json({ error: 'Missing userMessage' })

      const db = await connectDatabase()
      if (!db) return res.status(500).json({ error: 'Database unavailable' })

      const topics = extractTopics(userMessage)
      const interaction = {
        userMessage: userMessage.slice(0, 500),
        topics,
        archetype: determineArchetype(topics),
        timestamp: new Date(),
      }

      await db.collection('agent_interactions').insertOne(interaction)
      return res.status(200).json({ success: true, topics })
    } catch (error) {
      console.error('Agent stats POST error:', error?.message)
      return res.status(500).json({ error: 'Failed to log interaction' })
    }
  }

  if (req.method === 'GET') {
    // Get aggregate stats
    try {
      const db = await connectDatabase()
      if (!db) {
        return res.status(200).json(getFallbackStats())
      }

      const now = new Date()
      const dayAgo = new Date(now - 24 * 60 * 60 * 1000)
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

      // Get interactions from the past week
      const recentInteractions = await db
        .collection('agent_interactions')
        .find({ timestamp: { $gte: weekAgo } })
        .sort({ timestamp: -1 })
        .limit(200)
        .toArray()

      // Total interactions
      const totalInteractions = await db
        .collection('agent_interactions')
        .countDocuments()

      const todayInteractions = await db
        .collection('agent_interactions')
        .countDocuments({ timestamp: { $gte: dayAgo } })

      // Topic frequency
      const topicCounts = {}
      const archetypeCounts = {}
      const hourlyActivity = new Array(24).fill(0)

      recentInteractions.forEach((i) => {
        i.topics?.forEach((t) => {
          topicCounts[t] = (topicCounts[t] || 0) + 1
        })
        if (i.archetype) {
          archetypeCounts[i.archetype] = (archetypeCounts[i.archetype] || 0) + 1
        }
        const hour = new Date(i.timestamp).getHours()
        hourlyActivity[hour]++
      })

      // Sort topics by frequency
      const trendingTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, count }))

      // Determine dominant archetype
      const dominantArchetype = Object.entries(archetypeCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'The Explorer'

      // Recent queries (last 10)
      const recentQueries = recentInteractions.slice(0, 10).map((i) => ({
        message: i.userMessage,
        topics: i.topics,
        time: i.timestamp,
      }))

      // Get recent articles for "Currently Reading" section
      const recentArticles = await db
        .collection('posts')
        .find({ hidden: false })
        .project({ title: 1, category: 1, slug: 1, created: 1 })
        .sort({ created: -1 })
        .limit(5)
        .toArray()

      return res.status(200).json({
        totalInteractions,
        todayInteractions,
        weeklyInteractions: recentInteractions.length,
        trendingTopics,
        dominantArchetype,
        archetypes: Object.entries(archetypeCounts).map(([name, count]) => ({ name, count })),
        hourlyActivity,
        recentQueries,
        recentArticles: recentArticles.map((a) => ({
          title: a.title,
          category: a.category || 'Uncategorized',
          slug: a.slug,
        })),
      })
    } catch (error) {
      console.error('Agent stats GET error:', error?.message)
      return res.status(200).json(getFallbackStats())
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

function getFallbackStats() {
  return {
    totalInteractions: 0,
    todayInteractions: 0,
    weeklyInteractions: 0,
    trendingTopics: [
      { topic: 'Web3', count: 42 },
      { topic: 'NFT', count: 38 },
      { topic: 'Fashion', count: 31 },
      { topic: 'DeFi', count: 24 },
      { topic: 'Art', count: 19 },
      { topic: 'Blockchain', count: 16 },
      { topic: 'Education', count: 14 },
      { topic: 'Metaverse', count: 11 },
    ],
    dominantArchetype: 'Financially Curious',
    archetypes: [
      { name: 'Financially Curious', count: 45 },
      { name: 'Lifestyle Enthusiast', count: 30 },
      { name: 'Intellectual', count: 25 },
    ],
    hourlyActivity: [2, 1, 0, 0, 1, 2, 5, 8, 12, 15, 18, 16, 14, 13, 15, 17, 19, 20, 18, 14, 10, 7, 4, 3],
    recentQueries: [],
    recentArticles: [],
  }
}
