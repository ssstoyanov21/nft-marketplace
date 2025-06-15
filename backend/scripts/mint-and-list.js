// backend/scripts/mint-and-list.js
const { ethers } = require("hardhat");

async function main() {
  // 1) вземаме два тестови адреса
  const [addr1] = await ethers.getSigners();

  // 2) адресите, на които вече деплойнахме
  const NFT_ADDRESS    = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const MARKET_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // 3) прикачваме контрактите
  const nft    = await ethers.getContractAt("NFT", NFT_ADDRESS);
  const market = await ethers.getContractAt("Marketplace", MARKET_ADDRESS);

  // 4) loop за 5 токена
  for (let i = 1; i <= 5; i++) {
    const tokenUri = `http://localhost:5173/metadata/${i}.json`;

    // Mint
    await (await nft.connect(addr1).mint(tokenUri)).wait();
    console.log(`✅ Minted token ${i}`);

    // Approve
    await (await nft.connect(addr1).approve(market.address, i)).wait();

    // List — ВАЖНО: 4 аргумента, после override
    await (await market.connect(addr1).makeItem(
      /* 1 */ nft.address,
      /* 2 */ i,
      /* 3 */ ethers.utils.parseEther("0.5"),
      /* 4 */ ethers.constants.AddressZero,
      /* override */ { gasLimit: 3_000_000 }
    )).wait();
    console.log(`🛒 Listed token ${i} at 0.5 ETH`);
  }

  console.log("🎉 Done minting & listing!");
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
