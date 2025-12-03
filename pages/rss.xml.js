// pages/rss.xml.js

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const apiUrl = `${baseUrl}/api/database/getUserPosts`;
  const raw = await fetch(apiUrl).then((r) => r.json());

  let posts = [];
  if (Array.isArray(raw)) {
    posts = raw;
  } else if (Array.isArray(raw?.posts)) {
    posts = raw.posts;
  } else if (Array.isArray(raw?.data)) {
    posts = raw.data;
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
        post._id ||
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

      // 🔑 updated to match your URL structure
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
        <title>V
