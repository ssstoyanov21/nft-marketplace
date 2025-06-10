const { ethers } = require("hardhat");

async function main() {
    const addr1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const addr2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";


    const [deployer] = await ethers.getSigners();

    // Деплой на NFT контракта (ако още не е деплойнат)
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    console.log("NFT Contract deployed to:", nft.address); 

    // Mint 1 и трансфер към addr1
    await nft.connect(deployer).mint("https://res.cloudinary.com/total-dealer/image/upload/w_3840,f_auto,q_75/v1/production/a1w0s5t4dylni0nx24075l00q0uf");
    await (await nft.connect(deployer).transferFrom(deployer.address, addr1, 1)).wait();
console.log("Minting and transfers complete.");
    // Mint 2 и трансфер към addr1
    await nft.connect(deployer).mint("https://res.cloudinary.com/total-dealer/image/upload/w_3840,f_auto,q_75/v1/production/a1w0s5t4dylni0nx24075l00q0uf");
    await (await nft.connect(deployer).transferFrom(deployer.address, addr1, 2)).wait();
console.log("Minting and transfers complete.");
    // Mint 3 и трансфер към addr2
    await nft.connect(deployer).mint("https://res.cloudinary.com/total-dealer/image/upload/w_3840,f_auto,q_75/v1/production/a1w0s5t4dylni0nx24075l00q0uf");
    await (await nft.connect(deployer).transferFrom(deployer.address, addr2, 3)).wait();
console.log("Minting and transfers complete.");
    // Mint 4 и трансфер към addr2
    await nft.connect(deployer).mint("https://res.cloudinary.com/total-dealer/image/upload/w_3840,f_auto,q_75/v1/production/a1w0s5t4dylni0nx24075l00q0uf");
    await (await nft.connect(deployer).transferFrom(deployer.address, addr2, 4)).wait();
    console.log("Minting and transfers complete.");
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

// scripts/mint-local-nfts
