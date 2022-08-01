import { useForm } from "react-hook-form";
import { Avatar, Box, Button, Grid, TextField } from "@mui/material";
import useSWR from "swr";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

    const onPictureSubmit = async () => {
        const formData = new FormData();
        formData.append("image", selectedImage);
        try {
            await fetch(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            )
                .then((response) => response.json())
                .then((result) => {
                    fetch("/api/database/updateProfile", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            picture: `${result.data.url}`,
                        }),
                    })
                        .then((response) => response.json())
                        .then((newData) => {
                            mutate("/api/database/getUser", {
                                ...users.user,
                                newData,
                            });
                        });
                })
                .catch((err) => console.error(err));
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = async ({ name, bio }) => {
        try {
            await fetch("/api/database/updateProfile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `${name}`,
                    bio: `${bio}`,
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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    var readableLastUpdated = new Date(user.lastUpdated);
    var readableCreated = new Date(user.created);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    });

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
                                <input
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) =>
                                        setSelectedImage(e.target.files[0])
                                    }
                                    id="select-image"
                                    style={{ display: "none" }}
                                />
                                <label htmlFor="select-image">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        sx={{ borderRadius: "4px" }}
                                    >
                                        Change Profile Picture{" "}
                                        {imageUrl && selectedImage && (
                                            <Box sx={{ ml: 2 }}>
                                                <Avatar
                                                    alt={selectedImage.name}
                                                    src={imageUrl}
                                                />
                                            </Box>
                                        )}
                                    </Button>
                                </label>
                                {imageUrl && selectedImage && (
                                    <Button
                                        color="secondary"
                                        onClick={() => onPictureSubmit()}
                                    >
                                        Submit
                                    </Button>
                                )}
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
                                    multiline
                                    maxRows={4}
                                    defaultValue={user?.bio || ""}
                                    {...register("bio")}
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
        </>
    );
};

export default Profile;
