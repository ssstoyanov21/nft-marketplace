require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      blockGasLimit: 30_000_000,
      initialBaseFeePerGas: 0
    }
  }
};
