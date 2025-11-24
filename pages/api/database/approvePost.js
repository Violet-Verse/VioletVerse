import { getLoginSession } from '../../../lib/cookie-auth'
import { ObjectId } from 'mongodb'
import connectDatabase from '../../../lib/mongoClient'

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).end()
    return
  }

  const session = await getLoginSession(req)

  if (!session?.issuer) {
    res.status(405).end()
    return
  }

  const { hidden } = req.body
  const fields = { hidden }

  try {
    const db = await connectDatabase()
    await db.collection('posts').updateOne(
      {
        _id: new ObjectId(req.body._id),
      },
      {
        $set: fields,
      },
    )
    return res.status(200).json(fields || null)
  } catch (err) {
    console.log(err)
    return res.status(405).end()
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}
