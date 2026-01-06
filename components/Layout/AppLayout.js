import { Box } from "@mui/material";
import Head from "next/head";
import Footer from "./NewFooter";
import Navbar from "./Navbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../Context/UserContext";
import { useUser } from "../../hooks/useAuth";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "@lyket/react";
import { Analytics } from "@vercel/analytics/react";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamically import FlowWrapper with no SSR
const FlowWrapper = dynamic(
    () => import('../Context/flowContext').then(mod => mod.FlowWrapper),
    { ssr: false }
);

const Layout = ({ children }) => {
    const { user } = useUser();
    const router = useRouter();
    const isEnterprise = router.asPath.includes("enterprise");
    const color = isEnterprise ? "siteContainerBlack" : "white";
    const siteTitle = "Violet Verse: A Web3 Lifestyle Platform | Violet Verse";
    const metaTitle = "Violet Verse: A Web3 Lifestyle Platform";
    const siteDescription =
        "Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.";
    const shortDescription =
        "The latest trends in tech, digital lifestyle, web3 news, blockchain coverage, and crypto events on VioletVerse.io";

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

    function addJsonLd() {
        return {
            __html: `{
                "@context":"https://schema.org",
                "@type":"Organization",
                "url":"https://violetverse.io",
                "logo":"https://violetverse.io/logo.png",
                "name":"Violet Verse",
                "foundingDate":"2022-09-01",
                "foundingLocation":{
                   "@type":"Place",
                   "name":"Miami, FL"
                },
                "description":"Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.",
                "keywords":"Education, Web3, Technology, Lifestyle",
                "sameAs":[
                   "https://twitter.com/TheVioletVerse",
                   "https://www.instagram.com/violetverse.io/",
                   "https://www.linkedin.com/company/violet-verse/"
                ]
             }
      `,
        };
    }

    return (
        <UserContext.Provider value={user}>
            <Provider apiKey={process.env.NEXT_PUBLIC_LYKET_API}>
                <FlowWrapper>
                    <ThemeProvider theme={theme}>
                        <NextUIProvider>
                            <Head>
                                <link rel="icon" href="/favicon.ico" />
                                <link
                                    rel="apple-touch-icon"
                                    sizes="180x180"
                                    href="/apple-touch-icon.png"
                                />
                                <link
                                    rel="icon"
                                    type="image/png"
                                    sizes="32x32"
                                    href="/favicon-32x32.png"
                                />
                                <link
                                    rel="icon"
                                    type="image/png"
                                    sizes="16x16"
                                    href="/favicon-16x16.png"
                                />
                                <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={addJsonLd()}
                                    key="product-jsonld"
                                />
                                <title>{siteTitle}</title>
                                <meta
                                    name="description"
                                    content={shortDescription}
                                />
                                <meta
                                    name="og:site_name"
                                    content="Violet Verse"
                                />
                                <meta name="og:title" content={metaTitle} />
                                <meta
                                    name="og:description"
                                    content={siteDescription}
                                />
                                <meta
                                    property="og:image:type"
                                    content="image/png"
                                />
                                <meta property="og:image:width" content="800" />
                                <meta
                                    property="og:image:height"
                                    content="420"
                                />
                                <meta property="og:type" content="website" />
                                <meta
                                    name="twitter:site"
                                    content="@TheVioletVerse"
                                />
                                <meta
                                    name="twitter:title"
                                    content={metaTitle}
                                />
                                <meta
                                    name="twitter:description"
                                    content={siteDescription}
                                />
                                <meta
                                    name="twitter:card"
                                    content="summary_large_image"
                                />
                            </Head>
                            <Box className={`${color}`}>
                                <Navbar />
                                <Box
                                    className="pageContainer"
                                    sx={{
                                        mt: 4,
                                    }}
                                >
                                    {children}
                                    <Analytics />
                                </Box>
                                <Footer />
                            </Box>
                        </NextUIProvider>
                    </ThemeProvider>
                </FlowWrapper>
            </Provider>
        </UserContext.Provider>
    );
};

export default Layout;