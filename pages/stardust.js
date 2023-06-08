import { Box, Grid, Typography, styled, keyframes } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

const HeaderContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    margin: theme.spacing(4, 0),
}));

const Logo = styled(Image)({
    width: "50px",
    height: "50px",
});

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedTypography = styled(Typography)(({ theme }) => ({
    animation: `${gradientAnimation} 6s linear infinite`,
    background: "linear-gradient(45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB)",
    backgroundSize: "400% 400%",
    color: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: theme.typography.h2.fontSize,
}));

const Stardust = () => {
    const siteTitle = "Stardust | Violet Verse";
    const metaTitle = "Stardust";
    const siteDescription =
        "Check your tokens and level up in the Stardust game.";

    const stardustInfo = {
        tokens: 1000,
        level: 42,
        experience: 7800,
        lastSeen: "2023-06-07T10:30:00Z",
        image: "https://www.stardust.gg/_next/static/media/logo.94bbc2b8.svg",
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
                <meta name="description" content={siteDescription} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={siteDescription} />
                <meta property="og:type" content="website" />
                <meta name="twitter:site" content="@TheVioletVerse" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={siteDescription} />
            </Head>
            <HeaderContainer>
                <AnimatedTypography variant="h2" component="h1">
                    Stardust
                </AnimatedTypography>
                <Logo
                    src="/vvCircleLogo.svg"
                    alt="Violet Verse Logo"
                    width={50}
                    height={50}
                />
            </HeaderContainer>
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                alignItems="center"
                spacing={5}
            >
                <Grid item>
                    <Typography variant="h4" component="h2" align="center">
                        Welcome to Stardust x Violet Verse!
                    </Typography>
                    <Typography
                        variant="body1"
                        align="center"
                        sx={{ maxWidth: "500px" }}
                    >
                        Embark on an exciting journey in the world of Stardust.
                        Level up your skills, earn tokens, and compete with
                        other players to rise to the top of the leaderboard. Let
                        the adventure begin!
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
                        src={stardustInfo.image}
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
