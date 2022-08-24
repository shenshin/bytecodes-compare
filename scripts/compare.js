const hre = require('hardhat');
const solc = require('solc');
const { resolve } = require('path');
const { readFile } = require('fs/promises');
const { readAddress } = require('./saveDeploymentAddress.js');

async function main() {
  try {
    // read bytecode from RSK Testnet
    const demoAddress = await readAddress();
    const rskByteCode = await hre.ethers.provider.getCode(demoAddress);
    // compile the smart contract with SolcJS using hardhat parameters
    const demoSolidity = await readFile(
      resolve(__dirname, '..', 'contracts', 'Demo.sol'),
      'utf8',
    );
    const { settings } = hre.config.solidity.compilers[0];
    const input = {
      language: 'Solidity',
      settings,
      sources: {
        'Demo.sol': {
          content: demoSolidity,
        },
      },
    };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const solcDeployedBytecode = `0x${output.contracts['Demo.sol'].Demo.evm.deployedBytecode.object}`;
    console.log(`SolcJS version: ${solc.version()}`);
    console.log(`RSK Testnet bytecode lenght: ${rskByteCode.length}`);
    console.log(
      `SolcJS deployedBytecode lenght: ${solcDeployedBytecode.length}`,
    );
    console.log(
      solcDeployedBytecode === rskByteCode
        ? `Bytecodes are equal`
        : `Bytecodes are different`,
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
