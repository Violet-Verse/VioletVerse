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
    Icon,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React, { useState } from "react";
import { useUser } from "../../components/UserContext";

const settings = ["Profile", "Logout"];

const NewNav = () => {
    const { user } = useUser();

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
        } else {
            setAnchorElUser(null);
        }
    };

    return (
        <nav>
            <AppBar position="static" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Medium or larger | Logo */}
                        <Box
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
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
                        {/* Medium or larger | Menu Items */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
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
                                        Market
                                    </Button>
                                </a>
                            </Link>
                            <Link href="resources">
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
                                        Web3 Resources
                                    </Button>
                                </a>
                            </Link>
                            <Link href="#">
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
                                        VV VR
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
                        {/* Connect Wallet | XS Breakpoint */}
                        {!user && (
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
                                    color="inherit"
                                    onClick={() => Router.push("/login")}
                                >
                                    <PersonOutlineSharpIcon />
                                </IconButton>
                            </Box>
                        )}
                        {/* Menu Dropdown | XS Breakpoint */}
                        <Box
                            sx={{
                                mr: 2,
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
                                <MenuIcon />
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
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link href="/posts">
                                        <a>
                                            <Typography textAlign="center">
                                                Market
                                            </Typography>
                                        </a>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link href="/resources">
                                        <a>
                                            <Typography textAlign="center">
                                                Web3 Resources
                                            </Typography>
                                        </a>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link href="#">
                                        <a>
                                            <Typography textAlign="center">
                                                VV VR
                                            </Typography>
                                        </a>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Link href="/about">
                                        <a>
                                            <Typography textAlign="center">
                                                Community
                                            </Typography>
                                        </a>
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </Box>
                        {/* Logo | Medium or larger */}
                        <Box
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                flexGrow: 1,
                            }}
                        >
                            <Link href="/">
                                <a>
                                    <Image
                                        src="/Logo.png"
                                        alt="Violet Verse"
                                        height={66}
                                        width={117}
                                    />
                                </a>
                            </Link>
                        </Box>
                        {/* VV Tokens | Medium or larger */}
                        {/* Connect Wallet | Medium or larger */}
                        {user ? (
                            <>
                                <Box
                                    sx={{
                                        mr: 4,
                                        display: { xs: "none", md: "flex" },
                                        flexGrow: 0,
                                    }}
                                >
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
                                </Box>
                                <Box sx={{ flexGrow: 0 }}>
                                    <Box sx={{ flexGrow: 0 }}>
                                        <Tooltip title="Open settings">
                                            <IconButton
                                                onClick={handleOpenUserMenu}
                                                sx={{ p: 0 }}
                                            >
                                                <Avatar
                                                    alt={user.email.toUpperCase()}
                                                    src="/static/images/avatar/2.jpg"
                                                />
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
                        ) : (
                            <Box
                                sx={{
                                    flexGrow: 0,
                                    display: { xs: "none", md: "flex" },
                                }}
                            >
                                <Button
                                    disableElevation
                                    sx={{
                                        my: 2,
                                        padding: "15px 15px",
                                        color: "#43226D",
                                        bgcolor: "#DED1F7",
                                        display: "block",
                                        mr: "15px",
                                        fontFamily: "Ogg",
                                        fontSize: "18px",
                                        lineHeight: "130%",
                                        letterSpacing: "-0.005em",
                                        "&:hover": {
                                            backgroundColor: "#C9BDDF",
                                        },
                                    }}
                                    href="/login"
                                >
                                    Connect Wallet
                                </Button>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </nav>
    );
};

export default NewNav;
