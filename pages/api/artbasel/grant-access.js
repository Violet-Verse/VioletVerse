import { table } from '../utils/userTable'

const PRODUCT_ID = 'artbasel-2026'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, adminKey } = req.body

  if (!email || !adminKey) {
    return res.status(400).json({ error: 'email and adminKey required' })
  }

  if (adminKey !== process.env.ADMIN_LOGIN_SECRET) {
    return res.status(401).json({ error: 'Invalid admin key' })
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    const records = await table
      .select({ filterByFormula: `{email} = "${normalizedEmail}"` })
      .firstPage()

    if (records[0]) {
      const existing = (records[0].fields.purchasedContent || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      if (!existing.includes(PRODUCT_ID)) {
        await table.update([
          {
            id: records[0].id,
            fields: { purchasedContent: [...existing, PRODUCT_ID].join(',') },
          },
        ])
      }

      return res.status(200).json({ granted: true, created: false, email: normalizedEmail })
    }

    // Create user if they don't exist yet
    const userId = crypto.randomUUID()
    await table.create([
      {
        fields: {
          userId,
          email: normalizedEmail,
          role: 'user',
          username: normalizedEmail,
          name: normalizedEmail,
          purchasedContent: PRODUCT_ID,
        },
      },
    ])

    return res.status(200).json({ granted: true, created: true, email: normalizedEmail })
  } catch (err) {
    console.error('grant-access error:', err)
    return res.status(500).json({ error: 'Failed to grant access' })
  }
}
