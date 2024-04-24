const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Crowdsale', () => {

    let crowdsale, token;
    let accounts, deployer, user1;

    beforeEach(async () => {
        const Crowdsale = await ethers.getContractFactory('Crowdsale');
        const Token = await ethers.getContractFactory('Token');
        token = await Token.deploy("JUST Token", "JUST", '10000000')
        
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];
        
        crowdsale = await Crowdsale.deploy(token.address);

        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(10000000));
        await transaction.wait();
    })

    describe('Deployment', () => {
        it("Returns token address", async () => {
            expect(await crowdsale.token()).to.equal(token.address);
        })

        it('Sends tokens to crowdsale contract', async () => {
            let balance = await token.balanceOf(crowdsale.address);
            expect(balance).to.equal(tokens(10000000));
        })
    })

    describe('Buying Tokens', () => {
        let amount = tokens(10);

        describe('Success', () => {
            beforeEach(async () => {
                let transaction = await crowdsale.connect(user1).buyTokens(amount);
                await transaction.wait();
            
            })
            it('Transfer tokens', async () => {
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(9999990));
                expect(await token.balanceOf(user1.address)).to.equal(amount);
            })
        })
    })

})