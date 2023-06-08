import {
    Box,
    Grid,
    Typography,
    styled,
    keyframes,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
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

const CardContainer = styled(Box)({
    transition: "transform 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
    },
});

const AnimatedTypography = styled(Typography)(({ theme }) => ({
    animation: `${gradientAnimation} 6s linear infinite`,
    background: "linear-gradient(45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB)",
    backgroundSize: "400% 400%",
    color: "transparent",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: theme.typography.h2.fontSize, // Adjust the value as per your preference
    cursor: "pointer",
    transition: "color 0.3s",
    "&:hover": {
        color: "#666666", // Update with your preferred dimmed hover color
    },
}));

const LeaderBoardRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: "rgba(138, 43, 226, 0.1)", // Light shade of violet for odd rows
    },
    "&:nth-of-type(even)": {
        backgroundColor: "rgba(138, 43, 226, 0.05)", // Even lighter shade of violet for even rows
    },
    "&:hover": {
        backgroundColor: "rgba(138, 43, 226, 0.2)", // Darker shade of violet on hover
    },
    transition: "background-color 0.3s",
    cursor: "pointer",
}));

const LeaderBoardCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    padding: theme.spacing(1, 2), // Increase horizontal padding
}));

const LeaderBoardHeader = styled(TableCell)(({ theme }) => ({
    backgroundColor: "rgba(138, 43, 226, 0.2)", // Light violet for header
    color: "black", // White text color for contrast
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: theme.typography.h5.fontSize,
    padding: theme.spacing(1, 2),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: "15px",
    overflow: "hidden", // Hide any overflow caused by border radius
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const LeaderBoardContainer = styled(TableContainer)(({ theme }) => ({
    maxWidth: "90%", // Makes the table take 90% of the viewport width by default
    [theme.breakpoints.up("sm")]: {
        // When the viewport is small (600px and up by default)
        maxWidth: "75%", // The table takes up 75% of the viewport width
    },
    [theme.breakpoints.up("md")]: {
        // When the viewport is medium (960px and up by default)
        maxWidth: "60%", // The table takes up 60% of the viewport width
    },
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

    // Leaderboard data
    const leaderboardData = [
        { rank: 1, name: "Violet Summer", score: 5000 },
        { rank: 2, name: "Oak", score: 4500 },
        { rank: 3, name: "Purple", score: 4000 },
        // Add more data as needed
    ];

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
                    <CardContainer
                        sx={{
                            backgroundColor: "#ffffff",
                            borderRadius: "10px",
                            padding: "30px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                            width: {
                                xs: "100%",
                                sm: "500px",
                            },
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
                    </CardContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" align="center">
                        Leaderboard
                    </Typography>
                    <StyledTableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: "100%" }}
                            aria-label="simple table"
                        >
                            <TableHead>
                                <TableRow>
                                    <LeaderBoardHeader>Rank</LeaderBoardHeader>
                                    <LeaderBoardHeader>Name</LeaderBoardHeader>
                                    <LeaderBoardHeader>Score</LeaderBoardHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboardData.map((row) => (
                                    <LeaderBoardRow key={row.name}>
                                        <LeaderBoardCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.rank}
                                        </LeaderBoardCell>
                                        <LeaderBoardCell>
                                            {row.name}
                                        </LeaderBoardCell>
                                        <LeaderBoardCell>
                                            {row.score}
                                        </LeaderBoardCell>
                                    </LeaderBoardRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
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
