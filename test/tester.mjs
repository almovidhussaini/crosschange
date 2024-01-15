import { expect, assert } from 'chai';
import pkg from 'hardhat';
const { ethers} = pkg;

import { impersonateFundErc20 } from '../utils/utilities.js'

import { inputToConfig } from '@ethereum-waffle/compiler';

import  IERC20Json from"../artifacts/contracts/interfaces/IERC20.sol/IERC20.json" with { type: "json" };

const abi = IERC20Json['abi'];
const provider = waffle.provider;
  
describe("FlashSwap Contract", () => {

  let FLASHSWAP, BORROW_AMOUNT, FUND_AMOUNT, initiateFundingHuman, txArbitrage, gasUsedUSD;

  const DECIMALS =18;

  const BUSD_WHALE = "0xd2f93484f2d319194cba95c5171b18c1d8cfd6c4";
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  const USDT = "0x55d398326f99059fF775485246999027B3197955";
  const CROX = "0x2c094F5A7D1146BB93850f629501eB749f6Ed491";
  const CAKE = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
  const BASE_TOKEN_ADDRESS = BUSD;
  const tokenBase = new ethers.Contract(BASE_TOKEN_ADDRESS, abi, provider);

  beforeEach(async () => {
    // [owner] = await ethers.getSigners();

    const whale_balance = await provider.getBalance(BUSD_WHALE);
    // const senderBalance = await tokenBase.balanceOf(BUSD_WHALE);
    // console.log(senderBalance.toString(), 'Sender Balance');

    // console.log( whale_balance.toString(),'BUSD_WHALE')
    const FlashSwap = await ethers.getContractFactory("PancakeFlashwap");

    FLASHSWAP = await FlashSwap.deploy();
    await FLASHSWAP.deployed();

    console.log(FLASHSWAP.address,'address1')

    const borrowAmountHuman = "1";
    BORROW_AMOUNT = ethers.utils.parseUnits(borrowAmountHuman, DECIMALS);
    // console.log(BORROW_AMOUNT.toString(),'BORROW_AMOUNT')

    initiateFundingHuman="100"

    // Configure Funding
    FUND_AMOUNT = ethers.utils.parseUnits(initiateFundingHuman, DECIMALS);
    // console.log(FUND_AMOUNT.toString(),'FUND_AMOUNT')


    //Fund our Contract -- For testing Only]
    await impersonateFundErc20(tokenBase, BUSD_WHALE, FLASHSWAP.address, initiateFundingHuman);


  });
  describe("Arbitrage Execution", () => {
    it("ensure the contract is funded", async () => {

      const flashSwapBalance = await FLASHSWAP.getBalanceOfToken(BASE_TOKEN_ADDRESS);
      const flashSwapBalanceHuman = ethers.utils.formatUnits(flashSwapBalance, DECIMALS);
      console.log(flashSwapBalanceHuman,'flashSwapBalanceHuman')

      expect(Number(flashSwapBalanceHuman)).equal(Number(initiateFundingHuman));


    });

   it("executes the arbitrage", async() => {

    txArbitrage = await FLASHSWAP.startArbitrage(
      BASE_TOKEN_ADDRESS,
      BORROW_AMOUNT.toString()
    );

    console.log(txArbitrage,'txArbitrage')

    assert(txArbitrage);
     // Print balances
     const contractBalanceBUSD = await FLASHSWAP.getBalanceOfToken(BUSD);
     const formattedBalBUSD = Number(
       ethers.utils.formatUnits(contractBalanceBUSD, DECIMALS)
     );
     console.log("Balance of BUSD: " + formattedBalBUSD);

   })
  })

  // it("general test",  async () => {
  //   const whale_balance = await provider.getBalance(BUSD_WHALE);
  //   console.log(ethers.utils.formatUnits( whale_balance.toString(), DECIMALS),'whale_balance')

  // })


});

