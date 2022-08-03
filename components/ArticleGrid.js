import { CardActionArea, Grid, ButtonGroup, Button, Box } from "@mui/material";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import React, { useState } from "react";
import youtubeParser from "../lib/getYouTubeThumbnail";

const ArticleGrid = (props) => {
    const posts = props.posts;

    const [livePosts, setLivePosts] = useState(posts);
    const [category, setCategory] = useState("");
    const handleCategory = (newCategory) => {
        if (category == newCategory) {
            setCategory("");
            setLivePosts(posts);
        } else {
            setCategory(newCategory);
            setLivePosts(posts?.filter((x) => x.category === newCategory));
        }
    };

    return (
        <>
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
                <Grid item>
                    <Box
                        sx={{
                            marginBottom: {
                                xs: "30px",
                            },
                            textAlign: {
                                xs: "center",
                            },
                        }}
                    >
                        <h2>{props.title}</h2>
                    </Box>
                </Grid>
                {!props.buttonDisabled && (
                    <Grid item>
                        <ButtonGroup
                            color="secondary"
                            size="large"
                            fullWidth={true}
                        >
                            <Button
                                variant={
                                    category == "Tech"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handleCategory("Tech")}
                            >
                                Tech
                            </Button>
                            <Button
                                variant={
                                    category == "Lifestyle"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handleCategory("Lifestyle")}
                            >
                                Lifestyle
                            </Button>
                            <Button
                                variant={
                                    category == "Education"
                                        ? "contained"
                                        : "outlined"
                                }
                                onClick={() => handleCategory("Education")}
                            >
                                Education
                            </Button>
                        </ButtonGroup>
                    </Grid>
                )}
            </Grid>
            <Grid
                container
                spacing={2}
                align="center"
                sx={{ marginTop: "25px", px: { xs: 10, sm: 0 } }}
                justifyContent="left"
            >
                {livePosts?.slice(0, props.maximum).map((post) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={post.id}
                        sx={{ minWidth: "200px" }}
                    >
                        <Link href={"/posts/" + post.id}>
                            <a>
                                <Image
                                    src={
                                        youtubeParser(post.video)
                                            ? youtubeParser(post.video)
                                            : post.banner
                                    }
                                    alt="Placeholder Image"
                                    width={304}
                                    height={304}
                                    objectFit={"cover"}
                                    className="imageArticle"
                                    placeholder="blur"
                                    blurDataURL={
                                        youtubeParser(post.video)
                                            ? youtubeParser(post.video)
                                            : post.banner
                                    }
                                />
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
        </>
    );
};

export default ArticleGrid;
