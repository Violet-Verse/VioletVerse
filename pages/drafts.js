import React, { useState } from "react";
import {
    Button,
    Grid,
    Box,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import TableRowsIcon from "@mui/icons-material/TableRows";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import ArticleGrid from "../components/Posts/ArticleGrid";
import MaterialTable from "../components/Posts/PostsTable";
import { getAllDraftPosts } from "./api/database/getAllPosts";
import { getUsersByRole } from "./api/database/getUserByEmail";

export async function getStaticProps(context) {
    const data = await getAllDraftPosts();
    const authors = await getUsersByRole("admin");
    const contributors = await getUsersByRole("contributor");

    return {
        props: {
            protected: true,
            userTypes: ["admin", "contributor"],
            posts: data,
            authors: authors,
            contributors: contributors,
        },
    };
}

function DraftsPanel({ posts, authors, contributors }) {
    const { query } = useRouter();
    const [isExpanded, setIsExpanded] = useState(
        query.listView === "expanded" ? true : false
    );

    const handleToggleButtonChange = (event, newValue) => {
        setIsExpanded(newValue === "expanded");
        Router.push(
            {
                pathname: "/drafts",
                ...(newValue === "expanded" && {
                    query: { listView: newValue },
                }),
            },
            undefined,
            { shallow: true }
        );
    };

    return (
        <Box
            sx={{ px: { xs: "0", sm: "5%", md: "10%", lg: "15%", xl: "20%" } }}
        >
            <Grid
                container
                direction="column"
                alignContent="center"
                justifyContent="center"
                align="center"
                spacing={4}
            >
                <Grid item>
                    <h2>Review and Approve Unpublished Posts</h2>
                </Grid>
                <Grid item>
                    <p>
                        The Drafts page displays all posts that are currently in
                        the draft stage, giving editors the ability to review
                        and approve finished articles for publication on the
                        homepage. This page is where editors can easily manage
                        the content that is being developed and ensure that only
                        high-quality articles are published to the public.
                    </p>
                </Grid>
                <Grid item>
                    <Link href="/dashboard">
                        <a>
                            <Button
                                color="secondary"
                                variant="contained"
                                disableElevation
                                sx={{ px: 5, py: 1 }}
                            >
                                Back to Dashboard
                            </Button>
                        </a>
                    </Link>
                </Grid>
            </Grid>

            <Box sx={{ mt: 10 }}>
                <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
                    <Grid item>
                        <ToggleButtonGroup
                            value={isExpanded ? "expanded" : "compressed"}
                            exclusive
                            onChange={handleToggleButtonChange}
                            aria-label="list expansion toggle"
                        >
                            <ToggleButton
                                value="compressed"
                                aria-label="compressed list"
                            >
                                <TableRowsIcon />
                            </ToggleButton>
                            <ToggleButton
                                value="expanded"
                                aria-label="expanded list"
                            >
                                <SplitscreenIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                {isExpanded && (
                    <ArticleGrid
                        disableTitle
                        posts={posts}
                        buttonDisabled
                        authors={authors}
                        contributors={contributors}
                    />
                )}
                {!isExpanded && (
                    <MaterialTable
                        posts={posts}
                        authors={authors}
                        contributors={contributors}
                    />
                )}
            </Box>
        </Box>
    );
}

export default function Dashboard(props) {
    return <DraftsPanel {...props} />;
}
