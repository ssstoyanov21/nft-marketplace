// src/components/UploadDemo.jsx
import React, { useState } from 'react';

export default function UploadDemo({ signer, nft, market, reloadItems, setStatus }) {
  const [uri, setUri] = useState('');

  const handleMint = async () => {
    if (!signer) return alert('Connect wallet first');
    try {
      setStatus('Minting…');
      const tx = await nft.connect(signer).mint(uri);
      await tx.wait();
      setStatus('✅ Minted!');
      reloadItems();
    } catch (err) {
      console.error(err);
      setStatus('❌ Mint error: ' + err.message);
    }
  };

  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold">Upload / Mint NFT</h2>
      <input
        type="text"
        placeholder="Metadata URL (e.g. http://localhost:5173/metadata/1.json)"
        value={uri}
        onChange={e => setUri(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={handleMint} className="px-4 py-2 bg-blue-600 text-white rounded">
        Mint NFT
      </button>
    </section>
  );
}
