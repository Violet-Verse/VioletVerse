import { Box, Grid } from '@mui/material'

const FutureByMelissaCard = () => {
  return (
    <Box
      sx={{
        borderTop: { xs: 'clamp(24px, 4vw, 50px)', md: 'clamp(24px, 4vw, 50px)' },
        borderBottom: { xs: 'clamp(24px, 4vw, 50px)', md: 'clamp(24px, 4vw, 50px)' },
        borderColor: '#F9F4FE',
        backgroundColor: '#F9F4FE',
        borderRadius: '32px',
        px: {
          xs: '5%',
          sm: '5%',
          md: '10%',
          lg: '10%',
          xl: '10%',
        },
        py: { xs: 4, md: 8 },
        textAlign: 'center',
        mt: { xs: 4, md: 6 },
      }}
    >
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item sx={{ width: '100%', maxWidth: '600px' }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontFamily: 'serif',
              marginBottom: '1rem',
              margin: 0,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            ✨ Dispatches from the Future
          </h2>
          <Box
            sx={{
              maxWidth: '600px',
              margin: '1rem auto 0',
              px: { xs: 2, sm: 0 },
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: '1.6',
                color: 'rgba(0, 0, 0, 0.7)',
              }}
            >
              Subscribe to the <strong>Future by Melissa</strong> Substack to get fresh
              takes on AI, digital assets & lifestyle — every week.
            </p>
          </Box>
        </Grid>

        <Grid item sx={{ mt: { xs: 2, sm: 3 }, width: '100%', maxWidth: '600px' }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '53.33%', // Aspect ratio for 600x320
              overflow: 'hidden',
              borderRadius: '32px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                borderColor: 'rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <iframe
              src="https://futurebymelissa.substack.com/embed"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              frameBorder="0"
              scrolling="no"
              title="Future by Melissa Substack"
            ></iframe>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FutureByMelissaCard

