import {
    AppBar,
    Container,
    Toolbar,
    Box,
    Button,
    Menu,
    MenuItem,
    IconButton,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
// import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import styles from "../../styles/Navbar.module.css";
import * as React from "react";

const NewNav = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
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
                            <Button
                                href="/posts"
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
                            <Button
                                href="/resources"
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
                            <Button
                                href="#"
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
                            <Button
                                href="/about"
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
                        </Box>
                        {/* XS Breakpoint | Connect Wallet */}
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
                        {/* XS Breakpoint | Menu Dropdown */}
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
                        {/* Medium or larger | Logo */}
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
                        {/* Medium or larger | Connect Wallet */}
                        <Box
                            sx={{
                                flexGrow: 0,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            <Button
                                className={styles.navItem}
                                disableElevation
                                sx={{
                                    my: 2,
                                    padding: "15px 15px",
                                    color: "#43226D",
                                    bgcolor: "#DED1F7",
                                    display: "block",
                                    mr: "15px",
                                    "&:hover": {
                                        backgroundColor: "#C9BDDF",
                                    },
                                }}
                                href="/login"
                            >
                                Connect Wallet
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </nav>
    );
};

export default NewNav;
