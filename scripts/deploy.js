const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const [owner] = await hre.ethers.getSigners();
  //Here make sure you enter the name of the .sol file you've created in the contracts folder.
  const WaveContractFactory = await hre.ethers.getContractFactory("Wave");
  const WaveContract = await WaveContractFactory.deploy();
  await WaveContract.deployed();

  console.log("WaveContract deployed to:", WaveContract.address);
  console.log("WaveContract owner address:", owner.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
