import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const NFTDetails = ({ contract }) => {
  const { id } = useParams();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const fetchNFT = async () => {
      const tokenURI = await contract.tokenURI(id);
      const formattedURI = tokenURI.includes('ipfs://') 
        ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/') 
        : tokenURI;

      const response = await fetch(formattedURI);
      const metadata = await response.json();

      setNft({
        ...metadata,
        image: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
      });
    };

    fetchNFT();
  }, [id, contract]);

  if (!nft) return <div>Loading...</div>;

  return (
    <div className="nft-details">
      <img src={nft.image} alt={nft.name} className="detail-image" />
      <div className="metadata">
        <h1>{nft.name}</h1>
        <p>{nft.description}</p>
        <button className="buy-button">Buy Now</button>
      </div>
    </div>
  );
};

export default NFTDetails;