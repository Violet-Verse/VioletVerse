import { Box } from "@mui/material";
import Head from "next/head";
import Footer from "./Layout/Footer";
import Navbar from "./Layout/Navbar";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../components/UserContext";
import { useUser } from "../hooks/useAuth";
import { NextUIProvider } from "@nextui-org/react";

const Layout = ({ children }) => {
    const { user } = useUser();
    const siteTitle =
        "Violet Verse: A Token-Gated Web3 Lifestyle Platform | Violet Verse";
    const siteDescription =
        "Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.";

    const theme = createTheme({
        components: {
            MuiToggleButton: {
                styleOverrides: {
                    root: { borderRadius: "15px", padding: "10px 35px" },
                },
            },
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
    return (
        <UserContext.Provider value={user}>
            <ThemeProvider theme={theme}>
                <NextUIProvider>
                    <Head>
                        <link rel="icon" href="/favicon.ico" />
                        <title>{siteTitle}</title>
                        <meta name="og:site_name" content="Violet Verse" />
                        <meta name="og:title" content={siteTitle} />
                        <meta name="og:description" content={siteDescription} />
                        <meta property="og:image:type" content="image/png" />
                        <meta property="og:image:width" content="800" />
                        <meta property="og:image:height" content="420" />
                        <meta property="og:type" content="website" />
                        <meta name="twitter:site" content="@TheVioletVerse" />
                        <meta name="twitter:title" content={siteTitle} />
                        <meta
                            name="twitter:description"
                            content={siteDescription}
                        />
                        <meta
                            name="twitter:card"
                            content="summary_large_image"
                        />
                    </Head>
                    <Box className="siteContainer">
                        <Navbar />
                        <Box
                            className="pageContainer"
                            sx={{
                                mt: 4,
                            }}
                        >
                            {children}
                        </Box>
                        <Footer />
                    </Box>
                </NextUIProvider>
            </ThemeProvider>
        </UserContext.Provider>
    );
};

export default Layout;
