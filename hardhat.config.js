// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.5"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.8.8"
      },

    ]
  },
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      forking: {
        url:"https://bsc-dataseed.binance.org/",
      }
    }
    
    ,
    testnet:{
      url:"https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts:[
        "0x407348cb00e968f471de1d56bd6697c41374fe3caceea78c50f30e24ce71bc30"
    ],
    },

    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
    }
  }
};
