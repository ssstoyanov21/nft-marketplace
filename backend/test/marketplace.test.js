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
    const mock = await Mock.deploy(8, 2000 * 10**8);
    await mock.deployed();

    // 3) Деплой на NFT конктракта
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    // 4) Деплой на Marketplace с 1% такса и mock фийд
    const Market = await ethers.getContractFactory("Marketplace");
    market = await Market.deploy(1, mock.address);
    await market.deployed();

    // 5) Настройваме Marketplace да ползва mock фийда за ETH
    await market.setPriceFeed(ethers.constants.AddressZero, mock.address);
  });

  it("да минтне, листне и купи NFT успешно", async () => {
    // --- Mint токен #11 ---
    let tx = await nft.mint("ipfs://TEST");  // създаваме нов NFT
    await tx.wait();                         // изчакваме потвърждение
    expect((await nft.tokenCount()).toNumber()).to.equal(11);

    // --- Approve & List токен #11 за 0.1 ETH ---
    tx = await nft.approve(market.address, 11);
    await tx.wait();
    tx = await market.makeItem(
      nft.address,
      11,
      PRICE,
      ethers.constants.AddressZero
    );
    await tx.wait();
    expect((await market.itemCount()).toNumber()).to.equal(1);

    // --- Проверка на общата цена (0.1 + 1% taksa = 0.101 ETH) ---
    const total = await market.getTotalPrice(1);
    const expectedTotal = PRICE.mul(101).div(100);
    expect(total.toString()).to.equal(expectedTotal.toString());

    // --- Купуване от втория акаунт ---
    tx = await market.connect(buyer).purchaseItem(1, { value: total });
    await tx.wait();

    // --- Проверка на собствеността ---
    expect(await nft.ownerOf(11)).to.equal(buyer.address);
  });
});