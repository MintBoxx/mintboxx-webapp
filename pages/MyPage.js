import { ethers } from "ethers";
import { useState, useEffect } from "react";
import {
  QUICKMINT_FACTORY_ABI,
  QUICKMINT_FACTORY_ADDRESS,
} from "../blockchain/constants";

const MyPage = () => {
  const [address, setAddress] = useState("");


//     useEffect(() => {
//       const addr = localStorage.getItem("walletAddress");
//       setAddress(addr);
//     }, []);

  async function check() {
    const addr = localStorage.getItem("walletAddress");
      setAddress(addr);

     // Check if MetaMask is installed
     console.log(addr);
     if (typeof window.ethereum === "undefined") {
       alert("Please install MetaMask first.");
       return;
     }
 
     // Connect to the MetaMask provider
     window.addEventListener("load", async () => {
       try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
       } catch (error) {}
     });

    const provider = new ethers.providers.Web3Provider(window.ethereum)

// MetaMask requires requesting permission to connect users accounts
await provider.send("eth_requestAccounts", []);

// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner()
    // Create an instance of your smart contract
    const contractAddress = QUICKMINT_FACTORY_ADDRESS; // Replace with your contract address
    const abi = QUICKMINT_FACTORY_ABI; // Replace with your contract ABI
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Get data from your smart contract
    const data = await contract.userCollectionExists(addr);
    // Use the data to render the page
    console.log(data);
  }

  async function settingAddress(){
    const addr = localStorage.getItem("walletAddress");
    setAddress(addr);
  }

useEffect(() => {
  // settingAddress();
  check();
}, []);

  return <div>Hello</div>
  // <div><button onClick={check}>Check</button></div>
  
  ;
};

export default MyPage;
