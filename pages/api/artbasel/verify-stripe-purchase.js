import Stripe from 'stripe'
import { getLoginSession } from '../../../lib/cookie-auth'
import { table } from '../utils/userTable'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const PRODUCT_ID = 'artbasel-2026'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getLoginSession(req)
  if (!session?.email) return res.status(401).json({ error: 'Not authenticated' })

  const email = session.email.trim().toLowerCase()

  const records = await table
    .select({ filterByFormula: `{email} = "${email}"` })
    .firstPage()

  if (!records[0]) return res.status(404).json({ error: 'User not found' })

  const record = records[0]
  const existing = (record.fields.purchasedContent || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (existing.includes(PRODUCT_ID)) {
    return res.status(200).json({ purchased: true, justGranted: false })
  }

  try {
    const sessions = await stripe.checkout.sessions.list({
      customer_email: email,
      limit: 100,
    })

    const paid = sessions.data.find(
      (s) =>
        s.payment_status === 'paid' &&
        (s.metadata?.productId === PRODUCT_ID || s.amount_total === 999)
    )

    if (paid) {
      await table.update([
        {
          id: record.id,
          fields: { purchasedContent: [...existing, PRODUCT_ID].join(',') },
        },
      ])
      return res.status(200).json({ purchased: true, justGranted: true })
    }

    return res.status(200).json({ purchased: false })
  } catch (err) {
    console.error('verify-stripe-purchase error:', err)
    return res.status(500).json({ error: 'Verification failed' })
  }
}
