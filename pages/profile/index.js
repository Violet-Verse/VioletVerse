import {
    Box,
    Button,
    Stack,
    Grid,
    Avatar,
    IconButton,
    Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useUser } from "../../hooks/useAuth";
import Link from "next/link";
import EditPicture from "../../components/Modal/EditPicture";
import TwitterIcon from "@mui/icons-material/Twitter";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator", "user"],
        },
    };
}

const Profile = () => {
    const { user } = useUser();
    const role = user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
    const [editPictureModal, setEditPictureModal] = useState(false);
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
                    <EditPicture
                        open={editPictureModal}
                        handleClose={() => setEditPictureModal(false)}
                        user={user}
                    />
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item sx={{ mr: 5 }}>
                            <Tooltip title="Edit Picture">
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
                        {user?.role === "admin" && (
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
                        )}
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
                        <h2>{user?.name}</h2>
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" spacing={0}>
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
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" spacing={0}>
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
                            alignItems="flex-end"
                            sx={{ mt: 2 }}
                            spacing={0}
                        >
                            <a
                                href={
                                    `https://www.twitter.com/` + user?.twitter
                                }
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
                    <Stack direction="row" alignItems="flex-end" sx={{ mt: 3 }}>
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
                                    navigator.clipboard.writeText(
                                        user?.flowAddress
                                    );
                                }}
                            >
                                {`Flow Address: ${user?.flowAddress}`}
                            </Button>
                        </Tooltip>
                    </Stack>
                    <Stack direction="row" alignItems="flex-end" sx={{ mt: 3 }}>
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
                            $VV Tokens: 0
                        </Button>
                    </Stack>
                </Box>
            )}
        </>
    );
};

export default Profile;
