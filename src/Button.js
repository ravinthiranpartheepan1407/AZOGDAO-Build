import { useEffect, useMemo, useState } from "react";
import { ethers } from 'ethers';
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x370306bC40066Bf40554Edf63FaC07941B8B4CE5",
);

const tokenModule = sdk.getTokenModule(
  "0x2fb7262194B41345CdDEe327f59563c01C0BC26E",
);

const voteModule = sdk.getVoteModule(
  "0xf7f5c087D8CbD9fBC41350C96fE9a08EC96D1116",
);

const Button = () => {
  const { connectWallet, address, error, provider } = useWeb3();


  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [ memberTokenAmounts, setMemberTokenAmounts ] = useState({});
  const [ memberAddresses, setMemberAddresses ] = useState([]);

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortenAddresses = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };
  console.log("Address:", address);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  bundleDropModule
    .getAllClaimerAddresses("0")
    .then((addresses) => {
      console.log("Members addresses", addresses)
      setMemberAddresses(addresses);
    })
    .catch((err) => {
      console.error("failed to get member list", err);
    });
}, [hasClaimedNFT]);

useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  tokenModule
    .getAllHolderBalances()
    .then((amounts) => {
      console.log("Amounts", amounts)
      setMemberTokenAmounts(amounts);
    })
    .catch((err) => {
      console.error("failed to get token amounts", err);
    });
}, [hasClaimedNFT]);

useEffect(()=>{
  if(!hasClaimedNFT){
    return;
  }
  voteModule
    .getAll()
    .then((proposals)=>{
      setProposals(proposals);
      console.log("proposals", proposals);
    })
    .catch((error)=>{
      console.error("failed to get proposals", error);
    });

}, [hasClaimedNFT]);

useEffect(()=>{
  if(!hasClaimedNFT){
    return;
  }
  if(!proposals.length){
    return;
  }

  voteModule
    .hasVoted(proposals[0].proposalId, address)
    .then((hasVoted)=>{
      setHasVoted(hasVoted);
      if(hasVoted){
        console.log("User has already voted");
      } else {
        console.log("User has not voted yet");
      }
    })

    .catch((error)=>{
      console.error("Failed to check if wallet has voted", error);
    });
}, [hasClaimedNFT, proposals, address]);

const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    return {
      address,
      tokenAmount: ethers.utils.formatUnits(
        memberTokenAmounts[address] || 0,
        18,
      ),
    };
  });
}, [memberAddresses, memberTokenAmounts]);

  if(hasClaimedNFT){
    return(
      <div>
      <br />
        <h1 className="font-semibold text-xl text-white text-center tracking-tight"> AZOG DAO Member Page </h1>
        <br />
        <p className="font-light text-xl text-white text-center tracking-tight"> Congratulations on being a Azog DAO Member </p>
        <br />
        <br />
          {memberList.map((member)=>{
            return(
              <div className="grid grid-cols-4 gap-4 bg-indigo-800 text-white rounded-lg border shadow-lg p-10" key={member.address}>
                <div>Address: {shortenAddresses(member.address)}</div>
                <div>Token Amount:{member.tokenAmount}</div>
              </div>
            );
          })}


      <div>
           <h2 className="font-semibold text-xl text-white text-center tracking-tight">Active Proposals</h2>
           <form
             onSubmit={async (e) => {
               e.preventDefault();
               e.stopPropagation();

               setIsVoting(true);

               const votes = proposals.map((proposal) => {
                 let voteResult = {
                   proposalId: proposal.proposalId,
                   vote: 2,
                 };
                 proposal.votes.forEach((vote) => {
                   const elem = document.getElementById(
                     proposal.proposalId + "-" + vote.type
                   );

                   if (elem.checked) {
                     voteResult.vote = vote.type;
                     return;
                   }
                 });
                 return voteResult;
               });

               try {
                 const delegation = await tokenModule.getDelegationOf(address);
                 if (delegation === ethers.constants.AddressZero) {
                   await tokenModule.delegateTo(address);
                 }
                 try {
                   await Promise.all(
                     votes.map(async (vote) => {
                       const proposal = await voteModule.get(vote.proposalId);
                       if (proposal.state === 1) {
                         return voteModule.vote(vote.proposalId, vote.vote);
                       }
                       return;
                     })
                   );
                   try {
                     await Promise.all(
                       votes.map(async (vote) => {
                         const proposal = await voteModule.get(
                           vote.proposalId
                         );

                         if (proposal.state === 4) {
                           return voteModule.execute(vote.proposalId);
                         }
                       })
                     );
                     setHasVoted(true);
                     console.log("successfully voted");
                   } catch (err) {
                     console.error("failed to execute votes", err);
                   }
                 } catch (err) {
                   console.error("failed to vote", err);
                 }
               } catch (err) {
                 console.error("failed to delegate tokens");
               } finally {
                 setIsVoting(false);
               }
             }}
           >
             {proposals.map((proposal, index) => (
               <div key={proposal.proposalId} className="grid grid-cols-4 content-center gap-4 bg-indigo-800 text-white rounded-lg border shadow-lg p-10">
                 <h5>{proposal.description}</h5>
                 <div>
                   {proposal.votes.map((vote) => (
                     <div key={vote.type}>
                       <input
                         type="radio"
                         id={proposal.proposalId + "-" + vote.type}
                         name={proposal.proposalId}
                         value={vote.type}
                         defaultChecked={vote.type === 2}
                       />
                       <label htmlFor={proposal.proposalId + "-" + vote.type}>
                         {vote.label}
                       </label>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
             <br />
             <p className="font-light items-center text-white text-center tracking-tight">
               This will trigger multiple transactions that you will need to
               sign.
             </p>
             <br />
             <br />
             <button className="inline-block flex px-3 bg-blue-500 py-2 border rounded text-teal-200 text-center border-white-400 hover:text-white hover:border-white" disabled={isVoting || hasVoted} type="submit">
               {isVoting
                 ? "Voting..."
                 : hasVoted
                   ? "You Already Voted"
                   : "Submit Votes"}
             </button>
      
           </form>
         </div>
        </div>

    );
  };


  if (!address) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10" onClick={() => connectWallet("injected")}>
          Connect your wallet
        </button>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
    .claim("0", 1)
    .then(() => {
      setHasClaimedNFT(true);
      console.log(
        `Successfully Minted!OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
      );
    })
    .catch((err) => {
      console.error("failed to claim", err);
    })
    .finally(() => {
      setIsClaiming(false);
    });
  }

  return (
    <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
      <h1 className="font-semibold text-xl tracking-tight">Mint your free AZOG DAO Membership NFT</h1>
      <button className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10"
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
      <p>Successfully Minted!OpenSea: https://testnets.opensea.io/assets/{bundleDropModule.address.toLowerCase()}/0</p>
    </div>
  );
};

export default Button;
