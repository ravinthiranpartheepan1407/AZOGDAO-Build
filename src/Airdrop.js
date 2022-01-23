import { ethers } from 'ethers';
import sdk from './sdk.js';

const bundleDropModule = sdk.getBundleDropModule(
  "0x370306bC40066Bf40554Edf63FaC07941B8B4CE5",
);

const tokenModule = sdk.getTokenModule(
  "0x2fb7262194B41345CdDEe327f59563c01C0BC26E",
);

(async()=>{
  try{
    const walletAddress = await bundleDropModule.getAllClaimerAddresses("0");
    if(walletAddress === 0){
      console.log("No NFT Has claimed yet");
      process.exit(0);
    }
    const airDropTargets = walletAddress.map((address)=>{
      const randomAmount = Math.floor(Math.random()*(10000 - 1000 + 1) + 1000);
      console.log("Going to airdrop:", randomAmount, "Token to:", address);

      const airDropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
      return airDropTarget;
    });
    console.log("Starting Air Drop");
    await tokenModule.transferBatch(airDropTargets);
    console.log("Successfully Airdropped Tokens");
  } catch(error){
    console.error("Failed to airddrop tokens");
  }
})();
