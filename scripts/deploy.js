const hre = require("hardhat");

async function main() {
    const Token = hre.ethers.getContractFactory("Token");
    let token = await Token.deploy("just TOKEN", "JUST", 1000000000000000000000000);
    await token.deployed();

    console.log("Token deployed to:", token.address);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
    });