// Deprecated — Privy has been removed. This endpoint is kept to avoid 404s on old callbacks.
export default function handler(req, res) {
  res.status(410).json({ error: 'Deprecated. Use /api/auth/email-login instead.' })
}
