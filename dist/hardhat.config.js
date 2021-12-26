"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
(0, config_1.task)("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(await account.address);
    }
});
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const ALCHEMY_API_KEY = "WXIhcygzzvuZfxoTczr9LbXCUXq6bBsV";
const ROPSTEN_PRIVATE_KEY = "0d6d9606487683227bbe2ec181ee5de20fe1fe6795475e3e068ecc8f68f390ef";
exports.default = {
    solidity: "0.8.0",
    networks: {
        ropsten: {
            url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`${ROPSTEN_PRIVATE_KEY}`]
        }
    }
};
