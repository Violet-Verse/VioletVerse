import React, { useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Pagination,
} from "@mui/material";
import { getAllUsers } from "./api/database/getUser";
import { styled } from "@mui/system";
import Link from "next/link";

const UserCard = styled(Card)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
        transform: "scale(1.05)",
    },
    cursor: "pointer",
});

const UserCardDetails = styled(CardContent)({
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
});

const UserCardCover = styled(CardMedia)({
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
});

const UserName = styled(Typography)({
    fontWeight: "bold",
    marginBottom: "0.5rem",
});

export async function getServerSideProps() {
    const users = await getAllUsers();

    return {
        props: {
            users: users.map((user) => ({
                ...user,
                picture: user.picture || "/userPlaceholder.jpg",
            })),
        },
    };
}

export default function UserDisplayPage({ users }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset the current page to the first page
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const usersPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = currentPage * usersPerPage;
    const displayedUsers = filteredUsers.slice(startIndex, endIndex);

    return (
        <Box>
            <TextField
                label="Find a user"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                style={{ marginBottom: "1rem" }}
            />

            <Grid container spacing={2}>
                {displayedUsers.map((user) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={user.name}>
                        <Link href={`/user/${user.username}`} passHref>
                            <UserCard component="a">
                                <UserCardCover
                                    component="img"
                                    src={user.picture}
                                    alt={user.name}
                                />
                                <UserCardDetails>
                                    <UserName variant="h6" component="h2">
                                        {user.name}
                                    </UserName>
                                </UserCardDetails>
                            </UserCard>
                        </Link>
                    </Grid>
                ))}
            </Grid>

            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                style={{ marginTop: "1rem" }}
            />
        </Box>
    );
}