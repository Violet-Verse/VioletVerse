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
                    sx={{ width: props?.size, height: props?.size }}
                />
            )}
            {!user?.picture && user && (
                <Jazzicon diameter={props?.size || 40} seed={user?.uniqueId} />
            )}
        </>
    );
};

export default UserAvatar;
