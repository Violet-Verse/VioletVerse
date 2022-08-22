export const getBalance = `
import VioletVerse from 0xVioletVerse
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(account: Address) : UFix64 {
  let publicVault = getAccount(account).getCapability(/public/violetVerseBalance)
                      .borrow<&VioletVerse.Vault{FungibleToken.Balance}>()
                      ?? panic("Could not borrow the public Vault.")

  return(publicVault.balance)
}
`;
