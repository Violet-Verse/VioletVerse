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
import { useRouter } from "next/router";
import youtubeParser from "../../lib/getYouTubeThumbnail";
import styles from "../../styles/ArticleGrid.module.css";

const ArticleGrid = (props) => {
    const posts = props.posts;
    const authors = props.authors;
    const contributors = props.contributors;

    const { query } = useRouter();
    const [livePosts, setLivePosts] = useState(
        posts.sort((a, b) => (a.id < b.id ? 1 : -1))
    );
    const hasPosts = livePosts.length !== 0;
    const [category, setCategory] = useState(props?.filter || null);
    const handleCategory = (event, newCategory) => {
        setCategory(newCategory);
    };

    console.log(contributors);

    const filterAuthor = (userId, contributor) => {
        if (contributor) {
            return (
                contributors.filter((x) => x.email === contributor)[0]?.name ||
                "Contributor"
            );
        } else {
            return (
                authors.filter((x) => x.userId === userId)[0]?.name ||
                contributors.filter((x) => x.userId === userId)[0]?.name
            );
        }
    };

    useEffect(() => {
        if (query.category) {
            setCategory(query.category);
        }
    }, [query.category]);

    // Filter posts based on selected category
    useEffect(() => {
        if (category === null) {
            setLivePosts(posts);
        } else if (props?.postId) {
            setLivePosts(
                posts
                    ?.filter((x) => x.category === category)
                    .filter((x) => x.id !== props?.postId)
            );
        } else {
            setLivePosts(posts?.filter((x) => x.category === category));
        }
    }, [category, posts, props.postId]);

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
                    {/* props.filter is when ArticleGrid is shown on individual article pages */}

                    {!props.filter ? (
                        <Grid container direction="row">
                            {/* MD Breakpoint */}
                            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                                <Image
                                    src="/line1.svg"
                                    alt="line"
                                    height={1}
                                    width={100}
                                />
                                <h2 style={{ margin: "0 35px" }}>
                                    {props.title}
                                </h2>
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
                                <h2 style={{ margin: "0 15px" }}>
                                    {props.title}
                                </h2>
                                <Image
                                    src="/line1.svg"
                                    alt="line"
                                    height={1}
                                    width={40}
                                />
                            </Box>
                        </Grid>
                    ) : (
                        <>
                            <Grid container direction="row">
                                {/* MD Breakpoint */}
                                <Box
                                    sx={{ display: { xs: "none", md: "flex" } }}
                                >
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={100}
                                    />
                                    <p
                                        style={{
                                            margin: "0 35px",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            fontFamily: "stratos",
                                        }}
                                    >
                                        More From
                                    </p>
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={100}
                                    />
                                </Box>
                                {/* XS Breakpoint */}
                                <Box
                                    sx={{ display: { xs: "flex", md: "none" } }}
                                >
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={60}
                                    />
                                    <p
                                        style={{
                                            margin: "0 15px",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            fontFamily: "stratos",
                                        }}
                                    >
                                        More From
                                    </p>
                                    <Image
                                        src="/line1.svg"
                                        alt="line"
                                        height={1}
                                        width={60}
                                    />
                                </Box>
                            </Grid>
                            <Box sx={{ mt: 2 }}>
                                <h2>{props.title}</h2>
                            </Box>
                        </>
                    )}
                </Grid>
                {!props.buttonDisabled && (
                    <Grid item>
                        <ToggleButtonGroup
                            value={category}
                            exclusive
                            onChange={(event, newCategory) => {
                                global.analytics.track(
                                    "Article Category Sorted",
                                    {
                                        previous_category: category || "None",
                                        category_selected:
                                            newCategory || "None",
                                    }
                                );
                                handleCategory(event, newCategory);
                            }}
                            aria-label="category-selector"
                            size="large"
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
                    sx={{ mt: props.filter ? 0 : 4, px: { xs: 6, sm: 0 } }}
                    justifyContent="left"
                >
                    {livePosts?.slice(0, props.maximum).map((post) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={Number(post.id)}
                            style={{
                                display: "flex",
                            }}
                        >
                            <Link href={"/" + post.slug}>
                                <a
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box className={styles.container}>
                                        <Image
                                            src={
                                                youtubeParser(post.video) &&
                                                !post.banner
                                                    ? youtubeParser(post.video)
                                                    : post.banner
                                            }
                                            alt="Placeholder Image"
                                            style={{ borderRadius: "6px" }}
                                            width={450}
                                            height={300}
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
                                        {filterAuthor(
                                            post.createdBy,
                                            post?.contributor
                                        )}
                                    </h4>

                                    <h4
                                        style={{
                                            marginTop: "20px",
                                            fontFamily: "Ogg",
                                            fontWeight: "500",
                                            fontSize: "22px",
                                            lineHeight: "130%",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {post?.hidden == "true" ? (
                                            <span
                                                style={{
                                                    color: "purple",
                                                }}
                                            >{`[Draft] ${post.title}`}</span>
                                        ) : (
                                            `${
                                                post.title.substring(0, 72) +
                                                (post.title.length > 72
                                                    ? "..."
                                                    : "")
                                            }`
                                        )}
                                    </h4>
                                    <h5
                                        style={{
                                            marginTop: "20px",
                                            fontFamily: "Stratos",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            lineHeight: "130%",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        in {post.category}
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
                                onClick={() => {
                                    Router.push("/posts");
                                    global.analytics.track(
                                        "View All Articles Clicked"
                                    );
                                }}
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
                        {props.filter
                            ? `No other posts in ${category}`
                            : "No posts made yet"}
                    </h3>
                </Stack>
            )}
        </Box>
    );
};

export default ArticleGrid;
