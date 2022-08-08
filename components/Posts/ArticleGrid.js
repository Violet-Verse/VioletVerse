import {
    Grid,
    ButtonGroup,
    Button,
    Box,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import youtubeParser from "../../lib/getYouTubeThumbnail";
import styles from "../../styles/ArticleGrid.module.css";
import { styled } from "@mui/material/styles";

const ArticleGrid = (props) => {
    const posts = props.posts;

    const [livePosts, setLivePosts] = useState(posts);
    const hasPosts = livePosts.length !== 0;
    const [category, setCategory] = useState("");
    const handleCategory = (event, newCategory) => {
        setCategory(newCategory);
        console.log(newCategory);
    };

    // Filter posts based on selected category
    useEffect(() => {
        if (category === null) {
            setLivePosts(posts);
        } else {
            setLivePosts(posts?.filter((x) => x.category === category));
        }
    }, [category, posts]);

    return (
        <Box sx={{ mt: props.mt, mb: props.mb, my: props.my }}>
            <Grid
                container
                justifyContent={{
                    xs: "center",
                }}
                alignItems="center"
                direction="column"
                sx={{
                    textAlign: { xs: "center" },
                }}
            >
                <Grid item sx={{ mb: { xs: 4 } }}>
                    <Grid container direction="row">
                        {/* MD Breakpoint */}
                        <Box sx={{ display: { xs: "none", md: "flex" } }}>
                            <Image
                                src="/line1.svg"
                                alt="line"
                                height={1}
                                width={100}
                            />
                            <h2 style={{ margin: "0 35px" }}>{props.title}</h2>
                            <Image
                                src="/line1.svg"
                                alt="line"
                                height={1}
                                width={100}
                            />
                        </Box>
                        {/* XS Breakpoint */}
                        <Box sx={{ display: { xs: "flex", md: "none" } }}>
                            <Image
                                src="/line1.svg"
                                alt="line"
                                height={1}
                                width={40}
                            />
                            <h2 style={{ margin: "0 15px" }}>{props.title}</h2>
                            <Image
                                src="/line1.svg"
                                alt="line"
                                height={1}
                                width={40}
                            />
                        </Box>
                    </Grid>
                </Grid>
                {!props.buttonDisabled && (
                    <Grid item>
                        <ToggleButtonGroup
                            value={category}
                            exclusive
                            onChange={handleCategory}
                            aria-label="category-selector"
                        >
                            <ToggleButton value="Tech" aria-label="tech">
                                Tech
                            </ToggleButton>
                            <ToggleButton
                                value="Lifestyle"
                                aria-label="lifestyle"
                            >
                                Lifestyle
                            </ToggleButton>
                            <ToggleButton
                                value="Education"
                                aria-label="education"
                            >
                                Education
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                )}
            </Grid>
            {hasPosts ? (
                <Grid
                    container
                    spacing={2}
                    align="center"
                    sx={{ mt: 4, px: { xs: 10, sm: 0 } }}
                    justifyContent="left"
                >
                    {livePosts?.slice(0, props.maximum).map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Link href={"/posts/" + post.id}>
                                <a>
                                    <Box className={styles.container}>
                                        <Image
                                            src={
                                                youtubeParser(post.video) &&
                                                !post.banner
                                                    ? youtubeParser(post.video)
                                                    : post.banner
                                            }
                                            alt="Placeholder Image"
                                            width={304}
                                            height={304}
                                            objectFit="cover"
                                            className={styles.image}
                                            placeholder="blur"
                                            blurDataURL={
                                                youtubeParser(post.video) &&
                                                !post.banner
                                                    ? youtubeParser(post.video)
                                                    : post.banner
                                            }
                                        />
                                        <Box className={styles.overlay}>
                                            <h4 className={styles.text}>
                                                {post.video
                                                    ? "Watch Video"
                                                    : "Read More"}
                                            </h4>
                                        </Box>
                                    </Box>

                                    <h4>
                                        {post?.hidden == "true" ? (
                                            <strike>{post.title}</strike>
                                        ) : (
                                            post.title
                                        )}
                                    </h4>
                                    <h5
                                        style={{
                                            color: "#693E9A",
                                        }}
                                    >
                                        In {post.category}
                                    </h5>
                                </a>
                            </Link>
                        </Grid>
                    ))}
                    {props.seeAll && (
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                color="primary"
                                variant="contained"
                                disableElevation
                                onClick={() => Router.push("/posts")}
                            >
                                View All
                            </Button>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <Stack justifyContent="center" sx={{ textAlign: "center" }}>
                    <h3
                        style={{
                            fontFamily: "Test Calibre",
                            fontStyle: "italic",
                            fontWeight: "300",
                            fontSize: "28px",
                            lineHeight: "130%",
                            letterSpacing: "-0.01em",
                            color: "#0A0510",
                            textAlign: "center",
                        }}
                    >
                        No posts made yet
                    </h3>
                </Stack>
            )}
        </Box>
    );
};

export default ArticleGrid;
