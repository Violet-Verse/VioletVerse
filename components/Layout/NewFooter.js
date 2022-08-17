import { Box, Grid, Stack } from "@mui/material";
import Image from "next/image";
import styles from "../../styles/Footer.module.css";

const Footer = () => {
    return (
        <footer>
            <Box
                sx={{
                    textAlign: "left",
                    py: 10,
                    ml: 10,
                }}
            >
                <Stack
                    spacing={{ xs: 5, lg: 10, xl: 20 }}
                    direction={{ xs: "column", lg: "row" }}
                    justifyContent="center"
                >
                    <Box sx={{ mb: 5 }}>
                        <Image
                            src="/WhiteLogo.svg"
                            alt="logo light"
                            width={143}
                            height={80}
                        />
                    </Box>
                    <Box>
                        <h3 className={styles.header}>Market</h3>
                        <p className={styles.subheader}>See tech content</p>
                        <p className={styles.subheader}>
                            See lifestyle content
                        </p>
                        <p className={styles.subheader}>
                            See educational content
                        </p>
                    </Box>
                    <Box>
                        <h3 className={styles.header}>Resources</h3>
                        <p className={styles.subheader}>Getting Started</p>
                        <p className={styles.subheader}>Web3 Resources</p>
                        <p className={styles.subheader}>Events and Meetups</p>
                    </Box>
                    <Box>
                        <h3 className={styles.header}>Community</h3>
                        <p className={styles.subheader}>
                            Learn about VV tokens
                        </p>
                        <p className={styles.subheader}>Become a contributor</p>
                        <p className={styles.subheader}>Join the Discord</p>
                    </Box>
                    <Box>
                        <h3 className={styles.header}>About</h3>
                        <p className={styles.subheader}>Team</p>
                        <p className={styles.subheader}>Violet Summer Zine</p>
                        <p className={styles.subheader}>Contact us</p>
                    </Box>
                </Stack>
            </Box>
        </footer>
    );
};

export default Footer;
<div></div>;
