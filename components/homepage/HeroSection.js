import { Button, Grid, Box, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
import styles from '../../styles/Home.module.css'

const HeroSection = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })
  
  const spotlightPost = {
    title: ' ',
    subtitle: '',
    url: '/eth-denver-tVvOGAqXKR',
  }

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
          url="https://www.youtube.com/watch?v=N-ZMbCeswoM&t=4s"
          config={{ youtube: { playerVars: { showinfo: 1 } } }}
          width="100%"
          height="100%"
          muted={true}
          playing={true}
          playsinline={true}
          loop={true}
        />
      </Box>
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
          zIndex: 1,
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
            maxWidth: { xs: '100%', md: '1040px' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Grid item>
            <Link href={spotlightPost.url} legacyBehavior>
              <a>
                <Box
                  component="span"
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                  }}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = spotlightPost.url;
                    }
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'stratos-lights',
                      color: 'black',
                      fontStyle: 'italic',
                      fontWeight: '200',
                      fontSize: 'clamp(24px, 4vw, 36px)',
                      lineHeight: '130%',
                      letterSpacing: '-0.01em',
                      margin: 0,
                    }}
                  >
                    {spotlightPost.subtitle}
                  </p>
                </Box>
              </a>
            </Link>
          </Grid>

          <Grid item>
            <Link href={spotlightPost.url} legacyBehavior>
              <a>
                <Button
                  size="large"
                  variant="contained"
                  disableElevation={true}
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    padding: { xs: '10px 24px', sm: '12px 28px' },
                    minHeight: '44px', // Touch target size
                  }}
                >
                  {isMobile
                    ? 'Watch Now'
                    : 'Check out the latest Fashion and Tech Stories'}
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

