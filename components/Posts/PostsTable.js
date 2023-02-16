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
    TextField,
    TablePagination,
} from "@mui/material";
import Link from "next/link";

function MaterialTable(props) {
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState("dateObj");
    const [searchTitle, setSearchTitle] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    function createData(title, author, category, draftStatus, slug, created) {
        const formatter = new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        const date = new Date(created);
        const formattedDate = formatter.format(date);
        return {
            title,
            author,
            category,
            draftStatus,
            slug,
            created: formattedDate,
            dateObj: date,
        };
    }

    const rows = props.posts.map((post) => {
        const draftStatus = post.hidden ? "Draft" : "Final";
        return createData(
            post.title,
            post.createdBy,
            post.category,
            draftStatus,
            post.slug,
            post.created
        );
    });

    const sortedRows = rows
        .filter(
            (row) =>
                row.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
                row.author.toLowerCase().includes(searchTitle.toLowerCase())
        )
        .sort((a, b) => {
            const isAsc = order === "asc";
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (typeof aVal === "string") {
                return isAsc
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            } else if (aVal instanceof Date) {
                // Handle date object
                return isAsc
                    ? aVal.getTime() - bVal.getTime()
                    : bVal.getTime() - aVal.getTime();
            } else {
                return isAsc ? aVal - bVal : bVal - aVal;
            }
        });

    const rowCount = sortedRows.length;

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
        <>
            <TextField
                label="Search by Title or Author"
                variant="outlined"
                margin="normal"
                fullWidth
                value={searchTitle}
                onChange={(event) => setSearchTitle(event.target.value)}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "title"}
                                    direction={
                                        orderBy === "title" ? order : "asc"
                                    }
                                    onClick={(event) =>
                                        handleSort(event, "title")
                                    }
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "author"}
                                    direction={
                                        orderBy === "author" ? order : "asc"
                                    }
                                    onClick={(event) =>
                                        handleSort(event, "author")
                                    }
                                >
                                    Author
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Date</TableCell>
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
                                        orderBy === "draftStatus"
                                            ? order
                                            : "asc"
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
                        {sortedRows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                                <TableRow key={row.slug}>
                                    <TableCell>
                                        <Link href={`/${row.slug}`}>
                                            <a>{row.title}</a>
                                        </Link>
                                    </TableCell>
                                    <TableCell>{row.author}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.draftStatus}</TableCell>
                                    <TableCell>
                                        {row.draftStatus === "Draft" ? (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(event) =>
                                                    handleApproveClick(
                                                        event,
                                                        row
                                                    )
                                                }
                                            >
                                                Approve
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[15, 25, 50]}
                    component="div"
                    count={rowCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </TableContainer>
        </>
    );
}

export default MaterialTable;
