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

  const DECIMALS =6;

  const USDC_WHALE = "0x28c6c06298d514db089934071355e5743bf21d60";

  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

  const USERADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const BASE_TOKEN_ADDRESS = USDC;

  const tokenBase = new ethers.Contract(BASE_TOKEN_ADDRESS, abi, provider);

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    // console.log(owner,'owner')
    const whale_balance = await provider.getBalance(USDC_WHALE);

    const FlashSwap = await ethers.getContractFactory("UniswapCrossFlash");

    FLASHSWAP = await FlashSwap.deploy();
    await FLASHSWAP.deployed();
    const borrowAmountHuman = "1";
    BORROW_AMOUNT = ethers.utils.parseUnits(borrowAmountHuman, DECIMALS);
    // console.log(BORROW_AMOUNT.toString(),'BORROW_AMOUNT')
    initiateFundingHuman="100"
    // Configure Funding
    FUND_AMOUNT = ethers.utils.parseUnits(initiateFundingHuman, DECIMALS);
    await impersonateFundErc20(tokenBase, USDC_WHALE, FLASHSWAP.address, initiateFundingHuman, DECIMALS);
  });
  describe("Arbitrage Execution", () => {
    it("ensure the contract is funded", async () => {
      const flashSwapBalance = await FLASHSWAP.getBalanceOfToken(BASE_TOKEN_ADDRESS);
      const flashSwapBalanceHuman = ethers.utils.formatUnits(flashSwapBalance, DECIMALS);

      expect(Number(flashSwapBalanceHuman)).equal(Number(initiateFundingHuman));
    });

   it("executes the arbitrage", async() => {
    txArbitrage = await FLASHSWAP.startArbitrage(
      BASE_TOKEN_ADDRESS,
      BORROW_AMOUNT
    );
    assert(txArbitrage);
    const contractBalanceUSDC = await FLASHSWAP.getBalanceOfToken(USDC);
    const formattedBalUSDC = Number(
      ethers.utils.formatUnits(contractBalanceUSDC, DECIMALS)
    );
    console.log("Balance of USDC: " + formattedBalUSDC);

    const contractBalanceLINK = await FLASHSWAP.getBalanceOfToken(LINK);
    const formattedBalLINK = Number(
      ethers.utils.formatUnits(contractBalanceLINK, DECIMALS)
    );
    console.log("Balance of LINK: " + formattedBalLINK);
    
    const getUserBalance = await FLASHSWAP.getBalanceOfUser(USERADDRESS, USDC);
    const formattedUserBalance = Number(
      ethers.utils.formatUnits(getUserBalance, DECIMALS)
    );
    console.log("Balance of User: " + formattedUserBalance);

   });

   it("provides GAS output", async () => {
    const txReceipt = await provider.getTransactionReceipt(txArbitrage.hash);
    const effGasPrice = txReceipt.effectiveGasPrice;
    const txGasUsed = txReceipt.gasUsed;
    const gasUsedETH = effGasPrice * txGasUsed;
    console.log(
      "Total Gas USD: " +
        ethers.utils.formatEther(gasUsedETH.toString()) * 2900 // exchange rate today
    );
    expect(gasUsedETH).not.equal(0);
  });
  })

});

