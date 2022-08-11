import Iron from "@hapi/iron";
import { Magic } from "@magic-sdk/admin";

import CookieService from "../../lib/cookie";
import { table } from "./utils/userTable";

let magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default async function login(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    // exchange the DID from Magic for some user data
    const didToken = magic.utils.parseAuthorizationHeader(
        req.headers.authorization
    );
    const user = await magic.users.getMetadataByToken(didToken);

    // search for user record in database
    // if no user found then create record
    const users = [];
    table
        .select({
            filterByFormula: `{userId} = "${user.issuer}"`,
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    console.log("Retrieved", record.get("userId"));
                    users.push(record.get("userId"));
                });
                fetchNextPage();
            },
            function done(err) {
                if (users.length >= 1) {
                    // User found in database
                    console.log("user found");
                } else {
                    // User not found in database -- ADD NEW USER
                    console.log("user not found");
                    try {
                        table.create([
                            {
                                fields: {
                                    userId: `${user.issuer}`,
                                    email: `${user.email}`,
                                    role: "user",
                                    bio: "An interesting bio awaits...",
                                    flowAddress: `${req.body.flowAddress}`,
                                    username: `${req.body.flowAddress}`,
                                    name: `${req.body.flowAddress}`,
                                },
                            },
                        ]);
                    } catch (err) {
                        console.log(err);
                    }
                }
                if (err) {
                    console.error(err);
                    return;
                }
            }
        );

    // Author a couple of cookies to persist a user's session
    const token = await Iron.seal(
        user,
        process.env.TOKEN_SECRET,
        Iron.defaults
    );
    CookieService(res, token);
    res.end();
}
