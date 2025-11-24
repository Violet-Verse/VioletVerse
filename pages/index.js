import { Button, Grid, Box, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import ArticleGrid from '../components/article/ArticleGrid'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import InfoBlock from '../components/homepage/InfoBlock'
import { getUsersByRole } from './api/database/getUserByEmail'
import connectDatabase from '../lib/mongoClient'

export async function getServerSideProps() {
  const db = await connectDatabase()
  const collection = db.collection('posts')
  const data = await collection.find({ hidden: false }).toArray()

  const authors = await getUsersByRole('admin')
  const contributors = await getUsersByRole('contributor')

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data)),
      authors: authors,
      contributors: contributors,
    },
  }
}

const Home = ({ posts, authors, contributors }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true })
  
  const spotlightPost = {
    title: ' ',
    subtitle: '',
    url: '/eth-denver-tVvOGAqXKR',
  }

  return (
    <Box>
      <Head>
        <meta property="og:image" content="https://i.imgur.com/yhNmGo8.png" />
        <meta name="twitter:image:src" content="https://i.imgur.com/yhNmGo8.png" />
        <link rel="canonical" href="/" />
      </Head>

      {/* Hero Section - Responsive Video with Text Overlay */}
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
              <Link href={spotlightPost.url}>
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
              </Link>
            </Grid>

            <Grid item>
              <Button
                component={Link}
                href={spotlightPost.url}
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
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Art Basel Post */}
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
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item sx={{ width: '100%', maxWidth: { xs: '100%', sm: '450px' } }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/third_spaces.svg"
                alt="third spaces"
                width={450}
                height={300}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '450px',
                }}
                sizes="(max-width: 600px) 100vw, 450px"
              />
            </Box>
          </Grid>
          <Grid item sx={{ mt: { xs: 2, sm: 1 }, px: { xs: 2, sm: 0 } }}>
            <h2
              style={{
                fontSize: 'clamp(20px, 3vw, 28px)',
                margin: 0,
              }}
            >
              Art Basel 2025 Ultimate Guide
            </h2>
          </Grid>
          <Grid item sx={{ width: '100%', maxWidth: '555px', px: { xs: 2, sm: 0 } }}>
            <p style={{ margin: 0, fontSize: 'clamp(14px, 2vw, 16px)' }}>
              Ultimate Guide to Art, Fashion, Music, Tech in Miami
            </p>
          </Grid>
          <Grid item>
            <Link href="/art-basel-2025-ultimate-guide-to-art-tech-fashion-and-parties-1hZxmVcDMF">
              <Button
                variant="contained"
                disableElevation={true}
                sx={{
                  mt: { xs: 2, sm: 3 },
                  minHeight: '44px', // Touch target size
                  fontSize: { xs: '14px', sm: '16px' },
                  padding: { xs: '10px 24px', sm: '12px 28px' },
                }}
              >
                Download Now
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Claim Poap */}
      {/* <Box
                sx={{
                    borderTop: 100,
                    borderBottom: 100,
                    borderColor: "#0A0510",
                    backgroundColor: "#0A0510",
                    textAlign: {
                        xs: "center",
                    },
                }}
            >
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={4}
                >
                    <Grid item>
                        <h2 style={{ color: "white", fontSize: "28px" }}>
                            Frens at Art Basel, claim your free VV POAP!
                        </h2>
                    </Grid>
                    <Grid item>
                        <Image
                            src="/vvCircleLogo.svg"
                            alt="vv logo"
                            height={80}
                            width={80}
                        />
                    </Grid>
                </Grid>
                <Link href="https://kiosk.poap.xyz/#/event/hog54Jm3tROGR2jbwb9A">
                    <Button variant="contained" disableElevation sx={{ mt: 3 }}>
                        Claim Violet Verse POAP
                    </Button>
                </Link>
            </Box> */}

      {/* Main Content */}
      <Box
        sx={{
          px: {
            xs: '5%',
            sm: '5%',
            md: '10%',
            lg: '10%',
            xl: '10%',
          },
          maxWidth: { lg: '1400px', xl: '1600px' },
          mx: 'auto',
        }}
      >
        {/* Curated Content Marketplace */}
        <Box
          sx={{
            borderTop: { xs: 'clamp(24px, 4vw, 50px)', md: 'clamp(24px, 4vw, 50px)' },
            borderBottom: { xs: 'clamp(24px, 4vw, 50px)', md: 'clamp(24px, 4vw, 50px)' },
            borderColor: '#F9F4FE',
            backgroundColor: '#F9F4FE',
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
                }}
              >
                ✨ Dispatches from the Future
              </h2>
              <p
                style={{
                  maxWidth: '600px',
                  margin: '1rem auto 0',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  lineHeight: '1.6',
                  padding: { xs: '0 16px', sm: 0 },
                }}
              >
                Subscribe to the <strong>Future by Melissa</strong> Substack to get fresh
                takes on AI, digital assets & lifestyle — every week.
              </p>
            </Grid>

            <Grid item sx={{ mt: { xs: 2, sm: 3 }, width: '100%', maxWidth: '600px' }}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '53.33%', // Aspect ratio for 600x320
                  overflow: 'hidden',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  background: '#fff',
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

        <ArticleGrid
          title="Layers of the Verse"
          posts={posts}
          maximum={3}
          seeAll={true}
          mt={15}
          authors={authors}
          contributors={contributors}
        />

        {/* New to Web3? */}

        <InfoBlock title="New to Web3?" my={15} />
      </Box>
    </Box>
  )
}

export default Home
