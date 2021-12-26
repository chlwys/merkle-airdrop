import { ethers } from "hardhat";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

async function main () {
    // Our code will go here

    // Set up an ethers contract, representing our deployed Box instance
    const address = '0xff9Ad94c359bB29259A89b632f347D31b344083f';
    const Box = await ethers.getContractFactory('MerkleDistributor');
    const box = await Box.attach(address);

    const value = await box.isClaimed(4);
    console.log('isClaimed ', value.toString());

    const users = require('../trees/users.json');

    const elements = users.map((x: { index: any; address: any; amount: any; }) =>
    utils.solidityKeccak256(["uint256", "address", "uint256"], [x.index, x.address, x.amount])
    );

    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    const leaf = elements[4];
    const proof = merkleTree.getHexProof(leaf);

    console.log(users[4].address);

    await box.claim(users[4].index, users[4].address, users[4].amount, proof);

    const val = await box.isClaimed(4);
    console.log('isClaimed ', val.toString());
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });