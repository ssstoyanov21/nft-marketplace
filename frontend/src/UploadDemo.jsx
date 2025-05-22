import React, { useState } from "react";
import { uploadToNFTStorage } from "./utils/nftStorage";

export default function UploadDemo() {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");

  async function handleUpload() {
    if (!file) {
      alert("Моля, избери файл!");
      return;
    }
    try {
      const url = await uploadToNFTStorage(
        "Demo NFT Image",
        "Това е демонстрационно NFT изображение",
        file
      );
      setUploadUrl(url);
      alert("Качването е успешно! IPFS URL: " + url);
    } catch (error) {
      alert("Грешка при качване: " + error.message);
      console.error(error);
    }
  }

  return (
    <div className="upload-demo my-4 p-4 border rounded bg-white dark:bg-gray-700 text-black dark:text-white">
      <h3 className="mb-2 font-semibold text-lg">Качи NFT изображение</h3>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        Качи
      </button>
      {uploadUrl && (
        <div className="mt-4">
          <p className="break-all">IPFS URI: {uploadUrl}</p>
          <img
            src={uploadUrl.replace("ipfs://", "https://ipfs.io/ipfs/")}
            alt="Uploaded NFT"
            style={{ maxWidth: "300px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}
