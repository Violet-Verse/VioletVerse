import {
    Dialog,
    DialogContent,
    Grid,
    TextField,
    Box,
    Button,
    DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { useFlowContext } from "../../components/Context/flowContext";
import { useUser } from "../../hooks/useAuth";
import { transferTokens } from "../../cadence/scripts/transactions/transferTokens";

import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import Router from "next/router";
import { useForm } from "react-hook-form";

import { ScaleLoader } from "react-spinners";

const Tipping = (props) => {
    const { user, loaded } = useUser();
    const vvTokens = useFlowContext();
    const [walletLoading, setWalletLoading] = useState(false);
    const [txPending, setTxPending] = useState(false);
    const [txComplete, setTxComplete] = useState(false);
    const [txStatus, setTxStatus] = useState();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async ({ tokenAmount }) => {
        try {
            setTxPending(true);
            const transactionId = await fcl.mutate({
                cadence: transferTokens,
                args: (arg, t) => [
                    arg(props.address, types.Address),
                    arg(tokenAmount.toFixed(5).toString(), types.UFix64),
                ],
                proposer: fcl.currentUser,
                payer: fcl.currentUser,
                authorizations: [fcl.currentUser],
                limit: 1000,
            });

            await fcl
                .tx(transactionId)
                .onceSealed()
                .then((tx) => {
                    setTxComplete(true);
                    setTxPending(false);
                    setTxStatus({
                        message: `https://flowscan.org/transaction/${tx.events[0].transactionId}`,
                        status: "success",
                    });
                })
                .catch((err) => {
                    setTxStatus({ message: err, status: "error" });
                    setTxComplete(true);
                    setTxPending(false);
                });
        } catch (err) {
            setTxStatus({ message: err, status: "error" });
            setTxComplete(true);
            setTxPending(false);
        }
    };

    return (
        <>
            <Dialog {...props}>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            justifyContent="center"
                            alignContent="center"
                            direction="column"
                        >
                            <Box
                                sx={{
                                    py: 5,
                                    px: 7,
                                }}
                            >
                                <Grid item>
                                    <Box
                                        sx={{
                                            pb: 1,
                                            boxShadow:
                                                "rgba(105, 62, 154, 0.5) 0px 2px 0px 0px",
                                        }}
                                    >
                                        <h4
                                            style={{
                                                fontSize: "12px",
                                            }}
                                        >
                                            VIOLET VERSE | $VV
                                        </h4>
                                    </Box>
                                </Grid>
                                {!txComplete ? (
                                    <>
                                        <Grid item sx={{ mt: 2 }}>
                                            <h4>
                                                {txPending
                                                    ? "Confirming Transaction..."
                                                    : "Tip Creator"}
                                            </h4>
                                        </Grid>
                                        {!txPending ? (
                                            <>
                                                <Grid item sx={{ mt: 2 }}>
                                                    <TextField
                                                        variant="standard"
                                                        color="secondary"
                                                        label={
                                                            vvTokens == 0
                                                                ? "Not Enough Tokens"
                                                                : "Amount"
                                                        }
                                                        fullWidth
                                                        type="number"
                                                        disabled={
                                                            txPending ||
                                                            vvTokens == 0
                                                        }
                                                        inputProps={{
                                                            min: 0.0001,
                                                            step: 0.0001,
                                                            max: vvTokens,
                                                        }}
                                                        error={
                                                            !!errors?.tokenAmount
                                                        }
                                                        helperText={
                                                            errors?.tokenAmount
                                                                ? errors
                                                                      .tokenAmount
                                                                      .message
                                                                : null
                                                        }
                                                        {...register(
                                                            "tokenAmount",
                                                            {
                                                                required:
                                                                    "Required",
                                                                valueAsNumber: true,
                                                                validate: (
                                                                    value
                                                                ) => value > 0,
                                                                pattern: {
                                                                    value: /^(0|[1-9]\d*)(\.\d+)?$/,
                                                                    message:
                                                                        "Only numbers",
                                                                },
                                                            }
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        ) : (
                                            <Grid
                                                item
                                                align="center"
                                                sx={{ py: 4.5, px: 5 }}
                                            >
                                                <ScaleLoader
                                                    color="#693E9A"
                                                    height={60}
                                                    width={15}
                                                    radius={4}
                                                />
                                            </Grid>
                                        )}
                                        <Grid item sx={{ mt: 3 }}>
                                            <Box sx={{ position: "relative" }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    disableElevation
                                                    disabled={
                                                        txPending ||
                                                        vvTokens == 0
                                                    }
                                                    sx={{
                                                        backgroundColor:
                                                            "#693E9A",
                                                        color: "white",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "#815AAD",
                                                        },
                                                    }}
                                                >
                                                    Send Tokens
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item sx={{ mt: 2 }}>
                                            <h4>Transaction Status</h4>
                                        </Grid>
                                        {txStatus.status == "error" ? (
                                            <Grid item sx={{ mt: 2 }}>
                                                <h5
                                                    style={{
                                                        inlineSize: "250px",
                                                        overflowWrap:
                                                            "break-word",
                                                    }}
                                                >
                                                    {txStatus.message[0] ||
                                                        "Transaction Cancelled"}
                                                </h5>
                                            </Grid>
                                        ) : (
                                            <>
                                                <Grid item sx={{ mt: 2 }}>
                                                    <h5>Tip Successful!</h5>
                                                </Grid>
                                                <Grid item sx={{ mt: 2 }}>
                                                    <a
                                                        href={txStatus.message}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <h5
                                                            style={{
                                                                color: "purple",
                                                            }}
                                                        >
                                                            View Transaction
                                                        </h5>
                                                    </a>
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item sx={{ mt: 3 }}>
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                onClick={() =>
                                                    setTxComplete(false)
                                                }
                                                sx={{
                                                    backgroundColor: "#693E9A",
                                                    color: "white",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#815AAD",
                                                    },
                                                }}
                                            >
                                                Go Back
                                            </Button>
                                        </Grid>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Tipping;
