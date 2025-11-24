import { Box, Grid } from '@mui/material'
import Image from 'next/image'
import ArticleGrid from '../article/ArticleGrid'

const LayersOfTheVerse = ({ posts, authors, contributors }) => {
  return (
    <Box sx={{ mt: 15 }}>
      <Grid container={true} justifyContent="center" alignItems="center" sx={{ mb: { xs: 4, md: 5 } }}>
        <Grid item={true}>
          <Grid container={true} direction="row" alignItems="center" justifyContent="center">
            {/* MD Breakpoint */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Image src="/line1.svg" alt="line" height={1} width={100} />
              <h2
                style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  margin: '0 35px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                Layers of the Verse
              </h2>
              <Image src="/line1.svg" alt="line" height={1} width={100} />
            </Box>
            {/* XS Breakpoint */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
              <Image src="/line1.svg" alt="line" height={1} width={40} />
              <h2
                style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  margin: '0 15px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2',
                }}
              >
                Layers of the Verse
              </h2>
              <Image src="/line1.svg" alt="line" height={1} width={40} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <ArticleGrid
        disableTitle={true}
        title="Layers of the Verse"
        posts={posts}
        maximum={3}
        seeAll={true}
        authors={authors}
        contributors={contributors}
      />
    </Box>
  )
}

export default LayersOfTheVerse

