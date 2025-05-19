import { ethers } from 'ethers';
import NFTABI from '../abis/NFT.json';
import MarketABI from '../abis/Marketplace.json';

/**
 * Returns a JsonRpcProvider to the local Ganache network
 */
export function getProvider() {
  return new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
}

/**
 * Returns a Web3Provider signer using window.ethereum (MetaMask)
 */
export function getSigner() {
  if (typeof window !== 'undefined' && window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  }
  throw new Error('No Ethereum provider found');
}

/**
 * Returns an instance of the NFT contract (ERC721) at the configured address
 */
export function getNFTContract(signerOrProvider) {
  return new ethers.Contract(
    import.meta.env.VITE_NFT_CONTRACT_ADDRESS,
    NFTABI,
    signerOrProvider
  );
}

/**
 * Returns an instance of the Marketplace contract at the configured address
 */
export function getMarketContract(signerOrProvider) {
  return new ethers.Contract(
    import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS,
    MarketABI,
    signerOrProvider
  );
}
