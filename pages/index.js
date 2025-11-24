import { Button, Grid, Box, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ArtBaselCard from '../components/homepage/ArtBaselCard'
import FutureByMelissaCard from '../components/homepage/FutureByMelissaCard'
import LayersOfTheVerse from '../components/homepage/LayersOfTheVerse'
import NewToWeb3 from '../components/homepage/NewToWeb3'
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
      <ArtBaselCard />

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
        <FutureByMelissaCard />

        {/* Layers of the Verse */}
        <LayersOfTheVerse
          posts={posts}
          authors={authors}
          contributors={contributors}
        />

        {/* New to Web3? */}
        <NewToWeb3 />
      </Box>
    </Box>
  )
}

export default Home
