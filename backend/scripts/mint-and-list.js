// scripts/mint-and-list.js
const { ethers } = require("hardhat");

async function main() {
  const [addr1, addr2] = await ethers.getSigners();

  const nft = await ethers.getContractAt("NFT", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  const market = await ethers.getContractAt("Marketplace", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

  // Mint & list 5 NFTs for addr1
  for (let i = 1; i <= 5; i++) {
    const tokenUri = `http://localhost:5173/metadata/${i}.json`;

    // Mint
    const mintTx = await nft.connect(addr1).mint(tokenUri);
    await mintTx.wait();
    console.log(`✅ Minted token ${i} to ${addr1.address}`);

    // Approve marketplace
    const approveTx = await nft.connect(addr1).approve(market.address, i);
    await approveTx.wait();

    // List with four arguments: nft.address, tokenId, price, paymentToken
    const listTx = await market.connect(addr1).makeItem(
      nft.address,
      i,
      ethers.utils.parseEther("21"),         // цена 21 ETH
      ethers.constants.AddressZero          // paymentToken = ETH
    );
    await listTx.wait();
    console.log(`🛒 Listed token ${i} at 21 ETH`);
  }

  console.log("🎉 Done minting and listing NFTs!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
