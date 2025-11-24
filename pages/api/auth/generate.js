import crypto from 'crypto'
import { addNonce } from '../aws/nonceControl'

export default async function handler(req, res) {
  const nonce = crypto.randomBytes(32).toString('hex')
  const result = await addNonce(nonce)
  console.log('Nonce Added to DB', result)
  res.status(200).json({ nonce })
}
