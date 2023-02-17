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
import dynamic from "next/dynamic"; // Dynamic import for better performance
import { getUsersByRole } from "./api/database/getUserByEmail";
import connectDatabase from "../lib/mongoClient";

// Dynamic import of ArticleGrid and MaterialTable components for better performance
const ArticleGrid = dynamic(() => import("../components/Posts/ArticleGrid"));
const MaterialTable = dynamic(() => import("../components/Posts/PostsTable"));

export async function getStaticProps(context) {
    const db = await connectDatabase();
    const collection = db.collection("posts");
    const data = await collection.find({ hidden: true }).toArray();

    const authors = await getUsersByRole("admin");
    const contributors = await getUsersByRole("contributor");

    return {
        props: {
            protected: true,
            userTypes: ["admin", "contributor"],
            posts: JSON.parse(JSON.stringify(data)),
            authors: authors,
            contributors: contributors,
        },
    };
}

function DraftsPanel({ posts, authors, contributors }) {
    console.log(posts);
    const { query } = useRouter();
    const [isExpanded, setIsExpanded] = useState(query.listView === "expanded");

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
                    <h1>Drafts Panel</h1>
                </Grid>
                <Grid item>
                    <p>Unpublished articles of the Verse.</p>
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
