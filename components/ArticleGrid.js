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
                        <h2>{props.title}</h2>
                    </Box>
                </Grid>
                <Grid item xl={3}>
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
                <Grid item>
                    <Button
                        color="secondary"
                        onClick={() => Router.push("/posts")}
                    >
                        See All
                    </Button>
                </Grid>
            </Grid>
            <Grid
                container
                spacing={2}
                align="center"
                sx={{ marginTop: "25px" }}
                justifyContent="center"
            >
                {livePosts?.slice(0, props.maximum).map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <CardActionArea sx={{ maxWidth: "370px" }}>
                            <Link href={"/posts/" + post.id}>
                                <a>
                                    <Image
                                        src={
                                            `/placeholder/` +
                                            whichCategory(post.userId) +
                                            `.jpg`
                                        }
                                        alt="Placeholder Image"
                                        width={370}
                                        height={158}
                                        className="imageSm"
                                    />
                                    <h4 style={{ textAlign: "left" }}>
                                        {post.title}
                                    </h4>
                                    <h5
                                        style={{
                                            textAlign: "left",
                                            color: "#693E9A",
                                        }}
                                    >
                                        Content Creator |{" "}
                                        {whichCategory(post.userId)}
                                    </h5>
                                    <p
                                        style={{
                                            textAlign: "left",
                                            color: "#A4B0C0",
                                            // fontWeight: "400",
                                        }}
                                    >
                                        {post.body}
                                    </p>
                                </a>
                            </Link>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ArticleGrid;
