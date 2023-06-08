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
                    } else {
                        // User not found in database -- ADD NEW USER
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
                                }
                            );
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    // Check if user exists on Stardust.gg
                    const stardustUrl = `https://core-api.stardust.gg/v1/player/get?playerId=${user.address}`;
                    const stardustOptions = {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            "x-api-key":
                                "n8ZJVlZfAL1it1SkcNB538CFxRDIDL1aaJ9lE7Lt",
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
                                // User does not exist in Stardust.gg, so create new player
                                const stardustCreateUrl =
                                    "https://core-api.stardust.gg/v1/player/create";
                                const stardustCreateOptions = {
                                    method: "POST",
                                    headers: {
                                        accept: "application/json",
                                        "content-type": "application/json",
                                        "x-api-key":
                                            "n8ZJVlZfAL1it1SkcNB538CFxRDIDL1aaJ9lE7Lt",
                                    },
                                    body: JSON.stringify({
                                        userData: { email: user.email },
                                        uniqueId: user.address,
                                    }),
                                };

                                fetch(stardustCreateUrl, stardustCreateOptions)
                                    .then((stardustCreateRes) =>
                                        stardustCreateRes.json()
                                    )
                                    .then((stardustCreateJson) => {
                                        return res.status(200).json({
                                            userData: users,
                                            registration: true,
                                            stardustData: stardustCreateJson,
                                        });
                                    })
                                    .catch((err) => {
                                        console.error(
                                            "Stardust.gg error:",
                                            err
                                        );
                                        return res.status(200).json({
                                            userData: users,
                                            registration: true,
                                            stardustData: null,
                                        });
                                    });
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

                    if (err) {
                        console.error(err);
                        return;
                    }
                }
            );
    }
}
