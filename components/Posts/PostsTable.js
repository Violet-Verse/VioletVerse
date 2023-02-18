import React, { useState } from "react";
import { useUser } from "../../hooks/useAuth";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    CircularProgress,
} from "@mui/material";
import Link from "next/link";
import Router from "next/router";

function MaterialTable(props) {
    const { user } = useUser();
    const authors = props.authors;
    const contributors = props.contributors;
    const [order, setOrder] = useState("desc");
    const dateSortType = "dateObj";
    const [orderBy, setOrderBy] = useState(dateSortType);
    const [searchTitle, setSearchTitle] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const [confirmingArticle, setConfirmingArticle] = useState();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    function handleConfirmOpen() {
        setConfirmOpen(true);
    }

    function createData(
        title,
        author,
        category,
        draftStatus,
        slug,
        created,
        _id
    ) {
        const formatter = new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
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
        const date = new Date(created);
        const formattedDate = formatter.format(date);
        return {
            title,
            author: filterAuthor(author),
            category,
            draftStatus,
            slug,
            created: formattedDate,
            _id,
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
            post.created,
            post._id
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
        handleConfirmOpen();
    }

    async function handleApproveConfirm(row) {
        setIsApproving(true);
        await fetch("/api/database/approvePost", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: row._id,
                hidden: "false",
            }),
        })
            .then(() => {
                Router.reload(window.location.pathname);
            })
            .catch((err) => {
                console.log(err);
            });
        Router.push(`/posts`);
        setIsApproving(false);
        setConfirmOpen(false);
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
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === dateSortType}
                                    direction={
                                        orderBy === dateSortType ? order : "asc"
                                    }
                                    onClick={(event) =>
                                        handleSort(event, dateSortType)
                                    }
                                >
                                    Created Date
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
                            {user?.role === "admin" && <TableCell></TableCell>}
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
                                    {user?.role === "admin" && (
                                        <TableCell>
                                            {row.draftStatus === "Draft" ? (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        onClick={(event) => {
                                                            handleApproveClick(
                                                                event,
                                                                row
                                                            );
                                                            setConfirmingArticle(
                                                                row
                                                            );
                                                        }}
                                                    >
                                                        Approve
                                                    </Button>
                                                </>
                                            ) : null}
                                        </TableCell>
                                    )}
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
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to approve this draft?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You are about to approve the draft &quot;
                            <span style={{ fontWeight: "bold" }}>
                                {confirmingArticle?.title}
                            </span>
                            &quot;. This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setConfirmOpen(false)}
                            variant="contained"
                            color="secondary"
                            disabled={isApproving}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() =>
                                handleApproveConfirm(confirmingArticle)
                            }
                            autoFocus
                            variant="contained"
                            color="primary"
                            disabled={isApproving}
                        >
                            <span style={{ position: "relative" }}>
                                {isApproving && (
                                    <CircularProgress
                                        size={24}
                                        thickness={4}
                                        color="secondary"
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            marginTop: -12,
                                            marginLeft: -12,
                                        }}
                                    />
                                )}
                                Approve
                            </span>
                        </Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
        </>
    );
}

export default MaterialTable;
