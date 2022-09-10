export const transferTokens = `
import VioletVerse from 0xVioletVerse
import FungibleToken from 0xf233dcee88fe0abe

transaction(contributorAddress: Address, amountVV: UFix64, amountContributor: UFix64) {

  prepare(acct: AuthAccount) {
    let signerVault = acct.borrow<&VioletVerse.Vault>(from: /storage/violetVerseVault)
                        ?? panic("Couldn't get the signer's Vault")

    let vvVault = getAccount(0x2793bbf3c8ffa284).getCapability(/public/violetVerseBalance)
                          .borrow<&VioletVerse.Vault{FungibleToken.Receiver}>()
                          ?? panic("Couldn't get the public Vault of vv.")

    let contributorVault = getAccount(contributorAddress).getCapability(/public/violetVerseBalance)
                          .borrow<&VioletVerse.Vault{FungibleToken.Receiver}>()
                          ?? panic("Couldn't get the public Vault of contributor.")

    vvVault.deposit(from: <- signerVault.withdraw(amount: amountVV))
    contributorVault.deposit(from: <- signerVault.withdraw(amount: amountContributor))
    
  }

  execute {
    log("Transferred Violet Verse Token.")
  }
}
`;
