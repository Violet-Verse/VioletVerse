import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import * as fcl from "@onflow/fcl";
import useSWR, { useSWRConfig } from "swr";
import "../../flow/config.js";
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Tooltip,
    Avatar,
    Divider,
    ListItemIcon,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useAuth";
import UserAvatar from "../user/UserAvatar";
import { nFormatter, useFlowContext } from "../Context/flowContext";
import SignUpCTA from "../Modal/SignUpCTA.js";

const NewNav = () => {
    const { user, loaded } = useUser();

    // Identify User for Analytics
    useEffect(() => {
        if (user)
            global.analytics.identify(user?.userId, {
                username: user?.name,
                email: user?.email,
            });
    }, [loaded, user]);

    const vvTokens = nFormatter(useFlowContext(), 2);

    const dashboardPermission =
        user?.role === "admin" || user?.role === "contributor";

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (setting) => {
        global.analytics.track("Profile Menu Hidden");
        setAnchorElUser(null);
    };

    const { mutate } = useSWRConfig();

    const login = async () => {
        try {
            const res = await fcl.authenticate();

            const accountProofService = res.services.find(
                (services) => services.type === "account-proof"
            );

            const userEmail = res.services.find(
                (services) => services.type === "open-id"
            ).data.email.email;

            if (accountProofService) {
                fetch("/api/auth/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        address: accountProofService.data.address,
                        nonce: accountProofService.data.nonce,
                        signatures: accountProofService.data.signatures,
                        userEmail,
                    }),
                })
                    .then((response) => response.json())
                    .then((result) => {
                        global.analytics.track(
                            result.registration
                                ? "User Registration Success"
                                : "User Login Success ",
                            {
                                ...(result.registration && {
                                    userId: result.userData.userId,
                                }),
                                ...(result.registration && {
                                    email: result.userData.email,
                                }),
                                ...(result.registration && {
                                    role: result.userData.role,
                                }),
                                ...(result.registration && {
                                    flowAddress: result.userData.flowAddress,
                                }),
                            }
                        );
                        console.log(result);
                        mutate("/api/database/getUser");
                    })
                    .catch((err) => {
                        fcl.unauthenticate();
                        console.error(err);
                    });
            }
        } catch (err) {
            // console.log(err);
        }
    };

    const ctaClosed = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("homepageCTA");
        }
    };

    useEffect(() => {
        if (loaded && !ctaClosed() && !user) {
            setSignupCTA(true);
            global.analytics.track("Signup CTA Displayed");
        } else {
            setSignupCTA(false);
        }
    }, [loaded, user]);

    const [signupCTA, setSignupCTA] = useState(false);

    const setFirstVisit = () => {
        if (typeof window !== "undefined") {
            localStorage.setItem("homepageCTA", true);
            setSignupCTA(false);
        }
    };

    return (
        <nav>
            <SignUpCTA
                open={signupCTA}
                handleClose={() => {
                    global.analytics.track("Signup CTA Hidden");
                    setFirstVisit();
                }}
                handleSignup={() => {
                    global.analytics.track("Signup CTA Clicked");
                    login();
                    setFirstVisit();
                }}
            />
            <AppBar position="static" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ px: { xs: 0, md: 4 } }}>
                        {loaded && (
                            <>
                                {/* Menu Dropdown | XS Breakpoint */}

                                <Box
                                    sx={{
                                        flex: 1,
                                        display: { xs: "flex", lg: "none" },
                                        justifyContent: "start",
                                    }}
                                >
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon sx={{ fontSize: "32px" }} />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "left",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "left",
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenu}
                                        sx={{
                                            display: {
                                                xs: "block",
                                                lg: "none",
                                            },
                                        }}
                                    >
                                        {!user && loaded && (
                                            <MenuItem
                                                onClick={() => {
                                                    login();
                                                    handleCloseNavMenu();
                                                }}
                                            >
                                                <Typography textAlign="center">
                                                    Connect Wallet
                                                </Typography>
                                            </MenuItem>
                                        )}
                                        <Link href="/posts">
                                            <a>
                                                <MenuItem
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    <Typography textAlign="center">
                                                        Explore
                                                    </Typography>
                                                </MenuItem>
                                            </a>
                                        </Link>
                                        <Link href="/enterprise">
                                            <a>
                                                <MenuItem
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    <Typography textAlign="center">
                                                        Enterprise Plan
                                                    </Typography>
                                                </MenuItem>
                                            </a>
                                        </Link>
                                        <Link href="/about">
                                            <a>
                                                <MenuItem
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    <Typography textAlign="center">
                                                        Community
                                                    </Typography>
                                                </MenuItem>
                                            </a>
                                        </Link>
                                    </Menu>
                                </Box>

                                {/* Menu Items | Medium or larger */}

                                <Box
                                    sx={{
                                        flex: 1,
                                        display: { xs: "none", lg: "flex" },
                                        justifyContent: "start",
                                    }}
                                >
                                    <Link href="/posts">
                                        <a>
                                            <Button
                                                sx={{
                                                    my: 2,
                                                    color: "#0A0510",
                                                    display: "block",
                                                    mr: "15px",
                                                    fontFamily: "Ogg",
                                                    fontSize: "18px",
                                                    lineHeight: "130%",
                                                    letterSpacing: "-0.005em",
                                                }}
                                            >
                                                Explore
                                            </Button>
                                        </a>
                                    </Link>
                                    <Link href="/enterprise">
                                        <a>
                                            <Button
                                                sx={{
                                                    my: 2,
                                                    color: "#0A0510",
                                                    display: "block",
                                                    mr: "15px",
                                                    fontFamily: "Ogg",
                                                    fontSize: "18px",
                                                    lineHeight: "130%",
                                                    letterSpacing: "-0.005em",
                                                }}
                                            >
                                                Enterprise Plan
                                            </Button>
                                        </a>
                                    </Link>
                                    <Link href="/about">
                                        <a>
                                            <Button
                                                sx={{
                                                    my: 2,
                                                    color: "#0A0510",
                                                    display: "block",
                                                    fontFamily: "Ogg",
                                                    fontSize: "18px",
                                                    lineHeight: "130%",
                                                    letterSpacing: "-0.005em",
                                                }}
                                            >
                                                Community
                                            </Button>
                                        </a>
                                    </Link>
                                </Box>

                                {/* Logo | All Breakpoints */}

                                <Box
                                    sx={{
                                        justifyContent: "center",
                                    }}
                                >
                                    <Link href="/">
                                        <a>
                                            <Image
                                                src="/Logo.svg"
                                                alt="Violet Verse"
                                                height={59}
                                                width={105}
                                            />
                                        </a>
                                    </Link>
                                </Box>

                                {/* Connect Wallet + VV Tokens || Logged In*/}

                                {user && (
                                    <Box
                                        sx={{
                                            display: { xs: "flex" },
                                            flex: 1,
                                            justifyContent: "end",
                                        }}
                                    >
                                        {/* VV Tokens | Large or larger */}

                                        <Box
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    lg: "flex",
                                                },
                                                mr: { xs: 0, lg: 6 },
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                onClick={() =>
                                                    Router.push("/tokens")
                                                }
                                                sx={{
                                                    fontWeight: "400",
                                                    fontSize: "16px",
                                                    py: 1.5,
                                                    px: 2.5,
                                                }}
                                            >
                                                <Image
                                                    alt="edit"
                                                    src="/star.svg"
                                                    height={16}
                                                    width={16}
                                                />
                                                &nbsp;&nbsp;
                                                {vvTokens
                                                    ? `${vvTokens} $VV Tokens`
                                                    : `Setup VV Wallet`}
                                            </Button>
                                        </Box>

                                        {/* Profile Avatar Menu | All Breakpoints */}

                                        <Box
                                            sx={{
                                                display: { xs: "flex" },
                                            }}
                                        >
                                            <Tooltip title="Account settings">
                                                <IconButton
                                                    onClick={(event) => {
                                                        global.analytics.track(
                                                            "Profile Menu Displayed"
                                                        );
                                                        handleOpenUserMenu(
                                                            event
                                                        );
                                                    }}
                                                    size="small"
                                                    aria-controls={
                                                        open
                                                            ? "account-menu"
                                                            : undefined
                                                    }
                                                    aria-haspopup="true"
                                                    aria-expanded={
                                                        open
                                                            ? "true"
                                                            : undefined
                                                    }
                                                >
                                                    <UserAvatar user={user} />
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                sx={{ mt: "45px" }}
                                                id="menu-appbar"
                                                anchorEl={anchorElUser}
                                                transformOrigin={{
                                                    horizontal: "right",
                                                    vertical: "top",
                                                }}
                                                anchorOrigin={{
                                                    horizontal: "right",
                                                    vertical: "top",
                                                }}
                                                PaperProps={{
                                                    elevation: 0,
                                                    sx: {
                                                        overflow: "visible",
                                                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                                        mt: 1.5,
                                                        "& .MuiAvatar-root": {
                                                            width: 32,
                                                            height: 32,
                                                            ml: -0.5,
                                                            mr: 1,
                                                        },
                                                        "&:before": {
                                                            content: '""',
                                                            display: "block",
                                                            position:
                                                                "absolute",
                                                            top: 0,
                                                            right: 14,
                                                            width: 10,
                                                            height: 10,
                                                            bgcolor:
                                                                "background.paper",
                                                            transform:
                                                                "translateY(-50%) rotate(45deg)",
                                                            zIndex: 0,
                                                        },
                                                    },
                                                }}
                                                keepMounted
                                                open={Boolean(anchorElUser)}
                                                onClose={handleCloseUserMenu}
                                            >
                                                <MenuItem
                                                    onClick={() => {
                                                        Router.push("/profile");
                                                        global.analytics.track(
                                                            "Profile Menu Item Clicked",
                                                            {
                                                                page: "Profile Page",
                                                            }
                                                        );
                                                        setAnchorElUser(null);
                                                    }}
                                                >
                                                    <Avatar
                                                        alt={
                                                            user?.name ||
                                                            "user picture"
                                                        }
                                                        src={user?.picture}
                                                    />
                                                    Profile
                                                </MenuItem>
                                                <Divider />

                                                {dashboardPermission && (
                                                    <MenuItem
                                                        onClick={() => {
                                                            Router.push(
                                                                "/dashboard"
                                                            );
                                                            global.analytics.track(
                                                                "Profile Menu Item Clicked",
                                                                {
                                                                    page: "Dashboard Page",
                                                                }
                                                            );
                                                            setAnchorElUser(
                                                                null
                                                            );
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <DashboardIcon />
                                                        </ListItemIcon>
                                                        Dashboard
                                                    </MenuItem>
                                                )}
                                                <MenuItem
                                                    onClick={() => {
                                                        Router.push("/tokens");
                                                        global.analytics.track(
                                                            "Profile Menu Item Clicked",
                                                            {
                                                                page: "Dashboard Page",
                                                            }
                                                        );
                                                        setAnchorElUser(null);
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <AccountBalanceWalletIcon fontSize="small" />
                                                    </ListItemIcon>
                                                    My Wallet
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        Router.push(
                                                            "/profile/edit"
                                                        );
                                                        global.analytics.track(
                                                            "Profile Menu Item Clicked",
                                                            {
                                                                page: "Edit Profile Page",
                                                            }
                                                        );
                                                        setAnchorElUser(null);
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <Settings fontSize="small" />
                                                    </ListItemIcon>
                                                    Settings
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        fcl.unauthenticate();
                                                        global.analytics.track(
                                                            "Logout Button Clicked"
                                                        );
                                                        Router.push(
                                                            "/api/auth/logout"
                                                        );
                                                        setAnchorElUser(null);
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <Logout fontSize="small" />
                                                    </ListItemIcon>
                                                    Logout
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    </Box>
                                )}

                                {/* Connect Wallet || Logged Out */}

                                {!user && (
                                    <Box
                                        sx={{
                                            display: { xs: "flex" },
                                            flex: 1,
                                            justifyContent: "end",
                                        }}
                                    >
                                        {/* Connect Wallet | XS Breakpoint */}

                                        <Box
                                            sx={{
                                                display: {
                                                    xs: "flex",
                                                    lg: "none",
                                                },
                                            }}
                                        >
                                            <IconButton
                                                size="large"
                                                aria-label="account"
                                                aria-controls="menu-appbar"
                                                color="inherit"
                                                onClick={() => {
                                                    login();
                                                    global.analytics.track(
                                                        "Login Button Clicked"
                                                    );
                                                }}
                                            >
                                                <PersonOutlineSharpIcon
                                                    sx={{ fontSize: "32px" }}
                                                />
                                            </IconButton>
                                        </Box>

                                        {/* Connect Wallet | Large or larger */}
                                        <Box
                                            sx={{
                                                display: {
                                                    xs: "none",
                                                    lg: "flex",
                                                },
                                            }}
                                        >
                                            <Button
                                                disableElevation
                                                variant="contained"
                                                onClick={() => {
                                                    login();
                                                    global.analytics.track(
                                                        "Login Button Clicked"
                                                    );
                                                }}
                                                sx={{
                                                    py: 1.5,
                                                    px: 2.5,
                                                    fontWeight: "400",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                Connect Wallet
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </nav>
    );
};

export default NewNav;
