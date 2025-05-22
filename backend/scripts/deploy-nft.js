async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);

  const NFT = await ethers.getContractFactory("NFT");
  // Примерни URIs за constructor (7 елемента)
  const uris = Array(7).fill("https://example.com/meta.json");
  const nft = await NFT.deploy(uris);
  await nft.deployed();

  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });