import React from "react";
import { Modal } from "@nextui-org/react";
import UserAvatar from "../UserAvatar";
import dateFormatter from "../../lib/dateFormatter";
const ProfileModal = (props) => {
    const user = props.data;
    const dateJoined = dateFormatter(user?.created);

    if (user)
        return (
            <Modal {...props} closeButton aria-labelledby="modal-title">
                <Modal.Header>
                    <UserAvatar user={user} />
                    &nbsp;
                    <h4>{user?.name}</h4>
                </Modal.Header>
                <Modal.Body css={{ textAlign: "center" }}>
                    <p>{user?.bio || "An interesting bio awaits..."}</p>
                    <p>Member Since: {dateJoined}</p>
                </Modal.Body>
            </Modal>
        );
};

export default ProfileModal;
