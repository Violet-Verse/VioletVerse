import * as fcl from "@onflow/fcl";
import Iron from "@hapi/iron";
import CookieService from "../../../lib/cookie";
import { table } from "../utils/userTable";
import { deleteNonce, getNonce } from "../aws/nonceControl";
import fetch from "node-fetch";

// Helper Functions
async function checkValidNonce(nonce) {
    const validNonce = await getNonce(nonce);
    if (!validNonce) {
        console.log("Invalid Nonce", validNonce);
        return false;
    }

    deleteNonce(nonce);
    return true;
}

async function createStardustPlayer(user) {
    const stardustUrl = "https://core-api.stardust.gg/v1/player/create";
    const stardustOptions = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "x-api-key": "n8ZJVlZfAL1it1SkcNB538CFxRDIDL1aaJ9lE7Lt",
        },
        body: JSON.stringify({
            userData: { email: user.email },
            uniqueId: user.address,
        }),
    };

    const stardustRes = await fetch(stardustUrl, stardustOptions);
    return await stardustRes.json();
}

async function checkOrCreateStardustPlayer(user) {
    const stardustUrl = `https://core-api.stardust.gg/v1/player/get?playerId=${user.address}`;
    const stardustOptions = {
        method: "GET",
        headers: {
            accept: "application/json",
            "x-api-key": "n8ZJVlZfAL1it1SkcNB538CFxRDIDL1aaJ9lE7Lt",
        },
    };

    const stardustRes = await fetch(stardustUrl, stardustOptions);
    const stardustJson = await stardustRes.json();

    if (!stardustJson) {
        stardustJson = await createStardustPlayer(user);
    }

    return stardustJson;
}

async function createLocalUser(user) {
    // User not found in database -- ADD NEW USER
    const records = await table.create([
        {
            fields: {
                userId: `${user.address}`,
                email: `${user.email}`,
                role: "user",
                flowAddress: `${user.address}`,
                username: `${user.address}`,
                name: `${user.address}`,
            },
        },
    ]);

    if (records.error) {
        throw records.error;
    }

    return records[0].fields;
}

async function checkOrCreateLocalUser(user) {
    const users = [];
    await table
        .select({ filterByFormula: `{userId} = "${user.address}"` })
        .eachPage(function page(records, fetchNextPage) {
            records.forEach((record) => {
                console.log("Retrieved User:", record.get("userId"));
                users.push(record); // push entire record, not just userId
            });
            fetchNextPage();
        });

    let localUserData;
    if (users.length < 1) {
        localUserData = await createLocalUser(user);
    } else {
        // Each record has a `fields` property that contains the user data
        localUserData = users[0].fields; // use fields from the first record
    }

    return localUserData;
}

async function sealUserAndSetCookie(user, res) {
    const token = await Iron.seal(
        user,
        process.env.TOKEN_SECRET,
        Iron.defaults
    );
    CookieService(res, token);
}

// Main function
export default async function handler(req, res) {
    const data = req.body;
    const user = {
        issuer: data.address,
        address: data.address,
        email: data.userEmail,
    };

    console.log("Wallet Nonce", data.nonce);

    if (!checkValidNonce(data.nonce)) {
        return res.status(401).end();
    }

    const verified = await fcl.AppUtils.verifyAccountProof("VioletVerse", data);

    if (verified) {
        try {
            const localUserData = await checkOrCreateLocalUser(user);
            await sealUserAndSetCookie(user, res);

            const stardustData = await checkOrCreateStardustPlayer(user);
            const registration = stardustData ? false : true;

            return res.status(200).json({
                userData: localUserData,
                registration,
                stardustData,
            });
        } catch (error) {
            console.log(error);
            return res.status(400).end();
        }
    } else {
        return res.status(401).end();
    }
}
