import { Box, Button, ButtonGroup, Grid } from "@mui/material";
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
    return (
        <>
            {/* Top Section */}
            {/* Welcome to the Violet Verse */}

            <Grid
                container
                direction="column"
                spacing={6}
                sx={{
                    textAlign: {
                        xs: "center",
                    },
                }}
            >
                {/* Image Banner */}

                <Grid item>
                    <Link href="/posts">
                        <a>
                            <Image
                                width={2000}
                                height={1118}
                                src="/banners/large_banner.png"
                                alt="Default Image"
                                objectFit="cover"
                                className="image"
                                // layout="responsive"
                            />
                        </a>
                    </Link>
                </Grid>

                {/* Typography */}

                <Grid item>
                    <h1>Violet Verse at ETH Barcelona</h1>
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
                        Discover
                    </Button>
                </Grid>
            </Grid>

            {/* Curated Content Marketplace */}

            <ArticleGrid
                title="Curated Content Marketplace"
                posts={posts}
                maximum={3}
            />
        </>
    );
};

export default Home;
