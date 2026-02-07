import { Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/AppLayout";
import { useUser } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import dynamic from "next/dynamic";

import "@rainbow-me/rainbowkit/styles.css";
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

// Analytics call on page reroute
Router.events.on("routeChangeComplete", (url) => {
    if (typeof global.analytics !== 'undefined') {
        global.analytics.page(url);
    }
});

// Dynamic import of the Web3 providers to avoid SSR issues with RainbowKit/wagmi
const Web3Providers = dynamic(
    () => import("../components/Web3Providers"),
    { ssr: false }
);

function AppContent({ Component, pageProps }) {
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

    useEffect(() => {
        if (loadingUser && !noAccess) {
            if (seconds !== 0) {
                setTimeout(() => {
                    setSeconds(seconds - 1);
                }, 1000);
            } else {
                router.push("/connect");
            }
        } else if (seconds !== 3) {
            setSeconds(3);
        }
    }, [loadingUser, noAccess, seconds, router]);

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

function MyApp({ Component, pageProps }) {
    return (
        <Web3Providers>
            <AppContent Component={Component} pageProps={pageProps} />
        </Web3Providers>
    );
}

export default MyApp;
