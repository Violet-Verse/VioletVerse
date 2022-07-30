import { Button, Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import ArticleGrid from "../components/ArticleGrid";
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import { server } from "../components/config";
import Head from "next/head";

export async function getServerSideProps() {
    const res = await fetch(`${server}/api/database/getAllPosts`);
    const data = await res.json();

    return {
        props: { posts: data },
    };
}

const Home = ({ posts }) => {
    return (
        <>
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
            {/* Top Section */}
            {/* Welcome to the Violet Verse */}
            <Grid
                container
                direction="column"
                spacing={2}
                sx={{
                    textAlign: {
                        xs: "center",
                    },
                    mb: 16,
                }}
            >
                {/* Image Banner */}

                <Grid item>
                    <ReactPlayer
                        url="/video.mp4"
                        width="100%"
                        height="100%"
                        muted={true}
                        playing
                        playsinline
                        loop
                    />
                </Grid>

                {/* Typography */}

                <Grid item sx={{ mt: "30px" }}>
                    <Link href="/posts">
                        <a>
                            <h1>Violet Verse at ETH Barcelona</h1>
                        </a>
                    </Link>
                </Grid>

                <Grid item>
                    <Image src="/line1.svg" alt="line" height={1} width={100} />
                </Grid>

                <Grid item>
                    <Link href="/posts/11">
                        <a>
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
                                Exclusive interviews with trailblazing pioneers
                                in the crypto space.
                            </p>
                        </a>
                    </Link>
                </Grid>

                {/* Button */}

                <Grid item>
                    <Link href="/posts/11">
                        <a>
                            <Button
                                size="large"
                                variant="contained"
                                disableElevation
                            >
                                Watch Now
                            </Button>
                        </a>
                    </Link>
                </Grid>
            </Grid>
            {/* Curated Content Marketplace */}

            <ArticleGrid
                title="Layers of The Verse"
                posts={posts}
                maximum={3}
                seeAll={true}
            />
        </>
    );
};

export default Home;
