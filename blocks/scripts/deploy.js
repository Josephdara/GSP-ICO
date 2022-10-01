const { ethers } = require("hardhat");
const { GSP_CONTRACT_ADDRESS } = require("../constant");
require("dotenv").config({ path: ".env" });


async function main() {
  const nftContract = GSP_CONTRACT_ADDRESS


  const GSTContract = await ethers.getContractFactory("GlorySoundToken");
  const deployedGSTContract = await GSTContract.deploy(
    nftContract
  );
  await deployedGSTContract.deployed();
  console.log("GlorySoundToken", deployedGSTContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });