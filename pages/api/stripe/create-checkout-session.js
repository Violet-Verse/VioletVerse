import Stripe from 'stripe'
import { getLoginSession } from '../../../lib/cookie-auth'
import { table } from '../utils/userTable'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getLoginSession(req)
  if (!session?.issuer) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Look up user email from Airtable
  const userData = await table
    .select({ filterByFormula: `{userId} = "${session.issuer}"` })
    .firstPage()

  const userEmail = userData[0]?.fields?.email || session.email || undefined

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://violetverse.io'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 999, // $9.99
          product_data: {
            name: 'Art Basel 2025 Ultimate Guide',
            description:
              'The complete guide to Art Basel Miami 2025 — events, parties, galleries, fashion and tech. Includes the AI event finder.',
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId: 'artbasel-2025',
      userId: session.issuer,
      userEmail: userEmail || '',
    },
    success_url: `${baseUrl}/artbasel?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/artbasel`,
  })

  return res.status(200).json({ url: checkoutSession.url })
}
