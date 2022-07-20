import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import { UserContext } from "../components/UserContext";
import { useUser } from "../hooks/useAuth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../styles/globals.css";
import "../styles/fonts.css";

function MyApp({ Component, pageProps }) {
    const user = useUser();

    const theme = createTheme({
        shape: {
            borderRadius: 10,
        },
        typography: {
            button: {
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Test Calibre",
            },
        },
        palette: {
            type: "light",
            primary: {
                main: "#693E9A",
                light: "#53317A",
                dark: "#53317A",
            },
            secondary: {
                main: "#f50057",
            },
        },
    });

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
                <ThemeProvider theme={theme}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ThemeProvider>
            </UserContext.Provider>
        </NextUIProvider>
    );
}

export default MyApp;
