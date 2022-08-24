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
    // extracting hardhat compiler params
    const { settings } = hre.config.solidity.compilers[0];
    // inserting the params to compiler input
    const input = {
      language: 'Solidity',
      settings,
      sources: {
        'Demo.sol': {
          content: demoSolidity,
        },
      },
    };
    // compile the smart contract with SolcJS using hardhat parameters
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const demoOutput = output.contracts['Demo.sol'].Demo;
    const [deployer] = await hre.ethers.getSigners();
    // deploying to RSK using the bytecode gererated by SolcJS (not Hardhat!!!)
    const ContractFactory = hre.ethers.ContractFactory.fromSolidity(
      demoOutput,
      deployer,
    );
    const demoSC = await ContractFactory.deploy();
    await demoSC.deployed();
    // read bytecode from RSK Testnet
    const rskByteCode = (
      await hre.ethers.provider.getCode(demoSC.address)
    ).substring(2);

    const solcDeployedBytecode = demoOutput.evm.deployedBytecode.object;
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
