import { ethers } from 'ethers';
import sdk from './sdk';

const tokenModule = sdk.getTokenModule(
  "0x2fb7262194B41345CdDEe327f59563c01C0BC26E",
);

(async()=>{
  try{
    const amount = 1_000_000;
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(),18);
    await tokenModule.mint(amountWith18Decimals);
    const tokenSupply = await tokenModule.totalSupply();

    console.log("Now", ethers.utils.formatUnits(tokenSupply, 18), "$AZG in circulation",);
  } catch(error){
    console.error("Failed to print tokenMoney", error)
  }
})();
