import { NFTStorage, File } from "nft.storage";

// тук сложи твоя API ключ от nft.storage
const NFT_STORAGE_KEY = "9dd8beca.ac697d12fcc0467693e2d75c53e660d5"; // смени с твоя ако трябва

const client = new NFTStorage({ token: NFT_STORAGE_KEY });

export async function uploadToNFTStorage(name, description, fileData) {
  try {
    const metadata = await client.store({
      name,
      description,
      image: new File([fileData], "image.png", { type: fileData.type || "image/png" }),
    });
    console.log("NFT uploaded:", metadata);
    return metadata.url;
  } catch (error) {
    console.error("Error uploading to nft.storage:", error);
    throw error;
  }
}
