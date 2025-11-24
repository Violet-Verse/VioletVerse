import { Box, Grid } from '@mui/material'
import Image from 'next/image'
import Head from 'next/head'
import styles from '../styles/Enterprise.module.css'
import EnterpriseFeatures from '../components/enterprise/EnterpriseFeatures'
import SponsorCards from '../components/enterprise/SponsorCards'
import GithubButton from '../components/enterprise/GithubButton'

const Enterprise = () => {
  const siteTitle = `Enterprise Plan | Violet Verse`
  const metaTitle = `Enterprise Plan`
  const siteDescription = `The modern publishing tool for the fashion media community`
  const siteImage = 'https://i.imgur.com/LFpaItV.png'
  return (
    <Box mb={-7} className="enterprise-test" style={{ backgroundColor: 'black' }}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="og:title" content={metaTitle} />
        <meta name="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="80" />
        <meta property="og:image:height" content="80" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site" content="@TheVioletVerse" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image:src" content={siteImage} />
      </Head>
      <Box
        sx={{
          px: {
            xs: '0',
            sm: '5%',
            md: '10%',
            lg: '15%',
            xl: '20%',
          },
        }}
      >
        <Grid
          container
          alignItems={'center'}
          align={'center'}
          justifyContent={'center'}
          mt={{ xl: 10, lg: 10, md: 10 }}
        >
          <Grid item px={{ xl: 22, lg: 4, md: 0 }} mb={3} mt={{ xs: 0 }}>
            <h1 className={styles.header}>
              Introducing the modern publishing tool for the fashion media community.
            </h1>
          </Grid>
          <Grid item px={{ xl: 36, lg: 20, md: 0 }} mb={3}>
            <p className="color">
              Violet Verse excels at efficiency, simplifying content creator and member
              onboarding to under 5 minutes. In fashion&apos;s rapid world, time is
              precious. We facilitate connections and discoveries, especially during
              fashion week.
            </p>
          </Grid>
          <Grid item>
            <GithubButton />
          </Grid>
        </Grid>
      </Box>
      <Box
        mt={{ sm: 20, xs: 5 }}
        sx={{
          // borderTop: 70,
          // borderBottom: 70,
          borderColor: '#F3F0F8',
          backgroundColor: '#F3F0F8',
          textAlign: {
            xs: 'center',
          },
          px: {
            xs: '5%',
            sm: '5%',
            md: '10%',
            lg: '10%',
            xl: '15%',
          },
        }}
        style={{ backgroundColor: 'black' }}
      >
        <Grid
          container
          direction={'row'}
          alignItems="center"
          spacing={4}
          display={{ xs: 'none', lg: 'flex' }}
        >
          <Grid item xs={6}>
            <Grid container align="left" spacing={3}>
              <Grid item px={{ xl: 6, lg: 0 }}>
                <h1 className={styles.header} style={{ color: 'white' }}>
                  Your gateway to the heart of the fashion media community.
                </h1>
              </Grid>
              <Grid item px={{ xl: 38, lg: 0 }}>
                <p className="color">
                  Violet Verse excels at efficiency, simplifying content creator and
                  member onboarding to under 5 minutes. In fashion&apos;s rapid world,
                  time is precious. We facilitate connections and discoveries, especially
                  during fashion week.
                </p>
              </Grid>
              <Grid item>
                <GithubButton />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justifyContent="center">
              <Grid item>
                <Image alt="web vector" src="/enterprise1.svg" height={330} width={484} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          spacing={4}
          display={{ md: 'flex', lg: 'none' }}
        >
          <Grid item>
            <Grid item px={{ xl: 6, lg: 0 }}>
              <h1 className={styles.header}>
                Keep your audience engaged with Violet Verse Enterprise.
              </h1>
            </Grid>
            <Grid item my={5}>
              <Image alt="web vector" src="/enterprise1.svg" height={205} width={300} />
            </Grid>
            <Grid item px={{ xl: 38, lg: 0, md: 0, xs: 0 }} display={{ xs: 'none' }}>
              <p>
                Create and customize a blockchain-based blog site for your brand or
                business with streamlined audience management tools.
              </p>
            </Grid>
            <Grid item>
              <GithubButton />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box
        my={18}
        sx={{
          px: {
            xs: '0',
            sm: '5%',
            md: '10%',
            lg: '15%',
            xl: '20%',
          },
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <EnterpriseFeatures />
          </Grid>
        </Grid>
      </Box>
      <Box
        style={{ backgroundColor: 'black' }}
        sx={{
          // borderTop: 70,
          // borderBottom: 70,
          borderColor: '#F3F0F8',
          backgroundColor: '#F3F0F8',
          textAlign: {
            xs: 'center',
          },
          px: {
            xs: '5%',
            sm: '5%',
            md: '10%',
            lg: '10%',
            xl: '15%',
          },
        }}
      >
        <Grid
          container
          direction={'row'}
          alignItems="center"
          spacing={4}
          display={{ xs: 'none', lg: 'flex' }}
        >
          <Grid item xs={6}>
            <Grid container align="left" spacing={3}>
              <Grid item px={{ xl: 2, lg: 0 }}>
                <h1 className={styles.header}>
                  Read and collect Article NFTs in a digital wallet library.
                </h1>
              </Grid>
              <Grid item px={{ xl: 27, lg: 0 }}>
                <p className="color">
                  At the core of our software lies a dynamic member portal and integrated
                  payment system, allowing you to effortlessly segregate your content
                  between public and private domains. This versatility empowers you to
                  curate your fashion narrative with precision and finesse.
                </p>
              </Grid>
              <Grid item>
                <GithubButton />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justifyContent="center">
              <Grid item>
                <Image
                  alt="web vector"
                  src="/enterprise2.svg"
                  height={266.42}
                  width={323}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          spacing={4}
          display={{ md: 'flex', lg: 'none' }}
        >
          <Grid item>
            <Grid item px={{ xl: 6, lg: 0 }} mt={{ xs: 5 }}>
              <h1 className={styles.header}>
                Keep your audience engaged with Violet Verse Enterprise.
              </h1>
            </Grid>
            <Grid item my={5}>
              <Image
                alt="web vector"
                src="/enterprise2.svg"
                height={266.42}
                width={323}
              />
            </Grid>
            <Grid item px={{ xl: 38, lg: 0 }} display={{ xs: 'none' }}>
              <p>
                Create and customize a blockchain-based blog site for your brand or
                business with streamlined audience management tools.
              </p>
            </Grid>
            <Grid item>
              <GithubButton />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          px: {
            xs: '0',
            sm: '5%',
            md: '10%',
            lg: '15%',
            xl: '20%',
          },
        }}
      >
        <Grid
          container
          alignItems={'center'}
          align={'center'}
          justifyContent={'center'}
          direction="column"
          mt={8}
          px={{ xs: 2 }}
        >
          <Grid item px={{ xl: 22, lg: 4, md: 0 }} mb={3}>
            <h1 className={styles.header}>
              Trusted to build communities with the latest technological styles.
            </h1>
          </Grid>
          <Grid item px={{ xl: 36, lg: 20, md: 0 }} mb={3}>
            <p className="color">
              All applications are created with the latest distribution methods,
              discoverability, and subscription membership services with easy payment
              management.
            </p>
          </Grid>
          <Grid item mb={3}>
            <SponsorCards />
          </Grid>
          <Grid item>
            <GithubButton />
          </Grid>
        </Grid>
      </Box>
      <Box mt={20}>
        {/* <Image
                    layout="responsive"
                    alt="half circle shape"
                    src="/enterprisebottom.svg"
                    height={220}
                    width={1440}
                /> */}
      </Box>
    </Box>
  )
}

export default Enterprise
