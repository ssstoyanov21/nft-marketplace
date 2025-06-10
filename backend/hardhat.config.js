// require("@nomiclabs/hardhat-ethers");
// require("dotenv").config({ path: "../.env" });
// console.log(process.env.INFURA_PROJECT_ID);
// module.exports = {
//   solidity: "0.8.24",
//   networks: {
//     hardhat: {
//       chainId: 1,
//       forking: {
//         url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
//       },
//     },
//   },
// };
// hardhat.config.js
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.24",
  networks: {
    // 1) in-process “hardhat” мрежа (използва се при `npx hardhat node`)
    hardhat: {
      chainId: 1337,
      blockGasLimit: 30_000_000,
      initialBaseFeePerGas: 0
    },
    // 2) външният “localhost” node (когато вече си пуснал `npx hardhat node`)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      blockGasLimit: 30_000_000,
      initialBaseFeePerGas: 0
    }
  }
};
