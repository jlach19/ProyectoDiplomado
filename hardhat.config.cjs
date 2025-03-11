require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Importa dotenv para usar variables de entorno

module.exports = {
  solidity: "0.8.20",
  networks: {
    arbitrum_sepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
