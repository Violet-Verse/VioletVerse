import { useState } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Box, Grid, Button, IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

// ─── Archive items ────────────────────────────────────────────────────────────
// To add more pieces: duplicate an entry and update the fields.
// YouTube Shorts IDs are converted to standard watch URLs for reliable embeds.
const archiveItems = [
  {
    piece: 'The Work Dress',
    year: null,
    location: null,
    story:
      'Some pieces earn their place not through occasion but through repetition. This dress has shown up for meetings, travel days, and in-between moments — quietly indispensable, never trying too hard.',
    costPerWear: null,
    videoUrl: 'https://www.youtube.com/watch?v=zP-JmS-CNv0',
    type: 'youtube',
  },
  {
    piece: 'The Fringe Skirt',
    year: '2020',
    location: null,
    story:
      'Purchased during the pandemic. Originally intended for Paris Fashion Week. Years later, it remains one of the most dynamic pieces in my wardrobe — not because of where it was meant to go, but because of how it moves.',
    costPerWear: null,
    videoUrl: 'https://www.youtube.com/watch?v=UMMVJDqN9Ps',
    type: 'youtube',
  },
  {
    piece: 'The Trend Coat',
    year: null,
    location: null,
    story:
      'It arrived ahead of the trend cycle and stayed long after. The mark of a well-designed piece is that it doesn\'t need a moment — it creates one.',
    costPerWear: null,
    videoUrl: 'https://www.youtube.com/watch?v=KzOd_hP86S4',
    type: 'youtube',
  },
  {
    piece: 'The Cream Blazer Dress',
    year: null,
    location: 'London',
    story:
      'There are garments that only reveal themselves in the right city, the right light. London was the setting this piece had been waiting for.',
    costPerWear: null,
    videoUrl: 'https://www.instagram.com/p/DN9JsDlEqnd/embed/',
    type: 'instagram',
  },
]

// ─── CTA links ────────────────────────────────────────────────────────────────
// TODO: Replace placeholder hrefs with your real URLs
const ctas = [
  {
    label: 'Shop My Poshmark',
    href: 'https://poshmark.com', // TODO: your Poshmark shop URL
    variant: 'dark',
  },
  {
    label: 'Shop My Links',
    href: '#', // TODO: LTK / ShopMy / affiliate URL
    variant: 'outline',
  },
]

// ─── Shared style tokens ──────────────────────────────────────────────────────
const bg = '#F5F0EB'
const ink = '#0a0908'
const muted = 'rgba(10,9,8,0.55)'
const accent = '#6b5c4e'

