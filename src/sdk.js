import { ThirdwebSDK } from '@3rdweb/sdk';
import ethers from 'ethers';

import dotenv from "dotenv";
dotenv.config();

if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == ""){
  console.log("Private Key Not Found");
}

if(!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == ""){
  console.log("Alchemy API Not Found");
}

if(!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == ""){
  console.log("Wallet Address Not Found");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async()=>{
  try{
    const apps = await sdk.getApps();
    console.log("Your App Address is:", apps[0].address);
  } catch(err){
    console.error("Failed to get apps from SDK", err);

  }
})()

export default sdk;
