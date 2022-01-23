import sdk from './sdk';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule(
  "0x370306bC40066Bf40554Edf63FaC07941B8B4CE5",
);

(async ()=>{
  try{
    await bundleDrop.createBatch([
      {
        name: "Rosie NFT",
        description: "Rosie Volume 1 Story",
        image: readFileSync("./Rosie.jpg"),
      },
    ]);
    console.log("Successfully Dropped NFT");
  } catch(err){
    console.log(err);
  }
}) ()
