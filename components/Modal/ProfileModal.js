import React from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import UserAvatar from "../UserAvatar";
const ProfileModal = (props) => {
    const user = props.data;
    const readableCreated = new Date(user.created);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Modal {...props} closeButton aria-labelledby="modal-title">
            <Modal.Header>
                <UserAvatar user={user} />
                &nbsp;
                <h4>{user?.name}</h4>
            </Modal.Header>
            <Modal.Body css={{ textAlign: "center" }}>
                <p>{user?.bio}</p>
                <p>Member Since: {dateTimeFormat.format(readableCreated)}</p>
            </Modal.Body>
        </Modal>
    );
};

export default ProfileModal;
