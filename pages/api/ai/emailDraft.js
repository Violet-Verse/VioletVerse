import { nanoid } from "nanoid";
import connectDatabase from "../../../lib/mongoClient";
import { generateDraft } from "../../../lib/releaseDraft";
import { signPublishToken, secretMatches } from "../../../lib/publishToken";
import { table } from "../utils/userTable";

// Email-to-draft. Called by the Google Apps Script in tools/email-to-draft,
// never by a browser. Saves a HIDDEN draft and returns links for the reply email.
//
// Auth: header "Authorization: Bearer <EMAIL_DRAFT_SECRET>"
// Body: { from, subject, note, releaseText, file?: { name, type, base64 },
//         photos?: [url], videoUrl? }

const DEFAULT_BANNER = "https://i.ibb.co/tDBm1Vj/Squared.png";

function toSlug(str) {
    str = String(str).trim().toLowerCase();
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0; i < from.length; i++) str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    return str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function authorFor(email) {
    const records = await table
        .select({ filterByFormula: `LOWER({email}) = "${String(email).toLowerCase().replace(/"/g, "")}"` })
        .firstPage();
    const user = records[0]?.fields;
    if (!user) throw new Error(`No Violet Verse account uses ${email}.`);
    if (user.role !== "admin" && user.role !== "contributor") {
        throw new Error(`${email} isn't an admin or contributor on Violet Verse.`);
    }
    return user;
}

const senderEmail = (from) => (String(from).match(/[^\s<>"]+@[^\s<>"]+/) || [""])[0].toLowerCase();

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ") || !secretMatches(auth.slice(7))) {
        return res.status(401).json({ error: "Not authorized" });
    }

    const { from, subject, note, releaseText, file, photos = [], videoUrl } = req.body || {};
    const sender = senderEmail(from);
    const allowed = (process.env.EMAIL_DRAFT_ALLOWED || "")
        .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (allowed.length && !allowed.includes(sender)) {
        return res.status(403).json({ error: `${sender || "This sender"} isn't allowed to send drafts.` });
    }

    try {
        // Whose name goes on the post: EMAIL_DRAFT_AUTHOR_EMAIL, or the sender.
        const author = await authorFor(process.env.EMAIL_DRAFT_AUTHOR_EMAIL || sender);

        const cleanSubject = String(subject || "").replace(/^\s*((fwd?|fw|re)\s*:\s*)+/i, "").trim();
        const notes = [
            cleanSubject ? `Email subject: ${cleanSubject}` : "",
            note ? `Note from the editor: ${note}` : "",
        ].filter(Boolean).join("\n");

        const draft = await generateDraft({ releaseText, file, notes, photos, videoUrl });

        const now = new Date().toISOString();
        const slug = `${toSlug(draft.title)}-${nanoid(10)}`;
        const post = {
            id: Date.now(),
            title: draft.title,
            ...(draft.subtitle && { subtitle: draft.subtitle }),
            ...(draft.tldr && { tldr: draft.tldr }),
            category: draft.category || "Lifestyle",
            body: draft.body,
            hidden: true,
            banner: draft.bannerUrl || (draft.videoUrl ? undefined : DEFAULT_BANNER),
            ...(draft.videoUrl && { video: draft.videoUrl }),
            tokenPrice: null,
            createdBy: author.userId,
            slug,
            source: "email",
            created: now,
            lastUpdated: now,
        };
        if (!post.banner) delete post.banner;

        const db = await connectDatabase();
        if (!db) throw new Error("Database not available");
        const { insertedId } = await db.collection("posts").insertOne(post);

        const site = process.env.SITE_URL || `https://${req.headers.host}`;
        return res.status(200).json({
            title: post.title,
            subtitle: post.subtitle || "",
            category: post.category,
            banner: post.banner || null,
            video: post.video || null,
            previewUrl: `${site}/${slug}`,
            editUrl: `${site}/posts/${slug}/edit`,
            publishUrl: `${site}/api/ai/publish?t=${signPublishToken(String(insertedId))}`,
            editorNotes: draft.editorNotes,
        });
    } catch (err) {
        console.error("emailDraft:", err);
        return res.status(400).json({ error: err.message || "Something went wrong." });
    }
}

export const config = { api: { bodyParser: { sizeLimit: "4.5mb" } } };
