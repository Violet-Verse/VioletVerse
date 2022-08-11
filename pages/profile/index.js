import { Box, Button, Stack, Grid, Avatar } from "@mui/material";
import Router from "next/router";
import { useUser } from "../../hooks/useAuth";
import Link from "next/link";
import UserAvatar from "../../components/UserAvatar";

const Profile = () => {
    useUser({ redirectTo: "/login" });
    const { user } = useUser();
    const role = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
    return (
        <>
            {user && (
                <Box
                    sx={{
                        px: {
                            xs: "5%",
                            sm: "5%",
                            md: "10%",
                            lg: "15%",
                            xl: "20%",
                        },
                    }}
                >
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item sx={{ mr: 5 }}>
                            <Avatar
                                alt={user?.name || "user picture"}
                                src={user?.picture}
                                sx={{ width: 200, height: 200 }}
                            />
                        </Grid>
                        <Grid item>
                            <Link href="/dashboard">
                                <a>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                    >
                                        Creator Dashboard
                                    </Button>
                                </a>
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/profile/edit">
                                <a>
                                    <Button
                                        variant="contained"
                                        disableElevation
                                        sx={{
                                            backgroundColor: "white",
                                            border: 1,
                                            borderColor: "#DED1F7",
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                </a>
                            </Link>
                        </Grid>
                    </Grid>
                    <Stack sx={{ mt: 6 }}>
                        <h2>{user?.name || user?.flowAddress}</h2>
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" spacing={0}>
                        <p
                            style={{
                                fontSize: "22px",
                            }}
                        >
                            @{user?.name || user?.flowAddress}
                            <span
                                style={{
                                    fontSize: "18px",
                                    color: "#693E9A",
                                    marginLeft: "24px",
                                }}
                            >
                                {role}
                            </span>
                        </p>
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" spacing={0}>
                        <p
                            style={{
                                fontSize: "22px",
                            }}
                        >
                            {user?.bio}
                        </p>
                    </Stack>
                </Box>
            )}
        </>
    );
};

export default Profile;
