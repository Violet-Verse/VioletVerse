import { getLoginSession } from '../../../lib/cookie-auth'
import { removeTokenCookie } from '../../../lib/cookie'

export default async function logout(req, res) {
  try {
    const session = await getLoginSession(req)
    if (session) {
      removeTokenCookie(res)
    }
  } catch (error) {
    console.error(error)
  }

  res.writeHead(302, { Location: '/' })
  res.end()
}
