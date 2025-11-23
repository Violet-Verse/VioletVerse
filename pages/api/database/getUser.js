import { getLoginSession } from '../../../lib/cookie-auth'
import { table } from '../utils/userTable'

export async function getUserByIssuer(issuer) {
  const userData = await table
    .select({
      filterByFormula: `{userId} = "${issuer}"`,
    })
    .firstPage()

  return userData[0]?.fields
}

export async function getUserByUsername(username) {
  const userData = await table
    .select({
      filterByFormula: `{username} = "${username}"`,
    })
    .firstPage()

  return userData[0]?.fields
}

export default async function handler(req, res) {
  const session = await getLoginSession(req)

  // Retrieved Session
  // Now get user data.....

  const userData = await getUserByIssuer(session?.issuer)

  res.status(200).json({ user: userData || null })
}
