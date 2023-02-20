import {
    Button,
    Grid,
    Box,
    Tooltip,
    Stack,
    CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
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
import ArticleGrid from "../components/Posts/ArticleGrid";
import {
    getAuthorForPost,
    getContributorForPost,
} from "./api/database/getUserForPost";

import { transferTokens } from "../cadence/scripts/transactions/purchaseContent";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import Tipping from "../components/Modal/Tipping";
import connectDatabase from "../lib/mongoClient";

export async function getServerSideProps(context) {
    const id = context.params.articlePage;

    const db = await connectDatabase();
    const collection = db.collection("posts");
    const allPosts = await collection.find({ hidden: false }).toArray();
    const data = await collection.find({ slug: id }).toArray();
    const authorData = await getAuthorForPost(id);
    const contributorData = await getContributorForPost(id);

    if (!data || data.length === 0) {
        return { notFound: true, props: { posts: {} } };
    }

    return {
        props: {
            posts: JSON.parse(JSON.stringify(data[0])),
            allPosts: JSON.parse(JSON.stringify(allPosts)),
            authorData: authorData,
            contributorData: contributorData || null,
            tokenGatePrice: data[0]?.tokenPrice || false,
        },
    };
}

const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) => {
            return { user: data?.user || null };
        });

const Article = ({
    posts,
    allPosts,
    authorData,
    tokenGatePrice,
    contributorData,
}) => {
    const { data: users, mutate } = useSWR(`/api/database/getUser`, fetcher);
    const { user, loaded } = useUser();
    const author = authorData?.user;
    const contributor = contributorData?.user;
    const postDate = dateFormatter(posts.created);
    const updateDate = dateFormatter(posts?.lastUpdated);
    const editPermission =
        loaded && (user?.userId == author?.userId || user?.role == "admin");

    // Token Gate Permissions
    const purchasedArray = user?.purchasedContent
        ? user.purchasedContent.split(",")
        : [];

    const noTokenGateAccess =
        tokenGatePrice &&
        user &&
        purchasedArray.indexOf(posts.id.toString()) === -1;

    const tokenGatedNotLoggedIn = tokenGatePrice && !user;

    const siteTitle = `${posts.title} | Violet Verse`;
    const metaTitle = `${posts.title}`;
    const siteDescription = posts.subtitle;
    const YouTubeID = youtubeParser(posts.video);
    const siteImage = YouTubeID && !posts.banner ? YouTubeID : posts.banner;

    const [txPending, setTxPending] = useState(false);
    const [txStatus, setTxStatus] = useState();
    const [tippingModal, setTippingModal] = useState(false);

    const updateUser = async () => {
        try {
            await fetch("/api/database/updatePurchasedContent", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    purchasedContent: `${
                        user.purchasedContent ? user.purchasedContent + "," : ""
                    }${posts.id}`,
                }),
            })
                .then((response) => response.json())
                .then((newData) => {
                    mutate("/api/database/getUser", {
                        ...users.user,
                        newData,
                    });
                });
        } catch (err) {
            console.log(err);
        }
    };

    const addTokenWhitelist = async () => {
        const price = Number(tokenGatePrice);
        // 90% for VV
        const vvShare = (price / 100) * 90;
        // 10% for contributor or author
        const contributorShare = (price / 100) * 10;

        try {
            setTxPending(true);
            const transactionId = await fcl.mutate({
                cadence: transferTokens,
                args: (arg, t) => [
                    arg(
                        contributor?.flowAddress || author?.flowAddress,
                        types.Address
                    ),
                    arg(vvShare.toFixed(5).toString(), types.UFix64),
                    arg(contributorShare.toFixed(5).toString(), types.UFix64),
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                authorizations: [fcl.currentUser],
                limit: 1000,
            });

            await fcl
                .tx(transactionId)
                .onceSealed()
                .then((tx) => {
                    setTxPending(false);
                    updateUser();
                })
                .catch((err) => {
                    setTxStatus({
                        message: "Error: Transaction not sent.",
                        status: "error",
                    });
                    setTxPending(false);
                });
        } catch (err) {
            setTxStatus({
                message: "Error: Transaction not sent.",
                status: "error",
            });
            setTxPending(false);
        }
    };

    if (
        (!editPermission && noTokenGateAccess) ||
        (!editPermission && tokenGatedNotLoggedIn)
    ) {
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
                    <meta
                        name="twitter:description"
                        content={siteDescription}
                    />
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
                            }}
                        >
                            This content is token gated for{" "}
                            <b>{tokenGatePrice} $VV Tokens</b>.
                        </p>
                        <Box sx={{ position: "relative" }}>
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={() => addTokenWhitelist()}
                                disabled={txPending}
                                sx={{
                                    borderRadius: "15px",
                                    backgroundColor: "#693E9A",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#815AAD",
                                    },
                                }}
                            >
                                Click here to unlock!
                            </Button>
                            {txPending && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: "green",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        marginTop: "-12px",
                                        marginLeft: "-12px",
                                    }}
                                />
                            )}
                        </Box>
                        <br />
                        {txStatus && <pre>{txStatus?.message}</pre>}
                        {txPending && <h2>Stay on this page!</h2>}
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
    }

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
                                    posts.largeLetter == false
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
                        <Button
                            onClick={() => {
                                global.analytics.track(
                                    "Tip Creator Menu Shown",
                                    {
                                        author:
                                            contributor?.name || author?.name,
                                        author_address:
                                            contributor?.flowAddress ||
                                            author?.flowAddress,
                                        post_title: posts?.title,
                                    }
                                );
                                setTippingModal(true);
                            }}
                            sx={{
                                color: "#004455",
                                backgroundColor: "#AAEEFF",
                                borderRadius: "10px",
                                "&:hover": {
                                    backgroundColor: "#8EE8FF",
                                },
                            }}
                        >
                            Tip Creator
                        </Button>
                        <Tipping
                            open={tippingModal}
                            handleClose={() => {
                                setTippingModal(false);
                                global.analytics.track(
                                    "Tip Creator Menu Hidden",
                                    {
                                        post_title: posts?.title,
                                        author:
                                            contributor?.name || author?.name,
                                        author_address:
                                            contributor?.flowAddress ||
                                            author?.flowAddress,
                                    }
                                );
                            }}
                            address={
                                contributor?.flowAddress || author?.flowAddress
                            }
                            author={contributor?.name || author?.name}
                            pageTitle={posts?.title}
                        />
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
