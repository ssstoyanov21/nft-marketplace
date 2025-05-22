import { ethers } from 'ethers'
import NFTArtifact    from '../abis/NFT.json'
import MarketArtifact from '../abis/Marketplace.json'

const NFTABI    = NFTArtifact.abi
const MarketABI = MarketArtifact.abi

console.log('📦 [contracts.js] MarketArtifact.abi =', MarketArtifact.abi);
console.log("📦 NFTABI:", NFTABI);

export function getProvider() {
  if (import.meta.env.VITE_RPC_URL) {
    return new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL)
  }
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum)
  }
  throw new Error('No provider available')
}

export function getSigner(provider) {
  return provider.getSigner()
}

export function getNFTContract(signerOrProvider) {
  const address = import.meta.env.VITE_NFT_CONTRACT_ADDRESS
  if (!address) {
    throw new Error('Missing VITE_NFT_CONTRACT_ADDRESS in env')
  }
  return new ethers.Contract(address, NFTABI, signerOrProvider)
}

export function getMarketContract(signerOrProvider) {
  const address = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS
  if (!address) {
    throw new Error('Missing VITE_MARKETPLACE_CONTRACT_ADDRESS in env')
  }
  return new ethers.Contract(address, MarketABI, signerOrProvider)
}

export async function getTotalPrice(marketContract, itemId) {
  const total = await marketContract.getTotalPrice(itemId);
  return total;
}

export async function delistItem(marketContract, itemId) {
  const tx = await marketContract.delistItem(itemId);
  await tx.wait();
  return true;
}