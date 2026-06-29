import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import HeroSection from '../components/homepage/HeroSection'
import ArtBaselCard from '../components/homepage/ArtBaselCard'
import FutureByMelissaCard from '../components/homepage/FutureByMelissaCard'
import LayersOfTheVerse from '../components/homepage/LayersOfTheVerse'
import NewToWeb3 from '../components/homepage/NewToWeb3'
import { getUsersByRole } from './api/database/getUserByEmail'
import connectDatabase from '../lib/mongoClient'

const pillars = [
  {
    label: 'PUBLISH',
    name: 'The Verse',
    desc: 'Culture, technology, and lifestyle — told by writers who live it. Our journal covers the stories that matter at the intersection of media and the future.',
    cta: 'Read the Journal',
    href: '/posts',
  },
  {
    label: 'BUILD',
    name: 'Violet Verse Experts',
    desc: 'A 6-week expert data pilot for applied AI teams. We validate human data and RL strategies before you scale — so you invest in what actually works.',
    cta: 'Learn More',
    href: '/experts',
  },
  {
    label: 'EXPERIENCE',
    name: 'Travel',
    desc: "We've been there. We've written about it. Now let us book it for you. Curated trips for culture, crypto, and creative communities.",
    cta: 'Plan Your Trip',
    href: '/travel',
  },
  {
    label: 'COLLECT',
    name: 'The Jacquemus Archive',
    desc: 'A personal archive documenting years of collecting, wearing, and traveling in Jacquemus — and where to find these pieces now.',
    cta: 'Explore the Archive',
    href: '/jacquemusarchives',
  },
]

export async function getServerSideProps() {
  try {
    const db = await connectDatabase()
    const data = await db.collection('posts').find({ hidden: false }).toArray()
    let authors = [], contributors = []
    try { authors = await getUsersByRole('admin') } catch {}
    try { contributors = await getUsersByRole('contributor') } catch {}
    return {
      props: { posts: JSON.parse(JSON.stringify(data)), authors, contributors },
    }
  } catch {
    return { props: { posts: [], authors: [], contributors: [] } }
  }
}

const Home = ({ posts, authors, contributors }) => {
  return (
    <Box>
      <Head>
        <meta property="og:image" content="https://i.imgur.com/yhNmGo8.png" />
        <meta name="twitter:image:src" content="https://i.imgur.com/yhNmGo8.png" />
        <link rel="canonical" href="/" />
      </Head>

      {/* Hero Section - Responsive Video with Text Overlay */}
      <HeroSection />

      {/* Three Pillars — What We Do */}
      <Box
        sx={{
          backgroundColor: '#0a0908',
          px: { xs: '5%', sm: '5%', md: '10%', lg: '10%', xl: '10%' },
          py: { xs: 8, sm: 10, md: 12 },
        }}
      >
        <Grid container direction="column" spacing={5}>
          <Grid item sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <p
              style={{
                color: '#a9927d',
                fontSize: '13px',
                fontFamily: 'Test Calibre',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              What We Do
            </p>
            <h2
              style={{
                color: '#f2f4f3',
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                letterSpacing: '-0.02em',
              }}
            >
              One studio. Three ways we work.
            </h2>
          </Grid>
          <Grid item>
            <Grid container spacing={3}>
              {pillars.map((pillar) => (
                <Grid item xs={12} sm={6} md={3} key={pillar.label}>
                  <Box
                    sx={{
                      border: '1px solid rgba(169,146,125,0.2)',
                      borderRadius: '20px',
                      p: { xs: 3, md: 4 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      transition: 'border-color 0.2s ease, background-color 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(169,146,125,0.5)',
                        backgroundColor: 'rgba(73,17,28,0.15)',
                      },
                    }}
                  >
                    <Box>
                      <p
                        style={{
                          color: '#a9927d',
                          fontSize: '12px',
                          fontFamily: 'Test Calibre',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: '8px',
                        }}
                      >
                        {pillar.label}
                      </p>
                      <h3
                        style={{
                          color: '#f2f4f3',
                          fontSize: '22px',
                          marginBottom: '10px',
                        }}
                      >
                        {pillar.name}
                      </h3>
                      <p
                        style={{
                          color: 'rgba(242,244,243,0.7)',
                          fontSize: '15px',
                          lineHeight: '155%',
                          fontFamily: 'stratos-lights',
                          margin: 0,
                        }}
                      >
                        {pillar.desc}
                      </p>
                    </Box>
                    <Box sx={{ mt: 'auto', pt: 1 }}>
                      <Link href={pillar.href} legacyBehavior>
                        <a
                          style={{
                            color: '#a9927d',
                            fontFamily: 'stratos-lights',
                            fontSize: '15px',
                            textDecoration: 'none',
                            borderBottom: '1px solid rgba(169,146,125,0.4)',
                            paddingBottom: '2px',
                            transition: 'color 0.2s ease, border-color 0.2s ease',
                          }}
                        >
                          {pillar.cta} →
                        </a>
                      </Link>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
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

        {/* Pages of the Verse */}
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
