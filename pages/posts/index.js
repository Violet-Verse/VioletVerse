import React, { useState } from "react";
import { Grid, ButtonGroup, Button, Box } from "@mui/material";
import { Text } from "@nextui-org/react";
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
                    <Box sx={{ marginBottom: "25px" }}>
                        <h1>Curated Content Marketplace</h1>
                    </Box>
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
            <Article posts={livePosts} maximum={100} />
        </>
    );
};

export default Posts;
