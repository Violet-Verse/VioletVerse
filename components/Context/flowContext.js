import { createContext, useContext } from "react";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import React, { useState, useEffect } from "react";
import { getBalance } from "../../cadence/scripts/getBalance";

const FlowContext = createContext();

export function nFormatter(num, digits) {
    if (num === null) {
        return null;
    }
    const lookup = [
        { value: 1, symbol: "" },
        // { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
}

export function FlowWrapper({ children }) {
    const [user, setUser] = useState();
    const [userBalance, setUserBalance] = useState(0);

    useEffect(() => {
        fcl.currentUser.subscribe(setUser);
    }, []);

    useEffect(() => {
        if (user?.addr) {
            const getAccountBalance = async () => {
                await fcl
                    .send([
                        fcl.script(getBalance),
                        fcl.args([fcl.arg(user?.addr, types.Address)]),
                    ])
                    .then(fcl.decode)
                    .then((data) => setUserBalance(data))

                    .catch((err) => {
                        setUserBalance(null);
                        console.log(err);
                    });
            };
            getAccountBalance();
        }
    }, [user]);

    return (
        <FlowContext.Provider value={userBalance}>
            {children}
        </FlowContext.Provider>
    );
}

export function useFlowContext() {
    return useContext(FlowContext);
}
