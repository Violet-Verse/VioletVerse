import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    Grid,
    TextField,
    Alert,
    IconButton,
    Collapse,
    Snackbar,
} from "@mui/material";
import useSWR from "swr";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator", "user"],
        },
    };
}

const fetcher = (url) =>
    fetch(url)
        .then((r) => r.json())
        .then((data) => {
            return { user: data?.user || null };
        });

const Profile = () => {
    const { data: users, mutate } = useSWR(`/api/database/getUser`, fetcher);
    const user = users?.user;
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = async ({ name, bio, picture }) => {
        await fetch("/api/database/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: `${name}`,
                bio: `${bio}`,
                picture: `${picture}`,
            }),
        })
            .then((response) => response.json())
            .then((newData) => {
                handleClick();
                // mutate("/api/database/getUser", { ...users.user, newData });
            });
    };
    var readableLastUpdated = new Date(user.lastUpdated);
    var readableCreated = new Date(user.created);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            {user && (
                <Box sx={{ mt: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container direction="column" spacing={4}>
                            <Grid item>
                                <h1>Settings</h1>
                                <Link href="/profile">
                                    <a>
                                        <p>Back to Profile</p>
                                    </a>
                                </Link>
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Name"
                                    fullWidth
                                    autoFocus
                                    defaultValue={user?.name || ""}
                                    {...register("name")}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Bio"
                                    fullWidth
                                    autoFocus
                                    defaultValue={user?.bio || ""}
                                    {...register("bio")}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Image URL (Imgur)"
                                    fullWidth
                                    autoFocus
                                    defaultValue={user?.picture || ""}
                                    {...register("picture", {
                                        pattern: {
                                            value: /(https?:\/\/(.+?\.)?i\.imgur\.com(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/g,
                                            message:
                                                "Must be an imgur link (temporary)",
                                        },
                                    })}
                                    error={!!errors?.picture}
                                    helperText={
                                        errors?.picture
                                            ? errors.picture.message
                                            : null
                                    }
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disableElevation
                                    color="success"
                                    sx={{ borderRadius: "4px" }}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item>
                                <p>
                                    Account Created:{" "}
                                    {dateTimeFormat.format(readableCreated)}
                                </p>
                                <p>
                                    Last Updated:{" "}
                                    {dateTimeFormat.format(readableLastUpdated)}
                                </p>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            )}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Successfully saved profile!
                </Alert>
            </Snackbar>
        </>
    );
};

export default Profile;
