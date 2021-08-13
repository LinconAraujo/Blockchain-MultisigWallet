// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Wallet = await hre.ethers.getContractFactory("Wallet");

  const accounts = await web3.eth.getAccounts();

  const accountsToUse = [accounts[0], accounts[1], accounts[2]];

  const wallet = await Wallet.deploy(accountsToUse, 2);
  await wallet.deployed();

  web3.eth.sendTransaction({
    from: accounts[0],
    to: wallet.address,
    value: 10000,
  });

  console.log(wallet, wallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
