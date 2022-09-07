const hre = require('hardhat');
const solc = require('solc');
const { resolve } = require('path');
const { readFile } = require('fs/promises');

async function getSolcDeployedByteCode() {
  const { settings } = hre.config.solidity.compilers[0];
  // read the smart contract source file
  const demoSolidity = await readFile(
    resolve(__dirname, '..', 'contracts', 'Demo.sol'),
    'utf8',
  );

  // solidity compiler input parameters
  const input = {
    language: 'Solidity',
    settings,
    sources: {
      'Demo.sol': {
        content: demoSolidity,
      },
    },
  };

  // compile the smart contract with SolcJS
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  return `0x${output.contracts['Demo.sol'].Demo.evm.deployedBytecode.object}`;
}

async function getRskDeployedBytecode() {
  const Demo = await hre.ethers.getContractFactory('Demo');
  const demo = await Demo.deploy();
  await demo.deployed();
  return hre.ethers.provider.getCode(demo.address);
}

async function main() {
  const rskDeployedByteCode = await getRskDeployedBytecode();
  const hardhatDeployedByteCode = (await hre.artifacts.readArtifact('Demo'))
    .deployedBytecode;
  const solcDeployedBytecode = await getSolcDeployedByteCode();

  // compare deployed bytecodes
  console.log(
    `Hardhat compiler version: ${hre.config.solidity.compilers[0].version}`,
  );
  console.log(`SolcJS compiler version: ${solc.version()}`);

  console.log(
    `RSK Testnet deployedBytecode lenght: ${rskDeployedByteCode.length}`,
  );
  console.log(
    `Hardhat deployedBytecode lenght: ${hardhatDeployedByteCode.length}`,
  );
  console.log(`SolcJS deployedBytecode lenght: ${solcDeployedBytecode.length}`);

  console.log(
    'Hardhat (the deployer) and RSK deployedBytecodes are ',
    hardhatDeployedByteCode === rskDeployedByteCode ? `identical` : `different`,
  );
  console.log(
    'Hardhat and SolcJS deployedBytecodes are ',
    hardhatDeployedByteCode === solcDeployedBytecode
      ? `identical`
      : `different`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
