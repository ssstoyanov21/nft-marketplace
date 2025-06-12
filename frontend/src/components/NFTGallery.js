import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const NFTGallery = ({ contract }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNFTs = async () => {
    try {
      const totalSupply = await contract.totalSupply();
      const nftArray = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.tokenByIndex(i);
        const tokenURI = await contract.tokenURI(tokenId);
        
        // Fix за IPFS URL (ако е нужно)
        const formattedURI = tokenURI.includes('ipfs://') 
          ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/') 
          : tokenURI;

        const response = await fetch(formattedURI);
        const metadata = await response.json();

        nftArray.push({
          id: tokenId.toString(),
          name: metadata.name || `NFT #${tokenId}`,
          image: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          description: metadata.description || ''
        });
      }

      setNfts(nftArray);
    } catch (error) {
      console.error('Failed to load NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNFTs(); }, [contract]);

  if (loading) return <div className="loading">Loading NFTs...</div>;

  return (
    <div className="nft-grid">
      {nfts.map((nft) => (
        <div key={nft.id} className="nft-card">
          <img src={nft.image} alt={nft.name} className="nft-image" />
          <h3>{nft.name}</h3>
          <button onClick={() => window.location.href = `/nft/${nft.id}`}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default NFTGallery;