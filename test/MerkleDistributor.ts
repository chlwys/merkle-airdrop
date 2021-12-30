import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("MerkleDistributor", function () {

  const users = require('../trees/users.json');

  // equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, amount));
  const elements = users.map((x: { index: any; address: any; amount: any; }) =>
    utils.solidityKeccak256(["uint256", "address", "uint256"], [x.index, x.address, x.amount])
  );

  const tokenAddress = "0x4AF2198602DfAB370Cb7d16aD0AA8c88dFcb2660"


  it("should claim successfully for valid proof", async () => {
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    const leaf = elements[3];
    const proof = merkleTree.getHexProof(leaf);

    console.log(elements)

    // Deploy contract
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const distributor = await Distributor.deploy(tokenAddress,root);
    await distributor.deployed();

    // Attempt to claim and verify success
    await expect(distributor.claim(users[3].index, users[3].address, users[3].amount, proof))
      .to.emit(distributor, "Claimed")
      .withArgs(users[3].index, users[3].address, users[3].amount);
  });

  it("should throw for invalid amount or address", async () => {
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    const leaf = elements[3];
    const proof = merkleTree.getHexProof(leaf);

    // Deploy contract
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const distributor = await Distributor.deploy(tokenAddress,root);
    await distributor.deployed();

    // random amount
    await expect(
      distributor.claim(0, users[3].address, 10000, proof)
    ).to.be.revertedWith("Invalid proof.");

    // random address
    await expect(
      distributor.claim(0,
        "0x94069d197c64D831fdB7C3222Dd512af5339bd2d",
        users[3].amount,
        proof
      )
    ).to.be.revertedWith("Invalid proof.");
  });

  it("should throw for invalid proof", async () => {
    const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

    const root = merkleTree.getHexRoot();

    // recreating proof
    const leaf = elements[3];
    const proof = merkleTree.getHexProof(leaf);
    console.log(proof);
    console.log(root);

    // Deploy contract
    const Distributor = await ethers.getContractFactory("MerkleDistributor");
    const distributor = await Distributor.deploy(tokenAddress,root);
    await distributor.deployed();

    // Attempt to claim and verify success
    await expect(
      distributor.claim(users[3].index, users[3].address, users[3].amount, proof)
    ).to.be.revertedWith("Invalid proof.");
  });
});
