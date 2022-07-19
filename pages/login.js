import React, { useEffect } from "react";
import Router from "next/router";
import { Button, TextField, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Magic } from "magic-sdk";
import * as fcl from "@onflow/fcl";
import { FlowExtension } from "@magic-ext/flow";
import { useUser } from "../hooks/useAuth";
import useSWR, { useSWRConfig } from "swr";

export default function LoginPage() {
    const { mutate } = useSWRConfig();

    useEffect(() => {}, []);
    useUser({ redirectTo: "/", redirectIfFound: true });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // CONFIGURE FLOW ACCESS NODE
    fcl.config()
        .put("grpc.metadata", {
            api_key: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        })
        .put("accessNode.api", process.env.NEXT_PUBLIC_ACCESS_NODE) // Configure FCL's Alchemy Access Node
        .put("challenge.handshake", process.env.NEXT_PUBLIC_WALLET_DISCOVERY) // Configure FCL's Wallet Discovery mechanism
        .put("0xProfile", process.env.NEXT_PUBLIC_CONTRACT_PROFILE); // Will let us use `0xProfile` in our Cadence

    const onSubmit = async ({ email }) => {
        const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISH_KEY, {
            extensions: [
                new FlowExtension({
                    rpcUrl: "https://access-testnet.onflow.org",
                    network: "testnet",
                }),
            ],
        });

        const didToken = await magic.auth.loginWithMagicLink({ email });
        const { publicAddress } = await magic.user.getMetadata();
        const authRequest = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + didToken,
            },
            body: JSON.stringify({ flowAddress: publicAddress }),
        });
        if (authRequest.ok) {
            // We successfully logged in, our API
            // set authorization cookies and now we
            // can redirect to the dashboard!
            mutate("/api/user");
            Router.push("/");
        } else {
            /* handle errors */
        }
    };

    return (
        <div>
            <Container maxWidth="xs">
                <h1>Login with Flow</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={2}>
                        <TextField
                            variant="outlined"
                            label="email"
                            fullWidth
                            autoComplete="email"
                            autoFocus
                            {...register("email", {
                                required: "Required field",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                            error={!!errors?.email}
                            helperText={
                                errors?.email ? errors.email.message : null
                            }
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Login / Sign Up
                    </Button>
                </form>
            </Container>
        </div>
    );
}
