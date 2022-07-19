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
    return (
        <div>
            <Head>
                <title>{posts.title + `| by Violet Verse`}</title>
                <meta
                    name="title"
                    content={posts.title + `| by Violet Verse`}
                />
                <meta
                    name="og:title"
                    content={posts.title + `| by Violet Verse`}
                />
                <meta name="description" content={posts.body} />
                <meta
                    property="og:image"
                    content={`https://placehold.jp/40/693E9A/ffffff/1920x1080.png?text=Violet%20Verse%0ABy%20User${posts.userId}&css=%7B%22border-radius%22%3A%2215px%22%2C%22background%22%3A%22%20-webkit-gradient(linear%2C%20left%20top%2C%20left%20bottom%2C%20from(%23693E9A)%2C%20to(%23F985B4))%22%7D`}
                />
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
