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
                                href="https://app.console.xyz/c/violetverse"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Image
                                    src="/Discord.svg"
                                    alt="Discord icon"
                                    width={24}
                                    height={24}
                                    priority
                                />
                            </a>
                        </Stack>
                    </Box>
                    <Box>
                        <Link href="/posts">
                            <a>
                                <h3 className={styles.header}>Market</h3>
                            </a>
                        </Link>
                        <Link href="/posts?category=Tech">
                            <a>
                                <p className={styles.subheader}>
                                    See tech content
                                </p>
                            </a>
                        </Link>
                        <Link href="/posts?category=Lifestyle">
                            <a>
                                <p className={styles.subheader}>
                                    See lifestyle content
                                </p>
                            </a>
                        </Link>
                        <Link href="/posts?category=Education">
                            <a>
                                <p className={styles.subheader}>
                                    See educational content
                                </p>
                            </a>
                        </Link>
                    </Box>
                    <Box>
                        <Link href="/resources">
                            <a>
                                <h3 className={styles.header}>Resources</h3>
                            </a>
                        </Link>
                        <Link href="/resources">
                            <a>
                                <p className={styles.subheader}>
                                    Getting Started
                                </p>
                            </a>
                        </Link>
                        <Link href="/resources">
                            <a>
                                <p className={styles.subheader}>
                                    Fashion Tech Resources
                                </p>
                            </a>
                        </Link>
                        <Link href="/resources">
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
                                    Learn about VV Rewards
                                </p>
                            </a>
                        </Link>
                        <Link href="/become-a-contributor-l91YAc3Lmr">
                            <a>
                                <p className={styles.subheader}>
                                    Become a contributor
                                </p>
                            </a>
                        </Link>
                        <a
                            href="https://app.console.xyz/c/violetverse"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className={styles.subheader}>Join IRL Chat</p>
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
                            href="https://buy.stripe.com/9AQeYAapJg343tu7sy"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <p className={styles.subheader}>
                                1:1 Consultations
                            </p>
                        </a>

                        <Link href="/contact">
                            <a>
                                <p className={styles.subheader}>Contact us</p>
                            </a>
                        </Link>
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
                                href="https://app.console.xyz/c/violetverse"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Image
                                    src="/Discord.svg"
                                    alt="Discord icon"
                                    width={24}
                                    height={24}
                                    priority
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
