import Link from "next/link";
import Head from "next/head";

export const getStaticPaths = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    const paths = data.map((posts) => {
        return {
            params: { id: posts.id.toString() },
        };
    });

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps = async (context) => {
    const id = context.params.id;
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/` + id);
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Article = ({ posts }) => {
    const siteTitle = `${posts.title} + | by Violet Verse`;
    return (
        <div>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={posts.body} />
                <meta property="og:type" content="article" />
            </Head>
            <h1>{posts.title}</h1>
            <p>{posts.body}</p>
            <Link href="/posts">
                <a>
                    <h3 style={{ color: "blue" }}>See more posts</h3>
                </a>
            </Link>
        </div>
    );
};

export default Article;
