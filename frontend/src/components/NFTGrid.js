import { useEffect, useState } from 'react';

function NFTGrid({ nfts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {nfts.map((nft) => (
        <div key={nft.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-48 object-cover"
            onError={(e) => e.target.src = 'https://via.placeholder.com/200'} // Fallback ако снимката не се зареди
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">{nft.name}</h3>
            <p className="text-gray-600">{nft.price} ETH</p>
            <button className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}