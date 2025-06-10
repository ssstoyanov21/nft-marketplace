const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT + Marketplace end-to-end", function() {
  let nft, market, owner, buyer;
  const PRICE = ethers.utils.parseEther("0.1"); // 0.1 ETH

  beforeEach(async () => {
    // 1) Взимаме два акаунта от локалната мрежа
    [owner, buyer] = await ethers.getSigners();

    // 2) Деплой на Mock Chainlink feed (8 десетични, начална цена $2000)
   const Mock = await ethers.getContractFactory("MockV3Aggregator");
   const ethUsdFeed = await Mock.deploy(8, 2000 * 10**8); // $2000 per ETH
   await ethUsdFeed.deployed();// 0.0005 ETH за 1 USDC

    // 3) Деплой на NFT конктракта
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();
    // expect(await nft.ownerOf(10)).to.equal(buyer.address);

    // 4) Деплой на Marketplace с 1% такса и mock фийд
    const Market = await ethers.getContractFactory("Marketplace");
    market = await Market.deploy(1,ethUsdFeed.address);
    await market.deployed();
    this.WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    // 5) Настройваме Marketplace да ползва mock фийда за ETH
    await market.setPriceFeed(this.WETH,ethUsdFeed.address);

  });

it("трябва да минтне, листне и купи нов NFT", async () => {

  // Одобряваш за продажба
await nft.approve(market.address, 10);


  // Листваш го
 await market.makeItem(nft.address, 10, PRICE, this.WETH);

  expect((await market.itemCount()).toNumber()).to.equal(1);

  // Купуваш го
  const total = await market.getTotalPrice(1);
  await market.connect(buyer).purchaseItem(1, { value: total });

  // Проверяваш собствеността
  expect(await nft.ownerOf(10)).to.equal(buyer.address);
});
});