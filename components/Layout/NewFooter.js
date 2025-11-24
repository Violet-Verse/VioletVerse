import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import {
  Box,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Footer.module.css'

const Footer = () => {
  const marketLinks = useMemo(
    () => [
      { href: '/posts?category=Tech', label: 'See tech content' },
      { href: '/posts?category=Lifestyle', label: 'See lifestyle content' },
      { href: '/posts?category=Education', label: 'See educational content' },
    ],
    [],
  )

  const resourcesLinks = useMemo(
    () => [
      { href: '/resources', label: 'Getting Started' },
      { href: '/resources', label: 'Fashion Tech Resources' },
      { href: '/resources', label: 'Events and Meetups' },
    ],
    [],
  )

  const communityLinks = useMemo(
    () => [
      { href: '/how-to-earn-vv-tokens-PS1xU3BF4B', label: 'Learn about VV Rewards' },
      { href: '/become-a-contributor-l91YAc3Lmr', label: 'Become a contributor' },
      { href: 'https://app.console.xyz/c/violetverse', label: 'Join IRL Chat', external: true },
    ],
    [],
  )

  const aboutLinks = useMemo(
    () => [
      { href: '/about', label: 'Team' },
      { href: 'https://buy.stripe.com/9AQeYAapJg343tu7sy', label: '1:1 Consultations', external: true },
      { href: '/contact', label: 'Contact us' },
    ],
    [],
  )

  return (
    <footer className={styles.footer}>
      <Container size="100rem" px={{ base: 16, sm: 20, md: 32 }}>
        {/* Main Content Grid */}
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 5 }}
          spacing="xl"
          className={styles.mainGrid}
        >
          {/* Logo Section */}
          <Box className={styles.section}>
            <Group align="center" spacing={8} mb="md">
              <Image src="/WhiteLogo.svg" alt="logo light" width={143} height={80} />
            </Group>
            <Group spacing="md" className={styles.socialIconsDesktop}>
              <a
                href="https://instagram.com/violetverse.io"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                <InstagramIcon className={styles.socialIcon} />
              </a>
              <a
                href="https://twitter.com/TheVioletVerse"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                <TwitterIcon className={styles.socialIcon} />
              </a>
              <a
                href="https://app.console.xyz/c/violetverse"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                <Image
                  src="/Discord.svg"
                  alt="Discord icon"
                  width={24}
                  height={24}
                  priority
                  className={styles.discordIcon}
                />
              </a>
            </Group>
          </Box>

          {/* Market Section */}
          <Box className={styles.section}>
            <Title order={4} className={styles.sectionTitle} mb="md">
              <Link href="/posts" legacyBehavior>
                <a className={styles.sectionTitleLink}>Market</a>
              </Link>
            </Title>
            <Stack spacing="xs">
              {marketLinks.map((link) => (
                <Link key={link.label} href={link.href} legacyBehavior>
                  <a className={styles.link}>{link.label}</a>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Resources Section */}
          <Box className={styles.section}>
            <Title order={4} className={styles.sectionTitle} mb="md">
              <Link href="/resources" legacyBehavior>
                <a className={styles.sectionTitleLink}>Resources</a>
              </Link>
            </Title>
            <Stack spacing="xs">
              {resourcesLinks.map((link) => (
                <Link key={link.label} href={link.href} legacyBehavior>
                  <a className={styles.link}>{link.label}</a>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Community Section */}
          <Box className={styles.section}>
            <Title order={4} className={styles.sectionTitle} mb="md">
              <Link href="/about" legacyBehavior>
                <a className={styles.sectionTitleLink}>Community</a>
              </Link>
            </Title>
            <Stack spacing="xs">
              {communityLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} legacyBehavior>
                    <a className={styles.link}>{link.label}</a>
                  </Link>
                ),
              )}
            </Stack>
          </Box>

          {/* About Section */}
          <Box className={styles.section}>
            <Title order={4} className={styles.sectionTitle} mb="md">
              <Link href="/about" legacyBehavior>
                <a className={styles.sectionTitleLink}>About</a>
              </Link>
            </Title>
            <Stack spacing="xs">
              {aboutLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} legacyBehavior>
                    <a className={styles.link}>{link.label}</a>
                  </Link>
                ),
              )}
            </Stack>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Bottom Section */}
      <Box className={styles.bottom}>
        <Container size="100rem" px={{ base: 16, sm: 20, md: 32 }}>
          <Box className={styles.bottomContainer}>
            <Group spacing="md" className={styles.socialIconsMobile}>
              <a
                href="https://instagram.com/violetverse.io"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                <InstagramIcon className={styles.socialIcon} />
              </a>
              <a
                href="https://twitter.com/TheVioletVerse"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                <TwitterIcon className={styles.socialIcon} />
              </a>
              <a
                href="https://app.console.xyz/c/violetverse"
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                <Image
                  src="/Discord.svg"
                  alt="Discord icon"
                  width={24}
                  height={24}
                  priority
                  className={styles.discordIcon}
                />
              </a>
            </Group>
            <Text className={styles.copyright}>
              © {new Date().getFullYear()} Violet Verse. All rights reserved.
            </Text>
          </Box>
        </Container>
      </Box>
    </footer>
  )
}

export default Footer
