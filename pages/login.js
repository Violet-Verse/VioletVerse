import { FlowExtension } from "@magic-ext/flow";
import { Box, Button, Stack, TextField, Grid } from "@mui/material";
import * as fcl from "@onflow/fcl";
import { Magic } from "magic-sdk";
import Router from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import ReactLoading from "react-loading";
import Image from "next/image";

import { useUser } from "../hooks/useAuth";

export default function LoginPage() {
    const { mutate } = useSWRConfig();

    const [loading, setLoading] = useState(false);

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

        setLoading(true);

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
            mutate("/api/database/getUser");
            Router.push("/");
        } else {
            /* handle errors */
        }
    };

    if (loading)
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <ReactLoading
                    type={"bars"}
                    color={"#03fc4e"}
                    height={100}
                    width={100}
                />
            </Grid>
        );

    return (
        <Box
            sx={{
                px: {
                    xs: "0",
                    sm: "5%",
                    md: "10%",
                    lg: "15%",
                    xl: "20%",
                },
                mt: 10,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    container
                    direction="column"
                    alignContent="center"
                    align="center"
                    spacing={8}
                >
                    <Grid item>
                        <Grid container>
                            {/* SM or Larger */}
                            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                                <Grid item>
                                    <h1>Connect to the Verse</h1>
                                </Grid>
                                <Grid item sx={{ mt: 0.8, ml: 0.2 }}>
                                    <Image
                                        alt="edit"
                                        src="/starblack.svg"
                                        height={18}
                                        width={18}
                                    />
                                </Grid>
                            </Box>
                            {/* XS Only */}
                            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                                <Grid item>
                                    <h1 style={{ fontSize: "34px" }}>
                                        Connect to the Verse
                                    </h1>
                                </Grid>
                                <Grid item sx={{ mt: 0.2, ml: 0.2 }}>
                                    <Image
                                        alt="edit"
                                        src="/starblack.svg"
                                        height={14}
                                        width={14}
                                    />
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <div className="TextField-without-border-radius">
                            <TextField
                                variant="outlined"
                                label="Email"
                                fullWidth
                                sx={{ maxWidth: { xs: "100%", sm: "370px" } }}
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
                        </div>
                    </Grid>
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disableElevation
                            sx={{ px: 4, py: 1.5 }}
                        >
                            Connect Wallet
                        </Button>
                    </Grid>
                    <Grid item sx={{ mt: 10 }}>
                        <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={3}
                        >
                            <h6>Powered by Flow</h6>
                            <span />
                            <Image
                                alt="flow logo"
                                src="/FlowLogo.svg"
                                height={60}
                                width={60}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
