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
                <Box sx={{ p: 5 }}>
                    <h2>Sign up to VioletVerse</h2>

                    <DialogContent>
                        <p className="secondary">
                            Earn exclusive rewards and VV tokens!
                        </p>
                    </DialogContent>
                    <DialogActions>
                        <Button color="info" onClick={props.handleClose}>
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
                </Box>
            </Dialog>
        </>
    );
};

export default SignUpCTA;
