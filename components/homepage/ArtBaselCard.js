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
        Now Open
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
        Join Verso Network
      </h2>
      <p
        style={{
          color: 'rgba(242,244,243,0.7)',
          fontFamily: 'stratos-lights',
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          lineHeight: 1.65,
          maxWidth: '500px',
          margin: '0 auto 36px',
        }}
      >
        A matchmaking service for AI trainers and researchers. Ethical data, fair pay, and work that actually matters.
      </p>
      <a
        href="https://experts-network.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
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
          Join the Network
        </Button>
      </a>
    </Box>
  )
}

export default ArtBaselCard
