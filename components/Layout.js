import Head from "next/head";
import Navbar from "./Navigation/Navbar";
import Footer from "./Footer";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
    const siteTitle = "Violet Verse | Web3 content outlet powered by Flow";
    const siteDescription =
        "Violet Verse is a Web3 Dapp powered by Flow. The best place to get your crypto news!";

    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>{siteTitle}</title>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta
                    property="og:image"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:image:src"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
            </Head>
            <Navbar />
            <Box
                sx={{
                    padding: {
                        xs: "0px 0px",
                        sm: "0px 5%",
                        md: "0px 10%",
                        lg: "0px 15%",
                        xl: "0px 20%",
                    },
                    marginTop: "50px",
                }}
            >
                {children}
            </Box>
            <Footer />
        </div>
    );
};

export default Layout;
