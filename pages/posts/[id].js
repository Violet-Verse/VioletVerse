import Router from "next/router";
import Head from "next/head";
import Image from "next/image";
import { Grid, Button, ButtonGroup, Box } from "@mui/material";

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
    const siteDescription = posts.body;
    return (
        <>
            <Head>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/HOcgWqo.png"
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:image:src"
                    content="https://i.imgur.com/HOcgWqo.png"
                />
            </Head>
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
            >
                <Grid
                    item
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <h1>{posts.title}</h1>
                    <h4>By User {posts.userId}</h4>
                </Grid>
                <Grid item sx={{ margin: "50px 0px" }}>
                    <Image
                        src="/banners/Photography_2.png"
                        alt="Violet Verse Banner"
                        width={1920}
                        height={1080}
                        className="image"
                    />
                </Grid>
                <Grid
                    item
                    sx={{
                        textAlign: "justify",
                    }}
                >
                    <p>{posts.body}</p>
                </Grid>
                <Button
                    sx={{
                        marginTop: "50px",
                    }}
                    size="large"
                    variant="contained"
                    onClick={() => Router.push("/posts")}
                >
                    See more posts
                </Button>
            </Grid>
        </>
    );
};

export default Article;
