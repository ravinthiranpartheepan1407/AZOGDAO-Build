import sdk from './sdk.js';

const appModule = sdk.getAppModule(
  "0x8796f5E8be4052dc71b34F6f9c103e42244c1eb5",
);

(async()=>{
  try{
    const voteModule = await appModule.deployVoteModule({
      name: "Azog DAO Comic Proposals",
      votingTokenAddress: "0x2fb7262194B41345CdDEe327f59563c01C0BC26E",
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log("Successfully deployed vote module", voteModule.address);
  } catch(error){
    console.error("Failed to deploy", error);
  }
}) ();
