import { Button, Grid, Box, Tooltip } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import useSWR from "swr";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { useUser } from "../hooks/useAuth";
import youtubeParser from "../lib/getYouTubeThumbnail";
import ProfileModal from "../components/Modal/ProfileModal";
import React, { useState } from "react";
import UserAvatar from "../components/UserAvatar";
import dateFormatter from "../lib/dateFormatter";
import purifyHTML from "../lib/purifyHTML";
import { getPostsBySlug } from "./api/database/getPostsByID";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArticleGrid from "../components/Posts/ArticleGrid";
import { getAllPosts } from "./api/database/getAllPosts";
import { getAuthorForPost } from "./api/database/getUserForPost";

export async function getServerSideProps(context) {
    const id = context.params.articlePage;
    const data = await getPostsBySlug(id);
    const allPosts = await getAllPosts();
    const authorData = await getAuthorForPost(id);

    if (!data) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: { posts: data[0], allPosts: allPosts, authorData: authorData },
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

    const [profileModalShow, setProfileModalShow] = useState(false);

    const author = authorData?.user;
    const contributor = contributorData?.user;
    const postDate = dateFormatter(posts.created);
    const updateDate = dateFormatter(posts.lastUpdated);

    const siteTitle = `${posts.title}`;
    const siteDescription = posts.subtitle;
    const YouTubeID = youtubeParser(posts.video);
    const siteImage = YouTubeID && !posts.banner ? YouTubeID : posts.banner;
    return (
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
            {/* Head Tags - SEO */}

            <Head>
                <title>`${siteTitle} | Violet Verse`</title>
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

            {/* Modals */}

            <ProfileModal
                open={profileModalShow}
                onClose={() => setProfileModalShow(false)}
                data={contributor || author}
            />

            {/* Main Content */}

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
                {contributorData && (
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item>
                            <UserAvatar user={contributor || author} />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                title={
                                    contributor ? "Community Contributor" : ""
                                }
                            >
                                <a>
                                    <p
                                        className="secondary"
                                        onClick={() =>
                                            setProfileModalShow(true)
                                        }
                                        style={{
                                            color: contributor
                                                ? "gray"
                                                : "#693E9A",
                                        }}
                                    >
                                        By {contributor?.name || author?.name}
                                    </p>
                                </a>
                            </Tooltip>
                        </Grid>
                        <Grid item sx={{ display: "flex" }}>
                            <Image
                                alt="star"
                                src="/star.svg"
                                height={20}
                                width={20}
                            />
                        </Grid>
                        <Grid item>
                            <p
                                className="secondary"
                                style={{ color: "#693E9A" }}
                            >
                                {postDate}
                            </p>
                        </Grid>
                        <Grid item sx={{ display: "flex" }}>
                            <Image
                                alt="star"
                                src="/star.svg"
                                height={20}
                                width={20}
                            />
                        </Grid>
                        <Grid item>
                            <p
                                className="secondary"
                                style={{ color: "#693E9A" }}
                            >
                                Last updated {updateDate}
                            </p>
                        </Grid>
                        {user?.userId == author?.userId && (
                            <>
                                <Grid item sx={{ display: "flex" }}>
                                    <Image
                                        alt="star"
                                        src="/star.svg"
                                        height={20}
                                        width={20}
                                    />
                                </Grid>
                                <Grid item>
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
                            dangerouslySetInnerHTML={{
                                __html: purifyHTML(posts.body),
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
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
