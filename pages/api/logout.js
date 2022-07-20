import { Magic } from "@magic-sdk/admin";
import { removeTokenCookie } from "../../lib/cookie";
import { getLoginSession } from "../../lib/cookie";

export default async function logout(req, res) {
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);

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
