import { Box, Grid } from "@mui/material";
import Image from "next/image";

const Footer = () => {
    return (
        <footer>
            <Box sx={{ py: 10 }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    spacing={20}
                >
                    <Grid item>
                        <Image
                            src="/LogoWhite.png"
                            alt="logo light"
                            height={80}
                            width={143}
                        />
                    </Grid>
                    <Grid item sx={{ textAlign: "left" }}>
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