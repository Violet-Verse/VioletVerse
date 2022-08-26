import React, { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { useFlowContext } from "../components/Context/flowContext";
import { useUser } from "../hooks/useAuth";
import { createVault } from "../cadence/scripts/transactions/createVault";
import { transferTokens } from "../cadence/scripts/transactions/transferTokens";

import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import Router from "next/router";
import { useForm } from "react-hook-form";

export async function getStaticProps(context) {
    return {
        props: {
            protected: true,
            userTypes: ["admin", "collaborator", "user"],
        },
    };
}

const Tokens = () => {
    const { user, loaded } = useUser();
    const vvTokens = useFlowContext();
    const [walletLoading, setWalletLoading] = useState(false);
    const [txPending, setTxPending] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async ({ address, tokenAmount }) => {
        try {
            setTxPending(true);
            const transactionId = await fcl.mutate({
                cadence: transferTokens,
                args: (arg, t) => [
                    arg(address, types.Address),
                    arg(tokenAmount.toFixed(5).toString(), types.UFix64),
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                authorizations: [fcl.currentUser],
                limit: 50,
            });

            await fcl
                .tx(transactionId)
                .onceSealed()
                .then(() => {
                    setTxPending(false);
                    Router.reload(window.location.pathname);
                });
        } catch (err) {
            console.log(err);
            setTxPending(false);
        }
        console.log(address, tokenAmount);
    };

    const setupWallet = async () => {
        try {
            setWalletLoading(true);
            const transactionId = await fcl.mutate({
                cadence: createVault,
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                authorizations: [fcl.currentUser],
                limit: 50,
            });

            await fcl
                .tx(transactionId)
                .onceSealed()
                .then(() => {
                    setWalletLoading(false);
                    Router.reload(window.location.pathname);
                });
        } catch (err) {
            console.log(err);
            setWalletLoading(false);
        }
    };

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
            }}
        >
            {loaded && vvTokens ? (
                <>
                    <Grid
                        container
                        justifyContent="center"
                        alignContent="center"
                        direction="column"
                        spacing={3}
                    >
                        <Grid item>
                            <h1>Violet Verse Tokens</h1>
                        </Grid>
                        <Grid item>
                            <h4>
                                VV Balance:{" "}
                                {parseFloat(vvTokens).toLocaleString("en-US")}
                            </h4>
                        </Grid>
                        <Grid item>
                            <h4>Your Address: {user.flowAddress}</h4>
                        </Grid>
                    </Grid>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            justifyContent="center"
                            alignContent="center"
                            direction="column"
                            spacing={3}
                            sx={{ mt: 4 }}
                        >
                            <Grid item>
                                <h3>Send Tokens</h3>
                            </Grid>

                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Amount"
                                    fullWidth
                                    type="number"
                                    inputProps={{
                                        step: 0.0001,
                                    }}
                                    error={!!errors?.tokenAmount}
                                    helperText={
                                        errors?.tokenAmount
                                            ? errors.tokenAmount.message
                                            : null
                                    }
                                    {...register("tokenAmount", {
                                        required: "Required",
                                        valueAsNumber: true,
                                        validate: (value) => value > 0,
                                        pattern: {
                                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                            message:
                                                "Must be valid Flow address starting with 0x",
                                        },
                                    })}
                                />
                            </Grid>

                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    label="Flow Address"
                                    fullWidth
                                    error={!!errors?.address}
                                    helperText={
                                        errors?.address
                                            ? errors.address.message
                                            : null
                                    }
                                    {...register("address", {
                                        required: "Required",
                                        pattern: {
                                            value: /0x[a-fA-F0-9]{16}/g,
                                            message:
                                                "Must be valid Flow address starting with 0x",
                                        },
                                    })}
                                />
                            </Grid>

                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disableElevation
                                    disabled={txPending}
                                >
                                    Send Tokens
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </>
            ) : (
                <Grid
                    container
                    justifyContent="center"
                    alignContent="center"
                    direction="column"
                    align="center"
                    spacing={3}
                >
                    <Grid item>
                        <h1>Violet Verse Tokens</h1>
                    </Grid>
                    <Grid item>
                        {!walletLoading ? (
                            <Button
                                variant="contained"
                                disableElevation
                                onClick={() => setupWallet()}
                            >
                                Create Your VV Wallet
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                disableElevation
                                disabled
                            >
                                Generating New Wallet...
                            </Button>
                        )}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default Tokens;
