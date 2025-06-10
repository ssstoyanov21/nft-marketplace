// src/utils/contracts.js
import { ethers } from 'ethers';
import NFTArtifact from '../abis/NFT.json';
import MarketArtifact from '../abis/Marketplace.json';

const NFT_ABI = NFTArtifact.abi;
const MARKET_ABI = MarketArtifact.abi;

/**
 * Създава и връща ethers Provider:
 * - ако имаш VITE_RPC_URL в .env → JSON-RPC към твоя node
 * - иначе – MetaMask (window.ethereum)
 */
export function getProvider() {
  if (import.meta.env.VITE_RPC_URL) {
    return new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
  }
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  throw new Error('No provider available');
}

/**
 * Връща Signer (MetaMask) от provider-а
 */
export function getSigner(provider) {
  return provider.getSigner();
}

/**
 * Инициализира NFT контракт от ABI и адрес в .env:
 * VITE_NFT_CONTRACT_ADDRESS=0x...
 */
export function getNFTContract(signerOrProvider) {
  const address = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error('Missing VITE_NFT_CONTRACT_ADDRESS in .env');
  }
  return new ethers.Contract(address, NFT_ABI, signerOrProvider);
}

/**
 * Инициализира Marketplace контракт от ABI и адрес в .env:
 * VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
 */
export function getMarketContract(signerOrProvider) {
  const address = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
  if (!address) {
    throw new Error('Missing VITE_MARKETPLACE_CONTRACT_ADDRESS in .env');
  }
  return new ethers.Contract(address, MARKET_ABI, signerOrProvider);
}

/**
 * Помощна функция за изчисляване на total price (price + fee):
 */
export async function getTotalPrice(marketContract, itemId) {
  const total = await marketContract.getTotalPrice(itemId);
  return total;
}

/**
 * Помощна функция за delist:
 */
export async function delistItem(marketContract, itemId) {
  const tx = await marketContract.delistItem(itemId);
  await tx.wait();
  return true;
}
