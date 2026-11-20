import { ObjectId } from "mongodb";
import connectDatabase from "../../../lib/mongoClient";
import { verifyPublishToken } from "../../../lib/publishToken";

// One-tap publish from the draft email.
// GET shows a confirm page (so email link scanners can't publish by opening it);
// tapping the button POSTs back here and makes the post live.

const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function page(res, status, title, inner) {
    res.status(status).setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    res.end(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Violet Verse</title>
<style>
body{font:17px/1.5 -apple-system,system-ui,sans-serif;margin:0;background:#faf7fb;color:#222}
main{max-width:520px;margin:0 auto;padding:28px 20px}
.card{background:#fff;border-radius:14px;padding:20px;box-shadow:0 1px 4px #0001}
img{width:100%;border-radius:10px;margin-bottom:12px}
h1{font-size:22px;margin:0 0 6px} p{margin:6px 0 14px;color:#555}
button,.btn{display:block;width:100%;box-sizing:border-box;text-align:center;padding:15px;border:0;border-radius:10px;font-size:17px;font-weight:600;text-decoration:none}
button{background:#3b1220;color:#fff;margin-bottom:10px} .btn{background:#eee;color:#222}
</style></head><body><main><div class="card">${inner}</div></main></body></html>`);
}

export default async function handler(req, res) {
    const token = req.method === "POST" ? req.body?.t : req.query.t;
    let postId = null;
    try { postId = verifyPublishToken(token); } catch {}
    if (!postId) return page(res, 400, "Link expired", "<h1>This link has expired</h1><p>Approve the draft from violetverse.io/drafts instead.</p>");

    const db = await connectDatabase();
    if (!db) return page(res, 503, "Try again", "<h1>Couldn't reach the database</h1><p>Try again in a minute.</p>");
    const posts = db.collection("posts");
    let post;
    try { post = await posts.findOne({ _id: new ObjectId(postId) }); } catch {}
    if (!post) return page(res, 404, "Not found", "<h1>This draft no longer exists</h1>");

    const site = process.env.SITE_URL || `https://${req.headers.host}`;
    const url = `${site}/${post.slug}`;
    const head = `${post.banner ? `<img src="${esc(post.banner)}" alt="">` : ""}<h1>${esc(post.title)}</h1><p>${esc(post.subtitle)}</p>`;

    if (req.method === "POST") {
        await posts.updateOne({ _id: post._id }, { $set: { hidden: false, lastUpdated: new Date().toISOString() } });
        return page(res, 200, "Published", `${head}<p><strong>✓ It's live.</strong></p><a class="btn" href="${esc(url)}">View the post</a>`);
    }
    if (req.method !== "GET") return res.status(405).end();

    if (post.hidden !== true) {
        return page(res, 200, "Already live", `${head}<p><strong>Already live.</strong></p><a class="btn" href="${esc(url)}">View the post</a>`);
    }
    return page(res, 200, "Publish?", `${head}
<form method="POST"><input type="hidden" name="t" value="${esc(token)}"><button type="submit">Publish now</button></form>
<a class="btn" href="${esc(url)}">Preview first</a>`);
}
