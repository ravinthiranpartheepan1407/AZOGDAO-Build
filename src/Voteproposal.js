import { ethers } from 'ethers';
import sdk from './sdk.js';

const voteModule = sdk.getVoteModule(
  "0xf7f5c087D8CbD9fBC41350C96fE9a08EC96D1116",
);

const tokenModule = sdk.getTokenModule(
  "0x2fb7262194B41345CdDEe327f59563c01C0BC26E",
);

(async () => {
  try {
    const amount = 420_000;
    await voteModule.propose(
      "Should the AZOG DAO create Rose Volume 2 comic and mint an additional " + amount + " tokens into the pool?",
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "mint",
            [
              voteModule.address,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );

    console.log("Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    await voteModule.propose(
      "Should the AZOG DAO transfer " +
      amount + " tokens from the pool to " +
      process.env.WALLET_ADDRESS + " for being innovative?",
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "transfer",
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

    console.log(
      "Successfully created proposal to reward ourselves from the pool, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
