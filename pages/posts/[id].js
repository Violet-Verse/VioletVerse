import { Button, Grid, Avatar, Box } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import useSWR from "swr";
import DOMPurify from "isomorphic-dompurify";
import Jazzicon from "react-jazzicon";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { useUser } from "../../hooks/useAuth";
import { server } from "../../components/config";
import youtubeParser from "../../lib/getYouTubeThumbnail";

export async function getServerSideProps(context) {
    const id = context.params.id;
    const res = await fetch(
        `${server}/api/database/getPostsByID?` +
            new URLSearchParams({
                id: id,
            })
    );

    const data = await res.json();

    if (!data) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: { posts: data[0] },
    };
}

const Article = ({ posts }) => {
    const { user, loaded } = useUser();
    const fetchWithId = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data, error } = useSWR(
        ["/api/database/getUserForPost", posts.createdBy],
        fetchWithId
    );
    const author = data?.user;
    var readableDate = new Date(posts.created);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const clean = DOMPurify.sanitize(posts.body, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });

    const YouTubeID = youtubeParser(posts.video);

    const postDate = dateTimeFormat.format(readableDate);
    const siteTitle = `${posts.title} | by Violet Verse`;
    const siteDescription = posts.subtitle;
    const siteImage = YouTubeID ? YouTubeID : posts.banner;
    return (
        <Box sx={{ mt: 12 }}>
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
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
                    <Box sx={{ px: { xs: "4%", sm: "0" } }}>
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
                    </Box>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item>
                        {author?.picture && loaded && (
                            <Avatar
                                alt={author?.name || "author"}
                                src={author?.picture}
                            />
                        )}
                        {!author?.picture && loaded && (
                            <Box sx={{ pt: 0.5 }}>
                                <Jazzicon
                                    diameter={40}
                                    seed={author?.uniqueId}
                                />
                            </Box>
                        )}
                    </Grid>
                    <Grid item>
                        <p style={{ color: "#693E9A" }}>By {author?.name}</p>
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
                    {user?.userId == author?.userId && (
                        <>
                            <Grid item sx={{ display: "flex" }}>
                                <Image
                                    alt="edit"
                                    src="/star.svg"
                                    height={20}
                                    width={20}
                                />
                            </Grid>
                            <Grid item>
                                <Link href={`/edit/` + posts.id}>
                                    <a>
                                        <p style={{ color: "#693E9A" }}>Edit</p>
                                    </a>
                                </Link>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Grid>
            {posts.video && (
                <Box className="player-wrapper" sx={{ my: 4 }}>
                    <ReactPlayer
                        className="react-player"
                        url={posts.video}
                        width="100%"
                        height="100%"
                        controls
                        playsinline
                    />
                </Box>
            )}
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                spacing={3}
            >
                {!posts.video && (
                    <Grid item sx={{ margin: "50px 0px" }}>
                        <Image
                            src={posts.banner}
                            alt="Violet Verse Banner"
                            width={1920}
                            height={1080}
                            objectFit={"cover"}
                            className="image"
                            placeholder="blur"
                            blurDataURL={posts.banner}
                        />
                    </Grid>
                )}
                <Grid item>
                    <Box sx={{ px: { xs: "4%", sm: "0" } }}>
                        <p
                            style={{
                                fontFamily: "Test Calibre",
                                fontStyle: "italic",
                                fontWeight: "300",
                                fontSize: "28px",
                                lineHeight: "130%",
                                letterSpacing: "-0.01em",
                                color: "#0A0510",
                                textAlign: "center",
                            }}
                        >
                            {posts.tldr}
                        </p>
                    </Box>
                </Grid>
                <Grid
                    item
                    sx={{
                        textAlign: "left",
                    }}
                >
                    <Box sx={{ px: { xs: "4%", sm: "0" } }}>
                        <section
                            className={
                                posts.largeLetter == "false"
                                    ? "postBodyNoLetter"
                                    : "postBody"
                            }
                            dangerouslySetInnerHTML={{ __html: clean }}
                        />
                    </Box>
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
