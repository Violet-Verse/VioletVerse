import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './AgentDashboard.module.css'

const ARCHETYPE_DESCRIPTIONS = {
  'The Explorer': 'Curious minds discovering Web3 for the first time, asking foundational questions.',
  'The Technologist': 'Deep divers into blockchain, DeFi, and smart contracts.',
  'The Creative': 'Visionaries exploring the intersection of fashion, art, and technology.',
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function AgentDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/agent-stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch agent stats:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    // Refresh every 30 seconds for live feel
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.liveBadge}>
            <span className={styles.liveDot} />
            Live
          </div>
          <h1 className={styles.heroTitle}>The Violet Verse Reader</h1>
          <p className={styles.heroSubtitle}>Loading reader intelligence...</p>
        </div>
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.shimmerLine} style={{ width: '40%' }} />
              <div className={styles.shimmerBlock} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalArchetypes = stats?.archetypes?.reduce((sum, a) => sum + a.count, 0) || 1
  const maxActivity = Math.max(...(stats?.hourlyActivity || [1]))

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          Live Reader Intelligence
        </div>
        <h1 className={styles.heroTitle}>The Violet Verse Reader</h1>
        <p className={styles.heroSubtitle}>
          A living portrait of who reads Violet Verse, shaped by real conversations with our AI guide.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.cardLabel}>Total Conversations</div>
            <p className={styles.cardValue}>{stats?.totalInteractions || 0}</p>
            <p className={styles.cardSub}>all time</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.cardLabel}>Today</div>
            <p className={styles.cardValue}>{stats?.todayInteractions || 0}</p>
            <p className={styles.cardSub}>conversations today</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.cardLabel}>This Week</div>
            <p className={styles.cardValue}>{stats?.weeklyInteractions || 0}</p>
            <p className={styles.cardSub}>past 7 days</p>
          </div>
        </div>

        {/* Persona Card */}
        <div className={styles.persona}>
          <div className={styles.cardLabel}>Dominant Reader Archetype</div>
          <div className={styles.personaRing}>
            <svg className={styles.personaIcon} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {stats?.dominantArchetype === 'The Technologist' ? (
                <>
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </>
              ) : stats?.dominantArchetype === 'The Creative' ? (
                <>
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </>
              )}
            </svg>
          </div>
          <h3 className={styles.personaTitle}>{stats?.dominantArchetype || 'The Explorer'}</h3>
          <p className={styles.personaDesc}>
            {ARCHETYPE_DESCRIPTIONS[stats?.dominantArchetype] || ARCHETYPE_DESCRIPTIONS['The Explorer']}
          </p>
        </div>

        {/* Archetype Distribution */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Reader Archetypes</div>
          <div className={styles.archetypeList}>
            {(stats?.archetypes || []).map((arch) => (
              <div key={arch.name} className={styles.archetypeItem}>
                <div className={styles.archetypeHeader}>
                  <span className={styles.archetypeName}>{arch.name}</span>
                  <span className={styles.archetypePercent}>
                    {Math.round((arch.count / totalArchetypes) * 100)}%
                  </span>
                </div>
                <div className={styles.archetypeBar}>
                  <div
                    className={styles.archetypeFill}
                    style={{ width: `${Math.round((arch.count / totalArchetypes) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Activity */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Activity by Hour</div>
          <div className={styles.activityChart}>
            {(stats?.hourlyActivity || []).map((count, i) => (
              <div
                key={i}
                className={styles.activityBar}
                style={{ height: `${Math.max((count / maxActivity) * 100, 5)}%` }}
                title={`${i}:00 - ${count} conversations`}
              />
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className={styles.cardWide}>
          <div className={styles.cardLabel}>Trending Topics</div>
          <div className={styles.topicList}>
            {(stats?.trendingTopics || []).map((t) => (
              <div key={t.topic} className={styles.topicTag}>
                {t.topic}
                <span className={styles.topicCount}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Queries */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Recent Questions</div>
          <div className={styles.feedList}>
            {(stats?.recentQueries || []).length > 0 ? (
              stats.recentQueries.map((q, i) => (
                <div key={i} className={styles.feedItem}>
                  <div className={styles.feedDot} />
                  <div>
                    <div className={styles.feedText}>{q.message}</div>
                    <div className={styles.feedTime}>{timeAgo(q.time)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.feedItem}>
                <div className={styles.feedDot} />
                <div>
                  <div className={styles.feedText}>Waiting for the first conversation...</div>
                  <div className={styles.feedTime}>Talk to Violet to get started</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Currently Reading */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Latest on Violet Verse</div>
          <div className={styles.articleList}>
            {(stats?.recentArticles || []).map((article) => (
              <Link key={article.slug} href={`/${article.slug}`} legacyBehavior>
                <a className={styles.articleItem}>
                  <span className={styles.articleTitle}>{article.title}</span>
                  <span className={styles.articleCategory}>{article.category}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Shape the profile</h2>
        <p className={styles.ctaSubtitle}>
          Every question you ask Violet updates this living portrait in real time.
        </p>
      </div>
    </div>
  )
}