export default function TheCollection() {
  const [current, setCurrent] = useState(0)
  const item = archiveItems[current]
  const total = archiveItems.length

  const prev = () => setCurrent((i) => (i - 1 + total) % total)
  const next = () => setCurrent((i) => (i + 1) % total)

  return (
    <Box sx={{ backgroundColor: bg, minHeight: '100vh', pb: 14 }}>
      <Head>
        <title>The Collection, Vol. I: My Jacquemus Archive | Violet Verse</title>
        <meta
          name="description"
          content="A personal archive documenting years of collecting, wearing, and traveling in Jacquemus."
        />
        <meta property="og:title" content="The Collection, Vol. I: My Jacquemus Archive" />
        <meta
          property="og:description"
          content="A personal archive documenting years of collecting, wearing, and traveling in Jacquemus."
        />
        <meta property="og:type" content="article" />
      </Head>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          textAlign: 'center',
          pt: { xs: 10, md: 16 },
          pb: { xs: 8, md: 12 },
          px: '5%',
          borderBottom: `1px solid rgba(10,9,8,0.1)`,
        }}
      >
        <p
          style={{
            fontFamily: 'stratos-lights',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accent,
            marginBottom: '20px',
          }}
        >
          Vol. I — Jacquemus
        </p>
        <h1
          style={{
            fontFamily: 'Ogg',
            fontSize: 'clamp(40px, 7vw, 88px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: ink,
            margin: '0 auto 24px',
            maxWidth: '900px',
          }}
        >
          The Collection
        </h1>
        <p
          style={{
            fontFamily: 'stratos-lights',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            color: muted,
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.65,
            fontStyle: 'italic',
          }}
        >
          A personal archive documenting years of collecting, wearing, and traveling in Jacquemus.
        </p>
      </Box>

      {/* ── Introduction ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          maxWidth: '680px',
          mx: 'auto',
          px: { xs: '6%', md: '5%' },
          py: { xs: 8, md: 12 },
        }}
      >
        {/*
          TODO: Replace the three paragraphs below with your own intro essay.
          The brief calls for: why you've continued collecting Jacquemus,
          why these pieces remain in your wardrobe, and your perspective as
          a writer, traveler, and collector — not a shopping guide.
        */}
        <p
          style={{
            fontFamily: 'stratos-lights',
            fontSize: 'clamp(17px, 1.8vw, 20px)',
            lineHeight: 1.8,
            color: ink,
            marginBottom: '24px',
          }}
        >
          I started buying Jacquemus before it became the brand it is now. Not as a statement,
          not as an investment — because something about the proportion, the color, and the quiet
          confidence of each silhouette felt worth returning to.
        </p>
        <p
          style={{
            fontFamily: 'stratos-lights',
            fontSize: 'clamp(17px, 1.8vw, 20px)',
            lineHeight: 1.8,
            color: ink,
            marginBottom: '24px',
          }}
        >
          What follows is not a review or a ranking. It is a record — of the places these pieces
          have traveled, the moments they've witnessed, and the reasons they remain in my wardrobe
          years after purchase.
        </p>
        <p
          style={{
            fontFamily: 'stratos-lights',
            fontSize: 'clamp(17px, 1.8vw, 20px)',
            lineHeight: 1.8,
            color: muted,
            fontStyle: 'italic',
          }}
        >
          This is Vol. I. The archive is ongoing.
        </p>
      </Box>

      {/* ── Archive label ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          textAlign: 'center',
          pb: 6,
          borderTop: `1px solid rgba(10,9,8,0.1)`,
          pt: 6,
        }}
      >
        <p
          style={{
            fontFamily: 'stratos-lights',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accent,
          }}
        >
          The Archive
        </p>
      </Box>

      {/* ── Slideshow ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          px: { xs: '5%', md: '8%', lg: '12%' },
          maxWidth: '1100px',
          mx: 'auto',
        }}
      >
        <Grid
          container
          spacing={{ xs: 5, md: 8 }}
          alignItems="center"
          justifyContent="center"
        >
          {/* Video panel */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '177.78%', // 9:16 for Shorts / Reels
                backgroundColor: '#111',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              {item.type === 'youtube' ? (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                  }}
                >
                  <ReactPlayer
                    url={item.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    playing={false}
                    config={{ youtube: { playerVars: { modestbranding: 1 } } }}
                  />
                </Box>
              ) : (
                <iframe
                  src={item.videoUrl}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allowTransparency="true"
                  scrolling="no"
                  frameBorder="0"
                  title={item.piece}
                />
              )}
            </Box>
          </Grid>

          {/* Metadata panel */}
          <Grid item xs={12} md={5}>
            <Box>
              {/* Counter */}
              <p
                style={{
                  fontFamily: 'stratos-lights',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: accent,
                  marginBottom: '16px',
                }}
              >
                {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </p>

              {/* Piece name */}
              <h2
                style={{
                  fontFamily: 'Ogg',
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                  color: ink,
                  marginBottom: '10px',
                }}
              >
                {item.piece}
              </h2>

              {/* Year + location */}
              {(item.year || item.location) && (
                <p
                  style={{
                    fontFamily: 'stratos-lights',
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    color: accent,
                    marginBottom: '24px',
                  }}
                >
                  {[item.year, item.location].filter(Boolean).join(' — ')}
                </p>
              )}

              {/* Story */}
              <p
                style={{
                  fontFamily: 'stratos-lights',
                  fontSize: 'clamp(16px, 1.6vw, 18px)',
                  lineHeight: 1.8,
                  color: 'rgba(10,9,8,0.75)',
                  marginBottom: item.costPerWear ? '16px' : '40px',
                }}
              >
                {item.story}
              </p>

              {/* Cost per wear — shown only if populated */}
              {item.costPerWear && (
                <p
                  style={{
                    fontFamily: 'stratos-lights',
                    fontSize: '13px',
                    color: muted,
                    fontStyle: 'italic',
                    marginBottom: '40px',
                  }}
                >
                  Cost per wear: {item.costPerWear}
                </p>
              )}

              {/* Prev / dots / next */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={prev}
                  size="small"
                  sx={{
                    border: `1px solid rgba(10,9,8,0.2)`,
                    color: ink,
                    '&:hover': { backgroundColor: 'rgba(10,9,8,0.05)' },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {archiveItems.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setCurrent(i)}
                      sx={{
                        height: 6,
                        width: i === current ? 22 : 6,
                        borderRadius: 3,
                        backgroundColor:
                          i === current ? ink : 'rgba(10,9,8,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Box>

                <IconButton
                  onClick={next}
                  size="small"
                  sx={{
                    border: `1px solid rgba(10,9,8,0.2)`,
                    color: ink,
                    '&:hover': { backgroundColor: 'rgba(10,9,8,0.05)' },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── Philosophy ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          maxWidth: '620px',
          mx: 'auto',
          px: { xs: '6%', md: '5%' },
          py: { xs: 10, md: 16 },
          textAlign: 'center',
          borderTop: `1px solid rgba(10,9,8,0.1)`,
          mt: { xs: 10, md: 14 },
        }}
      >
        <p
          style={{
            fontFamily: 'Ogg',
            fontSize: 'clamp(20px, 2.4vw, 27px)',
            fontWeight: 400,
            lineHeight: 1.7,
            color: ink,
            fontStyle: 'italic',
          }}
        >
          "Fashion isn't simply about acquiring new pieces. It's about building a wardrobe that travels
          with you, gains meaning over time, and continues to feel relevant years after purchase."
        </p>
      </Box>

      {/* ── CTAs ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          px: '5%',
        }}
      >
        {ctas.map((cta) => (
          <Button
            key={cta.label}
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            disableElevation
            sx={
              cta.variant === 'dark'
                ? {
                    backgroundColor: ink,
                    color: bg,
                    fontFamily: 'stratos-lights',
                    fontSize: '15px',
                    fontWeight: 400,
                    py: 1.8,
                    px: 4,
                    borderRadius: 100,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#2a2928' },
                  }
                : {
                    border: `1.5px solid ${ink}`,
                    color: ink,
                    backgroundColor: 'transparent',
                    fontFamily: 'stratos-lights',
                    fontSize: '15px',
                    fontWeight: 400,
                    py: 1.8,
                    px: 4,
                    borderRadius: 100,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(10,9,8,0.05)' },
                  }
            }
          >
            {cta.label}
          </Button>
        ))}
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: {} }
}
