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
  let posts = []
  let authors = []
  let contributors = []

  try {
    const db = await connectDatabase()
    if (db) {
      const collection = db.collection('posts')
      const data = await collection.find({ hidden: false }).toArray()
      posts = JSON.parse(JSON.stringify(data))
    }
  } catch (error) {
    console.error("Error fetching posts from MongoDB:", error.message)
  }

  try {
    authors = await getUsersByRole('admin')
  } catch (error) {
    console.error("Error fetching authors:", error.message)
  }

  try {
    contributors = await getUsersByRole('contributor')
  } catch (error) {
    console.error("Error fetching contributors:", error.message)
  }

  return {
    props: {
      posts,
      authors,
      contributors,
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
