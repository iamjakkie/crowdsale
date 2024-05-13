const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

const ether = tokens;

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
        
        crowdsale = await Crowdsale.deploy(token.address, ether(1), '1000000');

        let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(10000000));
        await transaction.wait();

        transaction = await crowdsale.connect(deployer).addToWhitelist(user1.address);
        await transaction.wait();
    })

    describe('Deployment', () => {
        it("Returns token address", async () => {
            expect(await crowdsale.token()).to.equal(token.address);
        })

        it('Returns token price', async () => {
            expect(await crowdsale.price()).to.equal(ether(1));
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
                let transaction = await crowdsale.connect(user1).buyTokens(amount, {value: ether(10)});
                await transaction.wait();
            
            })
            it('Transfer tokens', async () => {
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(9999990));
                expect(await token.balanceOf(user1.address)).to.equal(amount);
            })

            it('Updates contracts ether balance', async() => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount);
            })

            it('Emits a buy event', async () => {
                expect(await crowdsale.connect(user1).buyTokens(amount, {value: ether(10)})).to.emit(crowdsale, 'Buy').withArgs(user1.address, amount, ether(10));
            })
        })

        describe('Failure', () => {
            it('Rejects insufficient Ether', async () => {
                await expect(crowdsale.connect(user1).buyTokens(amount, { value: 0})).to.be.revertedWith('Amount is not equal to the price');
            })

            it('Rejects insufficient balance in contract', async () => {
                // log crowdsale price
                await expect(crowdsale.connect(user1).buyTokens(amount, { value: 10000000})).to.be.revertedWith('Amount is not equal to the price');
            })
        })
    })

    describe('Sending ETH', () => {
        let transaction, result;
        let amount = tokens(10);

        describe('Success', () => {
            beforeEach(async () => {
                transaction = await user1.sendTransaction({to: crowdsale.address, value: amount});
                result = await transaction.wait();
            })

            it('Updated contract balance', async () => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(amount);
            })

            it('Updated user balance', async () => {
                expect(await token.balanceOf(user1.address)).to.equal(amount);
            })
        })
    })

    describe('Update price', () => {
        let transaction, result
        let price = ether(2);

        describe('Success', () => {
            beforeEach(async () => {
                transaction = await crowdsale.connect(deployer).setPrice(price);
                result = await transaction.wait();
            })

            it('Updates price', async () => {
                expect(await crowdsale.price()).to.equal(price);
            })
        })

        describe('Failure', () => {
            it('Rejects if not owner', async () => {
                await expect(crowdsale.connect(user1).setPrice(price)).to.be.reverted;
            })
        })
    })

    describe('Finalizing sale', () => {
        let transaction, result;
        let amount = tokens(10);
        let value = ether(10);

        describe('Success', () => {
            beforeEach(async () => {
                transaction = await crowdsale.connect(user1).buyTokens(amount, {value: value});
                result = await transaction.wait();

                transaction = await crowdsale.connect(deployer).finalize();
                result = await transaction.wait();
            })

            it('Transfers remaining tokens to owner', async () => {
                expect(await token.balanceOf(crowdsale.address)).to.equal(tokens(0));
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(9999990));
            })

            it('Transfers ether to owner', async () => {
                expect(await ethers.provider.getBalance(crowdsale.address)).to.equal(0);
            })

            it('Emits a finalization event', async () => {
                expect(transaction).to.emit(crowdsale, 'Finalized').withArgs(amount, 0);
            })
        })

        describe('Failure', () => {
            it('Rejects if not owner', async () => {
                await expect(crowdsale.connect(user1).finalize()).to.be.reverted;
            })
        })
    })

})