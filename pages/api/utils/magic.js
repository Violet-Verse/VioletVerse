import { Magic } from 'magic-sdk';

const customNodeOptions = {
  rpcUrl: YOUR_CUSTOM_EVM_RPC_URL, // Custom RPC URL
  chainId: YOUR_CUSTOM_EVM_CHAIN_ID, // Custom chain id
}
const magic = new Magic("pk_live_814EDBC3C8C17763", {
  network: customNodeOptions
});

/* Connect to any email input or enter your own */
await magic.auth.loginWithEmailOTP({ email: "gm#violetverse.io" });