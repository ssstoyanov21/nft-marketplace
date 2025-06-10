const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account:", deployer.address);

  // Взимаме фабриката на контракта
  const NFT = await hre.ethers.getContractFactory("NFT");
  // Понеже конструкторът няма аргументи, просто извикваме без нищо
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("✅ NFT deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
