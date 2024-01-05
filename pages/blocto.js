import React, { useState, useEffect } from "react";
import * as fcl from "@blocto/fcl";
import * as types from "@onflow/types";
import "../flow/config.js";
import useSWR, { useSWRConfig } from "swr";
import Router from "next/router";

import { getBalance } from "../cadence/scripts/getBalance";
import { getTotalSupply } from "../cadence/scripts/getTotalSupply";
import { Box, Button, Grid } from "@mui/material";

// 0xcbc161656bd04954

const Blocto = () => {
    const { mutate } = useSWRConfig();

    const [user, setUser] = useState();
    const [totalSupply, setTotalSupply] = useState();
    const [userBalance, setUserBalance] = useState(0);

    const loggedIn = user && user.addr;

    useEffect(() => {
        if (user?.addr) {
            const getAccountBalance = async () => {
                const result = await fcl
                    .send([
                        fcl.script(getBalance),
                        fcl.args([fcl.arg(user?.addr, types.Address)]),
                    ])
                    .then(fcl.decode)
                    .catch((err) => console.log(err));

                setUserBalance(result);
            };
            getAccountBalance();
        }
    }, [user]);

    useEffect(() => {
        const getSupply = async () => {
            const result = await fcl
                .query({
                    cadence: getTotalSupply,
                })
                .catch((err) => console.log(err));

            setTotalSupply(result);
        };
        getSupply();
    }, []);

    const login = async () => {
        const res = await fcl.authenticate();

        const accountProofService = res.services.find(
            (services) => services.type === "account-proof"
        );

        console.log(accountProofService.data);

        const userEmail = res.services.find(
            (services) => services.type === "open-id"
        ).data.email.email;

        console.log(userEmail);

        if (accountProofService) {
            fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address: accountProofService.data.address,
                    nonce: accountProofService.data.nonce,
                    signatures: accountProofService.data.signatures,
                    userEmail,
                }),
            })
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    mutate("/api/database/getUser");
                    Router.push("/");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const logout = () => {
        fcl.unauthenticate();
        setUser(null);
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
            {loggedIn ? (
                <Grid container direction="column" spacing={5} sx={{ mt: 5 }}>
                    <Grid item>
                        <h4>
                            Total Supply:{" "}
                            {(Math.round(totalSupply * 100) / 100).toFixed(2)}
                        </h4>
                    </Grid>

                    <Grid item>
                        <h4>
                            Your Balance:{" "}
                            {(Math.round(userBalance * 100) / 100).toFixed(2)}
                        </h4>
                    </Grid>
                </Grid>
            ) : (
                <>
                    <Grid item>
                        <Button variant="contained" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </Grid>
                    <Button variant="contained" onClick={() => login()}>
                        Log In
                    </Button>
                </>
            )}
        </Box>
    );
};

export default Blocto;
