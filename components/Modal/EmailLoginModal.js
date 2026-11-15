import { useState } from 'react'
import { useSWRConfig } from 'swr'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const EmailLoginModal = ({ open, onClose, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { mutate } = useSWRConfig()

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      await mutate('/api/database/getUser')
      setEmail('')
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    setEmail('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, pb: 1 }}>
        Sign in to Violet Verse
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (t) => t.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <p style={{ color: '#555', fontSize: '15px', marginBottom: '20px', lineHeight: 1.5 }}>
          Enter your email to sign in or create an account.
        </p>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            autoFocus
            fullWidth
            size="small"
            disabled={loading}
            error={Boolean(error)}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={loading || !email.trim()}
            sx={{ py: 1.5, fontWeight: 400, fontSize: '15px', textTransform: 'none' }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Continue'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EmailLoginModal
