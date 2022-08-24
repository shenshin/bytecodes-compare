# Compare RSK Testnet vs SolcJS bytecodes

This project demonstrates how to:
- compile the `Demo` smart contract with `SolcJS` version `0.8.7`
- deploy the compiled bytecode to RSK Testnet using `ethers.js`
- compare the bytecode on RSK Testnet and the one comming from `SolcJS`
- make sure they are identical

## Installation
Rename `template.secret.json` to `.secret.json` and paste your seed phrase for generating RSK accounts

```shell
npm install
```

## Compile smart contract, Deploy to RSK and Compare bytecodes
```shell
./compare.js
```