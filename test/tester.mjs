import { expect, assert } from 'chai';
import pkg from 'hardhat';
const { ethers,waffle } = pkg;

import { impersonateFundErc20 } from '../utils/utilities.js'
import  IERC20Json from"../artifacts/contracts/interfaces/IERC20.sol/IERC20.json" with { type: "json" };

const abi = IERC20Json['abi'];
const provider = waffle.provider;
  
describe("FlashSwap Contract", () => {

  console.log(expect,'expect')

  let FLASHSWAP, BORROW_AMOUNT, FUND_AMOUNT, initiateFundingHuman, txArbitrage, gasUsedUSD;

  const DECIMALS =18;

  const BUSD_WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  const USDT = "0x55d398326f99059fF775485246999027B3197955";
  const CROX = "0x2c094F5A7D1146BB93850f629501eB749f6Ed491";
  const CAKE = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
  const BASE_TOKEN_ADDRESS = BUSD;
  const tokenBase = new ethers.Contract(BASE_TOKEN_ADDRESS, abi, provider);

  beforeEach(async () => {
  
    const whale_balance = await provider.getBalance(BUSD_WHALE);
    expect(whale_balance).not.equal("0");

    const FlashSwap = await ethers.getContractFactory("PancakeFlashwap");
    FLASHSWAP = await FlashSwap.deploy();

    await FLASHSWAP.deployed();
    //Configuring our borrowing
    const borrowAmountHuman = "1";
    BORROW_AMOUNT = ethers.utils.parseUnits(borrowAmountHuman, DECIMALS);

    // Configure Funding
    initiateFundingHuman = "100";
    FUND_AMOUNT = ethers.utils.parseUnits(initiateFundingHuman, DECIMALS);

    //Fund our Contract -- For testing Only]

    // console.log(  tokenBase,'tokenBase', BUSD_WHALE,'BUSD_WHALE',FLASHSWAP.address,'FLASHSWAP.address',initiateFundingHuman,'initiateFundingHuman' );
    await impersonateFundErc20(tokenBase, BUSD_WHALE, FLASHSWAP.address, initiateFundingHuman);


  });
  describe("Arbitrage Execution", () => {
    it("ensure the contract is funded", async () => {
      const flashSwapBalance = await FLASHSWAP.getBalanceOfToken(BASE_TOKEN_ADDRESS);

      const flashSwapBalanceHuman = ethers.utils.formatUnits(flashSwapBalance, DECIMALS);

      console.log(flashSwapBalanceHuman,'flashSwapBalanceHuman')

      expect(Number(flashSwapBalanceHuman)).equal(Number(initiateFundingHuman));


    })
  })

  // it("general test",  async () => {
  //   const whale_balance = await provider.getBalance(BUSD_WHALE);
  //   console.log(ethers.utils.formatUnits( whale_balance.toString(), DECIMALS),'whale_balance')

  // })


});

