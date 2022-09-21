import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useUser } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import Head from "next/head";

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
    const { user, loaded } = useUser();
    const router = useRouter();

    const vrSite = pageProps.vrSite;
    const loadingUser = pageProps.protected && !user;
    const noAccess =
        pageProps.protected &&
        user &&
        pageProps.userTypes &&
        pageProps.userTypes.indexOf(user.role) === -1;

    const [seconds, setSeconds] = useState(3);

    const siteTitle =
        "Violet Verse: A Token-Gated Web3 Lifestyle Platform | Violet Verse";
    const metaTitle = "Violet Verse: A Token-Gated Web3 Lifestyle Platform";
    const siteDescription =
        "Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.";

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

    // User state loading
    if (!loaded || loadingUser) {
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
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
