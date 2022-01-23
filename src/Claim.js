import sdk from "./sdk";

const bundleDrop = sdk.getBundleDropModule(
  "0x370306bC40066Bf40554Edf63FaC07941B8B4CE5",
);

(async ()=>{
  try{
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 100_000,
      maxQuantityPerTransaction: 1,
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log(bundleDrop.address);

  } catch(err){
    console.log(err);
  }
}) ()
