import { createContext, useContext } from "react";
import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useAuth";

// Dynamic import for FCL - only loads on client side
let fcl = null;
let types = null;

if (typeof window !== 'undefined') {
    fcl = require("@onflow/fcl");
    types = require("@onflow/types");
    
    // Configure FCL for Flow Mainnet
    fcl.config({
        "accessNode.api": "https://rest-mainnet.onflow.org",
        "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
        "app.detail.title": "Violet Verse",
        "app.detail.icon": "https://violetverse.io/logo.png",
    });
}

const FlowContext = createContext();

export function nFormatter(num, digits) {
    if (num === null) {
        return null;
    }
    const lookup = [
        { value: 1, symbol: "" },
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
    const [userBalance, setUserBalance] = useState(0);
    const { user, loaded } = useUser();

    useEffect(() => {
        // Only run on client side when FCL is available
        if (!fcl || !types || !user?.flowAddress) return;
        
        // Dynamically import getBalance script
        import("../../cadence/scripts/getBalance").then(({ getBalance }) => {
            const getAccountBalance = async () => {
                await fcl
                    .send([
                        fcl.script(getBalance),
                        fcl.args([fcl.arg(user?.flowAddress, types.Address)]),
                    ])
                    .then(fcl.decode)
                    .then((data) => setUserBalance(data))
                    .catch((err) => {
                        setUserBalance(null);
                        console.log(err);
                    });
            };
            getAccountBalance();
        });
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