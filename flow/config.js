import * as fcl from '@blocto/fcl'

const resolver = async () => {
  const response = await fetch('/api/auth/generate')
  const { nonce } = await response.json()
  return {
    appIdentifier: 'VioletVerse',
    nonce,
  }
}

fcl.config({
  'app.detail.title': 'Violet Verse',
  'app.detail.icon': 'https://i.imgur.com/jDJnCzx.png',
  'accessNode.api': 'https://rest-mainnet.onflow.org',
  '0xVioletVerse': '0xf5f7db710acb59d3',
  'discovery.wallet': 'https://wallet-v2.blocto.app/api/flow/authn',
  'fcl.accountProof.resolver': resolver,
  //"app.detail.id": "YOUR_DAPP_ID"// this line is optional
  'discovery.wallet.method': 'HTTP/POST',
})

//// old config
// fcl.config()
//     .put("app.detail.title", "Violet Verse")
//     .put("app.detail.icon", "https://i.imgur.com/jDJnCzx.png")
//     .put("accessNode.api", "https://rest-mainnet.onflow.org") // pointing to mainnet
//     .put("0xVioletVerse", "0xf5f7db710acb59d3")
//     .put("discovery.wallet", "https://flow-wallet.blocto.app/authn")
//     .put("fcl.accountProof.resolver", resolver)
//     .put("flow.network", "mainnet");
