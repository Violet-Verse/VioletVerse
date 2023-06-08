import { Box, Grid } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

const Stardust = () => {
    const siteTitle = `Stardust | Violet Verse`;
    const metaTitle = `Stardust`;
    const siteDescription = `Check your tokens`;
    return (
        <Box
            sx={{
                px: {
                    xs: "0",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                    xl: "20%",
                },
            }}
        >
            <Head>
                <title>{siteTitle}</title>
                <meta name="og:title" content={metaTitle} />
                <meta name="og:description" content={siteDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                align="center"
                spacing={5}
            >
                <Grid item>
                    <h1>Contact Us</h1>
                </Grid>
                <Grid item>
                    <p>Your stardust account:</p>
                    <p>N/A</p>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Stardust;
