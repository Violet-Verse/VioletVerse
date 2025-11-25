import { Box, Grid, Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

const ArtBaselCard = () => {
  return (
    <Box
      sx={{
        borderTop: { xs: 'clamp(24px, 4vw, 50px)', md: 'clamp(24px, 4vw, 50px)' },
        borderBottom: { xs: 'clamp(24px, 4vw, 50px)', md: 'clamp(24px, 4vw, 50px)' },
        borderColor: '#ECE6F9',
        backgroundColor: '#ECE6F9',
        textAlign: {
          xs: 'center',
        },
        px: {
          xs: '5%',
          sm: '5%',
          md: '10%',
          lg: '10%',
          xl: '10%',
        },
        py: { xs: 4, md: 6 },
      }}
    >
      <Grid container={true} direction="column" justifyContent="center" alignItems="center" spacing={3}>
        <Grid item={true} sx={{ width: '100%', maxWidth: { xs: '100%', sm: '450px' } }}>
          <Link href="/art-basel-2025-ultimate-guide-to-art-tech-fashion-and-parties-1hZxmVcDMF" legacyBehavior>
            <a>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    '& .art-basel-image': {
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                    },
                  },
                }}
              >
                <Image
                  src="/third_spaces.svg"
                  alt="third spaces"
                  width={450}
                  height={300}
                  className="art-basel-image"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '450px',
                    borderRadius: '24px',
                    transition: 'box-shadow 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                  sizes="(max-width: 600px) 100vw, 450px"
                />
              </Box>
            </a>
          </Link>
        </Grid>
        <Grid item={true} sx={{ mt: { xs: 1, sm: 0 }, px: { xs: 2, sm: 0 } }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              margin: 0,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            Art Basel 2025 Ultimate Guide
          </h2>
        </Grid>
        <Grid item={true} sx={{ width: '100%', maxWidth: '555px', px: { xs: 2, sm: 0 } }}>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(14px, 2vw, 16px)',
              lineHeight: '1.6',
              color: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            Ultimate Guide to Art, Fashion, Music, Tech in Miami
          </p>
        </Grid>
        <Grid item={true}>
          <Link href="/art-basel-2025-ultimate-guide-to-art-tech-fashion-and-parties-1hZxmVcDMF" legacyBehavior>
            <a>
              <Button
                variant="contained"
                disableElevation={true}
                sx={{
                  mt: { xs: 2, sm: 3 },
                  minHeight: '44px',
                  fontSize: { xs: '14px', sm: '16px' },
                  padding: { xs: '10px 24px', sm: '12px 28px' },
                  fontWeight: 600,
                  borderRadius: 100,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Download Now
              </Button>
            </a>
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ArtBaselCard

