export const getBalance = `
import VioletVerse from 0xVioletVerse
import FungibleToken from 0xf233dcee88fe0abe

pub fun main(account: Address) : UFix64 {
  let publicVault = getAccount(account).getCapability(/public/violetVerseBalance)
                      .borrow<&VioletVerse.Vault{FungibleToken.Balance}>()
                      ?? panic("Could not borrow the public Vault.")

  return(publicVault.balance)
}
`;
