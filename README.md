# Compare RSK Testnet vs SolcJS bytecodes

This project demonstrates how to:
- deploy `Demo` smart contract to RSK Testnet
- compile the same smart contract with `SolcJS` version `0.8.9`
- compare the bytecode on RSK Testnet and the one comming from `SolcJS`

## Installation
Rename `template.secret.json` to `.secret.json` and paste your seed phrase for generating RSK accounts

```shell
npm install
```

## Deploy to RSK Testnet
```shell
npx hardhat run scripts/deploy.js
```

## Compare bytecodes
```shell
npx hardhat run scripts/compare.js
```