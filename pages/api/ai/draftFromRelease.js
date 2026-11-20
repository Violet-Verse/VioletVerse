import { getSessionUser, canWrite } from "../../../lib/authz";
import { generateDraft } from "../../../lib/releaseDraft";

// Turns a press release into a Violet Verse article draft for the editor panel.
// Input (JSON): { releaseText?, releaseUrl?, file?: { name, type, base64 },
//                 notes?, photos?: [url], videoUrl? }
// Output: { title, subtitle, tldr, category, body, bannerUrl, videoUrl, editorNotes }
// Nothing is saved here; the editor fills the form and you save it as usual.

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const user = await getSessionUser(req);
    if (!canWrite(user)) return res.status(403).json({ error: "Only admins and contributors can do this." });
    try {
        return res.status(200).json(await generateDraft(req.body || {}));
    } catch (err) {
        console.error("draftFromRelease:", err);
        return res.status(400).json({ error: err.message || "Something went wrong." });
    }
}

// Vercel caps request bodies at 4.5 MB; the editor limits uploads to 3 MB.
export const config = { api: { bodyParser: { sizeLimit: "4.5mb" } } };
