import { Box, Button, Grid, Stack } from "@mui/material";
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
                            xs: "0",
                            sm: "5%",
                            md: "10%",
                            lg: "15%",
                            xl: "20%",
                        },
                    }}
                >
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item sx={{ mr: 5 }}>
                            <UserAvatar user={user} size={200} />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" disableElevation>
                                Creator Dashboard
                            </Button>
                        </Grid>
                        <Grid item>
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
                        </Grid>
                    </Grid>
                    <Stack sx={{ mt: 6 }}>
                        <h2>{user?.name || user?.flowAddress}</h2>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <p style={{ fontSize: "22px", lineHeight: "100%" }}>
                            @{user?.name || user?.flowAddress}
                        </p>
                        <p
                            style={{
                                fontSize: "18px",
                                color: "#693E9A",
                                lineHeight: "100%",
                            }}
                        >
                            {role}
                        </p>
                    </Stack>
                </Box>
            )}
        </>
    );
};

export default Profile;
