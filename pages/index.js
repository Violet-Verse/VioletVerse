import { Box, Button, ButtonGroup, Grid } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";

import Article from "../components/Article";

export const getStaticProps = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Home = ({ posts }) => {
    const [livePosts, setLivePosts] = useState(posts);
    const [category, setCategory] = useState();
    const handleCategory = (newCategory) => {
        if (category == newCategory) {
            setCategory(0);
            setLivePosts(posts);
        } else {
            setCategory(newCategory);
            setLivePosts(posts.filter((x) => x.userId === newCategory));
        }
    };
    return (
        <>
            {/* First Section */}
            {/* Welcome to the Violet Verse */}

            <Grid
                container
                direction="row"
                spacing={6}
                justifyContent={{
                    xs: "center",
                    md: "center",
                    lg: "space-between",
                }}
                alignItems="center"
            >
                <Grid
                    item
                    lg={12}
                    xl={4}
                    sx={{
                        textAlign: {
                            xs: "center",
                            md: "center",
                            lg: "center",
                            xl: "left",
                        },
                    }}
                >
                    <h1 style={{ whiteSpace: "pre-wrap" }}>
                        {"Welcome to the \nViolet Verse"}
                    </h1>
                    <p>Welcome to the Violet Verse</p>
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                        justifyContent={{
                            xs: "center",
                            md: "center",
                            lg: "center",
                            xl: "flex-start",
                        }}
                    >
                        <Grid item>
                            <Button
                                sx={{
                                    marginTop: {
                                        xs: "20px",
                                        lg: "20px",
                                        xl: "60px",
                                    },
                                }}
                                size="large"
                                variant="contained"
                                disableElevation
                                onClick={() => Router.push("/posts")}
                            >
                                Discover
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12} lg={12} xl={8} align="center">
                    <Link href="/posts">
                        <a>
                            <Image
                                width={1920}
                                height={1080}
                                src="/banners/Photography_1.png"
                                alt="Default Image"
                                className="image"
                                // layout="responsive"
                            />
                        </a>
                    </Link>
                </Grid>
            </Grid>

            {/* Second Section */}
            {/* Curated Content Marketplace */}

            <Grid
                container
                justifyContent={{
                    xs: "center",
                    lg: "center",
                    xl: "space-between",
                }}
                alignItems="center"
                direction="row"
                sx={{
                    marginTop: {
                        xs: "75px",
                        md: "75px",
                        lg: "100px",
                    },
                    textAlign: { xs: "center", md: "center", lg: "left" },
                }}
            >
                <Grid item xs={12} lg={12} xl={7}>
                    <Box
                        sx={{
                            marginBottom: {
                                xs: "30px",
                                lg: "30px",
                                xl: "0px",
                            },
                            textAlign: {
                                xs: "center",
                                lg: "center",
                                xl: "left",
                            },
                        }}
                    >
                        <h1>Curated Content Marketplace</h1>
                    </Box>
                </Grid>
                <Grid item xl={3}>
                    <ButtonGroup
                        aria-label="outlined primary button group"
                        size="medium"
                        fullWidth={true}
                    >
                        <Button
                            variant={category == 1 ? "contained" : "outlined"}
                            onClick={() => handleCategory(1)}
                        >
                            Tech
                        </Button>
                        <Button
                            variant={category == 2 ? "contained" : "outlined"}
                            onClick={() => handleCategory(2)}
                        >
                            Lifestyle
                        </Button>
                        <Button
                            variant={category == 3 ? "contained" : "outlined"}
                            onClick={() => handleCategory(3)}
                        >
                            Education
                        </Button>
                    </ButtonGroup>
                </Grid>
                <Grid item>
                    <Button onClick={() => Router.push("/posts")}>
                        See All
                    </Button>
                </Grid>
            </Grid>
            <Article posts={livePosts} maximum={3} />
        </>
    );
};

export default Home;
