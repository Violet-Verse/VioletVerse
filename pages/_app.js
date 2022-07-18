import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { UserContext } from "../components/user";
import { useUser } from "../hooks/useAuth";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const user = useUser();

    if (pageProps.protected && !user) {
        return (
            <Layout>
                <span className="loading">Loading...</span>
            </Layout>
        );
    }

    if (
        pageProps.protected &&
        user &&
        pageProps.userTypes &&
        pageProps.userTypes.indexOf(user.type) === -1
    ) {
        return (
            <Layout>
                <p>Sorry, you don&apos;t have access {user.issuer}</p>
            </Layout>
        );
    }

    return (
        <NextUIProvider>
            <UserContext.Provider value={user}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </UserContext.Provider>
        </NextUIProvider>
    );
}

export default MyApp;
