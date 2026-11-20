// Shared by the dashboard panel and email-to-draft.

export const CATEGORIES = ["Tech", "Lifestyle", "Education"];
const MODEL = process.env.AI_MODEL || "claude-sonnet-5-5";
const ANTHROPIC_URL = process.env.ANTHROPIC_URL || "https://api.anthropic.com/v1/messages";
const MAX_PHOTOS = 8;

const SYSTEM = `You are an editor at Violet Verse (violetverse.io), a journal covering culture, technology, lifestyle and travel, with a Web3 and creative-community audience. You turn press releases into original Violet Verse articles.

Rules:
- Use only facts in the press release (and the editor's notes). Never invent quotes, names, numbers, dates, prices or links.
- Keep any quote you use word for word and attributed to the person the release names.
- Rewrite in Violet Verse's own editorial voice: lead with why it matters to our readers, not with "X announced today". No press-release clichés ("excited to announce", "leading provider", "revolutionary").
- Keep the practical details readers need: dates, place, price, how to attend or buy, and official links from the release.
- 400-800 words unless the editor's notes say otherwise.
- Body is HTML using only <p>, <h2>, <blockquote>, <ul>, <ol>, <li>, <strong>, <em>, <a href>. No <h1> (the title is separate).
- If photos are provided, place each marker {{PHOTO_n}} on its own line where that photo fits best, using each photo at most once. Photo 1 is the banner, so don't place PHOTO_1 in the body unless told there is no banner.
- In editor_notes, list anything the editor should verify or that the release left unclear. Leave it empty if nothing.
- Always answer by calling the write_article tool, with no other text.`;

const TOOL = {
    name: "write_article",
    description: "Return the finished Violet Verse article draft.",
    input_schema: {
        type: "object",
        properties: {
            title: { type: "string", description: "Headline, under 90 characters" },
            subtitle: { type: "string", description: "One-line dek, under 160 characters" },
            tldr: { type: "string", description: "1-2 sentence summary" },
            category: { type: "string", enum: CATEGORIES },
            body_html: { type: "string" },
            photo_alt: {
                type: "array",
                items: { type: "string" },
                description: "Short alt text for each photo, in order",
            },
            editor_notes: { type: "array", items: { type: "string" } },
        },
        required: ["title", "subtitle", "tldr", "category", "body_html"],
    },
};

const escapeAttr = (s) => String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function htmlToText(html) {
    return html
        .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
        .replace(/<br\s*\/?>|<\/(p|div|h\d|li|tr)>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n+/g, "\n\n")
        .trim();
}

async function releaseContent({ releaseText, releaseUrl, file }) {
    const blocks = [];
    if (releaseText?.trim()) blocks.push({ type: "text", text: `PRESS RELEASE (pasted):\n${releaseText.trim()}` });

    if (releaseUrl?.trim()) {
        if (!/^https?:\/\//i.test(releaseUrl)) throw new Error("The press release link must start with http:// or https://");
        const r = await fetch(releaseUrl, { headers: { "User-Agent": "VioletVerseBot/1.0" } });
        if (!r.ok) throw new Error(`Couldn't open the press release link (${r.status}). Paste the text instead.`);
        const text = htmlToText(await r.text()).slice(0, 60000);
        blocks.push({ type: "text", text: `PRESS RELEASE (from ${releaseUrl}):\n${text}` });
    }

    if (file?.base64) {
        const name = (file.name || "").toLowerCase();
        if (file.type === "application/pdf" || name.endsWith(".pdf")) {
            blocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: file.base64 } });
        } else if (name.endsWith(".docx")) {
            const mammoth = (await import("mammoth")).default;
            const { value } = await mammoth.extractRawText({ buffer: Buffer.from(file.base64, "base64") });
            blocks.push({ type: "text", text: `PRESS RELEASE (${file.name}):\n${value}` });
        } else if (name.endsWith(".txt") || name.endsWith(".md")) {
            blocks.push({ type: "text", text: `PRESS RELEASE (${file.name}):\n${Buffer.from(file.base64, "base64").toString("utf8")}` });
        } else {
            throw new Error("Upload a PDF, Word (.docx) or text file.");
        }
    }

    if (!blocks.length) throw new Error("Add a press release: paste it, upload it, or give its link.");
    return blocks;
}

function jsonFromText(content) {
    const text = (content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { return JSON.parse(m[0]); } catch { return null; }
}

export function placePhotos(bodyHtml, photos, alts, { bannerUsed }) {
    let body = bodyHtml;
    const used = new Set();
    photos.forEach((url, i) => {
        const marker = new RegExp(`(<p>\\s*)?\\{\\{PHOTO_${i + 1}\\}\\}(\\s*</p>)?`, "g");
        const img = `<p><img src="${escapeAttr(url)}" alt="${escapeAttr(alts[i] || "")}"></p>`;
        let first = true;
        body = body.replace(marker, () => {
            if (!first) return "";
            first = false;
            used.add(i);
            return img;
        });
    });
    // Any photo Claude didn't place (except the banner) goes at the end.
    photos.forEach((url, i) => {
        if (used.has(i) || (bannerUsed && i === 0)) return;
        body += `\n<p><img src="${escapeAttr(url)}" alt="${escapeAttr(alts[i] || "")}"></p>`;
    });
    return body.replace(/(<p>\s*)?\{\{PHOTO_\d+\}\}(\s*<\/p>)?/g, "");
}

// Writes a Violet Verse article from a press release. Throws on bad input or API errors.
// photos: hosted image URLs (first is the banner unless there's a video).
export async function generateDraft({ releaseText, releaseUrl, file, notes, photos = [], videoUrl } = {}) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY isn't set in Vercel.");
    photos = photos.filter((u) => /^https:\/\//.test(u)).slice(0, MAX_PHOTOS);
    const bannerUsed = photos.length > 0 && !videoUrl;

    const content = await releaseContent({ releaseText, releaseUrl, file });
    photos.forEach((url, i) => {
        content.push({ type: "text", text: `Photo ${i + 1}${i === 0 && bannerUsed ? " (banner)" : ""}:` });
        content.push({ type: "image", source: { type: "url", url } });
    });
    content.push({
        type: "text",
        text: [
            `Photos provided: ${photos.length}.${photos.length && !bannerUsed ? " There is no image banner, so PHOTO_1 may go in the body." : ""}`,
            videoUrl ? `A YouTube video will run at the top of the article: ${videoUrl}` : "",
            notes?.trim() ? `Editor's notes: ${notes.trim()}` : "",
            "Write the article now.",
        ].filter(Boolean).join("\n"),
    });

    const r = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: 4000,
            system: SYSTEM,
            tools: [TOOL],
            // Some models reject a forced tool choice, so let the model
            // call the tool itself and fall back to JSON in the text.
            tool_choice: { type: "auto" },
            messages: [{ role: "user", content }],
        }),
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(json?.error?.message || `Claude request failed (${r.status})`);
    const out = json.content?.find((c) => c.type === "tool_use")?.input || jsonFromText(json.content);
    if (!out?.body_html) throw new Error("Claude didn't return an article. Try again.");

    return {
        title: out.title,
        subtitle: out.subtitle,
        tldr: out.tldr,
        category: CATEGORIES.includes(out.category) ? out.category : "",
        body: placePhotos(out.body_html, photos, out.photo_alt || [], { bannerUsed }),
        bannerUrl: bannerUsed ? photos[0] : null,
        videoUrl: videoUrl || null,
        editorNotes: out.editor_notes || [],
    };
}
