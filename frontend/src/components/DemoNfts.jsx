import React from 'react';

export default function DemoNfts({ signer, items, filter, setFilter, openModal }) {
  const userAddress = signer?._address?.toLowerCase();
  
  return (
    <>
      <div className="tabs">
        {["All", "My NFTs", "Available", "Sold"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={filter === tab ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid">
        {items.filter(item => {
          if (filter === "All") return true;
          if (filter === "My NFTs") return item.seller.toLowerCase() === userAddress;
          if (filter === "Available") return !item.sold;
          if (filter === "Sold") return item.sold;
        }).map(item => (
          <div key={item.itemId} className="nft-card">
            <img src={item.image} alt={`NFT #${item.tokenId}`} />
            <p>NFT #{item.tokenId}</p>
            <button onClick={() => openModal(item)}>Details</button>
          </div>
        ))}
      </div>
    </>
  );
}
