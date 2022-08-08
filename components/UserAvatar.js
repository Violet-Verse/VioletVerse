import { Avatar, Box } from "@mui/material";
import Jazzicon from "react-jazzicon";

const UserAvatar = (props) => {
    const user = props.user;
    return (
        <>
            {user?.picture && user && (
                <Avatar
                    alt={user?.name || "user picture"}
                    src={user?.picture}
                />
            )}
            {!user?.picture && user && (
                <Box sx={{ pt: 0.5 }}>
                    <Jazzicon diameter={40} seed={user?.uniqueId} />
                </Box>
            )}{" "}
        </>
    );
};

export default UserAvatar;
