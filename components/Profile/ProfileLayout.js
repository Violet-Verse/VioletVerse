import {
    Box,
    Button,
    Stack,
    Grid,
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import { useUser } from "../../hooks/useAuth";
import React, { useState } from "react";
import Link from "next/link";
import EditPicture from "../Modal/EditPicture";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useFlowContext } from "../Context/flowContext";

const ProfileLayout = (props) => {
    const { user: loggedInUser } = useUser();
    const user = props?.user;
    const isOwner = loggedInUser?.userId === user?.userId;
    const role = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
    const [editPictureModal, setEditPictureModal] = useState(false);

    const vvTokens = useFlowContext();

    const env = process.env.NODE_ENV;

    return (
        <Box
            sx={{
                px: {
                    xs: "5%",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                    xl: "20%",
                },
                // textAlign: "center",
            }}
        >
            {/* Modals */}

            <EditPicture
                open={editPictureModal}
                handleClose={() => setEditPictureModal(false)}
                user={user}
            />

            {/* Main Content */}

            <Grid
                container
                alignItems={{ xs: "flex-start", md: "center" }}
                direction={{ xs: "column", md: "row" }}
                // justifyContent={{ xs: "center", md: "flex-start" }}
                justifyContent="flex-start"
                spacing={2}
            >
                {isOwner && (
                    <Grid item sx={{ mr: { xs: 0, md: 5 } }}>
                        <Tooltip title="Edit Picture" arrow>
                            <IconButton
                                onClick={() => setEditPictureModal(true)}
                            >
                                <Avatar
                                    alt={user?.name || "user picture"}
                                    src={user?.picture}
                                    sx={{ width: 200, height: 200 }}
                                />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
                {!isOwner && (
                    <Grid item sx={{ mr: { xs: 0, md: 5 } }}>
                        <Avatar
                            alt={user?.name || "user picture"}
                            src={user?.picture}
                            sx={{ width: 200, height: 200 }}
                        />
                    </Grid>
                )}
                {user?.role === "admin" && isOwner && (
                    <Grid item>
                        <Link href="/dashboard">
                            <a>
                                <Button variant="contained" disableElevation>
                                    Creator Dashboard
                                </Button>
                            </a>
                        </Link>
                    </Grid>
                )}
                {isOwner && (
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
                )}
            </Grid>
            <Stack
                direction="row"
                // justifyContent={{ xs: "center", md: "left" }}
                sx={{ mt: 6 }}
            >
                <h2>{user?.name}</h2>
            </Stack>
            <Stack
                direction="row"
                // justifyContent={{ xs: "center", md: "left" }}
                sx={{ mt: 2 }}
            >
                <Link
                    href={
                        env == "development"
                            ? `http://localhost:3000/user/${user?.username}`
                            : `http://https://violetverse.vercel.app/user/${user?.username}`
                    }
                >
                    <a>
                        <p
                            style={{
                                fontSize: "22px",
                            }}
                        >
                            @{user?.username}
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
                    </a>
                </Link>
            </Stack>
            <Stack
                direction="row"
                // justifyContent={{ xs: "center", md: "left" }}
            >
                <p
                    style={{
                        fontSize: "22px",
                    }}
                >
                    {user?.bio || "An interesting bio awaits..."}
                </p>
            </Stack>
            {user?.twitter && (
                <Stack
                    direction="row"
                    // justifyContent={{ xs: "center", md: "left" }}
                    sx={{ mt: 2 }}
                    spacing={0}
                >
                    <a
                        href={`https://www.twitter.com/` + user?.twitter}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <TwitterIcon
                            sx={{
                                color: "#73839C",
                            }}
                        />
                    </a>
                </Stack>
            )}
            <Stack
                direction="row"
                // justifyContent={{ xs: "center", md: "left" }}
                sx={{ mt: 3 }}
            >
                <Tooltip title="Copy Address to Clipboard">
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "white",
                            border: 1,
                            borderColor: "#DED1F7",
                        }}
                        onClick={() => {
                            navigator.clipboard.writeText(user?.flowAddress);
                        }}
                    >
                        {`Flow Address: ${user?.flowAddress}`}
                    </Button>
                </Tooltip>
            </Stack>
            <Stack
                direction="row"
                // justifyContent={{ xs: "center", md: "left" }}
                sx={{ mt: 3 }}
            >
                <Button
                    variant="contained"
                    disableElevation
                    sx={{
                        fontWeight: "400",
                        fontSize: "16px",
                        py: 1.5,
                        px: 2.5,
                    }}
                >
                    {vvTokens ? `$VV Tokens: ${vvTokens}` : "Setup VV Wallet"}
                </Button>
            </Stack>
        </Box>
    );
};

export default ProfileLayout;
