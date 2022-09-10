import { Button, Grid, Box, Tooltip, Stack } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import useSWR from "swr";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { useUser } from "../hooks/useAuth";
import youtubeParser from "../lib/getYouTubeThumbnail";
import UserAvatar from "../components/UserAvatar";
import dateFormatter from "../lib/dateFormatter";
import purifyHTML from "../lib/purifyHTML";
import { getPostsBySlug } from "./api/database/getPostsByID";
import ArticleGrid from "../components/Posts/ArticleGrid";
import { getAllPosts } from "./api/database/getAllPosts";
import { getAuthorForPost } from "./api/database/getUserForPost";
import { LikeButton } from "@lyket/react";

export async function getServerSideProps(context) {
    const id = context.params.articlePage;
    const data = await getPostsBySlug(id);
    const allPosts = await getAllPosts();
    const authorData = await getAuthorForPost(id);

    if (!data) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: {
            posts: data[0],
            allPosts: allPosts,
            authorData: authorData,
            tokenGatePrice: data[0]?.tokenPrice || false,
        },
    };
}

const Article = ({ posts, allPosts, authorData }) => {
    const { user, loaded } = useUser();
    const fetchWithId = (url, id) =>
        fetch(`${url}?id=${id}`).then((r) => r.json());
    const { data: contributorData } = useSWR(
        ["/api/database/getUserByEmail", posts.contributor],
        fetchWithId
    );

    const author = authorData?.user;
    const contributor = contributorData?.user;
    const postDate = dateFormatter(posts.created);
    const updateDate = dateFormatter(posts?.lastUpdated);
    const editPermission =
        loaded && (user?.userId == author?.userId || user?.role == "admin");

    const siteTitle = `${posts.title} | Violet Verse`;
    const metaTitle = `${posts.title}`;
    const siteDescription = posts.subtitle;
    const YouTubeID = youtubeParser(posts.video);
    const siteImage = YouTubeID && !posts.banner ? YouTubeID : posts.banner;
    return (
        <Box>
            {/* Head Tags - SEO */}

            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={metaTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
            </Head>

            {/* Main Content */}
            <Box
                sx={{
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "15%",
                        lg: "18%",
                        xl: "22%",
                    },
                }}
            >
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
                        <Image
                            src="/line1.svg"
                            alt="line"
                            height={1}
                            width={100}
                        />
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
                            {posts.tldr}
                        </p>
                    </Grid>
                </Grid>
                {contributorData && (
                    <Grid
                        container
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="center"
                        alignItems="center"
                        spacing={{ xs: 0, sm: 2 }}
                        sx={{ px: { xs: 2, sm: 0 } }}
                    >
                        <Grid item>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{
                                    display: { xs: "none", sm: "flex" },
                                }}
                            >
                                <UserAvatar user={contributor || author} />

                                <Link
                                    href={`/user/${
                                        contributor?.username ||
                                        author?.username
                                    }`}
                                >
                                    <Tooltip
                                        title={
                                            contributor
                                                ? "Community Contributor"
                                                : ""
                                        }
                                        arrow
                                        PopperProps={{
                                            modifiers: [
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, -15],
                                                    },
                                                },
                                            ],
                                        }}
                                    >
                                        <a>
                                            <p
                                                className="secondary"
                                                style={{
                                                    color: contributor
                                                        ? "gray"
                                                        : "#693E9A",
                                                }}
                                            >
                                                By{" "}
                                                {contributor?.name ||
                                                    author?.name}
                                            </p>
                                        </a>
                                    </Tooltip>
                                </Link>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    display: { xs: "flex", sm: "none" },
                                    textAlign: "center",
                                }}
                            >
                                <Tooltip
                                    title={
                                        contributor
                                            ? "Community Contributor"
                                            : ""
                                    }
                                >
                                    <Link
                                        href={`/user/${
                                            contributor?.username ||
                                            author?.username
                                        }`}
                                    >
                                        <a>
                                            <p
                                                className="secondary"
                                                style={{
                                                    fontWeight: "400",
                                                    fontSize: "18px",
                                                    color: contributor
                                                        ? "gray"
                                                        : "#693E9A",
                                                }}
                                            >
                                                BY{" "}
                                                {contributor?.name.toUpperCase() ||
                                                    author?.name.toUpperCase()}
                                            </p>
                                        </a>
                                    </Link>
                                </Tooltip>
                            </Stack>
                        </Grid>

                        <Grid
                            item
                            sx={{
                                display: { xs: "none", sm: "flex" },
                            }}
                        >
                            <Image
                                alt="star"
                                src="/star.svg"
                                height={20}
                                width={20}
                            />
                        </Grid>
                        <Grid
                            item
                            sx={{
                                display: { xs: "none", sm: "flex" },
                            }}
                        >
                            <p
                                className="secondary"
                                style={{ color: "#693E9A" }}
                            >
                                {postDate}
                            </p>
                        </Grid>
                        <Grid
                            item
                            sx={{
                                display: { xs: "flex", sm: "none" },
                            }}
                        >
                            <p
                                className="secondary"
                                style={{
                                    color: "#693E9A",
                                    marginTop: "0",
                                    fontSize: "16px",
                                }}
                            >
                                {postDate.toUpperCase()}
                            </p>
                        </Grid>
                        {editPermission && (
                            <Grid
                                item
                                sx={{
                                    display: { xs: "flex", sm: "none" },
                                }}
                            >
                                <Link href={`/edit/` + posts.id}>
                                    <a>
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            style={{
                                                color: "#693E9A",
                                                marginTop: "0",
                                                fontSize: "16px",
                                                padding: "4px 40px",
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </a>
                                </Link>
                            </Grid>
                        )}

                        {postDate !== updateDate && (
                            <>
                                <Grid
                                    item
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                    }}
                                >
                                    <Image
                                        alt="star"
                                        src="/star.svg"
                                        height={20}
                                        width={20}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                    }}
                                >
                                    <p
                                        className="secondary"
                                        style={{ color: "#693E9A" }}
                                    >
                                        Last updated {updateDate}
                                    </p>
                                </Grid>
                            </>
                        )}
                        {editPermission && (
                            <>
                                <Grid
                                    item
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                    }}
                                >
                                    <Image
                                        alt="star"
                                        src="/star.svg"
                                        height={20}
                                        width={20}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    sx={{
                                        display: { xs: "none", sm: "flex" },
                                    }}
                                >
                                    <Link href={`/edit/` + posts.id}>
                                        <a>
                                            <p
                                                className="secondary"
                                                style={{ color: "#693E9A" }}
                                            >
                                                Edit
                                            </p>
                                        </a>
                                    </Link>
                                </Grid>
                            </>
                        )}
                    </Grid>
                )}
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
                    alignItems="left"
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
                                    textAlign: "left",
                                }}
                            >
                                {posts.subtitle}
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
                                dangerouslySetInnerHTML={{
                                    __html: purifyHTML(posts.body),
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <LikeButton namespace={posts.id} id={posts.id} />
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    px: {
                        xs: "0",
                        sm: "5%",
                        md: "10%",
                        lg: "15%",
                        xl: "20%",
                    },
                }}
            >
                <ArticleGrid
                    title={posts?.category}
                    posts={allPosts}
                    maximum={3}
                    seeAll={false}
                    mt={15}
                    buttonDisabled
                    filter={posts?.category}
                    postId={posts?.id}
                />
            </Box>
            <Grid container justifyContent="center" sx={{ mt: 8 }}>
                <Grid item>
                    <Button
                        size="large"
                        variant="contained"
                        onClick={() => Router.push("/posts")}
                        disableElevation
                    >
                        See more posts
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Article;
