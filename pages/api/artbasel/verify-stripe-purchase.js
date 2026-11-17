import Airtable from 'airtable'
import { getLoginSession } from '../../../lib/cookie-auth'

// Temporary: grant known purchasers while Zapier automation is set up
// Remove entries here once Zapier → Art Basel Customers table is confirmed working
const BYPASS_EMAILS = ['melissa@melwrites.com']

function getArtBaselTable() {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_ARTBASEL_TABLE_ID } = process.env
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_ARTBASEL_TABLE_ID) return null
  return new Airtable({ apiKey: AIRTABLE_API_KEY })
    .base(AIRTABLE_BASE_ID)
    .table(AIRTABLE_ARTBASEL_TABLE_ID)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getLoginSession(req)
  if (!session?.email) return res.status(401).json({ error: 'Not authenticated' })

  const email = session.email.trim().toLowerCase()
  const artBaselTable = getArtBaselTable()

  if (!artBaselTable) {
    return res.status(500).json({ error: 'Purchase table not configured' })
  }

  try {
    // Check if email exists in the Art Basel Customers table
    const records = await artBaselTable
      .select({ filterByFormula: `{email} = "${email}"`, maxRecords: 1 })
      .firstPage()

    if (records.length > 0) {
      return res.status(200).json({ purchased: true })
    }

    // Temporary bypass: grant known purchasers and add them to the table
    if (BYPASS_EMAILS.includes(email)) {
      await artBaselTable.create([{
        fields: { email, purchasedAt: new Date().toISOString() },
      }])
      return res.status(200).json({ purchased: true, justGranted: true })
    }

    return res.status(200).json({ purchased: false })
  } catch (err) {
    console.error('verify-stripe-purchase error:', err)
    return res.status(500).json({ error: 'Verification failed' })
  }
}
