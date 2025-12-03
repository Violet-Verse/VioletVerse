// pages/rss.xml.js

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // 1. Fetch from your existing API route
  const apiUrl = `${baseUrl}/api/database/getUserPosts`;
  const raw = await fetch(apiUrl).then((r) => r.json());

  // 2. Normalize to an array
  //    If your API returns:
  //      [ ... ]                    -> use that
  //      { posts: [ ... ] }         -> use posts.posts
  //      { data: [ ... ] }          -> use posts.data
  let posts = [];
  if (Array.isArray(raw)) {
    posts = raw;
  } else if (Array.isArray(raw?.posts)) {
    posts = raw.posts;
  } else if (Array.isArray(raw?.data)) {
    posts = raw.data;
  }

  // 3. Build <item> blocks
  const itemsXml = posts
    .map((post) => {
      // 🔁 Adjust these keys to your schema
      const title =
        post.title ||
        post.name ||
        post.postTitle ||
        "";
      const slug =
        post.slug ||
        post.url_slug ||
        post.path ||
        "";
      const excerpt =
        post.excerpt ||
        post.summary ||
        post.description ||
        "";
      const date =
        post.createdAt ||
        post.publishedAt ||
        post.updatedAt ||
        new Date();

      return `
        <item>
          <title><![CDATA[${title}]]></title>
          <link>https://violetverse.io/${slug}</link>
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
