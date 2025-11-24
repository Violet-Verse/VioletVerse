import mantras from '../../novaMantras.json'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'

const SignUpCTA = (props) => {
  const { handleClose, handleSignup, ...rest } = props

  // Get current month's mantra
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const todayMantra = mantras[currentMonth]

  return (
    <>
      <Dialog {...rest}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <IconButton
            aria-label="close"
            onClick={props.handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <h2>Connect to the Verse</h2>
          <p>
            Earn $VV by reading and contributing content. Spend $VV by tipping your fav
            creators and purchasing VV merch.
          </p>

          {/* 🌙 Nova — Mood-Based Horoscope */}
          <Box
            className="nova-mantra-shimmer"
            sx={{
              backgroundColor: '#fdf6f0',
              border: '1px solid #e0d5c1',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '24px',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            <h3 style={{ marginBottom: '8px', fontWeight: 600 }}>
              🌙 Nova’s Monthly Mantra
            </h3>
            <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>
              “{todayMantra?.mantra || 'Nova is still syncing to the stars...'}”
            </p>
            <p style={{ fontSize: '14px', color: '#555' }}>
              {todayMantra?.note || 'Come back tomorrow for a fresh mantra drop.'}
            </p>
          </Box>

          <Image
            src="/banners/Photography_1.png"
            alt="vv banner"
            objectFit="cover"
            height="1080"
            width="1920"
          />
        </DialogContent>

        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button color="info" sx={{ borderRadius: '10px' }} onClick={props.handleClose}>
            Continue to site
          </Button>
          <Button
            variant="contained"
            disableElevation
            sx={{ borderRadius: '10px' }}
            onClick={props.handleSignup}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SignUpCTA
