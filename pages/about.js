import FacebookIcon from '@mui/icons-material/Facebook'
import LanguageIcon from '@mui/icons-material/Language'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import { Box, Grid } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { members } from '../components/Placeholder/UserData'

const About = () => {
  const siteTitle = `About The Team | Violet Verse`
  const metaTitle = `About The Team`
  const siteDescription = `Learn more about the team building Violet Verse.`
  const siteImage = 'https://i.imgur.com/HOcgWqo.png'

  const team = members.filter((member) => member.teamType === 'team')
  const contributor = members.filter((member) => member.teamType === 'contributor')
  return (
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
      {/* Our Team */}

      <Head>
        <title>{siteTitle}</title>
        <meta name="og:title" content={metaTitle} />
        <meta name="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="420" />
        <meta property="og:type" content="website" />
        <meta name="twitter:site" content="@TheVioletVerse" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image:src" content={siteImage} />
      </Head>

      {/* First section */}
      {/* About the Violet Verse */}

      <Grid
        container
        direction="row"
        spacing={8}
        justifyContent="space-around"
        alignItems="center"
        sx={{ mt: 1 }}
      >
        <Grid
          item
          md={12}
          lg={4}
          sx={{
            textAlign: { xs: 'center', md: 'center', lg: 'left' },
          }}
        >
          <h1 style={{ whiteSpace: 'pre-wrap' }}>{'About the \nViolet Verse'}</h1>
          <Box sx={{ padding: { xs: '0px 5%', md: '0px' } }}>
            <p className="secondary">
              Violet Verse, Inc. is a Web3-powered lifestyle content marketplace and
              software solution for the fashion media community. We are creators, Web3
              operators, technologists, innovators, and fashion enthusiasts. Our mission
              is to document the spirit and personality of technology through immersive
              storytelling, using our proprietary infrastructure.
            </p>
          </Box>
          <Grid container direction="row" spacing={2}></Grid>
          <Grid container spacing={2}></Grid>
        </Grid>
        <Grid item md={12} lg={8} align="center">
          <Image
            width={1920}
            height={1080}
            src="/banners/Photography_2.png"
            alt="Default Image"
            className="image"
            placeholder="blur"
            blurDataURL="/banners/Photography_2.png"
          />
        </Grid>
      </Grid>

      {/* 2nd Section */}
      {/* Our Team */}

      <Grid
        container
        spacing={2}
        align="center"
        sx={{ marginTop: { xs: '30px', md: '30px', lg: '40px' } }}
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          sx={{
            textAlign: { xs: 'center', md: 'center', lg: 'left' },
            marginBottom: { xs: '30px', md: '30px', lg: '50px' },
          }}
        >
          <h1>Our Team</h1>
        </Grid>
        {team.map((member) => (
          <Grid item xs={12} sm={6} lg={3} key={member.id}>
            <Link href={'/team/' + member.name.replace(/\s+/g, '-').toLowerCase()}>
              <a>
                <Image
                  width={1000}
                  height={1159}
                  src={member.photo}
                  alt="Default Image"
                  className="image"
                  objectFit={'cover'}
                  placeholder="blur"
                  blurDataURL={member.photo}
                />
              </a>
            </Link>
            <Box
              sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                  lg: 'left',
                },
              }}
            >
              <Link href={'/team/' + member.name.replace(/\s+/g, '-').toLowerCase()}>
                <a>
                  <h4
                    style={{
                      marginTop: '15px',
                    }}
                  >
                    {member.name}
                  </h4>
                </a>
              </Link>
              <h3
                style={{
                  fontFamily: 'Test Calibre',
                  fontWeight: '400',
                  fontSize: '18px',
                }}
              >
                {member.title}
              </h3>
              <Grid
                container
                direction="row"
                spacing={1}
                justifyContent={{ xs: 'center', sm: 'left' }}
              >
                {member?.website && (
                  <Grid item>
                    <a href={member.website} target="_blank" rel="noreferrer">
                      <LanguageIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.twitter && (
                  <Grid item>
                    <a
                      href={`https://www.twitter.com/` + member.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.linkedIn && (
                  <Grid item>
                    <a
                      href={`https://www.linkedin.com/in/` + member.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedInIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.facebook && (
                  <Grid item>
                    <a
                      href={`https://www.facebook.com/` + member.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FacebookIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
      {/*Our Contributors section*/}

      {/*Spacing between previous containter 'Our Teams'*/}

      <Grid
        container
        spacing={2}
        align="center"
        sx={{ marginTop: { xs: '30px', md: '30px', lg: '40px' } }}
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          sx={{
            textAlign: { xs: 'center', md: 'center', lg: 'left' },
            marginBottom: { xs: '30px', md: '30px', lg: '50px' },
          }}
        >
          <h1>Our Contributors</h1>
        </Grid>
        {contributor.map((member) => (
          <Grid item xs={12} sm={6} lg={3} key={member.id}>
            <Link href={'/team/' + member.name.replace(/\s+/g, '-').toLowerCase()}>
              <a>
                <Image
                  width={1000}
                  height={1159}
                  src={member.photo}
                  alt="Default Image"
                  className="image"
                  objectFit={'cover'}
                  placeholder="blur"
                  blurDataURL={member.photo}
                />
              </a>
            </Link>
            <Box
              sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                  lg: 'left',
                },
              }}
            >
              {' '}
              <Link href={'/team/' + member.name.replace(/\s+/g, '-').toLowerCase()}>
                <a>
                  <h4
                    style={{
                      marginTop: '15px',
                    }}
                  >
                    {member.name}
                  </h4>
                </a>
              </Link>
              <h3
                style={{
                  fontFamily: 'Test Calibre',
                  fontWeight: '400',
                  fontSize: '18px',
                }}
              >
                {member.title}
              </h3>
              <Grid
                container
                direction="row"
                spacing={1}
                justifyContent={{ xs: 'center', sm: 'left' }}
              >
                {member?.website && (
                  <Grid item>
                    <a href={member.website} target="_blank" rel="noreferrer">
                      <LanguageIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.instagram && (
                  <Grid item>
                    <a
                      href={`https://www.instagram.com/` + member.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <InstagramIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.twitter && (
                  <Grid item>
                    <a
                      href={`https://www.twitter.com/` + member.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.linkedIn && (
                  <Grid item>
                    <a
                      href={`https://www.linkedin.com/in/` + member.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedInIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
                {member?.facebook && (
                  <Grid item>
                    <a
                      href={`https://www.facebook.com/` + member.facebook}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FacebookIcon
                        sx={{
                          color: '#73839C',
                        }}
                      />
                    </a>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default About
