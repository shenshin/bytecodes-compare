const hre = require('hardhat');
const solc = require('solc');
const { resolve } = require('path');
const { readFile } = require('fs/promises');

async function main() {
  try {
    // read the smart contract source file
    const demoSolidity = await readFile(
      resolve(__dirname, '..', 'contracts', 'Demo.sol'),
      'utf8',
    );

    // solidity compiler input parameters
    const input = {
      language: 'Solidity',
      settings: {
        optimizer: { enabled: true, runs: 0 },
        evmVersion: 'london',
        outputSelection: {
          '*': {
            '*': [
              'abi',
              'evm.bytecode',
              'evm.deployedBytecode',
              'evm.methodIdentifiers',
              'metadata',
            ],
            '': ['ast'],
          },
        },
      },
      sources: {
        'Demo.sol': {
          content: demoSolidity,
        },
      },
    };

    // compile the smart contract with SolcJS
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const demoOutput = output.contracts['Demo.sol'].Demo;

    // deploying to RSK using the bytecode gererated by SolcJS (not Hardhat!!!)
    const [deployer] = await hre.ethers.getSigners();
    const ContractFactory = hre.ethers.ContractFactory.fromSolidity(
      demoOutput,
      deployer,
    );
    const demoSC = await ContractFactory.deploy();
    await demoSC.deployed();
    console.log(
      `Deployed to ${hre.network.name} with address ${demoSC.address}`,
    );

    // read bytecode from RSK Testnet
    const rskByteCode = (
      await hre.ethers.provider.getCode(demoSC.address)
    ).substring(2);

    // compare RSK and Solc bytecodes
    const solcDeployedBytecode = demoOutput.evm.deployedBytecode.object;
    console.log(`SolcJS version: ${solc.version()}`);
    console.log(`RSK Testnet bytecode lenght: ${rskByteCode.length}`);
    console.log(
      `SolcJS deployedBytecode lenght: ${solcDeployedBytecode.length}`,
    );
    console.log(
      solcDeployedBytecode === rskByteCode
        ? `Bytecodes are identical`
        : `Bytecodes are different`,
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

main();
