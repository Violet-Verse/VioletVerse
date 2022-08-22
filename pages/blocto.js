import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

import { getBalance } from "../cadence/scripts/getBalance";
import { getTotalSupply } from "../cadence/scripts/getTotalSupply";
import { Box, Button, Grid, Stack } from "@mui/material";

// 0xcbc161656bd04954

fcl.config()
    .put("app.detail.title", "Violet Verse")
    .put("app.detail.icon", "https://i.imgur.com/jDJnCzx.png")
    .put("accessNode.api", "https://rest-testnet.onflow.org") // pointing to testnet
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn") // tells  our dapp to use testnet wallets
    .put("0xVioletVerse", "0xcbc161656bd04954");

const Blocto = () => {
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
    }, [user?.addr]);

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

    const logIn = () => {
        fcl.authenticate();
        fcl.currentUser().subscribe(setUser);
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
                        <Button variant="contained" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </Grid>
                    <Grid item>
                        <h4>Account Address: {user?.addr}</h4>
                    </Grid>
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
                <Button variant="contained" onClick={() => logIn()}>
                    Log In
                </Button>
            )}
        </Box>
    );
};

export default Blocto;
