require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1) Deploy mock Chainlink feed
  const decimals = +process.env.ETH_USD_FEED_DECIMALS;
  const price    = process.env.ETH_USD_FEED_PRICE;
  const Mock     = await ethers.getContractFactory("MockV3Aggregator");
  const mock     = await Mock.deploy(decimals, price);
  await mock.deployed();
  console.log("MockFeed:", mock.address);

  // 2) Deploy NFT
  const NFT    = await ethers.getContractFactory("NFT");
  const nft    = await NFT.deploy();
  await nft.deployed();
  console.log("NFT:", nft.address);

  // 3) Deploy Marketplace
  const Market = await ethers.getContractFactory("Marketplace");
  const market = await Market.deploy(1, mock.address);
  await market.deployed();
  console.log("Marketplace:", market.address);

  // 4) Configure the price feed for ETH (addressZero)
  await market.setPriceFeed(ethers.constants.AddressZero, mock.address);
  console.log("ETH price feed set on Marketplace");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
