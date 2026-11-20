#!/usr/bin/env node
// vv-publish — post articles to violetverse.io as drafts, then publish on approval.
//
//   vv-publish draft <article.md|.docx|.html> [options]   create a hidden draft
//   vv-publish list                                        show your drafts
//   vv-publish publish <slug>                              make a draft live
//   vv-publish unpublish <slug>                            hide a live post again
//
// It uses the site's own endpoints (the same ones the /posts/create page uses),
// so nothing on the live site has to change.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CATEGORIES = ["Tech", "Lifestyle", "Education"];

// ---------- config ----------
function loadEnvFile(file) {
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
        if (!m || process.env[m[1]]) continue;
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
}
loadEnvFile(path.join(process.cwd(), ".env"));
loadEnvFile(path.join(HERE, ".env"));

const SITE = (process.env.VV_SITE_URL || "https://violetverse.io").replace(/\/$/, "");
const IMGBB_URL = process.env.IMGBB_UPLOAD_URL || "https://api.imgbb.com/1/upload";
const ANTHROPIC_URL = process.env.ANTHROPIC_URL || "https://api.anthropic.com/v1/messages";
const AI_MODEL = process.env.VV_AI_MODEL || "claude-sonnet-5-5";

function need(name) {
    const v = process.env[name];
    if (!v) fail(`Missing ${name}. Add it to tools/vv-publisher/.env (see .env.example).`);
    return v;
}
function fail(msg) {
    console.error(`\n✖ ${msg}\n`);
    process.exit(1);
}

// ---------- args ----------
function parseArgs(argv) {
    const out = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (!a.startsWith("--")) { out._.push(a); continue; }
        const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const next = argv[i + 1];
        if (next === undefined || next.startsWith("--")) out[key] = true;
        else { out[key] = next; i++; }
    }
    return out;
}

