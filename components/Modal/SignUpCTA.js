import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const SignUpCTA = (props) => {
    const { handleClose, handleSignup, ...rest } = props;
    return (
        <>
            <Dialog {...rest}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <IconButton
                        aria-label="close"
                        onClick={props.handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <h2>Connect to the Verse</h2>
                    <p>
                        Earn $VV by reading and contributing content. Spend $VV
                        by tipping your fav creators and purchasing VV merch.
                    </p>
                    <Image
                        src="/banners/Photography_1.png"
                        alt="vv banner"
                        // layout="fill"
                        objectFit="cover"
                        height="1080"
                        width="1920"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="info"
                        sx={{ borderRadius: "10px" }}
                        onClick={props.handleClose}
                    >
                        Continue to site
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{ borderRadius: "10px" }}
                        onClick={props.handleSignup}
                    >
                        Sign Up
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SignUpCTA;
