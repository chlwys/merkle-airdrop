import { ethers } from "hardhat";
import { utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

async function main () {
    // Our code will go here
    const users = require('../trees/users.json');

    const elements = users.map((x: { index: any; address: any; amount: any; }) =>
    utils.solidityKeccak256(["uint256", "address", "uint256"], [x.index, x.address, x.amount])
    );

    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    const leaf = elements[4];
    const proof = merkleTree.getHexProof(leaf);
    console.log('printing proof')
    console.log(proof);

    // Set up an ethers contract, representing our deployed Box instance
    const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const Box = await ethers.getContractFactory('MerkleDistributor');
    const box = await Box.attach(address);

    const value = await box.isClaimed(4);
    console.log('isClaimed ', value.toString());


    console.log('proof :');
    console.log(proof);

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