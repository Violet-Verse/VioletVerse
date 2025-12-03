// pages/rss.xml.js

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // 1. Call your existing API route
  const apiUrl = `${baseUrl}/api/database/getUserPosts`;
  const raw = await fetch(apiUrl).then((r) => r.json());

  // 2. Normalize to an array in case the API wraps it
  let posts = [];
  if (Array.isArray(raw)) {
    posts = raw;
  } else if (Array.isArray(raw?.posts)) {
    posts = raw.posts;
  } else if (Array.isArray(raw?.data)) {
    posts = raw.data;
  }

  // Helper: strip HTML tags for the RSS description
  const stripHtml = (html = "") =>
    html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // 3. Build <item> blocks
  const itemsXml = posts
    .map((post) => {
      // 🔁 These keys are based on what I can see in your screenshot:
      const title =
        post.title ||
        post.name ||
        "";

      // If you have a proper slug field, use that here:
      const slug =
        post.slug ||
        post.url_slug ||
        post._id || // fallback
        "";

      const excerpt =
        post.subtitle ||
        post.tldr ||
        stripHtml(post.body || "");

      const date =
        post.createdAt ||
        post.publishedAt ||
        post.updatedAt ||
        new Date();

      // TODO: update this path if your post URLs are different
      const link = `https://violetverse.io/post/${slug}`;

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

  // 4. Full RSS document
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
