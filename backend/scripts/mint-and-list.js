const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const NFT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const MARKET_ADDRESS = process.env.MARKETPLACE_CONTRACT_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const ETH_USD_FEED = process.env.ETH_USD_FEED_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const nft = await hre.ethers.getContractAt("NFT", NFT_ADDRESS);
  const market = await hre.ethers.getContractAt("Marketplace", MARKET_ADDRESS);

  // Регистрираме NFT контракта като paymentToken
  console.log("🔧 Registering price feed:", NFT_ADDRESS, "→", ETH_USD_FEED);
  await (
    await market.connect(deployer).setPriceFeed(NFT_ADDRESS, ETH_USD_FEED)
  ).wait();

  // Даваме blanket approval
  console.log("🔑 Setting approval for all NFTs to marketplace…");
  await (await nft.connect(deployer).setApprovalForAll(MARKET_ADDRESS, true)).wait();

  // Mint & List
  for (let i = 1; i <= 5; i++) {
    // const tokenUri = `http://localhost:5173/metadata/${i}.json`;
    const tokenUri = `ipfs://QmNyXvdU4UgeuCrNWM6vVzk49VtsquDL774RRVoSeKq63w/${i}.json`;

    // Mint
    const tx = await nft.connect(deployer).mint(tokenUri);
    const receipt = await tx.wait();
    console.log("✅ Transaction mined:", receipt.transactionHash);
    console.log(`✅ Minted token ${i}`);

    // List за 0.5 ETH срещу paymentToken = NFT_ADDRESS
    await (
      await market
        .connect(deployer)
        .makeItem(
          NFT_ADDRESS,
          i,
          hre.ethers.utils.parseEther("0.5"),
          NFT_ADDRESS
        )
    ).wait();
    console.log(`🛒 Listed token ${i} for 0.5 ETH`);
  }

  console.log("🎉 Done minting & listing NFTs!");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});