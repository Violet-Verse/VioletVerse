import Stripe from 'stripe'
import { table } from '../utils/userTable'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRODUCT_ID = 'artbasel-2026'

// Collect raw body for Stripe signature verification
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { userId, userEmail, productId } = session.metadata || {}

    if (!productId || !userId) {
      console.error('Webhook: missing metadata', session.metadata)
      return res.status(200).end()
    }

    try {
      // Find user by userId in Airtable
      const records = await table
        .select({ filterByFormula: `{userId} = "${userId}"` })
        .firstPage()

      if (!records || records.length === 0) {
        console.error('Webhook: user not found for userId', userId)
        return res.status(200).end()
      }

      const record = records[0]
      const existing = record.fields.purchasedContent || ''
      const purchased = existing
        ? existing.split(',').map((s) => s.trim())
        : []

      if (!purchased.includes(productId)) {
        purchased.push(productId)
        await table.update([
          {
            id: record.id,
            fields: { purchasedContent: purchased.join(',') },
          },
        ])
      }
    } catch (err) {
      console.error('Webhook: failed to update purchasedContent', err)
      // Still return 200 so Stripe doesn't retry
    }
  }

  return res.status(200).json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
