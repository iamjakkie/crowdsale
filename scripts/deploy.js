const hre = require("hardhat");

async function main() {
    hre.ethers.getContractFactory("Token")  
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
    });