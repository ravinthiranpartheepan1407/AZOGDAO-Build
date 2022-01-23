import { ethers } from 'ethers';
import sdk from "./sdk";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0x8796f5E8be4052dc71b34F6f9c103e42244c1eb5");

(async () => {
  try{
    const bundleDrop = await app.deployBundleDropModule({
      name: "Azog DAO Membership",
      description: "A DAO for Azog Comics.",
      image: readFileSync("./icon.png"),
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log("Successfully Dropped Bundle", bundleDrop.address);
    console.log("Metdata:", await bundleDrop.getMetadata(),);

  } catch(err){
    console.log(err);
  }
})()
