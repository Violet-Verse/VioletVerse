import { Box, Grid } from "@mui/material";
import Image from "next/image";

const Contact = () => {
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
