// frontend/src/utils/ethers.js
import { ethers } from "ethers";
import nftAbi from "../abis/NFT.json";
import marketAbi from "../abis/Marketplace.json";
import { RPC_URL, NFT_ADDRESS, MARKET_ADDRESS } from "../config";

export function createContracts() {
  // Ако искаш да работиш без MetaMask (само JSON-RPC):
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

 
  const signer = provider.getSigner();

  const nftContract = new ethers.Contract(NFT_ADDRESS, nftAbi.abi, signer);
  const marketContract = new ethers.Contract(MARKET_ADDRESS, marketAbi.abi, signer);

  // Debug:
  provider.getNetwork().then(net => console.log("Connected network:", net));
  console.log("NFT contract @", NFT_ADDRESS, nftContract.address);
  console.log("Market contract @", MARKET_ADDRESS, marketContract.address);

  return { provider, nftContract, marketContract };
}
