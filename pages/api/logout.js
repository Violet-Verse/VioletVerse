import { magic } from "../../lib/magic";
import { removeTokenCookie } from "../../lib/cookie";
import { getLoginSession } from "../../lib/cookie";

export default async function logout(req, res) {
    try {
        const session = await getLoginSession(req);

        if (session) {
            await magic.users.logoutByIssuer(session.issuer);
            removeTokenCookie(res);
        }
    } catch (error) {
        console.error(error);
    }

    res.writeHead(302, { Location: "/" });
    res.end();
}
