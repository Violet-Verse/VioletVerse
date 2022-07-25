import { Button, Grid, Avatar, Box } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import useSWR from "swr";
import DOMPurify from "isomorphic-dompurify";
import { server } from "../../components/config";

export const getStaticPaths = async () => {
    const res = await fetch(`${server}/api/database/getAllPosts`);
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
    const res = await fetch(
        `${server}/api/database/getPostsByID?` +
            new URLSearchParams({
                id: id,
            })
    );
    const data = await res.json();

    return {
        props: { posts: data[0] },
    };
};

const Article = ({ posts }) => {
    const fetchWithId = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data, error } = useSWR(
        ["/api/database/getUserForPost", posts.createdBy],
        fetchWithId
    );
    const user = data?.user;
    var readableDate = new Date(posts.created);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const clean = DOMPurify.sanitize(posts.body);
    const postDate = dateTimeFormat.format(readableDate);
    const siteTitle = `${posts.title} + | by Violet Verse`;
    const siteDescription = posts.body;
    return (
        <Box sx={{ mt: 12 }}>
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
                spacing={3}
            >
                <Grid
                    item
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <h1 style={{ maxWidth: "700px" }}>{posts.title}</h1>
                </Grid>
                <Grid item>
                    <Image src="/line1.svg" alt="line" height={1} width={100} />
                </Grid>
                <Grid
                    item
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "stratos-lights",
                            fontStyle: "italic",
                            fontWeight: "200",
                            fontSize: "28px",
                            lineHeight: "130%",
                            letterSpacing: "-0.01em",
                            color: "#0A0510",
                            maxWidth: "700px",
                        }}
                    >
                        {posts.subtitle}
                    </p>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item>
                        <Avatar alt={user?.name} src={user?.picture} />
                    </Grid>
                    <Grid item>
                        <p style={{ color: "#693E9A" }}>By {user?.name}</p>
                    </Grid>
                    <Grid item sx={{ display: "flex" }}>
                        <Image
                            alt="edit"
                            src="/star.svg"
                            height={20}
                            width={20}
                        />
                    </Grid>
                    <Grid item>
                        <p style={{ color: "#693E9A" }}>{postDate}</p>
                    </Grid>
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
                <Grid item>
                    <p
                        style={{
                            fontFamily: "Test Calibre",
                            fontStyle: "italic",
                            fontWeight: "300",
                            fontSize: "28px",
                            lineHeight: "130%",
                            letterSpacing: "-0.01em",
                            color: "#0A0510",
                            textAlign: "justify",
                        }}
                    >
                        Over the next 20 years, banking as we know it could
                        disappear. Katherine Davis speaks on what it means for
                        society and the future of decentralized finance.
                    </p>
                </Grid>
                <Grid
                    item
                    sx={{
                        textAlign: "justify",
                    }}
                >
                    <section
                        className="postBody"
                        dangerouslySetInnerHTML={{ __html: clean }}
                    />
                </Grid>
                <Button
                    sx={{
                        marginTop: "50px",
                    }}
                    size="large"
                    variant="contained"
                    onClick={() => Router.push("/posts")}
                    disableElevation
                >
                    See more posts
                </Button>
            </Grid>
        </Box>
    );
};

export default Article;
