import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // тук backend-ът слуша

export const getAllNFTs = () => axios.get(`${API_URL}/nfts`);

export const mintNFT = (data) => axios.post(`${API_URL}/nfts/mint`, data);

export const buyNFT = (id, data) => axios.post(`${API_URL}/nfts/${id}/buy`, data);

export const getMyNFTs = (address) => axios.get(`${API_URL}/my-nfts/${address}`);
