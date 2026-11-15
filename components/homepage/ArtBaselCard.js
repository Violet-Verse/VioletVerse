import Link from 'next/link'
import { Box, Button } from '@mui/material'

const ArtBaselCard = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#49111c',
        textAlign: 'center',
        px: { xs: '6%', sm: '8%', md: '10%' },
        py: { xs: 7, md: 10 },
      }}
    >
      <p
        style={{
          color: '#a9927d',
          fontSize: '12px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontFamily: 'Test Calibre',
          marginBottom: '16px',
        }}
      >
        Art Basel Miami 2026 · Dec 1–6
      </p>
      <h2
        style={{
          color: '#f2f4f3',
          fontFamily: 'Ogg',
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          marginBottom: '16px',
        }}
      >
        The Ultimate Guide to Art Basel Miami 2026
      </h2>
      <p
        style={{
          color: 'rgba(242,244,243,0.7)',
          fontFamily: 'stratos-lights',
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          lineHeight: 1.65,
          maxWidth: '520px',
          margin: '0 auto 36px',
        }}
      >
        Every party, gallery show, and pop-up — curated for culture, fashion, and tech. Includes an AI event finder.
      </p>
      <Link href="/artbasel" legacyBehavior>
        <a>
          <Button
            disableElevation
            sx={{
              backgroundColor: '#f2f4f3',
              color: '#0a0908',
              fontFamily: 'stratos-lights',
              fontSize: '15px',
              fontWeight: 400,
              py: 1.75,
              px: 4,
              borderRadius: 100,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' },
            }}
          >
            Get the Guide — $9.99
          </Button>
        </a>
      </Link>
    </Box>
  )
}

export default ArtBaselCard
