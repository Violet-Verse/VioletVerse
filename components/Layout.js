import { Box } from "@mui/material";
import Head from "next/head";
import Footer from "./Layout/NewFooter";
import Navbar from "./Layout/Navbar";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../components/UserContext";
import { useUser } from "../hooks/useAuth";
import { NextUIProvider } from "@nextui-org/react";
import { FlowWrapper } from "./Context/flowContext";
import { Provider } from "@lyket/react";

const Layout = ({ children }) => {
    const { user } = useUser();

    const theme = createTheme({
        components: {
            MuiToggleButton: {
                styleOverrides: {
                    root: { borderRadius: "15px", padding: "10px 35px" },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    colorPrimary: {
                        backgroundColor: "#FAFAFA",
                        padding: "15px 0px",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 100,
                        fontSize: "18px",
                    },
                },
            },
        },
        typography: {
            button: {
                textTransform: "none",
                fontWeight: 500,
                fontFamily: "stratos",
            },
        },
        palette: {
            primary: {
                light: "#E5DBF9",
                main: "#DED1F7",
                dark: "#B3A8C6",
                contrastText: "#43226D",
            },
        },
    });
    return (
        <UserContext.Provider value={user}>
            <Provider apiKey={process.env.NEXT_PUBLIC_LYKET_API}>
                <FlowWrapper>
                    <ThemeProvider theme={theme}>
                        <NextUIProvider>
                            <Box className="siteContainer">
                                <Navbar />
                                <Box
                                    className="pageContainer"
                                    sx={{
                                        mt: 4,
                                    }}
                                >
                                    {children}
                                </Box>
                                <Footer />
                            </Box>
                        </NextUIProvider>
                    </ThemeProvider>
                </FlowWrapper>
            </Provider>
        </UserContext.Provider>
    );
};

export default Layout;
