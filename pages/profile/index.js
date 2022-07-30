import { Button, Grid } from "@mui/material";
import Router from "next/router";

import { useUser } from "../../hooks/useAuth";
import Link from "next/link";

const Profile = () => {
    useUser({ redirectTo: "/login" });
    const { user } = useUser();
    return (
        <>
            {user && (
                <>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={12}>
                            <h1>Welcome, {user.name || user.email}!</h1>
                        </Grid>
                        <Grid item>
                            {user.role === "admin" && (
                                <Link href="/dashboard">
                                    <a>
                                        <Button
                                            variant="contained"
                                            disableElevation
                                            sx={{ mr: 2 }}
                                        >
                                            Go to Creator Dashboard
                                        </Button>
                                    </a>
                                </Link>
                            )}
                            <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                disableElevation
                                onClick={() => Router.push("/profile/edit")}
                            >
                                Edit Profile
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <p>
                                <b>Bio:</b> {user.bio}
                            </p>
                            <p>
                                <b>Flow Wallet:</b> {user.flowAddress}
                            </p>
                            <p>
                                <b>VV Tokens:</b> 0
                            </p>
                            <p>
                                <b>Role:</b> {user.role}
                            </p>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
};

export default Profile;