// ---------- site session ----------
async function login() {
    const res = await fetch(`${SITE}/api/auth/direct-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: need("VV_EMAIL"), adminKey: need("VV_ADMIN_KEY") }),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        fail(`Login failed (${res.status}): ${body.error || res.statusText}`);
    }
    const setCookie = res.headers.get("set-cookie") || "";
    const m = setCookie.match(/api_token=([^;]+)/);
    if (!m) fail("Login worked but the site sent no session cookie.");
    return `api_token=${m[1]}`;
}

async function api(cookie, method, route, body) {
    const res = await fetch(`${SITE}/api/database/${route}`, {
        method,
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) fail(`${route} failed (${res.status}) ${text.slice(0, 200)}`);
    try { return text ? JSON.parse(text) : null; } catch { return text; }
}

const myPosts = (cookie) => api(cookie, "GET", "getUserPosts");

// ---------- article loading ----------
async function loadArticle(file) {
    if (!fs.existsSync(file)) fail(`File not found: ${file}`);
    const ext = path.extname(file).toLowerCase();
    let meta = {};
    let html;

    if (ext === ".md" || ext === ".markdown") {
        const parsed = matter(fs.readFileSync(file, "utf8"));
        meta = parsed.data;
        let md = parsed.content;
        if (!meta.title) {
            const h1 = md.match(/^#\s+(.+)$/m);
            if (h1) { meta.title = h1[1].trim(); md = md.replace(h1[0], ""); }
        }
        html = marked.parse(md.trim());
    } else if (ext === ".docx") {
        const mammoth = (await import("mammoth")).default;
        const { value, messages } = await mammoth.convertToHtml({ path: file });
        messages.filter((m) => m.type === "warning").forEach((m) => console.warn("  docx:", m.message));
        html = value;
    } else if (ext === ".html" || ext === ".htm") {
        const parsed = matter(fs.readFileSync(file, "utf8"));
        meta = parsed.data;
        html = parsed.content;
        const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        if (body) html = body[1];
    } else {
        fail(`Unsupported file type ${ext}. Use .md, .docx or .html.`);
    }

    // Pull a leading <h1> out as the title if we still don't have one.
    if (!meta.title) {
        const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        if (h1) { meta.title = stripTags(h1[1]).trim(); html = html.replace(h1[0], ""); }
    }
    return { meta, html: html.trim(), dir: path.dirname(path.resolve(file)) };
}

const stripTags = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

function normalizeCategory(c) {
    if (!c) return undefined;
    const hit = CATEGORIES.find((x) => x.toLowerCase() === String(c).trim().toLowerCase());
    if (!hit) fail(`Category must be one of ${CATEGORIES.join(", ")} (got "${c}").`);
    return hit;
}

// ---------- images ----------
const isRemote = (src) => /^https?:\/\//i.test(src);

async function uploadImage(src, baseDir) {
    const key = need("IMGBB_KEY");
    const form = new FormData();
    if (src.startsWith("data:")) {
        form.append("image", src.split(",")[1]); // imgbb accepts base64
    } else {
        const p = path.resolve(baseDir, decodeURI(src));
        if (!fs.existsSync(p)) fail(`Image not found: ${p}`);
        form.append("image", new Blob([fs.readFileSync(p)]), path.basename(p));
    }
    const res = await fetch(`${IMGBB_URL}?key=${key}`, { method: "POST", body: form });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.data?.url) fail(`Image upload failed for ${src.slice(0, 60)}: ${json?.error?.message || res.status}`);
    return json.data.url;
}

async function hostBodyImages(html, baseDir) {
    const srcs = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]))]
        .filter((s) => !isRemote(s));
    for (const src of srcs) {
        const url = await uploadImage(src, baseDir);
        html = html.split(`src="${src}"`).join(`src="${url}"`);
        console.log(`  ↑ image ${src.startsWith("data:") ? "(embedded)" : src} → ${url}`);
    }
    return html;
}

// ---------- optional AI fill ----------
async function aiFill(fields, html) {
    const missing = ["subtitle", "tldr", "category"].filter((k) => !fields[k]);
    if (!missing.length) return {};
    const key = need("ANTHROPIC_API_KEY");
    const prompt = `You help edit Violet Verse, a culture, tech and lifestyle journal.
Article title: ${fields.title}
Article text:
${stripTags(html).slice(0, 20000)}

Return only JSON with these keys: ${missing.join(", ")}.
- subtitle: one line, under 140 characters, in the article's own voice
- tldr: 1-2 plain sentences summarizing the piece
- category: exactly one of ${CATEGORIES.join(", ")}`;
    const res = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: AI_MODEL, max_tokens: 600, messages: [{ role: "user", content: prompt }] }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) fail(`AI fill failed (${res.status}): ${json?.error?.message || ""}`);
    const text = json.content?.map((c) => c.text || "").join("") || "";
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) fail("AI fill returned no JSON.");
    const out = JSON.parse(m[0]);
    const filled = {};
    for (const k of missing) if (out[k]) filled[k] = k === "category" ? normalizeCategory(out[k]) : String(out[k]).trim();
    return filled;
}

// ---------- commands ----------
async function cmdDraft(file, o) {
    const { meta, html: rawHtml, dir } = await loadArticle(file);
    const f = {
        title: o.title || meta.title,
        subtitle: o.subtitle || meta.subtitle,
        tldr: o.tldr || meta.tldr,
        category: normalizeCategory(o.category || meta.category),
        banner: o.banner || meta.banner,
        video: o.video || meta.video,
        contributor: o.contributor || meta.contributor,
        largeLetter: Boolean(o.largeLetter || meta.largeLetter),
    };
    if (!f.title) fail("No title. Add `title:` front matter, a leading # heading, or --title.");
    if (!rawHtml) fail("The article body is empty.");

    if (o.ai) {
        const filled = await aiFill(f, rawHtml);
        for (const [k, v] of Object.entries(filled)) { f[k] = v; console.log(`  ✎ AI ${k}: ${v}`); }
    }
    if (!f.category) fail(`No category. Use --category (${CATEGORIES.join(" | ")}), front matter, or --ai.`);

    if (o.dryRun) {
        const out = path.join(process.cwd(), "vv-preview.html");
        fs.writeFileSync(out, `<!doctype html><meta charset="utf-8"><title>${f.title}</title>
<style>body{font:18px/1.6 Georgia,serif;max-width:720px;margin:40px auto;padding:0 20px}small{color:#777}</style>
<small>${f.category}${f.banner ? " · banner: " + f.banner : ""}</small><h1>${f.title}</h1>
${f.subtitle ? `<h3>${f.subtitle}</h3>` : ""}${f.tldr ? `<p><b>TL;DR</b> ${f.tldr}</p>` : ""}<hr>${rawHtml}`);
        console.log(`\nDry run: nothing was sent to the site. Preview written to ${out}`);
        return;
    }

    const cookie = await login();
    if (!o.force) {
        const existing = (await myPosts(cookie)) || [];
        const dupe = existing.find((p) => p.title?.trim().toLowerCase() === f.title.trim().toLowerCase());
        if (dupe) fail(`A post titled "${f.title}" already exists (${SITE}/${dupe.slug}). Use --force to post anyway.`);
    }

    const body = await hostBodyImages(rawHtml, dir);
    let banner = null;
    if (f.banner) banner = isRemote(f.banner) ? f.banner : await uploadImage(f.banner, dir);

    const post = await api(cookie, "POST", "createPost", {
        title: f.title,
        subtitle: f.subtitle,
        tldr: f.tldr,
        category: f.category,
        body,
        largeLetter: f.largeLetter,
        hidden: true, // always a draft; `publish` makes it live
        banner,
        video: f.video,
        contributor: f.contributor || null,
        tokenPrice: null,
    });
    if (!post?.slug) fail("The site did not confirm the draft. Check /drafts before retrying.");

    console.log(`\n✔ Draft saved (hidden): ${f.title}
  Preview:  ${SITE}/${post.slug}
  Edit:     ${SITE}/posts/${post.slug}/edit
  All drafts: ${SITE}/drafts
  Go live:  vv-publish publish ${post.slug}\n`);
}

async function cmdList() {
    const cookie = await login();
    const posts = ((await myPosts(cookie)) || []).filter((p) => p.hidden === true);
    if (!posts.length) return console.log("No drafts.");
    posts.sort((a, b) => String(b.created).localeCompare(String(a.created)));
    for (const p of posts) console.log(`${String(p.created).slice(0, 10)}  [${p.category || "-"}]  ${p.title}\n            ${p.slug}`);
}

async function cmdSetHidden(slug, hidden) {
    if (!slug) fail(`Usage: vv-publish ${hidden ? "unpublish" : "publish"} <slug>`);
    const cookie = await login();
    const post = ((await myPosts(cookie)) || []).find((p) => p.slug === slug);
    if (!post) fail(`No post of yours with slug ${slug}. Run \`vv-publish list\`.`);
    await api(cookie, "PUT", "approvePost", { _id: post._id, hidden });
    console.log(hidden ? `✔ Hidden again: ${post.title}` : `✔ Live: ${SITE}/${slug}`);
}

const HELP = `vv-publish — post articles to Violet Verse

  vv-publish draft <file.md|.docx|.html> [options]
      --title "..."  --subtitle "..."  --tldr "..."
      --category Tech|Lifestyle|Education
      --banner <url or local image>   --video <url>
      --contributor <userId>          --large-letter
      --ai        fill a missing subtitle, TL;DR or category with Claude
      --dry-run   write vv-preview.html and send nothing
      --force     post even if the title already exists
  vv-publish list
  vv-publish publish <slug>
  vv-publish unpublish <slug>
`;

const args = parseArgs(process.argv.slice(2));
const [cmd, arg] = args._;
try {
    if (cmd === "draft" && arg) await cmdDraft(arg, args);
    else if (cmd === "list") await cmdList();
    else if (cmd === "publish") await cmdSetHidden(arg, false);
    else if (cmd === "unpublish") await cmdSetHidden(arg, true);
    else console.log(HELP);
} catch (e) {
    fail(e.message || String(e));
}
