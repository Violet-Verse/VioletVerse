import { table } from '../utils/userTable'
import { postTable, minifyRecords } from '../utils/postsTable'
import connectDatabase from '../../../lib/mongoClient'

export async function getAuthorForPost(id) {
  const db = await connectDatabase()
  const collection = db.collection('posts')
  const posts = await collection.find({ slug: id }).toArray()

  if (posts.length === 0) {
    return null
  }

  const userId = posts[0].createdBy

  const authorData = await table
    .select({
      filterByFormula: `{userId} = "${userId}"`,
    })
    .firstPage()

  return { user: authorData[0]?.fields }
}

export async function getContributorForPost(id) {
  const db = await connectDatabase()
  const collection = db.collection('posts')
  const posts = await collection.find({ slug: id }).toArray()

  if (posts.length === 0) {
    return null
  }

  const email = posts[0].contributor

  const contributorData = await table
    .select({
      filterByFormula: `{email} = "${email}"`,
    })
    .firstPage()

  return { user: contributorData[0]?.fields || null }
}

export default async function handler(req, res) {
  const id = req.query.id
  const userData = await table
    .select({
      filterByFormula: `{userId} = "${id}"`,
    })
    .firstPage()

  res.status(200).json({ user: userData[0]?.fields || null })
}
