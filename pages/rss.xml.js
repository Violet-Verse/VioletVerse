// pages/rss.xml.js
import connectDatabase from "../lib/mongoClient";

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  let posts = [];

  try {
    // Query database directly for public posts (no auth required)
    const db = await connectDatabase();
    const collection = db.collection("posts");
    
    // Get only public, non-hidden posts, sorted by creation date (newest first)
    // Limit to 50 most recent posts for RSS feed performance
    posts = await collection
      .find({ hidden: { $ne: true } })
      .sort({ created: -1 })
      .limit(50)
      .toArray();
  } catch (e) {
    console.error("RSS database error:", e);
    posts = [];
  }

  const stripHtml = (html = "") =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  const escapeXml = (str) => {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const itemsXml = posts
    .map((post) => {
      const title = post.title || post.name || "Untitled";

      const slug = post.slug || post.url_slug || post._id?.toString() || "";

      const excerpt =
        post.subtitle ||
        post.tldr ||
        stripHtml(post.body || "").substring(0, 300) || "";

      // Use created date, fallback to lastUpdated, then current time as last resort
      const date = post.created || post.lastUpdated || new Date().toISOString();

      // Use baseUrl instead of hardcoded domain
      const link = `${baseUrl}/${slug}`;
      const guid = `${baseUrl}/${slug}`;

      // Format date properly for RSS
      let pubDate;
      try {
        pubDate = new Date(date).toUTCString();
      } catch (e) {
        console.error("RSS date parsing error:", e, date);
        pubDate = new Date().toUTCString();
      }

      // Build category if available
      const categoryXml = post.category
        ? `<category><![CDATA[${post.category}]]></category>`
        : "";

      return `
        <item>
          <title><![CDATA[${title}]]></title>
          <link>${escapeXml(link)}</link>
          <guid isPermaLink="true">${escapeXml(guid)}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${excerpt}]]></description>
          ${categoryXml}
        </item>
      `;
    })
    .join("");

  const rss = `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>VioletVerse</title>
        <link>${baseUrl}</link>
        <description>VioletVerse – digital fashion, AI, and culture</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${itemsXml}
      </channel>
    </rss>
  `.trim();

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.write(rss);
  res.end();

  return { props: {} };
}

export default function RSS() {
  return null;
}
