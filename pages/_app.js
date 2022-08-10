import { Grid } from "@mui/material";
import React from "react";
import Layout from "../components/Layout";
import ReactLoading from "react-loading";
import { useUser } from "../hooks/useAuth";

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

    if (pageProps.protected && !user) {
        return (
            <Layout>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <ReactLoading
                        type={"bars"}
                        color={"#03fc4e"}
                        height={100}
                        width={100}
                    />
                </Grid>
            </Layout>
        );
    }

    if (
        pageProps.protected &&
        user &&
        pageProps.userTypes &&
        pageProps.userTypes.indexOf(user.role) === -1
    ) {
        return (
            <Layout>
                <p>Sorry, you don&apos;t have access {user.issuer}</p>
            </Layout>
        );
    }

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
