import { Box } from "@mui/material";
import Head from "next/head";

import Footer from "./Layout/Footer";
import Navbar from "./Layout/NewNav";

const Layout = ({ children }) => {
    const siteTitle = "Violet Verse | A Token-Gated Web3 Lifestyle Platform ";
    const siteDescription =
        "Violet Verse is a crypto-friendly publication combining the latest trends in tech, documenting the narratives of Web3 builders and providing educational resources to the socially-aware.";

    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <title>{siteTitle}</title>
                <meta name="og:title" content={siteTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="420" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={siteTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
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
                    marginTop: "10px",
                }}
            >
                {children}
            </Box>
            <Footer />
        </>
    );
};

export default Layout;
