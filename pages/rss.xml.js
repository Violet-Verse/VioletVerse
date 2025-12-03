// pages/rss.xml.js

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const apiUrl = `${baseUrl}/api/database/getUserPosts`;

  let raw;
  try {
    const response = await fetch(apiUrl);
    raw = await response.json();
  } catch (e) {
    console.error("RSS fetch error:", e);
    raw = [];
  }

  // --- DEBUG: see what we're getting back (check logs on your host) ---
  console.log(
    "RSS raw getUserPosts sample:",
    typeof raw,
    Array.isArray(raw),
    JSON.stringify(raw).slice(0, 500)
  );

  // Normalize to an array in *any* case
  let posts = [];

  if (Array.isArray(raw)) {
    posts = raw;
  } else if (raw && typeof raw === "object") {
    if (Array.isArray(raw.posts)) {
      posts = raw.posts;
    } else if (Array.isArray(raw.data)) {
      posts = raw.data;
    } else {
      // if it's an object keyed by ids, turn values into an array
      posts = Object.values(raw);
    }
  }

  const stripHtml = (html = "") =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const itemsXml = posts
    .map((post) => {
      const title =
        post.title ||
        post.name ||
        "";

      const slug =
        post.slug ||
        post.url_slug ||
        post._id || "";

      const excerpt =
        post.subtitle ||
        post.tldr ||
        stripHtml(post.body || "");

      const date =
        post.createdAt ||
        post.publishedAt ||
        post.updatedAt ||
        new Date();

      const link = `https://violetverse.io/${slug}`;

      return `
        <item>
          <title><![CDATA[${title}]]></title>
          <link>${link}</link>
          <pubDate>${new Date(date).toUTCString()}</pubDate>
          <description><![CDATA[${excerpt}]]></description>
        </item>
      `;
    })
    .join("");

  const rss = `
    <rss version="2.0">
      <channel>
        <title>VioletVerse</title>
        <link>https://violetverse.io</link>
        <description>VioletVerse – digital fashion, AI, and culture</description>
        ${itemsXml}
      </channel>
    </rss>
  `.trim();

  res.setHeader("Content-Type", "text/xml");
  res.write(rss);
  res.end();

  return { props: {} };
}

export default function RSS() {
  return null;
}
