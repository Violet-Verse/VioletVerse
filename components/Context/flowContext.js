import { createContext, useContext } from "react";
import React from "react";

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
    // Temporarily return 0 balance until we fix FCL
    return (
        <FlowContext.Provider value={0}>
            {children}
        </FlowContext.Provider>
    );
}

export function useFlowContext() {
    return useContext(FlowContext);
}