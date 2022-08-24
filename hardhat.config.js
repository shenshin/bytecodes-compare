require('@nomicfoundation/hardhat-toolbox');
const { mnemonic } = require('./.secret.json');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 0,
      },
      evmVersion: 'london',
    },
  },
  defaultNetwork: 'rsktestnet',
  networks: {
    hardhat: {},
    rsktestnet: {
      chainId: 31,
      url: 'https://public-node.testnet.rsk.co/',
      accounts: {
        mnemonic,
        path: "m/44'/60'/0'/0",
      },
    },
  },
  mocha: {
    timeout: 600000,
  },
};
