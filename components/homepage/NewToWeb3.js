import { Box, Grid } from '@mui/material'
import Image from 'next/image'
import InfoBlock from './InfoBlock'

const NewToWeb3 = () => {
  return (
    <Box sx={{ my: 15 }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ mb: { xs: 4, md: 5 } }}>
        <Grid item>
          <Grid container direction="row" alignItems="center" justifyContent="center">
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
                New to Web3?
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
                New to Web3?
              </h2>
              <Image src="/line1.svg" alt="line" height={1} width={40} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <InfoBlock disableTitle={true} title="New to Web3?" />
    </Box>
  )
}

export default NewToWeb3

