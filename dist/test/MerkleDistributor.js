"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = __importDefault(require("keccak256"));
describe("MerkleDistributor", function () {
    const users = [
        { address: "0xD08c8e6d78a1f64B1796d6DC3137B19665cb6F1F", amount: 10 },
        { address: "0xb7D15753D3F76e7C892B63db6b4729f700C01298", amount: 15 },
        { address: "0xf69Ca530Cd4849e3d1329FBEC06787a96a3f9A68", amount: 20 },
        { address: "0xa8532aAa27E9f7c3a96d754674c99F1E2f824800", amount: 30 },
        { address: "0x7b60f9470B4D13ed8a87A5bD04a97cCE8e5586A1", amount: 30 }
    ];
    // equal to MerkleDistributor.sol #keccak256(abi.encodePacked(account, amount));
    const elements = users.map((x) => ethers_1.utils.solidityKeccak256(["address", "uint256"], [x.address, x.amount]));
    it("should claim successfully for valid proof", async () => {
        const merkleTree = new merkletreejs_1.MerkleTree(elements, keccak256_1.default, { sort: true });
        const root = merkleTree.getHexRoot();
        const leaf = elements[3];
        const proof = merkleTree.getHexProof(leaf);
        //console.log(merkleTree);
        // Deploy contract
        const Distributor = await hardhat_1.ethers.getContractFactory("MerkleDistributor");
        const distributor = await Distributor.deploy(root);
        await distributor.deployed();
        // Attempt to claim and verify success
        await (0, chai_1.expect)(distributor.claim(users[3].address, users[3].amount, proof))
            .to.emit(distributor, "Claimed")
            .withArgs(users[3].address, users[3].amount);
    });
    it("should throw for invalid amount or address", async () => {
        const merkleTree = new merkletreejs_1.MerkleTree(elements, keccak256_1.default, { sort: true });
        const root = merkleTree.getHexRoot();
        const leaf = elements[3];
        const proof = merkleTree.getHexProof(leaf);
        // Deploy contract
        const Distributor = await hardhat_1.ethers.getContractFactory("MerkleDistributor");
        const distributor = await Distributor.deploy(root);
        await distributor.deployed();
        // random amount
        await (0, chai_1.expect)(distributor.claim(users[3].address, 10000, proof)).to.be.revertedWith("MerkleDistributor: Invalid proof.");
        // random address
        await (0, chai_1.expect)(distributor.claim("0x94069d197c64D831fdB7C3222Dd512af5339bd2d", users[3].amount, proof)).to.be.revertedWith("MerkleDistributor: Invalid proof.");
    });
    it("should throw for invalid proof", async () => {
        const merkleTree = new merkletreejs_1.MerkleTree(elements, keccak256_1.default, { sort: true });
        const root = merkleTree.getHexRoot();
        // Deploy contract
        const Distributor = await hardhat_1.ethers.getContractFactory("MerkleDistributor");
        const distributor = await Distributor.deploy(root);
        await distributor.deployed();
        // Attempt to claim and verify success
        await (0, chai_1.expect)(distributor.claim(users[3].address, users[3].amount, [])).to.be.revertedWith("MerkleDistributor: Invalid proof.");
    });
});
