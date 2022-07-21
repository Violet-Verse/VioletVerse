import { Box, Button, ButtonGroup, Grid } from "@mui/material";
import { Text } from "@nextui-org/react";
import React, { useState } from "react";

import Article from "../../components/Article";

export const getStaticProps = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();

    return {
        props: { posts: data },
    };
};

const Posts = ({ posts }) => {
    const [livePosts, setLivePosts] = useState(posts);
    const [category, setCategory] = useState(0);
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
                        color="secondary"
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
            </Grid>
            <Article posts={livePosts} maximum={100} />
        </>
    );
};

export default Posts;
