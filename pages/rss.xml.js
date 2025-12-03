// pages/rss.xml.js

export async function getServerSideProps({ req, res }) {
  // Figure out your base URL (works locally + in prod)
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // 1. Fetch posts from your existing API route
  const apiUrl = `${baseUrl}/api/database/getUserPosts`;
  const posts = await fetch(apiUrl).then((r) => r.json());

  // 2. Build RSS items from posts
  const itemsXml = (posts || [])
    .map((post) => {
      // 🔁 Adjust these field names to match what your API returns
      const title = post.title || "";
      const slug = post.slug || "";
      const excerpt = post.excerpt || "";
      const date = post.createdAt || post.updatedAt || new Date();

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

  // 3. Full RSS document
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

  // 4. Send XML
  res.setHeader("Content-Type", "text/xml");
  res.write(rss);
  res.end();

  return { props: {} };
}

export default function RSS() {
  return null;
}
