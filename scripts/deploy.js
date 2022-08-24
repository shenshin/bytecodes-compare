const hre = require('hardhat');
const { writeAddress } = require('./saveDeploymentAddress.js');

async function main() {
  try {
    const Demo = await hre.ethers.getContractFactory('Demo');
    const demo = await Demo.deploy();

    await demo.deployed();
    await writeAddress(demo.address);
    console.log(
      `Demo deployed to ${hre.network.name} at address ${demo.address}`,
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
