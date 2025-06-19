import { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import WalletConnector from './components/WalletConnector.jsx';
import NFTModal from './components/NFTModal.jsx';
import DemoNfts from './components/DemoNfts.jsx';
import UploadDemo from './components/UploadDemo.jsx';

import { getProvider, getNFTContract, getMarketContract } from './utils/contracts.js';
import { ethers } from 'ethers';

export default function App() {
  const provider = getProvider();
  const nft = getNFTContract(provider);
  const market = getMarketContract(provider);

  // Wallet & signer
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);

  // Gallery state
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Status (toast / spinner)
  const [status, setStatus] = useState('');

  // Reload items on signer or status change
  useEffect(() => {
    if (signer) {
      reloadItems();
    }
  }, [signer, status]);

  // Единственото reloadItems()
  async function reloadItems() {
    try {
      console.log("🔍 reloadItems() called");
      console.log("🔍 market.address =", market.address);

      const countBN = await market.itemCount();
      console.log("🔍 got itemCount =", countBN.toString());
      const count = countBN.toNumber();

      const loaded = [];
      for (let i = 1; i <= count; i++) {
        const it = await market.items(i);

        // по желание: прескачаме вече продадени
        if (it.sold) continue;

        const totalBN = await market.getTotalPrice(it.itemId);
        const totalPrice = ethers.utils.formatEther(totalBN);

        const tokenURI = await nft.tokenURI(it.tokenId);
        console.log("🔍 fetching metadata from", tokenURI);

        const localTokenURI = tokenURI.startsWith('ipfs://')
          ? tokenURI.replace('ipfs://', 'http://localhost:8080/ipfs/')
          : tokenURI;

        const res = await fetch(localTokenURI);
        console.log(
          "🔍 metadata response:",
          res.status,
          res.headers.get("content-type")
        );

        const meta = await res.json();

        loaded.push({
          itemId: it.itemId.toNumber(),
          tokenId: it.tokenId.toNumber(),
          price: ethers.utils.formatEther(it.price),
          totalPrice,
          seller: it.seller,
          sold: it.sold,
          image: meta.image,
          name: meta.name,
        });
      }

      setItems(loaded);
    } catch (err) {
      console.error("🔴 Failed to load items:", err);
    }
  }

  return (
    <Router>
      <Navbar address={address} provider={provider} />

      <nav className="bg-white shadow p-4 mb-6 flex space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">
          All NFTs
        </Link>
        <Link to="/upload" className="text-blue-600 hover:underline">
          Upload NFT
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto p-6 bg-gray-100 dark:bg-gray-200 rounded-xl shadow-lg space-y-6">
        <WalletConnector
          onConnect={(sign, addr) => {
            setSigner(sign);
            setAddress(addr);
          }}
        />

        <Routes>
          {/* Main gallery & buy page */}
          <Route
            path="/"
            element={
              <DemoNfts
                signer={signer}
                market={market}
                nft={nft}
                items={items}
                filter={filter}
                setFilter={setFilter}
                openModal={(item) => {
                  setActiveItem(item);
                  setModalOpen(true);
                }}
              />
            }
          />

          {/* Upload / mint page */}
          <Route
            path="/upload"
            element={
              <UploadDemo
                signer={signer}
                nft={nft}
                market={market}
                reloadItems={reloadItems}
                setStatus={setStatus}
              />
            }
          />
        </Routes>

        {/* Modal for viewing & buying */}
        <NFTModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveItem(null);
          }}
          item={activeItem}
          onBuy={async (id) => {
            setStatus('Purchasing…');
            const total = await market.getTotalPrice(id);
            await market.connect(signer).purchaseItem(id, { value: total });
            setStatus('✅ Purchased!');
            reloadItems();
            setModalOpen(false);
          }}
        />

        {/* Status messages */}
        {status && (
          <div className={`toast ${status.includes('…') ? 'flex items-center' : ''}`}>
            {status.includes('…') ? <span className="spinner mr-2" /> : null}
            {status}
          </div>
        )}
      </div>
    </Router>
  );
}
