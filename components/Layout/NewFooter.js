import { Box, Grid, Stack } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
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
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ display: { xs: "none", lg: "flex" }, mt: 5 }}
                        >
                            <a
                                href="https://instagram.com/violetverse.io"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <InstagramIcon
                                    sx={{
                                        color: "#73839C",
                                    }}
                                />{" "}
                            </a>
                            <a
                                href="https://twitter.com/TheVioletVerse"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <TwitterIcon
                                    sx={{
                                        color: "#73839C",
                                    }}
                                />
                            </a>
                            <a
                                href="https://discord.gg/3uhQHMF8fJ"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Image
                                    src="/Discord.svg"
                                    alt="Discord icon"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </Stack>
                    </Box>
                    <Box>
                        <Link href="posts">
                            <a>
                                <h3 className={styles.header}>Market</h3>
                            </a>
                        </Link>
                        <Link href="posts">
                            <a>
                                <p className={styles.subheader}>
                                    See tech content
                                </p>
                            </a>
                        </Link>
                        <Link href="posts">
                            <a>
                                <p className={styles.subheader}>
                                    See lifestyle content
                                </p>
                            </a>
                        </Link>
                        <Link href="posts">
                            <a>
                                <p className={styles.subheader}>
                                    See educational content
                                </p>
                            </a>
                        </Link>
                    </Box>
                    <Box>
                        <Link href="resources">
                            <a>
                                <h3 className={styles.header}>Resources</h3>
                            </a>
                        </Link>
                        <Link href="resources">
                            <a>
                                <p className={styles.subheader}>
                                    Getting Started
                                </p>
                            </a>
                        </Link>
                        <Link href="resources">
                            <a>
                                <p className={styles.subheader}>
                                    Web3 Resources
                                </p>
                            </a>
                        </Link>
                        <Link href="resources">
                            <a>
                                <p className={styles.subheader}>
                                    Events and Meetups
                                </p>
                            </a>
                        </Link>
                    </Box>
                    <Box>
                        <Link href="/about">
                            <a>
                                <h3 className={styles.header}>Community</h3>
                            </a>
                        </Link>
                        <Link href="/how-to-earn-vv-tokens-PS1xU3BF4B">
                            <a>
                                <p className={styles.subheader}>
                                    Learn about VV tokens
                                </p>
                            </a>
                        </Link>
                        <a
                            href="https://discord.gg/3uhQHMF8fJ"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className={styles.subheader}>
                                Become a contributor
                            </p>
                        </a>
                        <a
                            href="https://discord.gg/3uhQHMF8fJ"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className={styles.subheader}>Join the Discord</p>
                        </a>
                    </Box>
                    <Box>
                        <Link href="/about">
                            <a>
                                <h3 className={styles.header}>About</h3>
                            </a>
                        </Link>
                        <Link href="/about">
                            <a>
                                <p className={styles.subheader}>Team</p>
                            </a>
                        </Link>
                        <a
                            href="https://store.violetverse.io/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className={styles.subheader}>
                                Violet Summer Market
                            </p>
                        </a>

                        <a
                            href="https://discord.gg/3uhQHMF8fJ"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className={styles.subheader}>Contact us</p>
                        </a>
                    </Box>
                    <Box>
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ display: { xs: "flex", lg: "none" } }}
                        >
                            <a
                                href="https://instagram.com/violetverse.io"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <InstagramIcon
                                    sx={{
                                        color: "#73839C",
                                    }}
                                />{" "}
                            </a>
                            <a
                                href="https://twitter.com/TheVioletVerse"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <TwitterIcon
                                    sx={{
                                        color: "#73839C",
                                    }}
                                />
                            </a>
                            <a
                                href="https://discord.gg/3uhQHMF8fJ"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Image
                                    src="/Discord.svg"
                                    alt="Discord icon"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </footer>
    );
};

export default Footer;
