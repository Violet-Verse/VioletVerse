import { Button, Grid, Box, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
import styles from '../../styles/Home.module.css'

const HeroSection = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        className={styles.videoContainer}
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: { xs: '56.25%', md: '56.25%' }, // 16:9 aspect ratio
          '& > div': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          },
        }}
      >
        <ReactPlayer
          className={styles.video}
          url="https://www.youtube.com/watch?v=bDa4LJvnPPo"
          config={{ youtube: { playerVars: { showinfo: 1 } } }}
          width="100%"
          height="100%"
          muted={true}
          playing={true}
          playsinline={true}
          loop={true}
        />
      </Box>
      {/* Gradient overlay for text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: 'linear-gradient(to right, rgba(10,9,8,0.72) 0%, rgba(10,9,8,0.3) 100%)',
            md: 'linear-gradient(to right, rgba(10,9,8,0.65) 0%, rgba(10,9,8,0.1) 70%, transparent 100%)',
          },
          zIndex: 1,
        }}
      />
      <Box
        className={styles.overlay}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          zIndex: 2,
          px: {
            xs: '5%',
            sm: '5%',
            md: '10%',
          },
          py: { xs: 4, md: 8 },
        }}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{
            maxWidth: { xs: '100%', md: '680px' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Grid item>
            <h1
              style={{
                color: '#f2f4f3',
                fontSize: 'clamp(28px, 5vw, 56px)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 12px rgba(10,9,8,0.4)',
                margin: 0,
              }}
            >
              Media. Intelligence. Experience.
            </h1>
          </Grid>

          <Grid item>
            <p
              style={{
                fontFamily: 'stratos-lights',
                color: 'rgba(242,244,243,0.9)',
                fontSize: 'clamp(14px, 1.8vw, 18px)',
                lineHeight: '145%',
                letterSpacing: '0.005em',
                margin: 0,
                textShadow: '0 1px 6px rgba(10,9,8,0.3)',
              }}
            >
              Violet Verse is a creative studio at the intersection of content, AI,
              and global experiences. We publish, we build, and we take you places.
            </p>
          </Grid>

          <Grid item>
            <Link href="/posts" legacyBehavior>
              <a>
                <Button
                  size="large"
                  variant="contained"
                  disableElevation={true}
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    padding: { xs: '10px 24px', sm: '12px 28px' },
                    minHeight: '44px',
                  }}
                >
                  {isMobile ? 'Read the Journal' : 'Read the Journal'}
                </Button>
              </a>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default HeroSection

