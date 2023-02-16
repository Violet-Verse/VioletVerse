import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TableSortLabel,
} from "@mui/material";
import Link from "next/link";

function MaterialTable(props) {
    const posts = props.posts;
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("title");

    function createData(title, author, category, draftStatus, slug) {
        return { title, author, category, draftStatus, slug };
    }

    const rows = posts.map((post) => {
        const draftStatus = post.hidden ? "Draft" : "Final";
        return createData(
            post.title,
            post.createdBy,
            post.category,
            draftStatus,
            post.slug
        );
    });

    const sortedRows = rows.sort((a, b) => {
        const isAsc = order === "asc";
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (typeof aVal === "string") {
            return isAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else {
            return isAsc ? aVal - bVal : bVal - aVal;
        }
    });

    function handleSort(event, property) {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    }

    function handleApproveClick(event, row) {
        // Add logic to approve draft here
        console.log("Approved:", row);
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "title"}
                                direction={orderBy === "title" ? order : "asc"}
                                onClick={(event) => handleSort(event, "title")}
                            >
                                Title
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "author"}
                                direction={orderBy === "author" ? order : "asc"}
                                onClick={(event) => handleSort(event, "author")}
                            >
                                Author
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "category"}
                                direction={
                                    orderBy === "category" ? order : "asc"
                                }
                                onClick={(event) =>
                                    handleSort(event, "category")
                                }
                            >
                                Category
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === "draftStatus"}
                                direction={
                                    orderBy === "draftStatus" ? order : "asc"
                                }
                                onClick={(event) =>
                                    handleSort(event, "draftStatus")
                                }
                            >
                                Draft Status
                            </TableSortLabel>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.map((row) => (
                        <TableRow key={row.title}>
                            <TableCell>
                                <Link href={"/" + row.slug}>
                                    <a>{row.title}</a>
                                </Link>
                            </TableCell>
                            <TableCell>{row.author}</TableCell>
                            <TableCell>{row.category}</TableCell>
                            <TableCell>{row.draftStatus}</TableCell>
                            <TableCell>
                                {row.draftStatus === "Draft" && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(event) =>
                                            handleApproveClick(event, row)
                                        }
                                    >
                                        Approve
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MaterialTable;
