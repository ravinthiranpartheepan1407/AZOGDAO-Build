import sdk from './sdk';

const app = sdk.getAppModule("0x8796f5E8be4052dc71b34F6f9c103e42244c1eb5");

(async()=>{
  try{
    const tokenModule = await app.deployTokenModule({
      name: "Azog Governance Token",
      symbol: "AZG",
    });

    console.log("Successfully deployed token address", tokenModule.address);
  } catch(error){
    console.error("Failed to deploy token module", error);
  }
})();
