import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
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
    Divider,
    ListItemIcon,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { useUser } from "../../hooks/useAuth";
import UserAvatar from "../UserAvatar";

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
        setAnchorElUser(null);
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
                                            <Tooltip title="Account settings">
                                                <IconButton
                                                    onClick={handleOpenUserMenu}
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
                                                        setAnchorElUser(null);
                                                    }}
                                                >
                                                    <Avatar />
                                                    Profile
                                                </MenuItem>
                                                <Divider />
                                                <MenuItem
                                                    onClick={() => {
                                                        Router.push(
                                                            "/dashboard"
                                                        );
                                                        setAnchorElUser(null);
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <DashboardIcon />
                                                    </ListItemIcon>
                                                    Dashboard
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        Router.push(
                                                            "/profile/edit"
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
                                                        Router.push(
                                                            "/api/logout"
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
