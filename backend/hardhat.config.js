require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.4",
  networks: {
    localhost: {
      // Ganache слуша на 8545 по подразбиране
      url: process.env.GANACHE_URL || "http://127.0.0.1:8545",
      // Ganache детерминистичен порт и chainId 1337
      chainId: 1337,
      // Ganache вече си зарежда 10 мнемонични акаунта автоматично,
      // Hardhat Ethers ще ги използва по подразбиране.
    },
    // ако искаш пак да имаш Hardhat Network:
    hardhat: {
      chainId: 1337 
    }
  }
};
