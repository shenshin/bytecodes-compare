// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Demo {
  address deployer;
  constructor() {
    deployer = msg.sender;
  }

  function getDeployer() public view returns (address) {
    return deployer;
  }
}