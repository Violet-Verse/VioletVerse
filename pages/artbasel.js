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

const PRODUCT_ID = 'artbasel-2026'

function hasBought(user) {
  if (!user?.purchasedContent) return false
  return user.purchasedContent.split(',').map((s) => s.trim()).includes(PRODUCT_ID)
}

// ── Guide data ───────────────────────────────────────────────────────────────
const PARTIES = [
  { date: 'Tue Dec 1, 4:30–6pm', what: 'The Ocean Odyssey by Subodh Kerkar with REEFLINE: beach performance with Miami City Ballet dancers and 50+ community performers', where: 'Andaz beachfront, 4041 Collins Ave', access: 'Free, public' },
  { date: 'Tue–Fri Dec 1–4, 10pm–midnight', what: 'Capital One Venture X Sound Sessions: intimate sets from emerging and established artists', where: 'Pauline Bar, The Shelborne By Proper', access: 'Hotel guests' },
  { date: 'Thu Dec 3, 11:30pm–2:30am', what: 'Capital One x BÉIS after-hours: theatrical performances, Shay Mitchell, live music and the Midnight Blue luggage reveal', where: 'The Shelborne By Proper', access: 'Capital One cardholders; tickets on Capital One Entertainment' },
]

const ART_HAPPENINGS = [
  { dates: 'Opens Nov 19', what: 'Sheroanawe Hakihiiwe, ICA Miami x Fondation Cartier: first U.S. museum solo, 100+ works', where: 'ICA Miami, 61 NE 41st St', entry: 'Check ICA admission' },
  { dates: 'Nov 29 – Feb 15', what: 'Basquiat: Hidden World: three never-before-seen paintings with hidden layers revealed under UV light', where: 'ICA Miami Expansion Space, 23 NE 41st St', entry: 'Check' },
  { dates: 'Nov 30 – Dec 6', what: 'Yanira Collado, Converging Timelines (No Vacancy)', where: 'Lobby Gallery, The Shelborne By Proper', entry: 'Free' },
  { dates: 'Dec 1–6', what: 'SCOPE Miami Beach', where: 'SCOPE Art Deco Center, 1001 Ocean Dr', entry: 'Ticketed; 2026 hours and prices TBA' },
  { dates: 'Dec 1–6', what: 'Andrés Reisinger, Do You Dream In Color?: draped install and digital works', where: 'Andaz Miami Beach, 4041 Collins Ave', entry: 'Free, public' },
  { dates: 'Dec 1–3', what: 'Hårklinikken pop-up: one-on-one hair and scalp consults with a custom Hair Gain Extract', where: 'Rodrigo Ivory Salon, 1749 NE Miami Ct', entry: 'Private consultation; book ahead' },
  { dates: 'Dec 2–5, 12–7pm', what: 'The Open Invitational: nonprofit fair for progressive art studios', where: '3930 NE 2nd Ave, 2nd fl', entry: 'Check' },
  { dates: 'Dec 2–6, 11am–4pm', what: 'LVMH The Studio Miami: 9-artist gallery, craft demos, panels, free legal and finance clinics for artists and founders', where: 'Palm Court Event Space, 140 NE 39th St, 3rd fl', entry: 'Public' },
  { dates: 'Dec 4–6 (VIP Dec 2–3)', what: 'Art Basel Miami Beach, incl. the Zero 10 digital-art sector: The Forest Remembers: Winds of Yawanawa with Refik Anadol, booth Z6', where: 'Miami Beach Convention Center', entry: 'Ticketed' },
  { dates: 'From Art Week, into 2027', what: 'MDD Design Commission by Objects of Common Interest: totems that react to touch, release vapor and make sound', where: 'Throughout the Miami Design District', entry: 'Free' },
  { dates: 'Wed–Fri, 12–4pm', what: 'Craig Robins Collection rehang: Baldessari, Dumas, Charles Ray', where: 'Dacra HQ, 3841 NE 2nd Ave', entry: 'Free, by appointment (collection@dacra.com)' },
]

