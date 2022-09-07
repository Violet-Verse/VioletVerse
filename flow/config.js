import * as fcl from "@onflow/fcl";

const resolver = async () => {
    const response = await fetch("/api/auth/generate");
    const { nonce } = await response.json();
    return {
        appIdentifier: "VioletVerse",
        nonce,
    };
};

fcl.config()
    .put("app.detail.title", "Violet Verse")
    .put("app.detail.icon", "https://i.imgur.com/jDJnCzx.png")
    .put("accessNode.api", "https://rest-mainnet.onflow.org") // pointing to mainnet
    .put("0xVioletVerse", "0xf5f7db710acb59d3")
    .put("discovery.wallet", "https://flow-wallet.blocto.app/authn")
    .put("fcl.accountProof.resolver", resolver)
    .put("flow.network", "mainnet");
