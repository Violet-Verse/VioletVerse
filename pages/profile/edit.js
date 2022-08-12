import { useForm } from "react-hook-form";
import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import dateFormatter from "../../lib/dateFormatter";

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
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async ({ name, bio, twitter }) => {
        try {
            await fetch("/api/database/updateProfile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `${name}`,
                    bio: `${bio}`,
                    twitter: `${twitter}`,
                }),
            })
                .then((response) => response.json())
                .then((newData) => {
                    mutate("/api/database/getUser", {
                        ...users.user,
                        newData,
                    });
                });
        } catch (err) {
            console.log(err);
        }
    };

    var accountLastUpdated = dateFormatter(user.lastUpdated, true);
    var accountCreated = dateFormatter(user.created, true);

    return (
        <>
            {user && (
                <Box
                    sx={{
                        px: {
                            xs: "0",
                            sm: "5%",
                            md: "10%",
                            lg: "15%",
                            xl: "20%",
                        },
                    }}
                >
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
                                    placeholder="Satoshi Nakamoto "
                                    fullWidth
                                    autoFocus
                                    defaultValue={user?.name || ""}
                                    error={!!errors?.name}
                                    helperText={
                                        errors?.name
                                            ? errors.name.message
                                            : null
                                    }
                                    {...register("name", {
                                        maxLength: {
                                            value: 40,
                                            message:
                                                "Names must be under 40 characters.",
                                        },
                                        pattern: {
                                            value: /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
                                            message:
                                                "Name cannot contain numbers or symbols.",
                                        },
                                    })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Bio"
                                    placeholder="An interesting bio awaits..."
                                    fullWidth
                                    multiline
                                    defaultValue={user?.bio || ""}
                                    error={!!errors?.bio}
                                    helperText={
                                        errors?.bio ? errors.bio.message : null
                                    }
                                    {...register("bio", {
                                        maxLength: {
                                            value: 1000,
                                            message:
                                                "Bio must be under 1000 characters.",
                                        },
                                    })}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Twitter"
                                    placeholder="Twitter Username"
                                    fullWidth
                                    multiline
                                    defaultValue={user?.twitter || ""}
                                    error={!!errors?.twitter}
                                    helperText={
                                        errors?.twitter
                                            ? errors.twitter.message
                                            : null
                                    }
                                    {...register("twitter", {
                                        maxLength: {
                                            value: 15,
                                            message:
                                                "Invalid Twitter Username.",
                                        },
                                        pattern: {
                                            value: /^([a-z0-9_]{1,15})$/i,
                                            message:
                                                "Invalid Twitter Username.",
                                        },
                                    })}
                                />
                            </Grid>
                            <Grid item>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box sx={{ position: "relative" }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disableElevation
                                            color="success"
                                            sx={{ borderRadius: "4px" }}
                                            disabled={isSubmitting}
                                        >
                                            Save
                                        </Button>
                                        {isSubmitting && (
                                            <CircularProgress
                                                size={24}
                                                sx={{
                                                    color: "green",
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    marginTop: "-12px",
                                                    marginLeft: "-12px",
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item>
                                <p>Account Created: {accountCreated}</p>
                                <p>Last Updated: {accountLastUpdated}</p>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            )}
        </>
    );
};

export default Profile;
