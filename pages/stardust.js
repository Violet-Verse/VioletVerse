import { Box, Grid, Typography } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

const Stardust = () => {
    const siteTitle = `Stardust | Violet Verse`;
    const metaTitle = `Stardust`;
    const siteDescription = `Check your tokens`;

    const stardustInfo = {
        tokens: 1000,
        level: 42,
        experience: 7800,
        lastSeen: "2023-06-07T10:30:00Z",
        image: "/stardust-logo.svg",
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f2f2f2",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
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
                alignItems="center"
                spacing={5}
            >
                <Grid item>
                    <Typography
                        variant="h1"
                        component="h1"
                        align="center"
                        sx={{
                            background: `linear-gradient(45deg, #3f51b5, #f50057)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            animation: "$gradientAnimation 5s ease infinite",
                            fontSize: "4rem",
                            fontWeight: "bold",
                            "@keyframes gradientAnimation": {
                                "0%": {
                                    backgroundPosition: "0% 50%",
                                },
                                "50%": {
                                    backgroundPosition: "100% 50%",
                                },
                                "100%": {
                                    backgroundPosition: "0% 50%",
                                },
                            },
                        }}
                    >
                        My Stardust Account Info
                    </Typography>
                </Grid>
                <Grid item>
                    <Box
                        sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            padding: "30px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            width: "500px",
                            color: "#333333",
                        }}
                    >
                        <Typography variant="h6" component="p">
                            Tokens:
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            fontWeight="bold"
                        >
                            {stardustInfo.tokens}
                        </Typography>
                        <Typography variant="h6" component="p">
                            Level:
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            fontWeight="bold"
                        >
                            {stardustInfo.level}
                        </Typography>
                        <Typography variant="h6" component="p">
                            Experience:
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            fontWeight="bold"
                        >
                            {stardustInfo.experience}
                        </Typography>
                        <Typography variant="h6" component="p">
                            Last Seen:
                        </Typography>
                        <Typography
                            variant="body1"
                            component="p"
                            fontWeight="bold"
                        >
                            {new Date(stardustInfo.lastSeen).toLocaleString()}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item>
                    <Image
                        src={
                            "https://www.stardust.gg/_next/static/media/logo.94bbc2b8.svg"
                        }
                        alt="Stardust Logo"
                        width={200}
                        height={200}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Stardust;
