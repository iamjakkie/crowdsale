const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Crowdsale', () => {

    let crowdsale, token;

    beforeEach(async () => {
        const Crowdsale = await ethers.getContractFactory('Crowdsale');
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy("JUST Token", "JUST", '10000000')
        crowdsale = await Crowdsale.deploy(token.address);
    })

    describe('Deployment', () => {
        it("Returns token address", async () => {
            expect(await crowdsale.token()).to.equal(token.address);
        })
    })

})