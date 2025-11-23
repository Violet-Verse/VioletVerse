export const transferTokens = `
import VioletVerse from 0xVioletVerse
import FungibleToken from 0xf233dcee88fe0abe

transaction(receiverAccount: Address, amount: UFix64) {

  prepare(acct: AuthAccount) {
    let signerVault = acct.borrow<&VioletVerse.Vault>(from: /storage/violetVerseVault)
                        ?? panic("Couldn't get the signer's Vault")
    let receiverVault = getAccount(receiverAccount).getCapability(/public/violetVerseBalance)
                          .borrow<&VioletVerse.Vault{FungibleToken.Receiver}>()
                          ?? panic("Couldn't get the public Vault.")

    receiverVault.deposit(from: <- signerVault.withdraw(amount: amount))
    
  }

  execute {
    log("Transferred Violet Verse Token.")
  }
}
`
