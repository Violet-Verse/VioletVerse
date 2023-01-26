import { Box, Button, Grid } from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import styles from "../styles/Enterprise.module.css";

const Enterprise = () => {
    const siteTitle = `Enterprise Plan | Violet Verse`;
    const metaTitle = `Enterprise Plan`;
    const siteDescription = `The modern publishing tool for digital creators and brands`;
    const siteImage = "https://i.imgur.com/LFpaItV.png";
    return (
        <Box mb={-7}>
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
                    alignItems={"center"}
                    align={"center"}
                    justifyContent={"center"}
                    mt={10}
                >
                    <Grid item px={{ xl: 22, lg: 4, md: 0 }} mb={3}>
                        <h1 className={styles.header}>
                            Introducing the modern publishing tool for digital
                            creators and brands.
                        </h1>
                    </Grid>
                    <Grid item px={{ xl: 36, lg: 20, md: 0 }} mb={3}>
                        <p>
                            Violet Verse is a decentralized CMS software for
                            content creators, independent magazines, and
                            businesses.
                        </p>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" disableElevation>
                            Become a publisher
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box
                mt={{ sm: 20, xs: 10 }}
                sx={{
                    borderTop: 70,
                    borderBottom: 70,
                    borderColor: "#F3F0F8",
                    backgroundColor: "#F3F0F8",
                    textAlign: {
                        xs: "center",
                    },
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "10%",
                        xl: "15%",
                    },
                }}
            >
                <Grid
                    container
                    direction={"row"}
                    alignItems="center"
                    spacing={4}
                    display={{ xs: "none", lg: "flex" }}
                >
                    <Grid item xs={6}>
                        <Grid container align="left" spacing={3}>
                            <Grid item px={{ xl: 6, lg: 0 }}>
                                <h1 className={styles.header}>
                                    Keep your audience engaged with Violet Verse
                                    Enterprise.
                                </h1>
                            </Grid>
                            <Grid item px={{ xl: 38, lg: 0 }}>
                                <p>
                                    Create and customize a blockchain-based blog
                                    site for your brand or business with
                                    streamlined audience management tools.
                                </p>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" disableElevation>
                                    Learn more
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Image
                                    alt="web vector"
                                    src="/enterprise1.svg"
                                    height={330}
                                    width={484}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    alignItems="center"
                    spacing={4}
                    display={{ md: "flex", lg: "none" }}
                >
                    <Grid item>
                        <Grid item px={{ xl: 6, lg: 0 }}>
                            <h1 className={styles.header}>
                                Keep your audience engaged with Violet Verse
                                Enterprise.
                            </h1>
                        </Grid>
                        <Grid item my={5}>
                            <Image
                                alt="web vector"
                                src="/enterprise1.svg"
                                height={205}
                                width={300}
                            />
                        </Grid>
                        <Grid item px={{ xl: 38, lg: 0 }}>
                            <p>
                                Create and customize a blockchain-based blog
                                site for your brand or business with streamlined
                                audience management tools.
                            </p>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" disableElevation>
                                Learn more
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Box
                my={18}
                display={{ xs: "none", md: "flex" }}
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
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Image
                            alt="web vector"
                            src="/enterprisefeatures.svg"
                            height={538}
                            width={1050}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box
                my={18}
                display={{ xs: "flex", md: "none" }}
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
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item>
                        <Image
                            alt="web vector"
                            src="/enterprisefeatures_mobile.svg"
                            height={480}
                            width={341}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    borderTop: 70,
                    borderBottom: 70,
                    borderColor: "#F3F0F8",
                    backgroundColor: "#F3F0F8",
                    textAlign: {
                        xs: "center",
                    },
                    px: {
                        xs: "5%",
                        sm: "5%",
                        md: "10%",
                        lg: "10%",
                        xl: "15%",
                    },
                }}
            >
                <Grid
                    container
                    direction={"row"}
                    alignItems="center"
                    spacing={4}
                    display={{ xs: "none", lg: "flex" }}
                >
                    <Grid item xs={6}>
                        <Grid container align="left" spacing={3}>
                            <Grid item px={{ xl: 2, lg: 0 }}>
                                <h1 className={styles.header}>
                                    Read and collect Article NFTs in a digital
                                    wallet library.
                                </h1>
                            </Grid>
                            <Grid item px={{ xl: 27, lg: 0 }}>
                                <p>
                                    Article NFTs are displayed in a digital
                                    bookshelf within web3 wallets like Rainbow,
                                    MetaMask, and Verse Wallet that users can
                                    collect.
                                </p>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" disableElevation>
                                    Learn more
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Image
                                    alt="web vector"
                                    src="/enterprise2.svg"
                                    height={266.42}
                                    width={323}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    alignItems="center"
                    spacing={4}
                    display={{ md: "flex", lg: "none" }}
                >
                    <Grid item>
                        <Grid item px={{ xl: 6, lg: 0 }}>
                            <h1 className={styles.header}>
                                Keep your audience engaged with Violet Verse
                                Enterprise.
                            </h1>
                        </Grid>
                        <Grid item my={5}>
                            <Image
                                alt="web vector"
                                src="/enterprise2.svg"
                                height={266.42}
                                width={323}
                            />
                        </Grid>
                        <Grid item px={{ xl: 38, lg: 0 }}>
                            <p>
                                Create and customize a blockchain-based blog
                                site for your brand or business with streamlined
                                audience management tools.
                            </p>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" disableElevation>
                                Learn more
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
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
                    alignItems={"center"}
                    align={"center"}
                    justifyContent={"center"}
                    direction="column"
                    mt={20}
                >
                    <Grid item px={{ xl: 22, lg: 4, md: 0 }} mb={3}>
                        <h1 className={styles.header}>
                            Writers get paid instantly when their blogs are
                            published.
                        </h1>
                    </Grid>
                    <Grid item px={{ xl: 36, lg: 20, md: 0 }} mb={3}>
                        <p>
                            All blogs are published on-chain and encrypted with
                            the author&apos;s digital signature, certifying
                            proof-of-writer.
                        </p>
                    </Grid>
                    <Grid item mb={3}>
                        <Image
                            alt="hand holding vv coin"
                            src="/vvhand.svg"
                            height={59}
                            width={59}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" disableElevation>
                            Learn more
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box mt={20}>
                <Image
                    layout="responsive"
                    alt="half circle shape"
                    src="/enterprisebottom.svg"
                    height={220}
                    width={1440}
                />
            </Box>
        </Box>
    );
};

export default Enterprise;
