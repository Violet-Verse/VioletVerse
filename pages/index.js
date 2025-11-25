import { Box } from '@mui/material'
import Head from 'next/head'
import HeroSection from '../components/homepage/HeroSection'
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
  return (
    <Box>
      <Head>
        <meta property="og:image" content="https://i.imgur.com/yhNmGo8.png" />
        <meta name="twitter:image:src" content="https://i.imgur.com/yhNmGo8.png" />
        <link rel="canonical" href="/" />
      </Head>

      {/* Hero Section - Responsive Video with Text Overlay */}
      <HeroSection />

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
