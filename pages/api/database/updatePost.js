import { getLoginSession } from '../../../lib/cookie-auth'
import { ObjectId } from 'mongodb'
import connectDatabase from '../../../lib/mongoClient'

export default async function updatePost(req, res) {
  // Reject the request if the method is not PUT
  if (req.method !== 'PUT') {
    return res.status(405).end('Method Not Allowed')
  }

  // Get the user's session
  const session = await getLoginSession(req)

  // If the user is not signed in, reject the request
  if (!session?.issuer) {
    return res.status(405).end('Access Denied')
  }

  // Check if the user has the necessary access permissions
  const accessPermission =
    session?.issuer === req.body.issuer || req.body.role === 'admin'

  // If the user doesn't have the necessary permissions, reject the request
  if (!accessPermission) {
    return res.status(405).end('Access Denied')
  }

  // Extract the necessary fields from the request body
  const {
    title,
    subtitle,
    tldr,
    category,
    body,
    largeLetter,
    hidden,
    video,
    contributor,
    tokenPrice,
    banner,
    id,
  } = req.body

  // Create a new object with only the allowed fields for the post update
  const postData = {
    ...(title && { title }),
    ...(subtitle && { subtitle }),
    tldr,
    ...(category && { category }),
    ...(body && { body }),
    largeLetter,
    hidden,
    ...(banner && { banner }),
    ...(video && { video }),
    contributor,
    tokenPrice,
    lastUpdated: new Date().toISOString(),
  }

  try {
    // Connect to the MongoDB database
    const db = await connectDatabase()

    // Update the post with the specified ID with the new data
    await db.collection('posts').updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: postData,
      },
    )

    // Return a 200 status code and the updated post data
    return res.status(200).json(postData || null)
  } catch (error) {
    // If there was an error, return a 405 status code with an error message
    return res.status(405).end('Error Updating Post')
  }
}
