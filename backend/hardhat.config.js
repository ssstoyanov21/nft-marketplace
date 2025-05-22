require("@nomiclabs/hardhat-ethers");
require("dotenv").config({ path: "../.env" });

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        // blockNumber: 17820000, // по желание фиксиран блок
      },
    },
  },
};