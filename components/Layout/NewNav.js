import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
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
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { useUser } from "../../hooks/useAuth";
import Jazzicon from "react-jazzicon";

const settings = ["Profile", "Settings", "Logout"];

const NewNav = () => {
    const { user, loaded } = useUser();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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
        if (setting === "logout") {
            Router.push("/api/" + setting);
            setAnchorElUser(null);
        } else if (setting === "profile") {
            Router.push("/" + setting);
            setAnchorElUser(null);
        } else if (setting === "dashboard") {
            Router.push("/dashboard");
            setAnchorElUser(null);
        } else if (setting === "settings") {
            Router.push("/profile/edit");
            setAnchorElUser(null);
        } else {
            setAnchorElUser(null);
        }
    };

    return (
        <nav>
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
                                            <Link href="/login">
                                                <a>
                                                    <MenuItem
                                                        onClick={
                                                            handleCloseNavMenu
                                                        }
                                                    >
                                                        <Typography textAlign="center">
                                                            Connect
                                                        </Typography>
                                                    </MenuItem>
                                                </a>
                                            </Link>
                                        )}
                                        <Link href="/posts">
                                            <a>
                                                <MenuItem
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    <Typography textAlign="center">
                                                        Zine
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
                                                Zine
                                            </Button>
                                        </a>
                                    </Link>
                                    <Link href="#">
                                        <a>
                                            <Tooltip title="Coming Soon">
                                                <Button
                                                    sx={{
                                                        my: 2,
                                                        color: "#0A0510",
                                                        display: "block",
                                                        mr: "15px",
                                                        fontFamily: "Ogg",
                                                        fontSize: "18px",
                                                        lineHeight: "130%",
                                                        letterSpacing:
                                                            "-0.005em",
                                                    }}
                                                >
                                                    Web3 Resources
                                                </Button>
                                            </Tooltip>
                                        </a>
                                    </Link>
                                    <Link href="#">
                                        <a>
                                            <Tooltip title="Coming Soon">
                                                <Button
                                                    sx={{
                                                        my: 2,
                                                        color: "#0A0510",
                                                        display: "block",
                                                        mr: "15px",
                                                        fontFamily: "Ogg",
                                                        fontSize: "18px",
                                                        lineHeight: "130%",
                                                        letterSpacing:
                                                            "-0.005em",
                                                    }}
                                                >
                                                    VV VR
                                                </Button>
                                            </Tooltip>
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
                                            <Link href="/profile">
                                                <a>
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
                                                        <Image
                                                            alt="edit"
                                                            src="/star.svg"
                                                            height={16}
                                                            width={16}
                                                        />
                                                        &nbsp;&nbsp;0 $VV Tokens
                                                    </Button>
                                                </a>
                                            </Link>
                                        </Box>

                                        {/* Profile Avatar Menu | All Breakpoints */}

                                        <Box
                                            sx={{
                                                display: { xs: "flex" },
                                            }}
                                        >
                                            <Tooltip title="Open settings">
                                                <IconButton
                                                    onClick={handleOpenUserMenu}
                                                    sx={{ p: 0 }}
                                                >
                                                    {user?.picture ? (
                                                        <Avatar
                                                            alt={user.email.toUpperCase()}
                                                            src={user?.picture}
                                                        />
                                                    ) : (
                                                        <Jazzicon
                                                            diameter={40}
                                                            seed={
                                                                user?.uniqueId
                                                            }
                                                        />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                            <Menu
                                                sx={{ mt: "45px" }}
                                                id="menu-appbar"
                                                anchorEl={anchorElUser}
                                                anchorOrigin={{
                                                    vertical: "top",
                                                    horizontal: "right",
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: "top",
                                                    horizontal: "right",
                                                }}
                                                open={Boolean(anchorElUser)}
                                                onClose={handleCloseUserMenu}
                                            >
                                                {user?.role === "admin" && (
                                                    <MenuItem
                                                        onClick={() =>
                                                            handleCloseUserMenu(
                                                                "dashboard"
                                                            )
                                                        }
                                                    >
                                                        <Typography textAlign="center">
                                                            Dashboard
                                                        </Typography>
                                                    </MenuItem>
                                                )}
                                                {settings.map((setting) => (
                                                    <MenuItem
                                                        key={setting}
                                                        onClick={() =>
                                                            handleCloseUserMenu(
                                                                setting.toLowerCase()
                                                            )
                                                        }
                                                    >
                                                        <Typography textAlign="center">
                                                            {setting}
                                                        </Typography>
                                                    </MenuItem>
                                                ))}
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
                                                onClick={() =>
                                                    Router.push("/login")
                                                }
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
                                            <Link href="/login">
                                                <a>
                                                    <Button
                                                        disableElevation
                                                        variant="contained"
                                                        sx={{
                                                            py: 1.5,
                                                            px: 2.5,
                                                            fontWeight: "400",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        Connect Wallet
                                                    </Button>
                                                </a>
                                            </Link>
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