const EAT_PHOTOS = [
  { for: 'Photo', spot: 'PASTEL Miami, CJ Hendry + Salon 94 Design', where: '3925 N Miami Ave', dates: 'Nov 30 – Dec 20, 10am–6pm', hook: 'Pool-sized pit of giant pills; scoop your own, $1 per pill' },
  { for: 'Photo', spot: 'Shelly Floyd, MELT Lounger', where: 'The Standard Spa, 40 Island Ave', dates: 'Nov 24 – Dec 8', hook: 'Melting pink figure on a poolside lounger; the empty one is for you' },
  { for: 'Photo', spot: 'Andrés Reisinger draped install', where: 'Andaz porte cochère, 4041 Collins Ave', dates: 'Dec 1–6', hook: 'All-pink drape over the entrance, free from the street' },
  { for: 'Photo', spot: 'JJ Hammond, Look Around Once and a While', where: 'Bal Harbour, 102nd St Beach Access Path', dates: 'Nov 29 – Dec 27', hook: 'Seven-foot sculptures and glow-in-the-dark stars; go at dusk' },
  { for: 'Photo', spot: 'MDD Design Commission (OOCI)', where: 'Throughout the Design District', dates: 'From Art Week', hook: 'Totems that steam and hum; good for video' },
  { for: 'Eat + photo', spot: 'Grotto Baths', where: '325 NW 28th St, Wynwood', dates: 'Art Week preview', hook: 'BLOCK PARTY nonalcoholic drink and a Florida conch tartine, beside Emmett Moore\'s breeze-block wall' },
  { for: 'Eat', spot: 'The Joyce', where: '448 Espanola Way, Miami Beach', dates: 'Hang on view from end of Nov', hook: '45-seat steakhouse with Picasso, de Kooning, Basquiat, Condo and KAWS on the walls' },
  { for: 'Eat (splurge)', spot: 'Le Dîner des Grands Crus at The Joyce', where: '448 Espanola Way', dates: 'Tue Dec 1', hook: '12 seats at $12,000 each, about $150,000 of rare wine incl. 1964 Pétrus' },
  { for: 'Eat (new)', spot: 'Pizza Studio Tamaki', where: 'North Beach', dates: 'Opens December', hook: 'Tokyo-Neapolitan pizza from Spicy Hospitality Group' },
  { for: 'Eat (new)', spot: 'Wilder Miami', where: 'Miami', dates: 'Coming soon', hook: 'Neighborhood market backed by Major Food Group' },
]

