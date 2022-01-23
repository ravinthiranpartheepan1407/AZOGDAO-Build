import { ethers } from 'ethers';
import sdk from './sdk.js';

const voteModule = sdk.getVoteModule(
  "0xf7f5c087D8CbD9fBC41350C96fE9a08EC96D1116",
);

const tokenModule = sdk.getTokenModule(
  "0x2fb7262194B41345CdDEe327f59563c01C0BC26E",
);

(async()=>{
  try{
    await tokenModule.grantRole("minter", voteModule.address);
    console.log("Succesfully granted role");

  } catch(error){
    console.error("Failed to grant a role", error);
    process.exit(1);
  }

  try{
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );

    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(
      voteModule.address,
      percent
    );
    console.log("Succesfully trasnfered token to vote mod");
  } catch (error){
    console.error("Failed to trasnfer tokens", error);
  }
}) ();
