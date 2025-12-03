// pages/rss.xml.js

export async function getServerSideProps({ req, res }) {
  // 1. Figure out the base URL (works locally + in prod)
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  // 2. Call your existing API route to get posts
  const apiUrl = `${baseUrl}/api/database/getUserPosts`;
  const posts = await fetch(apiUrl).then((r) => r.json());

  // 3. Build RSS XML out of those posts
  const rss = `
    <rss version="2.0">
      <channel>
        <title>VioletVerse</title>
        <link>https://violetverse.io</link>
        <description>VioletVerse — digital fashion, AI, and culture</description>

        ${posts
          .map((post) => {
            // adjust these fields if your API returns different names
            const title = post.title || '';
            const slug = post.slug || '';
            const excerpt = post.excerpt || '';
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
          .join('')}
      </channel>
    </rss>
  `;

  // 4. Send XML response
  res.setHeader('Content-Type', 'text/xml');
  res.write(rss.trim());
  res.end();

  return { props: {} };
}

export default function RSS() {
  return null;
}
