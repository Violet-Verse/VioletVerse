import { CardActionArea, Grid, ButtonGroup, Button, Box } from "@mui/material";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import React, { useState } from "react";

const ArticleGrid = (props) => {
    const whichCategory = (id) => {
        if (id == 1) {
            return "Tech";
        } else if (id == 2) {
            return "Lifestyle";
        } else {
            return "Education";
        }
    };

    const posts = props.posts;

    const [livePosts, setLivePosts] = useState(posts);
    const [category, setCategory] = useState();
    const handleCategory = (newCategory) => {
        if (category == newCategory) {
            setCategory(0);
            setLivePosts(posts);
        } else {
            setCategory(newCategory);
            setLivePosts(posts?.filter((x) => x.userId === newCategory));
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
                        {/* <Image
                            src="/line1.svg"
                            alt="line"
                            height={1}
                            width={100}
                        /> */}
                        <h2>{props.title}</h2>
                        {/* <Image
                            src="/line1.svg"
                            alt="line"
                            height={1}
                            width={100}
                        /> */}
                    </Box>
                </Grid>
                <Grid item>
                    <ButtonGroup
                        color="secondary"
                        size="large"
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
            </Grid>
            <Grid
                container
                spacing={2}
                align="center"
                sx={{ marginTop: "25px", px: { xs: 10, sm: 0 } }}
                justifyContent="center"
            >
                {livePosts?.slice(0, props.maximum).map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Link href={"/posts/" + post.id}>
                            <a>
                                <Image
                                    src={
                                        `/placeholder/` +
                                        whichCategory(post.userId) +
                                        `.png`
                                    }
                                    alt="Placeholder Image"
                                    width={304}
                                    height={304}
                                    objectFit={"cover"}
                                    className="imageArticle"
                                />
                                <h4>{post.title}</h4>
                                <h5
                                    style={{
                                        color: "#693E9A",
                                    }}
                                >
                                    In {whichCategory(post.userId)}
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
