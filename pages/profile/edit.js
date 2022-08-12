import { useForm } from "react-hook-form";
import { Box, Button, Grid, TextField } from "@mui/material";
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
        formState: { errors },
    } = useForm();

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
                                    multiline
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
