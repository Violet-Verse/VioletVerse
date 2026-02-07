import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
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
      <div style={{ maxWidth: '100rem', margin: '0 auto', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
        <div
          className={styles.mainGrid}
          style={{ display: 'grid', gap: '2rem' }}
        >
          <div className={styles.section}>
            <div style={{ marginBottom: '1rem' }}>
              <Image src="/WhiteLogo.svg" alt="logo light" width={143} height={80} />
            </div>
            <div className={styles.socialIconsDesktop} style={{ gap: '1rem' }}>
              <a href="https://instagram.com/violetverse.io" target="_blank" rel="noreferrer" className={styles.socialLink}>
                <InstagramIcon className={styles.socialIcon} />
              </a>
              <a href="https://twitter.com/TheVioletVerse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                <TwitterIcon className={styles.socialIcon} />
              </a>
              <a href="https://app.console.xyz/c/violetverse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                <Image src="/Discord.svg" alt="Discord icon" width={24} height={24} priority className={styles.discordIcon} />
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>
              <Link href="/posts" legacyBehavior><a className={styles.sectionTitleLink}>Market</a></Link>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {marketLinks.map((link) => (
                <Link key={link.label} href={link.href} legacyBehavior><a className={styles.link}>{link.label}</a></Link>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>
              <Link href="/resources" legacyBehavior><a className={styles.sectionTitleLink}>Resources</a></Link>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {resourcesLinks.map((link) => (
                <Link key={link.label} href={link.href} legacyBehavior><a className={styles.link}>{link.label}</a></Link>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>
              <Link href="/about" legacyBehavior><a className={styles.sectionTitleLink}>Community</a></Link>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {communityLinks.map((link) =>
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={styles.link}>{link.label}</a>
                ) : (
                  <Link key={link.label} href={link.href} legacyBehavior><a className={styles.link}>{link.label}</a></Link>
                ),
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle} style={{ marginBottom: '1rem' }}>
              <Link href="/about" legacyBehavior><a className={styles.sectionTitleLink}>About</a></Link>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {aboutLinks.map((link) =>
                link.external ? (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className={styles.link}>{link.label}</a>
                ) : (
                  <Link key={link.label} href={link.href} legacyBehavior><a className={styles.link}>{link.label}</a></Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div style={{ maxWidth: '100rem', margin: '0 auto', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
          <div className={styles.bottomContainer}>
            <div className={styles.socialIconsMobile} style={{ gap: '1rem' }}>
              <a href="https://instagram.com/violetverse.io" target="_blank" rel="noreferrer" className={styles.socialLink}>
                <InstagramIcon className={styles.socialIcon} />
              </a>
              <a href="https://twitter.com/TheVioletVerse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                <TwitterIcon className={styles.socialIcon} />
              </a>
              <a href="https://app.console.xyz/c/violetverse" target="_blank" rel="noreferrer" className={styles.socialLink}>
                <Image src="/Discord.svg" alt="Discord icon" width={24} height={24} priority className={styles.discordIcon} />
              </a>
            </div>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} Violet Verse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer