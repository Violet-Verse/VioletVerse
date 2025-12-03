import { getAllPosts } from '../lib/api' // <- your posts source

export async function getServerSideProps({ res }) {
  const posts = await getAllPosts()

  const rss = `
  <rss version="2.0">
    <channel>
      <title>VioletVerse</title>
      <link>https://violetverse.io</link>
      <description>VioletVerse Articles</description>

      ${posts
        .map(post => {
          return `
            <item>
              <title><![CDATA[${post.title}]]></title>
              <link>https://violetverse.io/${post.slug}</link>
              <pubDate>${new Date(post.date).toUTCString()}</pubDate>
              <description><![CDATA[${post.excerpt}]]></description>
            </item>
          `
        })
        .join('')}
    </channel>
  </rss>
  `

  res.setHeader('Content-Type', 'text/xml')
  res.write(rss)
  res.end()

  return { props: {} }
}

export default function RSS() {
  return null
}
