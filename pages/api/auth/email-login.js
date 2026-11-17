import Iron from '@hapi/iron'
import CookieService, { MAX_AGE } from '../../../lib/cookie'
import { table } from '../utils/userTable'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    // Find existing user by email
    const records = await table
      .select({ filterByFormula: `{email} = "${normalizedEmail}"` })
      .firstPage()

    let userData
    const isNew = !records[0]

    if (records[0]) {
      userData = records[0].fields
    } else {
      const userId = crypto.randomUUID()
      const created = await table.create([
        {
          fields: {
            userId,
            email: normalizedEmail,
            role: 'user',
            username: normalizedEmail,
            name: normalizedEmail,
          },
        },
      ])
      userData = created[0].fields
    }

    const sessionUser = {
      issuer: userData.userId,
      address: userData.userId,
      email: normalizedEmail,
      createdAt: Date.now(),
      maxAge: MAX_AGE,
    }

    const token = await Iron.seal(sessionUser, process.env.TOKEN_SECRET, Iron.defaults)
    CookieService(res, token)

    return res.status(200).json({ userData, registration: isNew })
  } catch (err) {
    console.error('email-login error:', err)
    return res.status(500).json({ error: 'Login failed' })
  }
}
