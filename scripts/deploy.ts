import { ethers } from "hardhat";
import { utils } from "ethers";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

async function main() {

    const users = require('../trees/users.json');

    // equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, amount));
  const elements = users.map((x: { index: any; address: any; amount: any; }) =>
    utils.solidityKeccak256(["uint256", "address", "uint256"], [x.index, x.address, x.amount])
  ); 
      
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();
    
    const [deployer] = await ethers.getSigners();

    // Deploy contract
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const distributor = await Distributor.deploy("0x4AF2198602DfAB370Cb7d16aD0AA8c88dFcb2660", root);
    await distributor.deployed();
    
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    console.log("Address:", distributor.address);
}
  
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });