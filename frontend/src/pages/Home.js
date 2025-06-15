import { useState } from 'react';
import NFTGrid from '../components/NFTGrid';
import { useContractRead } from 'wagmi';

function Home() {
  const [activeTab, setActiveTab] = useState('All');
  const [nfts, setNfts] = useState([]); // Тук ще заредиш NFT-тата от контракта

  // Примерни данни (замени с реални от контракта)
  const mockNFTs = [
    { id: 1, name: "Cool NFT", image: "https://example.com/nft1.jpg", price: 0.1, status: "Available" },
    { id: 2, name: "Rare Art", image: "https://example.com/nft2.jpg", price: 0.5, status: "Sold" },
  ];

  const filteredNFTs = activeTab === 'All' 
    ? mockNFTs 
    : mockNFTs.filter(nft => nft.status === activeTab);

  return (
    <div>
      <div className="flex space-x-4 p-4 border-b">
        {['All', 'Available', 'Sold'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <NFTGrid nfts={filteredNFTs} />
    </div>
  );
}