import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Button, Grid, CircularProgress, TextField } from '@mui/material'
import { useUser } from '../hooks/useAuth'
import { usePrivy } from '@privy-io/react-auth'

const bg = '#0a0908'
const wine = '#49111c'
const cream = '#f2f4f3'
const gold = '#a9927d'
const px = { xs: '6%', sm: '8%', md: '12%', lg: '16%' }

const PRODUCT_ID = 'artbasel-2025'
const PDF_URL = process.env.NEXT_PUBLIC_ART_BASEL_PDF_URL || ''

function hasBought(user) {
  if (!user?.purchasedContent) return false
  return user.purchasedContent.split(',').map((s) => s.trim()).includes(PRODUCT_ID)
}

// ── Pre-purchase hero ────────────────────────────────────────────────────────
function BuyPage({ onBuy, buying, notLoggedIn, onLogin }) {
  return (
    <Box sx={{ backgroundColor: bg, minHeight: '100vh', pb: 14 }}>
      {/* Hero */}
      <Box sx={{ backgroundColor: wine, px, py: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '16px' }}>
          Art Basel Miami Beach 2025 · Dec 4–7
        </p>
        <h1 style={{ color: cream, fontFamily: 'Ogg', fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: '24px' }}>
          The Ultimate Guide
        </h1>
        <p style={{ color: 'rgba(242,244,243,0.75)', fontFamily: 'stratos-lights', fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto 40px' }}>
          Every event, gallery show, party, and pop-up — curated for culture, fashion, and tech. Plus an AI event finder to surface what matters to you.
        </p>
        {notLoggedIn ? (
          <Box>
            <p style={{ color: gold, fontFamily: 'stratos-lights', fontSize: '15px', marginBottom: '16px' }}>
              Sign in to purchase
            </p>
            <Button
              onClick={onLogin}
              disableElevation
              sx={{ backgroundColor: cream, color: bg, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' } }}
            >
              Sign In
            </Button>
          </Box>
        ) : (
          <Button
            onClick={onBuy}
            disabled={buying}
            disableElevation
            startIcon={buying ? <CircularProgress size={18} sx={{ color: bg }} /> : null}
            sx={{ backgroundColor: cream, color: bg, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' }, '&:disabled': { backgroundColor: 'rgba(242,244,243,0.5)', color: 'rgba(10,9,8,0.5)' } }}
          >
            {buying ? 'Redirecting…' : 'Get the Guide — $9.99'}
          </Button>
        )}
      </Box>

      {/* What's inside */}
      <Box sx={{ px, py: { xs: 8, md: 12 }, maxWidth: '900px', mx: 'auto' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '32px', textAlign: 'center' }}>
          What&apos;s Inside
        </p>
        <Grid container spacing={3}>
          {[
            { title: 'Full Event Calendar', desc: 'Every gallery opening, satellite fair, and curated show — with dates, locations, and RSVP links.' },
            { title: 'Parties & Nightlife', desc: 'The collector dinners, brand activations, and after-parties worth your time.' },
            { title: 'Fashion & Retail', desc: 'Pop-ups, installations, and limited drops happening across Miami during the week.' },
            { title: 'Tech & Culture', desc: 'AI art, digital collectibles, and the conversations shaping the intersection of tech and art.' },
            { title: 'AI Event Finder', desc: 'Search Eventbrite, Luma, and more by vibe, date, or category — buyer-exclusive.' },
            { title: 'Insider Tips', desc: 'Where to stay, eat, and be seen. What to skip. How to actually get into the good stuff.' },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Box sx={{ border: `1px solid rgba(169,146,125,0.2)`, borderRadius: '16px', p: 3, height: '100%', '&:hover': { borderColor: 'rgba(169,146,125,0.45)' } }}>
                <h3 style={{ color: gold, fontFamily: 'Test Calibre', fontSize: '15px', letterSpacing: '0.04em', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(242,244,243,0.7)', fontFamily: 'stratos-lights', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ textAlign: 'center', px }}>
        {notLoggedIn ? (
          <Button onClick={onLogin} disableElevation sx={{ backgroundColor: wine, color: cream, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: '#5a1520' } }}>
            Sign In to Purchase
          </Button>
        ) : (
          <Button onClick={onBuy} disabled={buying} disableElevation sx={{ backgroundColor: wine, color: cream, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: '#5a1520' }, '&:disabled': { opacity: 0.5 } }}>
            {buying ? 'Redirecting…' : 'Get the Guide — $9.99'}
          </Button>
        )}
      </Box>
    </Box>
  )
}

// ── Event finder (buyer-only) ────────────────────────────────────────────────
function EventFinder() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setEvents([])
    setError('')
    try {
      const res = await fetch('/api/artbasel/find-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setEvents(data.events || [])
      if (data.events?.length === 0) setError('No events found — try a different search.')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ backgroundColor: wine, px, py: { xs: 8, md: 10 }, mt: { xs: 8, md: 10 }, borderRadius: { md: '20px' }, mx: { md: '5%' } }}>
      <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '12px' }}>
        AI Event Finder — Buyer Exclusive
      </p>
      <h2 style={{ color: cream, fontFamily: 'Ogg', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, lineHeight: 1.2, marginBottom: '24px' }}>
        Find your Art Basel moment.
      </h2>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 4 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="e.g. tech parties, free gallery openings, fashion pop-ups…"
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: cream,
              fontFamily: 'stratos-lights',
              backgroundColor: 'rgba(10,9,8,0.4)',
              borderRadius: '100px',
              '& fieldset': { borderColor: 'rgba(169,146,125,0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(169,146,125,0.6)' },
              '&.Mui-focused fieldset': { borderColor: gold },
            },
            '& .MuiInputBase-input::placeholder': { color: 'rgba(242,244,243,0.4)', fontFamily: 'stratos-lights' },
          }}
        />
        <Button
          onClick={search}
          disabled={loading || !query.trim()}
          disableElevation
          sx={{ backgroundColor: cream, color: bg, fontFamily: 'stratos-lights', fontSize: '15px', fontWeight: 400, py: 1.5, px: 4, borderRadius: 100, textTransform: 'none', whiteSpace: 'nowrap', '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' }, '&:disabled': { opacity: 0.5 } }}
        >
          {loading ? <CircularProgress size={18} sx={{ color: bg }} /> : 'Search Events'}
        </Button>
      </Box>

      {error && <p style={{ color: 'rgba(242,244,243,0.6)', fontFamily: 'stratos-lights', fontSize: '15px' }}>{error}</p>}

      {events.length > 0 && (
        <Grid container spacing={2}>
          {events.map((ev, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box sx={{ backgroundColor: 'rgba(10,9,8,0.4)', border: '1px solid rgba(169,146,125,0.2)', borderRadius: '12px', p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <span style={{ color: gold, fontSize: '11px', fontFamily: 'Test Calibre', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{ev.platform}</span>
                  <span style={{ color: 'rgba(242,244,243,0.5)', fontSize: '11px', fontFamily: 'stratos-lights' }}>{ev.price}</span>
                </Box>
                <h3 style={{ color: cream, fontFamily: 'stratos-lights', fontSize: '15px', lineHeight: 1.3, margin: 0 }}>{ev.name}</h3>
                <p style={{ color: gold, fontSize: '13px', fontFamily: 'stratos-lights', margin: 0 }}>{ev.date}{ev.time ? ` · ${ev.time}` : ''}</p>
                <p style={{ color: 'rgba(242,244,243,0.55)', fontSize: '13px', fontFamily: 'stratos-lights', margin: 0 }}>{ev.location}</p>
                {ev.description && <p style={{ color: 'rgba(242,244,243,0.65)', fontSize: '14px', fontFamily: 'stratos-lights', lineHeight: 1.5, margin: 0, flex: 1 }}>{ev.description}</p>}
                {ev.url && ev.url !== '#' && (
                  <a href={ev.url} target="_blank" rel="noopener noreferrer" style={{ color: gold, fontFamily: 'stratos-lights', fontSize: '14px', textDecoration: 'none', borderBottom: '1px solid rgba(169,146,125,0.3)', paddingBottom: '1px', alignSelf: 'flex-start', marginTop: 'auto' }}>
                    Get tickets →
                  </a>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

// ── Post-purchase: guide + event finder ─────────────────────────────────────
function GuidePage() {
  return (
    <Box sx={{ backgroundColor: bg, minHeight: '100vh', pb: 14 }}>
      <Box sx={{ backgroundColor: wine, px, py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '12px' }}>
          Art Basel Miami Beach 2025 · Dec 4–7
        </p>
        <h1 style={{ color: cream, fontFamily: 'Ogg', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 400, lineHeight: 1.1, marginBottom: '8px' }}>
          The Ultimate Guide
        </h1>
        <p style={{ color: 'rgba(242,244,243,0.6)', fontFamily: 'stratos-lights', fontSize: '14px' }}>
          Your purchase gives you permanent access to the guide below and the AI event finder.
        </p>
      </Box>

      {/* PDF viewer */}
      <Box sx={{ px, pt: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {PDF_URL && (
            <a href={PDF_URL} download style={{ color: gold, fontFamily: 'stratos-lights', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(169,146,125,0.3)', borderRadius: '100px', padding: '8px 20px' }}>
              Download PDF ↓
            </a>
          )}
        </Box>
        {PDF_URL ? (
          <Box sx={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(169,146,125,0.2)' }}>
            <iframe
              src={`${PDF_URL}#toolbar=0`}
              width="100%"
              height="800px"
              style={{ display: 'block', border: 'none' }}
              title="Art Basel 2025 Ultimate Guide"
            />
          </Box>
        ) : (
          <Box sx={{ backgroundColor: wine, borderRadius: '12px', p: 6, textAlign: 'center' }}>
            <p style={{ color: 'rgba(242,244,243,0.6)', fontFamily: 'stratos-lights', fontSize: '15px' }}>
              The guide PDF is being finalized. Check back shortly — it will appear here automatically.
            </p>
          </Box>
        )}
      </Box>

      {/* AI Event Finder */}
      <EventFinder />
    </Box>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ArtBasel() {
  const { user, loaded } = useUser()
  const { login } = usePrivy()
  const router = useRouter()
  const { session_id } = router.query

  const [buying, setBuying] = useState(false)
  const [processing, setProcessing] = useState(false)

  const purchased = loaded && user && hasBought(user)
  const notLoggedIn = loaded && !user

  // If redirected back from Stripe with session_id, poll for access
  useEffect(() => {
    if (!session_id) return
    if (purchased) return
    setProcessing(true)
    // Poll every 2s for up to 20s waiting for webhook to update Airtable
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch('/api/database/getUser')
        const data = await res.json()
        const updated = data?.user?.purchasedContent
          ?.split(',')
          .map((s) => s.trim())
          .includes(PRODUCT_ID)
        if (updated) {
          clearInterval(interval)
          setProcessing(false)
          // Remove query param without reload
          router.replace('/artbasel', undefined, { shallow: true })
        }
      } catch {}
      if (attempts >= 10) {
        clearInterval(interval)
        setProcessing(false)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [session_id, purchased, router])

  const handleBuy = useCallback(async () => {
    setBuying(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setBuying(false)
      }
    } catch {
      setBuying(false)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Art Basel 2025 Ultimate Guide | Violet Verse</title>
        <meta name="description" content="The complete guide to Art Basel Miami Beach 2025 — events, parties, galleries, fashion and tech. With AI-powered event finder." />
        <meta property="og:title" content="Art Basel 2025 Ultimate Guide | Violet Verse" />
        <meta property="og:description" content="Every event, party, and gallery show — curated for culture, fashion, and tech." />
        <meta property="og:type" content="website" />
      </Head>

      {!loaded ? (
        <Box sx={{ backgroundColor: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: gold }} />
        </Box>
      ) : processing ? (
        <Box sx={{ backgroundColor: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <CircularProgress sx={{ color: gold }} />
          <p style={{ color: 'rgba(242,244,243,0.7)', fontFamily: 'stratos-lights', fontSize: '17px' }}>
            Unlocking your guide…
          </p>
        </Box>
      ) : purchased ? (
        <GuidePage />
      ) : (
        <BuyPage onBuy={handleBuy} buying={buying} notLoggedIn={notLoggedIn} onLogin={login} />
      )}
    </>
  )
}

export async function getStaticProps() {
  return { props: {} }
}
