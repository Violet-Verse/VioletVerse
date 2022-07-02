import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { Mail } from "./Mail";
import { Password } from "./Password";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);

    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    return (
        <nav>
            <Link href="/">
                <a className="logo">
                    <Image
                        src="/Logo.png"
                        alt="Violet Verse Logo"
                        height={90}
                        width={160}
                    />
                </a>
            </Link>
            <Link href="/">
                <a>Market</a>
            </Link>
            <Link href="/">
                <a>Web3 Resources</a>
            </Link>
            <Link href="/">
                <a>VV VR</a>
            </Link>
            <Link href="/">
                <a>Community</a>
            </Link>
            <a>
                <Button flat size="sm" color="primary" onClick={handler}>
                    Connect Wallet
                </Button>
            </a>
            <Modal
                closeButton
                aria-labelledby="modal-title"
                open={visible}
                onClose={closeHandler}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        Welcome to{" "}
                        <Text b size={18}>
                            Violet Verse
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Email"
                        contentLeft={<Mail fill="currentColor" />}
                    />
                    <Input
                        clearable
                        bordered
                        fullWidth
                        color="primary"
                        size="lg"
                        placeholder="Password"
                        contentLeft={<Password fill="currentColor" />}
                    />
                    <Row justify="space-between">
                        <Checkbox>
                            <Text size={14}>Remember me</Text>
                        </Checkbox>
                        <Text size={14}>Forgot password?</Text>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onClick={closeHandler}>
                        Close
                    </Button>
                    <Button auto onClick={closeHandler}>
                        Sign in
                    </Button>
                </Modal.Footer>
            </Modal>
        </nav>
    );
};

export default Navbar;
