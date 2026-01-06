import * as fcl from "@onflow/fcl";

const resolver = async () => {
    const response = await fetch("/api/auth/generate");
    const { nonce } = await response.json();
    return {
        appIdentifier: "VioletVerse",
        nonce,
    };
};

fcl.config({
    "app.detail.title": "Violet Verse",
    "app.detail.icon": "https://i.imgur.com/jDJnCzx.png",
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "0xVioletVerse": "0xf5f7db710acb59d3",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn", // Updated for standard Flow wallets
    "fcl.accountProof.resolver": resolver,
    "discovery.wallet.method": "HTTP/POST"
});