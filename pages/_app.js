import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NextUIProvider } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import { UserContext } from "../components/UserContext";
import { useUser } from "../hooks/useAuth";

import "../styles/fonts.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const user = useUser();

    const theme = createTheme({
        components: {
            MuiAppBar: {
                styleOverrides: {
                    colorPrimary: {
                        backgroundColor: "white",
                        padding: "15px 0px",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 100,
                    },
                },
            },
        },
        // shape: {
        //     borderRadius: 100,
        // },
        typography: {
            button: {
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "Test Calibre",
            },
        },
        palette: {
            primary: {
                main: "#DED1F7",
                light: "#E5DBF9",
                dark: "#B3A8C6",
                contrastText: "#43226D",
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
