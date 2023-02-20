import {
    Grid,
    Button,
    Box,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    Pagination,
} from "@mui/material";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import youtubeParser from "../../lib/getYouTubeThumbnail";
import styles from "../../styles/ArticleGrid.module.css";
import { setRevalidateHeaders } from "next/dist/server/send-payload";

const ArticleGrid = (props) => {
    const { query } = useRouter();
    const posts = props.posts.sort((a, b) => (a.id < b.id ? 1 : -1));
    const [livePosts, setLivePosts] = useState(posts);
    const { maximum } = props;
    const hasPosts = livePosts.length !== 0;

    const [category, setCategory] = useState(props?.filter);
    const [draftsOnly, setDraftsOnly] = useState("all");
    const [searchValue, setSearchValue] = useState("");

    const authors = props.authors;
    const contributors = props.contributors;

    const [page, setPage] = useState(1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(livePosts.length / itemsPerPage);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const visiblePosts = maximum
        ? livePosts.slice(0, maximum)
        : livePosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Filtering uses from page query (Footer links)
    useEffect(() => {
        if (query.category) {
            setLivePosts(
                posts.filter((post) => post.category === query.category)
            );
        }
    }, [posts, query.category]);

    // Filtering used on article pages (More from category)
    useEffect(() => {
        if (props.filter) {
            setLivePosts(
                posts
                    .filter((post) => post.category === props.filter)
                    .filter((post) => post.id !== props.postId)
            );
        }
    }, [posts, props.filter, props.postId]);

    // Event handler for search bar
    const handleSearchChange = (event) => {
        if (page !== 1) {
            setPage(1);
        }
        setSearchValue(event.target.value);
        setCategory();
        setLivePosts(
            posts.filter((post) =>
                post.title
                    .toLowerCase()
                    .includes(event.target.value.toLowerCase())
            )
        );
    };

    // Event handler for category toggle button group
    const handleCategory = (event, newCategory) => {
        if (page !== 1) {
            setPage(1);
        }
        setCategory(newCategory);

        if (newCategory === null) {
            setLivePosts(posts);
        } else {
            setLivePosts(
                posts?.filter((post) => post.category === newCategory)
            );
        }
    };

    // Event handler for drafts toggle button group
    const handleDrafts = (event, newSelection) => {
        if (newSelection === true || newSelection === false) {
            setDraftsOnly(newSelection);
            setLivePosts(posts?.filter((post) => post.hidden === newSelection));
        } else if (newSelection === "all") {
            setDraftsOnly(newSelection);
            setLivePosts(posts);
        }
    };

    // Function for finding author data from a post
    const filterAuthor = (userId, contributor) => {
        if (contributor) {
            return (
                contributors.filter(
                    (contributor) => contributor.email === contributor
                )[0]?.name || "Contributor"
            );
        } else {
            return (
                authors.filter(
                    (contributor) => contributor.userId === userId
                )[0]?.name ||
                contributors.filter(
                    (contributor) => contributor.userId === userId
                )[0]?.name
            );
        }
    };

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
                {!props.disableTitle && (
                    <Grid item sx={{ mb: { xs: 4 } }}>
                        {/* props.filter is when ArticleGrid is shown on individual article pages */}

                        {!props.filter ? (
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
                                <Box
                                    sx={{ display: { xs: "flex", md: "none" } }}
                                >
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
                                        sx={{
                                            display: { xs: "none", md: "flex" },
                                        }}
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
                                        sx={{
                                            display: { xs: "flex", md: "none" },
                                        }}
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
                )}
                {props.marketPage && (
                    <Grid container sx={{ mb: 4, px: 8 }}>
                        <TextField
                            id="outlined-search"
                            label="Search the Verse"
                            type="search"
                            value={searchValue}
                            onChange={handleSearchChange}
                            fullWidth
                        />
                    </Grid>
                )}
                {!props.buttonDisabled && (
                    <Grid item>
                        <ToggleButtonGroup
                            value={category}
                            exclusive
                            disabled={searchValue ? true : false}
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
                {props.dashboardPage && (
                    <Grid item>
                        <ToggleButtonGroup
                            value={draftsOnly}
                            exclusive
                            onChange={(event, newSelection) => {
                                handleDrafts(event, newSelection);
                            }}
                            aria-label="draft-selector"
                            size="large"
                        >
                            <ToggleButton value="all" aria-label="all">
                                All Posts
                            </ToggleButton>
                            <ToggleButton value={false} aria-label="published">
                                Published
                            </ToggleButton>
                            <ToggleButton value={true} aria-label="drafts">
                                Drafts
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
                    sx={{
                        mt: props.filter || props.disableTitle ? 0 : 4,
                        px: { xs: 6, sm: 0 },
                    }}
                    justifyContent="left"
                >
                    <Grid container spacing={4}>
                        {visiblePosts.map((post) => (
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
                                                        ? youtubeParser(
                                                              post.video
                                                          )
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
                                                        ? youtubeParser(
                                                              post.video
                                                          )
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

                                        {authors && (
                                            <h6 style={{ marginTop: "10px" }}>
                                                {filterAuthor(
                                                    post.createdBy,
                                                    post?.contributor
                                                )}
                                            </h6>
                                        )}

                                        <h3 style={{ marginTop: "21px" }}>
                                            {post?.hidden == true ? (
                                                <span
                                                    style={{
                                                        color: "purple",
                                                    }}
                                                >{`[Draft] ${post.title}`}</span>
                                            ) : (
                                                `${
                                                    post.title.substring(
                                                        0,
                                                        72
                                                    ) +
                                                    (post.title.length > 72
                                                        ? "..."
                                                        : "")
                                                }`
                                            )}
                                        </h3>
                                        <h6
                                            style={{
                                                marginTop: "21px",
                                                marginBottom: "20px",
                                                color: "#43226D",
                                            }}
                                        >
                                            in {post.category}
                                        </h6>
                                    </a>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                    {!maximum && totalPages > 1 && (
                        <Grid container justifyContent="center">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handleChange}
                            />
                        </Grid>
                    )}
                    {props.seeAll && (
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button
                                color="primary"
                                sx={{ fontSize: "16px", padding: "12px 28px" }}
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
