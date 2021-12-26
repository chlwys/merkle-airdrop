"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const merkletreejs_1 = require("merkletreejs");
const keccak256_1 = __importDefault(require("keccak256"));
const users = [
    { address: "0xD08c8e6d78a1f64B1796d6DC3137B19665cb6F1F", amount: 10 },
    { address: "0xb7D15753D3F76e7C892B63db6b4729f700C01298", amount: 15 },
    { address: "0xf69Ca530Cd4849e3d1329FBEC06787a96a3f9A68", amount: 20 },
    { address: "0xa8532aAa27E9f7c3a96d754674c99F1E2f824800", amount: 30 },
    { address: "0x7b60f9470B4D13ed8a87A5bD04a97cCE8e5586A1", amount: 30 }
];
const test = 1;
const elements = users.map((x) => ethers_1.utils.solidityKeccak256(["address", "uint256"], [x.address, x.amount]));
//console.log(elements);
const merkleTree = new merkletreejs_1.MerkleTree(elements, keccak256_1.default, { sort: true });
//console.log(merkleTree);
const root = merkleTree.getHexRoot();
const fs = require('fs');
fs.writeFile("./mkTree.json", JSON.stringify(merkleTree), (err) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("books.txt", "utf8"));
    }
});
// const leaf = elements[3];
// const proof = merkleTree.getHexProof(leaf);
