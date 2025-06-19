import React from 'react';

export default function DemoNfts({ items, openModal }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All NFTs</h2>
      <div className="nft-grid">
        {items.map(item => (
          <div
            key={item.itemId}
            className="nft-card"
            onClick={() => openModal(item)}
          >
            <img
              className="nft-image"
              src={item.image}
              alt={item.name}
            />
            <div className="p-4">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.price} ETH</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}