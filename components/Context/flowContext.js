import { createContext, useContext } from "react";
import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useAuth";

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
        // Only run on client side
        if (typeof window === 'undefined' || !user?.flowAddress) return;
        
        // Dynamically import everything
        Promise.all([
            import("@onflow/fcl"),
            import("@onflow/types"),
            import("../../cadence/scripts/getBalance")
        ]).then(([fclModule, typesModule, { getBalance }]) => {
            const fcl = fclModule.default || fclModule;
            const types = typesModule.default || typesModule;
            
            // Configure FCL
            fcl.config({
                "accessNode.api": "https://rest-mainnet.onflow.org",
                "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
                "app.detail.title": "Violet Verse",
                "app.detail.icon": "https://violetverse.io/logo.png",
            });
            
            const getAccountBalance = async () => {
                try {
                    const data = await fcl
                        .send([
                            fcl.script(getBalance),
                            fcl.args([fcl.arg(user?.flowAddress, types.Address)]),
                        ])
                        .then(fcl.decode);
                    setUserBalance(data);
                } catch (err) {
                    setUserBalance(null);
                    console.log(err);
                }
            };
            
            getAccountBalance();
        }).catch(err => {
            console.error("Failed to load Flow modules:", err);
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