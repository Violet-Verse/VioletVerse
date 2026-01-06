import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";
import { table } from "../utils/userTable";
import fetch from "node-fetch";

export default async function handler(req, res) {
    const data = req.body;
    
    // Privy sends wallet address, chain type, and user info
    const user = {
        issuer: data.address,
        address: data.address,
        email: data.userEmail,
        chainType: data.chainType, // 'ethereum', 'solana', 'flow'
        walletType: data.walletType, // 'metamask', 'phantom', etc.
        privyUserId: data.privyUserId,
    };

    console.log("Privy Login - Address:", data.address);
    console.log("Privy Login - Chain Type:", data.chainType);

    // Privy handles wallet verification, so we can proceed directly
    const users = [];
    
    table
        .select({
            filterByFormula: `{userId} = "${data.address}"`,
        })
        .eachPage(
            function page(records, fetchNextPage) {
                records.forEach(function (record) {
                    console.log("Retrieved User:", record.get("userId"));
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

                    // Check if user exists on Stardust.gg
                    const stardustUrl = `https://core-api.stardust.gg/v1/player/get?playerId=${user.address}`;
                    const stardustOptions = {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "x-api-key": process.env.STARDUST_KEY,
                        },
                    };

                    fetch(stardustUrl, stardustOptions)
                        .then((stardustRes) => stardustRes.json())
                        .then((stardustJson) => {
                            // Check if user exists in Stardust.gg response
                            if (stardustJson) {
                                // User exists in Stardust.gg
                                return res.status(200).json({
                                    userData: users,
                                    registration: false,
                                    stardustData: stardustJson,
                                });
                            } else {
                                // User does not exist in Stardust.gg -- ADD NEW USER
                                const addressField = data.chainType === 'solana' 
                                    ? 'solanaAddress' 
                                    : data.chainType === 'flow'
                                    ? 'flowAddress'
                                    : 'ethereumAddress';
                                
                                const newUserFields = {
                                    userId: `${user.address}`,
                                    email: `${user.email}`,
                                    role: "user",
                                    username: `${data.address}`,
                                    name: `${data.address}`,
                                    chainType: `${data.chainType}`,
                                };
                                
                                // Add the appropriate address field
                                newUserFields[addressField] = `${data.address}`;
                                
                                table.create(
                                    [
                                        {
                                            fields: newUserFields,
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
                                        return res.status(200).json({
                                            userData: records[0].fields,
                                            registration: true,
                                            stardustData: null,
                                        });
                                    }
                                );
                            }
                        })
                        .catch((err) => {
                            console.error("Stardust.gg error:", err);
                            return res.status(200).json({
                                userData: users,
                                registration: false,
                                stardustData: null,
                            });
                        });
                } else {
                    // User not found in database -- ADD NEW USER
                    try {
                        const addressField = data.chainType === 'solana' 
                            ? 'solanaAddress' 
                            : data.chainType === 'flow'
                            ? 'flowAddress'
                            : 'ethereumAddress';
                        
                        const newUserFields = {
                            userId: `${user.address}`,
                            email: `${user.email}`,
                            role: "user",
                            username: `${data.address}`,
                            name: `${data.address}`,
                            chainType: `${data.chainType}`,
                        };
                        
                        // Add the appropriate address field
                        newUserFields[addressField] = `${data.address}`;
                        
                        table.create(
                            [
                                {
                                    fields: newUserFields,
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

                                // Create new player in Stardust.gg
                                const stardustUrl =
                                    "https://core-api.stardust.gg/v1/player/create";
                                const stardustOptions = {
                                    method: "POST",
                                    headers: {
                                        accept: "application/json",
                                        "content-type": "application/json",
                                        "x-api-key":
                                            process.env.STARDUST_KEY,
                                    },
                                    body: JSON.stringify({
                                        userId: user.address,
                                        email: user.email,
                                    }),
                                };

                                fetch(stardustUrl, stardustOptions)
                                    .then((stardustRes) =>
                                        stardustRes.json()
                                    )
                                    .then((stardustJson) => {
                                        return res.status(200).json({
                                            userData: records[0].fields,
                                            registration: true,
                                            stardustData: stardustJson,
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(
                                            "Stardust.gg error:",
                                            err
                                        );
                                        return res.status(200).json({
                                            userData: records[0].fields,
                                            registration: true,
                                            stardustData: null,
                                        });
                                    });
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