import * as fcl from "@onflow/fcl";
import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";
import { table } from "../utils/userTable";
import { deleteNonce, getNonce } from "../aws/nonceControl";

export default async function handler(req, res) {
    const data = req.body;
    const nonce = data.nonce;
    const user = {
        issuer: data.address,
        address: data.address,
        email: data.userEmail,
    };

    console.log("Wallet Nonce", nonce);

    const validNonce = await getNonce(nonce);

    if (!validNonce) {
        console.log("Invalid Nonce", validNonce);
        return res.status(401).end();
    }

    deleteNonce(nonce);

    const verified = await fcl.AppUtils.verifyAccountProof("VioletVerse", data);

    if (verified) {
        const users = [];
        table
            .select({
                filterByFormula: `{userId} = "${data.address}"`,
            })
            .eachPage(
                function page(records, fetchNextPage) {
                    records.forEach(function (record) {
                        console.log("Retrieved", record.get("userId"));
                        users.push(record.get("userId"));
                    });
                    fetchNextPage();
                },
                async function done(err) {
                    if (users.length >= 1) {
                        // User found in database
                        const token = await Iron.seal(
                            user,
                            process.env.TOKEN_SECRET,
                            Iron.defaults
                        );
                        CookieService(res, token);
                        console.log("user found");
                        return res.status(200).json(users || null);
                        // res.end();
                    } else {
                        // User not found in database -- ADD NEW USER
                        console.log("user not found");
                        try {
                            table.create(
                                [
                                    {
                                        fields: {
                                            userId: `${user.address}`,
                                            email: `${user.email}`,
                                            role: "user",
                                            flowAddress: `${req.body.address}`,
                                            username: `${req.body.address}`,
                                            name: `${req.body.address}`,
                                        },
                                    },
                                ],
                                async function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return res.status(400).end();
                                    }
                                    const token = await Iron.seal(
                                        user,
                                        process.env.TOKEN_SECRET,
                                        Iron.defaults
                                    );
                                    CookieService(res, token);
                                    return res
                                        .status(200)
                                        .json(records[0].fields || null);
                                }
                            );
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
    }
}
