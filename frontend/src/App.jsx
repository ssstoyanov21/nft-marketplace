import React, { useState, useEffect } from "react";
import Navbar        from "./components/Navbar.jsx";
import WalletConnector from "./components/WalletConnector.jsx";
import NFTModal      from "./components/NFTModal.jsx";
import { getProvider, getNFTContract, getMarketContract } from "./utils/contracts";
import { ethers }    from "ethers";


export default function App() {
  // 1) Wallet + контракти
  const [signer, setSigner]   = useState(null);
  const [address, setAddress] = useState(null);
  const provider = getProvider();
  const nft      = getNFTContract(signer || provider);
  const market   = getMarketContract(signer || provider);

  // 3) List / Buy
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice]     = useState("");

  // 4) Chainlink feeds
  const [feedToken, setFeedToken]     = useState("");
  const [feedAddress, setFeedAddress] = useState("");
  const [ethUsdPrice, setEthUsdPrice] = useState(null);
  const [tokenUsdPrice, setTokenUsdPrice] = useState(null);

  // 5) Items + Gallery state
  const [items, setItems]     = useState([]);
  const [filter, setFilter]   = useState("All");
  const [modalOpen, setModalOpen]  = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // 6) Status (spinner / toast)
  const [status, setStatus]   = useState("");

  // --- HANDLERS ---

  // List NFT
  async function handleList() {
    try {
      setStatus("Listing…");
      await nft.connect(signer).approve(market.address, tokenId);
      const tx = await market
        .connect(signer)
        .makeItem(nft.address, tokenId, ethers.utils.parseEther(price), ethers.constants.AddressZero);
      await tx.wait();
      setStatus("✅ NFT listed!");
      reloadItems();
    } catch (err) {
      console.error(err);
      setStatus("❌ Error listing: " + err.message);
    }
  }

  // Buy NFT
  async function handleBuy(id) {
    try {
      const itemId = id ?? tokenId;
      setStatus("Buying…");
      const total = await market.getTotalPrice(itemId);
      const tx = await market.connect(signer).purchaseItem(itemId, { value: total });
      await tx.wait();
      setStatus("✅ Bought!");
      reloadItems();
    } catch (err) {
      console.error(err);
      setStatus("❌ Error buying: " + err.message);
    }
  }

  // Set Chainlink feed
  async function handleSetFeed() {
    try {
      setStatus("Setting feed…");
      const tx = await market.connect(signer).setPriceFeed(feedToken, feedAddress);
      await tx.wait();
      setStatus("✅ Feed set!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error setting feed: " + err.message);
    }
  }

  // Get prices
  async function handleGetEthPrice() {
    const p = await market.getEthPriceUsd();
    setEthUsdPrice(p);
  }
  async function handleGetTokenPrice() {
    const p = await market.getTokenPriceUsd(feedToken);
    setTokenUsdPrice(p);
  }

  // Delist
  async function handleDelist(itemId) {
    try {
      setStatus("Delisting…");
      const tx = await market.connect(signer).delistItem(itemId);
      await tx.wait();
      setStatus("✅ Delisted!");
      reloadItems();
    } catch (err) {
      console.error(err);
      setStatus("❌ Error delisting: " + err.message);
    }
  }

  // Load all items + fetch metadata.image
  async function reloadItems() {
    try {
      const countBN = await market.itemCount();             // <<-- бележка: това е функция!
      const count   = countBN.toNumber();
      const loaded  = [];
      for (let i = 1; i <= count; i++) {
        const it = await market.items(i);
        let image = null;
        try {
          const uri  = await nft.tokenURI(it.tokenId);
          const res  = await fetch(uri);
          const meta = await res.json();
          image = meta.image;
        } catch {}
        loaded.push({
          itemId: it.itemId.toNumber(),
          tokenId: it.tokenId.toNumber(),
          price: ethers.utils.formatEther(it.price),
          seller: it.seller,
          sold: it.sold,
          image
        });
      }
      setItems(loaded);
    } catch (err) {
      console.error("reloadItems error", err);
    }
  }

  // Modal helpers
  function openModal(item) {
    setActiveItem(item);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setActiveItem(null);
  }
  async function handleBuyFromModal(itemId) {
    await handleBuy(itemId);
    closeModal();
  }

  // при connect или status промяна → презареждаме
  useEffect(() => {
    if (signer) reloadItems();
  }, [signer, status]);

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar address={address} provider={provider} />

      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
        <WalletConnector
          onConnect={(sign, addr) => {
            setSigner(sign);
            setAddress(addr);
          }}
        />

        {signer && (
          <>
            {/* 3) List NFT */}
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">List NFT</h2>
              <div className="flex space-x-2">
                <input
                  className="border p-1 w-20"
                  type="number"
                  placeholder="Token ID"
                  value={tokenId}
                  onChange={e => setTokenId(e.target.value)}
                />
                <input
                  className="border p-1 w-32"
                  type="text"
                  placeholder="Price (ETH)"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
                <button onClick={handleList} className="btn">List</button>
              </div>
            </section>

            {/* 3) Buy NFT */}
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Buy NFT</h2>
              <div className="flex space-x-2">
                <input
                  className="border p-1 w-20"
                  type="number"
                  placeholder="Item ID"
                  value={tokenId}
                  onChange={e => setTokenId(e.target.value)}
                />
                <button onClick={() => handleBuy()} className="btn">Buy</button>
              </div>
            </section>

            {/* 4) Set Price Feed */}
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Set Price Feed</h2>
              <div className="flex space-x-2">
                <input
                  className="border p-1 flex-1"
                  type="text"
                  placeholder="Token Address"
                  value={feedToken}
                  onChange={e => setFeedToken(e.target.value)}
                />
                <input
                  className="border p-1 flex-1"
                  type="text"
                  placeholder="Feed Address"
                  value={feedAddress}
                  onChange={e => setFeedAddress(e.target.value)}
                />
                <button onClick={handleSetFeed} className="btn">Set Feed</button>
              </div>
            </section>

            {/* 4) View Price Feeds */}
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Price Feeds</h2>
              <div className="flex space-x-2 items-center">
                <button onClick={handleGetEthPrice} className="btn">ETH/USD</button>
                {ethUsdPrice && <span>{ethers.utils.formatUnits(ethUsdPrice, 8)} USD</span>}
              </div>
              <div className="flex space-x-2 items-center">
                <input
                  className="border p-1 flex-1"
                  type="text"
                  placeholder="Token Address"
                  value={feedToken}
                  onChange={e => setFeedToken(e.target.value)}
                />
                <button onClick={handleGetTokenPrice} className="btn">Token/USD</button>
                {tokenUsdPrice && <span>{ethers.utils.formatUnits(tokenUsdPrice, 8)} USD</span>}
              </div>
            </section>

            {/* 5) NFT Gallery + Filters */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                NFT Gallery
              </h2>
              <div className="flex space-x-4 border-b pb-2 text-gray-700 dark:text-gray-300">
                {["All", "My NFTs", "Available", "Sold"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`py-1 ${filter === tab ? "border-b-2 border-indigo-600" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {items.filter(item => {
                  if (filter === "All") return true;
                  if (filter === "My NFTs")   return item.seller.toLowerCase() === signer._address.toLowerCase();
                  if (filter === "Available") return !item.sold;
                  if (filter === "Sold")      return item.sold;
                }).map(item => (
                  <div key={item.itemId} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={`Token #${item.tokenId}`} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4 space-y-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Token #{item.tokenId}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.price} ETH
                      </p>
                      <button
                        onClick={() => openModal(item)}
                        className="mt-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6) Modal */}
            <NFTModal
              isOpen={modalOpen}
              onClose={closeModal}
              item={activeItem}
              onBuy={handleBuyFromModal}
            />

            {/* Status */}
            {status && !status.includes("…") && (
              <div className="toast">{status}</div>
            )}
            {status.includes("…") && (
              <div className="flex items-center space-x-2">
                <div className="spinner"></div>
                <span className="text-gray-600">{status}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
