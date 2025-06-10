// src/components/DemoNfts.jsx
import React from 'react';

export default function DemoNfts({ signer, market, nft, items, filter, setFilter, openModal }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">NFT Gallery</h2>

      <div className="flex space-x-4 mb-4">
        {['All', 'Available', 'My NFTs', 'Sold'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 ${
              filter === tab ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            } rounded`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items
          .filter(item => {
            if (filter === 'All') return true;
            if (filter === 'Available') return !item.sold;
            if (filter === 'My NFTs') return signer && item.seller.toLowerCase() === signer._address.toLowerCase();
            if (filter === 'Sold') return item.sold;
          })
          .map(item => (
            <div key={item.itemId} className="border rounded p-4">
              {item.image && (
                <img src={item.image} alt={`Token #${item.tokenId}`} className="mb-2 w-full h-32 object-cover" />
              )}
              <p>Token #{item.tokenId}</p>
              <p>Price: {item.price} ETH</p>
              <p>Total: {item.totalPrice} ETH</p>
              <button
                onClick={() => openModal(item)}
                className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
              >
                View / Buy
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}
