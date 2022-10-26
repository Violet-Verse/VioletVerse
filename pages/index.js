import { Button, Grid, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ArticleGrid from "../components/Posts/ArticleGrid";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import Head from "next/head";
import styles from "../styles/Home.module.css";
import InfoBlock from "../components/InfoBlock";
import { getAllPosts } from "./api/database/getAllPosts";

export async function getServerSideProps() {
    const data = await getAllPosts();

    return {
        props: { posts: data },
    };
}

const Home = ({ posts }) => {
    const spotlightPost = {
        title: "Devcon in Bogota: Misogyny, Danger, and Crypto Bros",
        subtitle: "A recap of Ethereum's Devcon Conference.",
        url: "/-devcon-in-bogota-misogyny-danger-and-crypto-bros--J-2HhuSD23",
    };
    return (
        <Box sx={{ mt: -4 }}>
            <Head>
                <meta
                    property="og:image"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
                <meta
                    name="twitter:image:src"
                    content="https://i.imgur.com/yhNmGo8.png"
                />
            </Head>

            {/* Video with Text Overlay | XS to MD */}
            <Link href={spotlightPost.url}>
                <a>
                    <Box
                        className={styles.content}
                        sx={{ display: { xs: "none", md: "flex" } }}
                    >
                        <Grid
                            className={styles.overlay}
                            container
                            direction="column"
                            spacing={2}
                            sx={{
                                px: {
                                    xs: "0",
                                    sm: "5%",
                                    md: "10%",
                                    lg: "10%",
                                    xl: "10%",
                                },
                                mt: 12,
                                maxWidth: "1040px",
                            }}
                        >
                            <Grid item>
                                <h1 style={{ color: "white" }}>
                                    {spotlightPost.title}
                                </h1>
                            </Grid>
                            <Grid item>
                                <p
                                    style={{
                                        fontFamily: "stratos-lights",
                                        color: "white",
                                        fontStyle: "italic",
                                        fontWeight: "200",
                                        fontSize: "28px",
                                        lineHeight: "130%",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {spotlightPost.subtitle}
                                </p>
                            </Grid>

                            <Grid item>
                                <Button
                                    size="large"
                                    variant="contained"
                                    disableElevation
                                >
                                    Watch Now
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <ReactPlayer
                        className={styles.video}
                        url="/devcon.mp4"
                        width="100%"
                        height="100%"
                        muted={true}
                        playing
                        playsinline
                        loop
                    />
                </a>
            </Link>

            {/* Section under video */}

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
                {/* Top Section under video | MD or smaller */}

                <Box sx={{ display: { xs: "flex", md: "none" }, mt: 10 }}>
                    <Link href={spotlightPost.url}>
                        <a>
                            <Grid
                                container
                                direction="column"
                                spacing={2}
                                sx={{
                                    textAlign: {
                                        xs: "center",
                                    },
                                }}
                            >
                                <Grid item sx={{ mt: "30px" }}>
                                    <h1>{spotlightPost.title}</h1>
                                </Grid>
                                <Grid item>
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={100}
                                    />
                                </Grid>
                                <Grid item>
                                    <p
                                        style={{
                                            fontFamily: "stratos-lights",
                                            fontStyle: "italic",
                                            fontWeight: "200",
                                            fontSize: "28px",
                                            lineHeight: "130%",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {spotlightPost.subtitle}
                                    </p>
                                </Grid>
                                <Grid item>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        disableElevation
                                    >
                                        Watch Now
                                    </Button>
                                </Grid>
                            </Grid>
                        </a>
                    </Link>
                </Box>

                {/* Curated Content Marketplace */}

                <ArticleGrid
                    title="Layers of the Verse"
                    posts={posts}
                    maximum={3}
                    seeAll={true}
                    mt={15}
                />

                {/* New to Web3? */}

                <InfoBlock title="New to Web3?" my={15} />
            </Box>
        </Box>
    );
};

export default Home;
