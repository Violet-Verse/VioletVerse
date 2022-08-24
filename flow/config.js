import * as fcl from "@onflow/fcl";

const resolver = async () => {
    const response = await fetch("/api/generate");
    const { nonce } = await response.json();
    return {
        appIdentifier: "VioletVerse",
        nonce,
    };
};

fcl.config()
    .put("app.detail.title", "Violet Verse")
    .put("app.detail.icon", "https://i.imgur.com/jDJnCzx.png")
    .put("accessNode.api", "https://rest-testnet.onflow.org") // pointing to testnet
    .put("0xVioletVerse", "0xcbc161656bd04954")
    .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
    .put("fcl.accountProof.resolver", resolver)
    .put("flow.network", "testnet");
// .put(
//     "discovery.wallet",
//     "https://flow-wallet-testnet.blocto.app/api/flow/authn"
// )
// .put("discovery.wallet.method", "HTTP/POST")