// ── Pre-purchase hero ────────────────────────────────────────────────────────
function BuyPage({ onBuy, buying, notLoggedIn, onLogin }) {
  return (
    <Box sx={{ backgroundColor: bg, minHeight: '100vh', pb: 14 }}>
      <Box sx={{ backgroundColor: wine, px, py: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '16px' }}>
          Art Basel Miami Beach 2026 · Dec 1–6
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
            <Button onClick={onLogin} disableElevation sx={{ backgroundColor: cream, color: bg, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' } }}>
              Sign In
            </Button>
          </Box>
        ) : (
          <Button onClick={onBuy} disabled={buying} disableElevation startIcon={buying ? <CircularProgress size={18} sx={{ color: bg }} /> : null} sx={{ backgroundColor: cream, color: bg, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' }, '&:disabled': { backgroundColor: 'rgba(242,244,243,0.5)', color: 'rgba(10,9,8,0.5)' } }}>
            {buying ? 'Redirecting…' : 'Get the Guide — $9.99'}
          </Button>
        )}
      </Box>

      <Box sx={{ px, py: { xs: 8, md: 12 }, maxWidth: '900px', mx: 'auto' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '32px', textAlign: 'center' }}>
          What&apos;s Inside
        </p>
        <Grid container spacing={3}>
          {[
            { title: 'Parties & Performances', desc: 'Clubs, shows, and after-hours — from a free beach performance to a Shay Mitchell reveal.' },
            { title: 'Art Happenings', desc: 'Gallery openings, satellite fairs, and the main Art Basel fair (Dec 4–6). Basquiat, SCOPE, LVMH The Studio, and more.' },
            { title: 'Eat + Take Photos', desc: 'CJ Hendry\'s pill pit, the MELT Lounger, The Joyce steakhouse with Picasso on the walls.' },
            { title: 'AI Event Finder', desc: 'Search Eventbrite, Luma, and more by vibe or category — buyer-exclusive.' },
            { title: 'Design District Walk', desc: 'One afternoon itinerary: Basquiat, ICA, LVMH The Studio, and the MDD commission.' },
            { title: 'Insider Tips', desc: 'What\'s free, what\'s ticketed, what requires a hotel stay — so you spend your time right.' },
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

// ── Guide tables ─────────────────────────────────────────────────────────────
const thTd = { fontFamily: 'stratos-lights', fontSize: '14px', padding: '10px 14px', lineHeight: 1.45, verticalAlign: 'top', borderBottom: `1px solid rgba(169,146,125,0.1)` }
const thStyle = { ...thTd, color: gold, fontWeight: 600, backgroundColor: wine, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase' }
const tdStyle = { ...thTd, color: 'rgba(242,244,243,0.82)' }
const trEven = { backgroundColor: 'rgba(73,17,28,0.18)' }

function PartiesTable() {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '22%' }} />
          <col style={{ width: '46%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '12%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={thStyle}>Date &amp; time</th>
            <th style={thStyle}>What</th>
            <th style={thStyle}>Where</th>
            <th style={thStyle}>Who can go</th>
          </tr>
        </thead>
        <tbody>
          {PARTIES.map((r, i) => (
            <tr key={i} style={i % 2 === 1 ? trEven : {}}>
              <td style={tdStyle}>{r.date}</td>
              <td style={tdStyle}>{r.what}</td>
              <td style={tdStyle}>{r.where}</td>
              <td style={tdStyle}>{r.access}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: 'rgba(242,244,243,0.4)', fontFamily: 'stratos-lights', fontSize: '13px', fontStyle: 'italic', marginTop: '14px' }}>More parties will be added as invitations are announced.</p>
    </Box>
  )
}

function ArtHappeningsTable() {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '18%' }} />
          <col style={{ width: '46%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '14%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={thStyle}>Dates</th>
            <th style={thStyle}>What</th>
            <th style={thStyle}>Where</th>
            <th style={thStyle}>Entry</th>
          </tr>
        </thead>
        <tbody>
          {ART_HAPPENINGS.map((r, i) => (
            <tr key={i} style={i % 2 === 1 ? trEven : {}}>
              <td style={tdStyle}>{r.dates}</td>
              <td style={tdStyle}>{r.what}</td>
              <td style={tdStyle}>{r.where}</td>
              <td style={tdStyle}>{r.entry}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: 'rgba(242,244,243,0.4)', fontFamily: 'stratos-lights', fontSize: '13px', fontStyle: 'italic', marginTop: '14px' }}>Dates and entry details as announced; confirm before you go.</p>
    </Box>
  )
}

function EatPhotosTable() {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '12%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '28%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={thStyle}>For</th>
            <th style={thStyle}>Spot</th>
            <th style={thStyle}>Where</th>
            <th style={thStyle}>Dates</th>
            <th style={thStyle}>The hook</th>
          </tr>
        </thead>
        <tbody>
          {EAT_PHOTOS.map((r, i) => (
            <tr key={i} style={i % 2 === 1 ? trEven : {}}>
              <td style={tdStyle}>{r.for}</td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{r.spot}</td>
              <td style={tdStyle}>{r.where}</td>
              <td style={tdStyle}>{r.dates}</td>
              <td style={tdStyle}>{r.hook}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: 'rgba(242,244,243,0.4)', fontFamily: 'stratos-lights', fontSize: '13px', fontStyle: 'italic', marginTop: '14px' }}>Opening dates for Pizza Studio Tamaki and Wilder to be confirmed.</p>
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
const TABS = [
  { id: 'parties', label: 'Parties', pdf: '/guides/art-basel-2026-parties.pdf', desc: 'Clubs, performances, and after-hours', Component: PartiesTable },
  { id: 'art', label: 'Art Happenings', pdf: '/guides/art-basel-2026-art-happenings.pdf', desc: 'Exhibitions, fairs, and the main show', Component: ArtHappeningsTable },
  { id: 'eat', label: 'Eat + Photos', pdf: '/guides/art-basel-2026-eat-photos.pdf', desc: 'Where to eat and what to photograph', Component: EatPhotosTable },
]

function GuidePage() {
  const [activeTab, setActiveTab] = useState('parties')
  const tab = TABS.find((t) => t.id === activeTab)

  return (
    <Box sx={{ backgroundColor: bg, minHeight: '100vh', pb: 14 }}>
      <Box sx={{ backgroundColor: wine, px, py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '12px' }}>
          Art Basel Miami Beach 2026 · Dec 1–6
        </p>
        <h1 style={{ color: cream, fontFamily: 'Ogg', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 400, lineHeight: 1.1, marginBottom: '8px' }}>
          The Ultimate Guide
        </h1>
        <p style={{ color: 'rgba(242,244,243,0.6)', fontFamily: 'stratos-lights', fontSize: '14px' }}>
          Your purchase gives you permanent access to all three guide sections and the AI event finder below.
        </p>
      </Box>

      {/* Tab navigation */}
      <Box sx={{ px, pt: { xs: 5, md: 7 } }}>
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, mb: 4, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <Button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              disableElevation
              sx={{
                fontFamily: 'stratos-lights',
                fontSize: { xs: '14px', sm: '15px' },
                fontWeight: 400,
                py: 1.25,
                px: { xs: 2.5, sm: 3.5 },
                borderRadius: 100,
                textTransform: 'none',
                backgroundColor: activeTab === t.id ? cream : 'transparent',
                color: activeTab === t.id ? bg : 'rgba(242,244,243,0.55)',
                border: `1px solid ${activeTab === t.id ? cream : 'rgba(169,146,125,0.25)'}`,
                '&:hover': { backgroundColor: activeTab === t.id ? cream : 'rgba(169,146,125,0.08)', color: activeTab === t.id ? bg : cream },
              }}
            >
              {t.label}
            </Button>
          ))}
        </Box>

        {/* Section header + download */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <div>
            <p style={{ color: gold, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '4px' }}>
              Art Basel Miami 2026
            </p>
            <h2 style={{ color: cream, fontFamily: 'Ogg', fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, margin: 0 }}>{tab.label}</h2>
            <p style={{ color: 'rgba(242,244,243,0.5)', fontFamily: 'stratos-lights', fontSize: '14px', margin: '4px 0 0' }}>{tab.desc}</p>
          </div>
          <a
            href={tab.pdf}
            download
            style={{ color: gold, fontFamily: 'stratos-lights', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(169,146,125,0.3)', borderRadius: '100px', padding: '8px 20px', whiteSpace: 'nowrap' }}
          >
            Download PDF ↓
          </a>
        </Box>

        {/* Table */}
        <Box sx={{ border: '1px solid rgba(169,146,125,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
          <tab.Component />
        </Box>
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
  const [authTimedOut, setAuthTimedOut] = useState(false)

  useEffect(() => {
    if (loaded) return
    const t = setTimeout(() => setAuthTimedOut(true), 4000)
    return () => clearTimeout(t)
  }, [loaded])

  const showPage = loaded || authTimedOut
  const purchased = showPage && user && hasBought(user)
  const notLoggedIn = showPage && !user

  useEffect(() => {
    if (!session_id) return
    if (purchased) return
    setProcessing(true)
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
        <title>Art Basel 2026 Ultimate Guide | Violet Verse</title>
        <meta name="description" content="The complete guide to Art Basel Miami Beach 2026 — events, parties, galleries, fashion and tech. With AI-powered event finder." />
        <meta property="og:title" content="Art Basel 2026 Ultimate Guide | Violet Verse" />
        <meta property="og:description" content="Every event, party, and gallery show — curated for culture, fashion, and tech." />
        <meta property="og:type" content="website" />
      </Head>

      {!showPage ? (
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
