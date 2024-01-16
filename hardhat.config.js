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
        url:"https://eth-mainnet.g.alchemy.com/v2/wrudut-xYQ5hNzETOcjl87kYu1Ajdkn-",
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
      url: "https://eth-mainnet.g.alchemy.com/v2/wrudut-xYQ5hNzETOcjl87kYu1Ajdkn-",
      chainId: 1,
      accounts: ["0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"]
    }
  }
};
