  // 2) Deploy NFT
  const NFT    = await ethers.getContractFactory("NFT");
  const nft    = await NFT.deploy();
  await nft.deployed();
  console.log("NFT:", nft.address);