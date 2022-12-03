import { Box, Grid } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

const Contact = () => {
    const siteTitle = `Contact Us | Violet Verse`;
    const metaTitle = `Contact Us`;
    const siteDescription = `Reach the Violet Verse team at gm@violetverse.io`;
    const siteImage = "https://i.imgur.com/LFpaItV.png";
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
                <meta property="og:image" content={siteImage} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="80" />
                <meta property="og:image:height" content="80" />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image:src" content={siteImage} />
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
                    <p>Need to get in touch with the Violet Verse team?</p>
                    <p>
                        Send us an email at{" "}
                        <a href="mailto: gm@violetverse.io">
                            gm@violetverse.io
                        </a>
                    </p>
                </Grid>
                <Grid item>
                    <Image
                        src="/vvCircleLogo.svg"
                        alt="vv logo"
                        height={80}
                        width={80}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Contact;
