import { minifyRecords } from '../utils/postsTable'
import { table } from '../utils/userTable'

export async function getUsersByRole(role) {
  const userData = await table
    .select({
      filterByFormula: `{role} = "${role}"`,
    })
    .firstPage()

  const minifiedRecords = minifyRecords(userData)
  return minifiedRecords
}

export default async function getUserbyEmail(req, res) {
  const email = req.query.id
  const userData = await table
    .select({
      filterByFormula: `{email} = "${email}"`,
    })
    .firstPage()

  res.status(200).json({ user: userData[0]?.fields || null })
}
