#! /usr/bin/env node

const ethers = require('ethers');
const solc = require('solc');
const { resolve } = require('path');
const { readFile } = require('fs/promises');
const { mnemonic } = require('./.secret.json');

async function main() {
  try {
    // connecting to JSON RPC provider and setting up wallet
    const provider = ethers.getDefaultProvider(
      'https://public-node.testnet.rsk.co/',
    );
    const deployer = ethers.Wallet.fromMnemonic(mnemonic).connect(provider);

    // read the smart contract source file
    const demoSolidity = await readFile(
      resolve(__dirname, 'contracts', 'Demo.sol'),
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

    // deploying to RSK using the bytecode gererated by SolcJS
    const ContractFactory = ethers.ContractFactory.fromSolidity(
      demoOutput,
      deployer,
    );
    console.log(`Deploying Demo smart contract to RSK Testnet`);
    const demoSC = await ContractFactory.deploy();
    await demoSC.deployed();
    console.log(`Deployed Demo to RSK Testnet with address ${demoSC.address}`);

    // read bytecode from RSK Testnet
    const rskByteCode = (await provider.getCode(demoSC.address)).substring(2);

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
    console.log(error);
  }
}
main();
