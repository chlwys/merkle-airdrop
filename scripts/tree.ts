import { ethers } from "hardhat";
import { utils } from "ethers";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const users = [
    { index: 0, address: "0xD08c8e6d78a1f64B1796d6DC3137B19665cb6F1F", amount: 10 },
    { index: 1, address: "0xb7D15753D3F76e7C892B63db6b4729f700C01298", amount: 15 },
    { index: 2, address: "0xf69Ca530Cd4849e3d1329FBEC06787a96a3f9A68", amount: 20 },
    { index: 3, address: "0xa8532aAa27E9f7c3a96d754674c99F1E2f824800", amount: 30 },
    { index: 4, address: "0x7b60f9470B4D13ed8a87A5bD04a97cCE8e5586A1", amount: 30 }
];


const elements = users.map((x: { index: any; address: any; amount: any; }) =>
utils.solidityKeccak256(["uint256", "address", "uint256"], [x.index, x.address, x.amount])
); 

//console.log(elements);

const merkleTree = new MerkleTree(elements, keccak256, { sort: true });

//console.log(merkleTree);

const root = merkleTree.getHexRoot();

const proofers = [merkleTree.getHexProof(elements[0])];

for (let i = 1; i < users.length; i += 1) {
    const leaf = elements[i];
    const proof = merkleTree.getHexProof(leaf);
    console.log('proof of ', i);
    console.log(proof);
    proofers.push(proof)
}


const fs = require('fs');

fs.writeFile("trees/mkTree.json", JSON.stringify(merkleTree), (err : any) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
    }
  });

fs.writeFile("trees/root.json", JSON.stringify(root), (err : any) => {
if (err)
    console.log(err);
else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
}
});
fs.writeFile("trees/elements.json", JSON.stringify(elements), (err : any) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
    }
    });
fs.writeFile("trees/users.json", JSON.stringify(users), (err : any) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
    }
    });

fs.writeFile("trees/proofs.json", JSON.stringify(proofers), (err : any) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
    }
    });
    
// const leaf = elements[3];
// const proof = merkleTree.getHexProof(leaf);

