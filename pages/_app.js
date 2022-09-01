import { Grid, Box, Button } from "@mui/material";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useUser } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

// Remove after launch
import dynamic from "next/dynamic";
import Image from "next/image";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import styles from "../styles/Home.module.css";

import "../styles/fonts.css";
import "../styles/globals.css";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

NProgress.configure({
    minimum: 0.3,
    easing: "ease",
    speed: 800,
    showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
    const { user } = useUser();
    const router = useRouter();

    const vrSite = pageProps.vrSite;
    const loadingUser = pageProps.protected && !user;
    const noAccess =
        pageProps.protected &&
        user &&
        pageProps.userTypes &&
        pageProps.userTypes.indexOf(user.role) === -1;

    const [seconds, setSeconds] = useState(3);

    // For Launch

    const login = async () => {
        try {
            const res = await fcl.authenticate();

            const accountProofService = res.services.find(
                (services) => services.type === "account-proof"
            );

            const userEmail = res.services.find(
                (services) => services.type === "open-id"
            ).data.email.email;

            if (accountProofService) {
                fetch("/api/auth/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        address: accountProofService.data.address,
                        nonce: accountProofService.data.nonce,
                        signatures: accountProofService.data.signatures,
                        userEmail,
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log(result);
                        mutate("/api/database/getUser");
                        Router.push("/");
                    })
                    .catch((err) => {
                        fcl.unauthenticate();
                        console.error(err);
                    });
            }
        } catch (err) {
            // console.log(err);
        }
    };

    const launched = (checkDate) => {
        if (Date.now() > checkDate) {
            return true;
        } else {
            return false;
        }
    };

    const releaseDate = 1662069600000; // 9/1/22 at 6pm EST
    const pastDate = 1661832374000; // Date in the past

    useEffect(() => {
        if (loadingUser && !noAccess) {
            if (seconds !== 0) {
                setTimeout(() => {
                    setSeconds(seconds - 1);
                }, 1000);
            } else {
                router.push("/");
            }
        } else if (seconds !== 3) {
            setSeconds(3);
        }
    }, [loadingUser, noAccess, seconds, router]);

    // If not launched

    const spotlightPost = {
        title: "Violet Verse Launches at 6pm EST",
    };
    const siteTitle =
        "Violet Verse: A Token-Gated Web3 Lifestyle Platform | Violet Verse";
    const metaTitle = "Violet Verse: A Token-Gated Web3 Lifestyle Platform";
    const siteDescription =
        "Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.";

    if (!launched(releaseDate) || user.role !== "admin") {
        return (
            <>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <title>{siteTitle}</title>
                    <meta name="og:site_name" content="Violet Verse" />
                    <meta name="og:title" content={metaTitle} />
                    <meta name="og:description" content={siteDescription} />
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
                </Head>
                <Box sx={{ mt: -4 }}>
                    {/* Video with Text Overlay | XS to MD */}

                    <Box
                        className={styles.content}
                        sx={{ display: { xs: "none", md: "flex" } }}
                    >
                        <Grid
                            className={styles.overlay}
                            container
                            direction="column"
                            spacing={2}
                            sx={{
                                px: {
                                    xs: "0",
                                    sm: "5%",
                                    md: "10%",
                                    lg: "10%",
                                    xl: "10%",
                                },
                                mt: 12,
                                maxWidth: "1040px",
                            }}
                        >
                            <Grid item>
                                <h1 style={{ color: "white" }}>
                                    {spotlightPost.title}
                                </h1>
                            </Grid>
                        </Grid>
                    </Box>
                    <ReactPlayer
                        className={styles.video}
                        url="/video.mp4"
                        width="100%"
                        height="100%"
                        muted={true}
                        playing
                        playsinline
                        loop
                    />

                    {/* Section under video */}

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
                        {/* Top Section under video | MD or smaller */}

                        <Box
                            sx={{ display: { xs: "flex", md: "none" }, mt: 10 }}
                        >
                            <Grid
                                container
                                direction="column"
                                spacing={2}
                                sx={{
                                    textAlign: {
                                        xs: "center",
                                    },
                                }}
                            >
                                <Grid item sx={{ mt: "30px" }}>
                                    <h1>{spotlightPost.title}</h1>
                                </Grid>
                                <Grid item>
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={100}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </>
        );
    }

    // User state loading
    if (loadingUser) {
        return (
            <Layout>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <ClipLoader color="#693E9A" />
                </Grid>
            </Layout>
        );
    }

    // Access Rejected
    if (noAccess) {
        return (
            <Layout>
                <Grid
                    container
                    justifyContent="center"
                    sx={{ textAlign: "center" }}
                >
                    <Grid item>
                        <p>Sorry, you don&apos;t have access to this page.</p>
                    </Grid>
                </Grid>
            </Layout>
        );
    }

    if (vrSite) {
        return <Component {...pageProps} />;
    }

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
