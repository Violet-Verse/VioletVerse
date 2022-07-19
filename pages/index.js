import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { Grid, Button, ButtonGroup, Box } from "@mui/material";
import { Text } from "@nextui-org/react";
import Article from "../components/Article";
import Router from "next/router";

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
        <Box
            sx={{
                padding: { xs: "0px 50px", lg: "0px 100px", xl: "0px 200px" },
            }}
        >
            {/* First Section */}
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
                    md={12}
                    lg={4}
                    sx={{
                        textAlign: { xs: "center", md: "center", lg: "left" },
                    }}
                >
                    <h1 style={{ whiteSpace: "pre-wrap" }}>
                        {"Welcome to the \n Violet Verse"}
                    </h1>
                    <p>Welcome to the Violet Verse</p>
                    <Grid
                        container
                        direction="row"
                        spacing={2}
                        justifyContent={{
                            xs: "center",
                            md: "center",
                            lg: "flex-start",
                        }}
                    >
                        <Grid item>
                            <Button
                                sx={{
                                    marginTop: {
                                        xs: "20px",
                                        md: "20px",
                                        lg: "60px",
                                    },
                                }}
                                size="large"
                                variant="contained"
                                onClick={() => Router.push("/posts")}
                            >
                                Discover
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12} lg={8} align="center">
                    <Image
                        width={1920}
                        height={1080}
                        src="/Photography_Banner.png"
                        alt="Default Image"
                        // layout="responsive"
                    />
                </Grid>
            </Grid>
            {/* Second Section */}
            <Grid
                container
                justifyContent={{
                    xs: "center",
                    md: "center",
                    lg: "space-between",
                }}
                alignItems="center"
                sx={{
                    marginTop: {
                        xs: "75px",
                        md: "75px",
                        lg: "100px",
                    },
                    textAlign: { xs: "center", md: "center", lg: "left" },
                }}
            >
                <Grid item md={12} lg={6}>
                    <h1>Curated Content Marketplace</h1>
                </Grid>
                <Grid item md={6} lg={4}>
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
        </Box>
    );
};

export default Home;
