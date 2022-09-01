export const createVault = `
import VioletVerse from 0xVioletVerse
import FungibleToken from 0xf233dcee88fe0abe

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- VioletVerse.createVioletVault(), to: /storage/violetVerseVault)
    acct.link<&VioletVerse.Vault{FungibleToken.Balance, FungibleToken.Receiver}>(/public/violetVerseBalance, target: /storage/violetVerseVault)
  }

  execute {
    log("I saved my own personal Vault!")
  }
}
`;
