import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import CookieService from "../../lib/cookie";
import { table } from "./utils/Airtable";

let magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default async function login(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    // exchange the DID from Magic for some user data
    const didToken = magic.utils.parseAuthorizationHeader(
        req.headers.authorization
    );
    const user = await magic.users.getMetadataByToken(didToken);

    // database
    table
        .select({
            filterByFormula: `{userId} = "${user.issuer}"`,
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    console.log("Retrieved", record.get("userId"));
                });
                fetchNextPage();
            },
            function done(err) {
                if (err) {
                    console.error(err);
                    return;
                }
            }
        );

    console.log(req.body);
    console.log(user);

    // Author a couple of cookies to persist a user's session
    const token = await Iron.seal(
        user,
        process.env.TOKEN_SECRET,
        Iron.defaults
    );
    CookieService.setTokenCookie(res, token);

    res.end();
}
