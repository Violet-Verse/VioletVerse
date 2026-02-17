import React from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserAvatar from "../user/UserAvatar";
import dateFormatter from "../../lib/dateFormatter";

const ProfileModal = (props) => {
    const { data, onClose, ...rest } = props;
    const user = data;
    const dateJoined = dateFormatter(user?.created);

    if (user)
        return (
            <Dialog {...rest} onClose={onClose} aria-labelledby="modal-title">
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <UserAvatar user={user} />
                        <h4 style={{ margin: 0 }}>{user?.name}</h4>
                    </Box>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
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
                <DialogContent sx={{ textAlign: "center" }}>
                    <p>{user?.bio || "An interesting bio awaits..."}</p>
                    <p>Member Since: {dateJoined}</p>
                </DialogContent>
            </Dialog>
        );
};

export default ProfileModal;
