import { getLoginSession } from "../../../lib/cookie-auth";
import { postTable } from "../utils/postsTable";
import { nanoid } from "nanoid";

function string_to_slug(str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "aaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-"); // collapse dashes

    return str;
}

export default async function createPost(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const session = await getLoginSession(req);

    // Reject request if no user signed in
    if (!session?.issuer) {
        return res.status(405).end();
    }

    // Allowed Parameters
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const tldr = req.body.tldr;
    const category = req.body.category;
    const body = req.body.body;
    const largeLetter = req.body.largeLetter || "false";
    const hidden = req.body.hidden;
    const video = req.body.video;
    const contributor = req.body.contributor;
    const tokenPrice = req.body.tokenPrice;
    const banner =
        !req.body.banner && !req.body.video
            ? "https://i.ibb.co/tDBm1Vj/Squared.png"
            : req.body.banner;

    // Generate Slug
    const preSlug = string_to_slug(req.body.title);
    const slug = `${preSlug}-${nanoid(10)}`;

    try {
        postTable.create(
            [
                {
                    fields: {
                        ...(title && { title }),
                        ...(subtitle && { subtitle }),
                        ...(tldr && { tldr }),
                        ...(category && { category }),
                        ...(body && { body }),
                        ...(largeLetter && { largeLetter }),
                        ...(hidden && { hidden }),
                        ...(banner && { banner }),
                        ...(video && { video }),
                        contributor: `${contributor}`,
                        tokenPrice: `${tokenPrice}`,
                        createdBy: `${session?.issuer}`,
                        slug: `${slug}`,
                    },
                },
            ],
            function (err, records) {
                if (err) {
                    console.error(err);
                    return res.status(405).end();
                }
                console.log(records[0].fields);
                return res.status(200).json(records[0].fields || null);
            }
        );
    } catch (err) {
        console.log(err);
    }
}
