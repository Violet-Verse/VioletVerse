import { Box, Grid, Stack } from "@mui/material";
import Image from "next/image";

const Footer = () => {
    return (
        <footer>
            {/* XS Styling */}
            <Box
                sx={{
                    textAlign: "left",
                    py: 10,
                    ml: 10,
                    display: { xs: "flex", lg: "none" },
                }}
            >
                <Stack spacing={5}>
                    <Box sx={{ mb: 5 }}>
                        <Image
                            src="/WhiteLogo.svg"
                            alt="logo light"
                            height={80}
                            width={143}
                        />
                    </Box>
                    <Box>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            Market
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            See tech content
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            See lifestyle content
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            See educational content
                        </p>
                    </Box>
                    <Box>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            Resources
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Getting Started
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Web3 Resources
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Events and Meetups
                        </p>
                    </Box>
                    <Box>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            Community
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Learn about VV tokens
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Become a contributor
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Join the Discord
                        </p>
                    </Box>
                    <Box>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            About
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>Team</p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Violet Summer Zine
                        </p>
                        <p
                            style={{
                                color: "white",
                                fontSize: "16px",
                            }}
                        >
                            Contact us
                        </p>
                    </Box>
                </Stack>
            </Box>
            {/* XL Styling */}
            <Box sx={{ py: 10, display: { xs: "none", lg: "flex" } }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    spacing={{ md: 3, lg: 10, xl: 20 }}
                >
                    <Grid item>
                        <Image
                            src="/WhiteLogo.svg"
                            alt="logo light"
                            height={80}
                            width={143}
                        />
                    </Grid>
                    <Grid item sx={{ textAlign: "left" }}>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            Zine
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            See tech content
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            See lifestyle content
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            See educational content
                        </p>
                    </Grid>
                    <Grid item sx={{ textAlign: "left" }}>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            Resources
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Getting Started
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Web3 Resources
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Events and Meetups
                        </p>
                    </Grid>
                    <Grid item sx={{ textAlign: "left" }}>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            Community
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Learn about VV tokens
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Become a contributor
                        </p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Join the Discord
                        </p>
                    </Grid>
                    <Grid item sx={{ textAlign: "left" }}>
                        <h3 style={{ color: "white", fontSize: "18px" }}>
                            About
                        </h3>
                        <p style={{ color: "white", fontSize: "16px" }}>Team</p>
                        <p style={{ color: "white", fontSize: "16px" }}>
                            Violet Summer Zine
                        </p>
                        <p
                            style={{
                                color: "white",
                                fontSize: "16px",
                            }}
                        >
                            Contact us
                        </p>
                    </Grid>
                </Grid>
            </Box>
        </footer>
    );
};

export default Footer;
<div></div>;
