import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import Layout from "../components/Layout";
import { UserContext } from "../components/UserContext";
import { useUser } from "../hooks/useAuth";
import ReactLoading from "react-loading";

import "../styles/fonts.css";
import "../styles/globals.css";
import { Grid } from "@mui/material";

function MyApp({ Component, pageProps }) {
    const { user } = useUser();

    const theme = createTheme({
        components: {
            MuiAppBar: {
                styleOverrides: {
                    colorPrimary: {
                        backgroundColor: "#FAFAFA",
                        padding: "15px 0px",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 100,
                        fontSize: "18px",
                    },
                },
            },
        },
        typography: {
            button: {
                textTransform: "none",
                fontWeight: 500,
                fontFamily: "stratos",
            },
        },
        palette: {
            primary: {
                light: "#E5DBF9",
                main: "#DED1F7",
                dark: "#B3A8C6",
                contrastText: "#43226D",
            },
        },
    });

    if (pageProps.protected && !user) {
        return (
            <UserContext.Provider value={user}>
                <ThemeProvider theme={theme}>
                    <NextUIProvider>
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
                    </NextUIProvider>
                </ThemeProvider>
            </UserContext.Provider>
        );
    }

    if (
        pageProps.protected &&
        user &&
        pageProps.userTypes &&
        pageProps.userTypes.indexOf(user.role) === -1
    ) {
        return (
            <UserContext.Provider value={user}>
                <ThemeProvider theme={theme}>
                    <NextUIProvider>
                        <Layout>
                            <p>
                                Sorry, you don&apos;t have access {user.issuer}
                            </p>
                        </Layout>
                    </NextUIProvider>
                </ThemeProvider>
            </UserContext.Provider>
        );
    }

    return (
        <UserContext.Provider value={user}>
            <ThemeProvider theme={theme}>
                <NextUIProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </NextUIProvider>
            </ThemeProvider>
        </UserContext.Provider>
    );
}

export default MyApp;
