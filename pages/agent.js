import Head from 'next/head'
import AgentDashboard from '../components/Agent/AgentDashboard'

export default function AgentPage() {
  const siteTitle = 'Live Agent | Violet Verse'
  const metaTitle = 'The Violet Verse Reader'
  const siteDescription =
    'A living portrait of who reads Violet Verse, shaped by real conversations with our AI guide.'
  const siteImage = 'https://i.imgur.com/yhNmGo8.png'

  return (
    <>
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
      <AgentDashboard />
    </>
  )
}
