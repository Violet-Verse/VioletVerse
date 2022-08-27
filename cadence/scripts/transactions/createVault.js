export const createVault = `
import VioletVerse from 0xVioletVerse
import FungibleToken from 0x9a0766d93b6608b7

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- VioletVerse.createEmptyVault(), to: /storage/violetVerseVault)
    acct.link<&VioletVerse.Vault{FungibleToken.Balance, FungibleToken.Receiver}>(/public/violetVerseBalance, target: /storage/violetVerseVault)
  }

  execute {
    log("I saved my own personal Vault!")
  }
}
`;
