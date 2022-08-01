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
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

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
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        {/* Logo | All Breakpoints */}
                        <Box
                            sx={{
                                mr: 2,
                                display: { xs: "flex" },
                                flexGrow: 1,
                            }}
                        >
                            <Link href="/">
                                <a>
                                    <Image
                                        src="/Logo.png"
                                        alt="Violet Verse"
                                        height={59}
                                        width={105}
                                    />
                                </a>
                            </Link>
                        </Box>
                        {/* Menu Items | Medium or larger */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                                mr: 4,
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
                                                letterSpacing: "-0.005em",
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
                                                letterSpacing: "-0.005em",
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
                        {/* Connect Wallet | XS Breakpoint */}
                        {!user && loaded && (
                            <Box
                                sx={{
                                    mr: 1,
                                    flexGrow: 0,
                                    display: { xs: "flex", md: "none" },
                                }}
                            >
                                <IconButton
                                    size="large"
                                    aria-label="account"
                                    aria-controls="menu-appbar"
                                    color="inherit"
                                    onClick={() => Router.push("/login")}
                                >
                                    <PersonOutlineSharpIcon
                                        sx={{ fontSize: "32px" }}
                                    />
                                </IconButton>
                            </Box>
                        )}
                        {/* Menu Dropdown | XS Breakpoint */}
                        <Box
                            sx={{
                                flexGrow: 0,
                                display: { xs: "flex", md: "none" },
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
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {!user && loaded && (
                                    <Link href="/login">
                                        <a>
                                            <MenuItem
                                                onClick={handleCloseNavMenu}
                                            >
                                                <Typography textAlign="center">
                                                    Login
                                                </Typography>
                                            </MenuItem>
                                        </a>
                                    </Link>
                                )}
                                <Link href="/posts">
                                    <a>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                Zine
                                            </Typography>
                                        </MenuItem>
                                    </a>
                                </Link>
                                {/* <Link href="#">
                                    <a>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                Web3 Resources
                                            </Typography>
                                        </MenuItem>
                                    </a>
                                </Link> */}
                                {/* <Link href="#">
                                    <a>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                VV VR
                                            </Typography>
                                        </MenuItem>
                                    </a>
                                </Link> */}
                                <Link href="/about">
                                    <a>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                Community
                                            </Typography>
                                        </MenuItem>
                                    </a>
                                </Link>
                            </Menu>
                        </Box>
                        {/* Connect Wallet + VV Tokens | Medium or larger */}
                        {user && loaded && (
                            <>
                                <Box
                                    sx={{
                                        mr: 4,
                                        display: { xs: "none", md: "flex" },
                                        flexGrow: 0,
                                    }}
                                >
                                    <Link href="/profile">
                                        <a>
                                            <Button
                                                variant="contained"
                                                disableElevation
                                            >
                                                <Image
                                                    alt="edit"
                                                    src="/star.svg"
                                                    height={16}
                                                    width={16}
                                                />
                                                &nbsp;0 VV Tokens
                                            </Button>
                                        </a>
                                    </Link>
                                </Box>
                                <Box sx={{ flexGrow: 0 }}>
                                    <Box sx={{ flexGrow: 0 }}>
                                        <Tooltip title="Open settings">
                                            <IconButton
                                                onClick={handleOpenUserMenu}
                                                sx={{ p: 0 }}
                                            >
                                                {user?.picture ? (
                                                    <Avatar
                                                        alt={user.email.toUpperCase()}
                                                        src={user?.picture}
                                                        style={{
                                                            border: "0.1px solid lightgray",
                                                        }}
                                                    />
                                                ) : (
                                                    <Jazzicon
                                                        diameter={40}
                                                        seed={jsNumberForAddress(
                                                            user.userId.slice(9)
                                                        )}
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
                            </>
                        )}
                        {!user && loaded && (
                            <Box
                                sx={{
                                    flexGrow: 0,
                                    display: { xs: "none", md: "flex" },
                                }}
                            >
                                <Link href="/login">
                                    <a>
                                        <Button
                                            disableElevation
                                            variant="contained"
                                            sx={{
                                                py: 2,
                                                display: "block",
                                                fontFamily: "Ogg",
                                                fontSize: "18px",
                                                lineHeight: "130%",
                                                letterSpacing: "-0.005em",
                                            }}
                                        >
                                            Connect Wallet
                                        </Button>
                                    </a>
                                </Link>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </nav>
    );
};

export default NewNav;
