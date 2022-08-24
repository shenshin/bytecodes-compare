const { writeFile, readFile } = require('fs/promises');
const { join } = require('path');

const deploymentFilename = 'demo-deploy.json';

async function readDeployments() {
  const file = join(__dirname, deploymentFilename);
  let deployments = {};
  try {
    deployments = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    console.log(`${deploymentFilename} not found, creating`);
  }
  return {
    deployments,
    file,
  };
}

async function readAddress() {
  const { deployments } = await readDeployments();
  const address = deployments[hre.network.name];
  if (!address)
    throw new Error(
      `There are no deployments on ${hre.network.name}. First run 'npx hardhat run scripts/deploy.js'`,
    );
  return address;
}

async function writeAddress(address) {
  const { deployments, file } = await readDeployments();
  deployments[hre.network.name] = address;
  await writeFile(file, JSON.stringify(deployments), 'utf8');
}

module.exports = {
  readAddress,
  writeAddress,
};
