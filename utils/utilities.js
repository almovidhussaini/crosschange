const { network, ethers } = require("hardhat");

const fundErc20 = async (contract, sender, recepient, amount) => {
  const FUND_AMOUNT = ethers.utils.parseUnits(amount, 18);
  const whale = await ethers.getSigner(sender);
  const contractSigner = contract.connect(whale);
  await contractSigner.transfer(recepient, FUND_AMOUNT);
};

const impersonateFundErc20 = async (contract, sender, recepient, amount) => {
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [sender],
  });
  await fundErc20(contract, sender, recepient, amount);
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [sender],
  });
};

module.exports = {
  impersonateFundErc20: impersonateFundErc20,
};
