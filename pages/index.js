import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { Grid, Button, ButtonGroup, CardActionArea } from "@mui/material";
import { Text } from "@nextui-org/react";
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
        <div>
            {/* First Section */}
            <Grid
                container
                direction="row"
                spacing={6}
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid item md={12} lg={6} align="center">
                    <Image
                        width={763}
                        height={338}
                        src="/Squared.png"
                        alt="Default Image"
                    />
                </Grid>
                <Grid item xs={6}>
                    <Text h1 size={43} color="#f293854" weight="bold">
                        Welcome to the Violet Verse
                    </Text>
                    <p className={styles.text}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Strong, sweet, cup americano spoon blue
                        mountain black robusta breve. Skinny variety to go white
                        rich, redeye crema breve whipped. Strong, sweet, cup
                        americano spoon blue mountain black robusta breve.
                        Skinny variety to go white rich, redeye crema breve
                        whipped.
                    </p>
                    <Grid container direction="row" spacing={2}>
                        <Grid item>
                            <Link href="/">
                                <Button variant="contained">Read More</Button>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/about">
                                <Button variant="outlined" color="secondary">
                                    Our Community
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/* Second Section */}
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                marginTop="100px"
            >
                <Grid item md={12} lg={6}>
                    <Text h1 size={43} color="#f293854" weight="bold">
                        Curated Content Marketplace
                    </Text>
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
                    <Link href="/posts">
                        <a>
                            <Button>[+] See All</Button>
                        </a>
                    </Link>
                </Grid>
            </Grid>
            <Article posts={livePosts} maximum={3} />
        </div>
    );
};

export default Home;
