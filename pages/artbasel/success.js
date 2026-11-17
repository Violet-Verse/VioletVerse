import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box, Button, CircularProgress } from '@mui/material'
import useSWR, { useSWRConfig } from 'swr'
import EmailLoginModal from '../../components/Modal/EmailLoginModal'

const bg = '#0a0908'
const wine = '#49111c'
const cream = '#f2f4f3'
const gold = '#a9927d'
const px = { xs: '4%', sm: '5%', md: '6%', lg: '8%' }

const PRODUCT_ID = 'artbasel-2026'

function hasBought(user) {
  if (!user?.purchasedContent) return false
  return user.purchasedContent.split(',').map((s) => s.trim()).includes(PRODUCT_ID)
}

export default function ArtBaselSuccess() {
  const { data: authData, error: authError } = useSWR('/api/database/getUser', (url) => fetch(url).then(r => r.json()))
  const user = authData?.user || null
  const loaded = authData !== undefined || authError !== undefined
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [notPurchased, setNotPurchased] = useState(false)

  // Already purchased → go straight to the guide
  useEffect(() => {
    if (loaded && user && hasBought(user)) {
      router.replace('/artbasel')
    }
  }, [loaded, user, router])

  // Logged in but not yet showing as purchased → verify
  useEffect(() => {
    if (!loaded || !user || hasBought(user)) return
    setVerifying(true)
    setNotPurchased(false)
    fetch('/api/artbasel/verify-stripe-purchase')
      .then((r) => r.json())
      .then((data) => {
        if (data.purchased) {
          mutate('/api/database/getUser')
          setConfirmed(true)
          setTimeout(() => router.replace('/artbasel'), 1500)
        } else {
          setNotPurchased(true)
        }
      })
      .catch(() => setNotPurchased(true))
      .finally(() => setVerifying(false))
  }, [loaded, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const showSpinner = !loaded || verifying

  return (
    <>
      <Head>
        <title>Purchase Confirmed | Art Basel 2026 Guide | Violet Verse</title>
        <meta name="robots" content="noindex" />
      </Head>

      {showSpinner ? (
        <Box sx={{ backgroundColor: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <CircularProgress sx={{ color: gold }} />
          {verifying && (
            <p style={{ color: 'rgba(242,244,243,0.7)', fontFamily: 'stratos-lights', fontSize: '17px', margin: 0 }}>
              Verifying your purchase…
            </p>
          )}
        </Box>
      ) : confirmed ? (
        <Box sx={{ backgroundColor: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <CircularProgress sx={{ color: gold }} />
          <p style={{ color: 'rgba(242,244,243,0.7)', fontFamily: 'stratos-lights', fontSize: '17px', margin: 0 }}>
            Opening your guide…
          </p>
        </Box>
      ) : (
        <Box sx={{ backgroundColor: bg, minHeight: '100vh', pb: 14 }}>
          <Box sx={{ backgroundColor: wine, px, py: { xs: 10, md: 16 }, textAlign: 'center' }}>
            <p style={{ color: gold, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Test Calibre', marginBottom: '16px' }}>
              Art Basel Miami Beach 2026 · Dec 1–6
            </p>
            <h1 style={{ color: cream, fontFamily: 'Ogg', fontSize: 'clamp(36px, 5vw, 68px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '20px' }}>
              Your guide is ready.
            </h1>
            <p style={{ color: 'rgba(242,244,243,0.75)', fontFamily: 'stratos-lights', fontSize: 'clamp(15px, 1.6vw, 18px)', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto 36px' }}>
              {notPurchased
                ? "We couldn't find a purchase for that email. Make sure you're using the same email from checkout."
                : 'Sign in with the email you used at checkout to access your purchase.'}
            </p>
            <Button
              onClick={() => setEmailModalOpen(true)}
              disableElevation
              sx={{ backgroundColor: cream, color: bg, fontFamily: 'stratos-lights', fontSize: '16px', fontWeight: 400, py: 1.75, px: 4.5, borderRadius: 100, textTransform: 'none', '&:hover': { backgroundColor: 'rgba(242,244,243,0.88)' } }}
            >
              {notPurchased ? 'Try a different email →' : 'Sign in with email →'}
            </Button>
          </Box>

          <Box sx={{ px, py: { xs: 7, md: 10 }, textAlign: 'center' }}>
            <p style={{ color: 'rgba(242,244,243,0.4)', fontFamily: 'stratos-lights', fontSize: '14px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
              After signing in, your guide unlocks automatically. You&apos;ll get permanent access to all event listings, party flyers, and the AI event finder.
            </p>
          </Box>
        </Box>
      )}

      <EmailLoginModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        onSuccess={() => {
          mutate('/api/database/getUser')
          setEmailModalOpen(false)
        }}
        subtitle="Sign in with the email address you used to purchase the Art Basel 2026 guide."
      />
    </>
  )
}

export async function getStaticProps() {
  return { props: { vrSite: true } }
}
