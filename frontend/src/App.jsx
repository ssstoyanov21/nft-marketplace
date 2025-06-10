// src/App.jsx
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

  // Load items whenever signer or status changes
  useEffect(() => {
    if (signer) reloadItems();
  }, [signer, status]);

  async function reloadItems() {
    try {
      const countBN = await market.itemCount();
      const count = countBN.toNumber();
      const loaded = [];

      for (let i = 1; i <= count; i++) {
        const it = await market.items(i);
        const totalBN = await market.getTotalPrice(it.itemId);
        const total = ethers.utils.formatEther(totalBN);

        let image = null;
        try {
          const uri = await nft.tokenURI(it.tokenId);
          const res = await fetch(uri);
          const meta = await res.json();
          image = meta.image;
        } catch {}

        loaded.push({
          itemId: it.itemId.toNumber(),
          tokenId: it.tokenId.toNumber(),
          price: ethers.utils.formatEther(it.price),
          totalPrice: total,
          seller: it.seller,
          sold: it.sold,
          image,
        });
      }

      setItems(loaded);
    } catch (err) {
      console.error('Failed to load items', err);
    }
  }

  return (
    <Router>
      <Navbar address={address} provider={provider} />

      <nav className="bg-white shadow p-4 mb-6 flex space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">All NFTs</Link>
        <Link to="/upload" className="text-blue-600 hover:underline">Upload NFT</Link>
      </nav>

      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
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
          onClose={() => setModalOpen(false)}
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
