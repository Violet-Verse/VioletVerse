import { Box, Button, Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";

import ArticleGrid from "../components/ArticleGrid";

export const getStaticProps = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Home = ({ posts }) => {
    const EmbedVideo = function (props) {
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: `
             <video
              poster="/banners/thumbnail.jpeg"
               loop
               muted
               autoplay
               playsinline
               width="100%"
               src="${props.src}"
               class="${props.className}"
             />,
           `,
                }}
            ></div>
        );
    };
    return (
        <>
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
                    <Link href="/posts">
                        <a>
                            <EmbedVideo className="video" src="/video.mp4" />
                        </a>
                    </Link>
                </Grid>

                {/* Typography */}

                <Grid item sx={{ mt: "30px" }}>
                    <h1>Violet Verse at ETH Barcelona</h1>
                </Grid>

                <Grid item>
                    <Image src="/line1.svg" alt="line" height={1} width={100} />
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
                        Exclusive interviews with trailblazing pioneers in the
                        crypto space.
                    </p>
                </Grid>

                {/* Button */}

                <Grid item>
                    <Button
                        size="large"
                        variant="contained"
                        disableElevation
                        onClick={() => Router.push("/posts")}
                    >
                        Watch Now
                    </Button>
                </Grid>
            </Grid>

            {/* Curated Content Marketplace */}

            <ArticleGrid
                title="Curated Content Marketplace"
                posts={posts}
                maximum={3}
                seeAll={true}
            />
        </>
    );
};

export default Home;
