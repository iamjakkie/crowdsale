import { Container } from "react-bootstrap";
import { ethers } from "ethers";
import { useEffect, useState } from "react";


import Navigation from "./components/Navigation";
import Info from "./components/Info";
import Loader from "./components/Loader";
import Progress from "./components/Progress";
import Buy from "./components/Buy";

import TOKEN_ABI from './abis/Token.json'
import CROWDSALE_ABI from './abis/Crowdsale.json'

import config from "./config.json"




function App() {

    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [crowdsale, setCrowdsale] = useState(null);
    const [accountBalance, setAccountBalance] = useState(0);
    const [price, setPrice] = useState(0);
    const [maxTokens, setMaxTokens] = useState(0);
    const [tokensSold, setTokensSold] = useState(0);
    const [crowdsaleStartTime, setCrowdsaleStartTime] = useState(Date.now());
    const [hasStarted, setHasStarted] = useState(false);
    const [minContribution, setMinContribution] = useState(0);
    const [maxContribution, setMaxContribution] = useState(0);

    const loadBlockchainData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const token = new ethers.Contract(config["31337"].token.address, TOKEN_ABI, provider);
        const crowdsale = new ethers.Contract(config["31337"].crowdsale.address, CROWDSALE_ABI, provider);
        setCrowdsale(crowdsale);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);

        const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account));
        setAccountBalance(accountBalance);

        const price = ethers.utils.formatUnits(await crowdsale.price());
        setPrice(price);
        const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens());
        setMaxTokens(maxTokens);
        const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold());
        setTokensSold(tokensSold);
        const crowdsaleStartTime = await crowdsale.startTime();

        setCrowdsaleStartTime(new Date(crowdsaleStartTime * 1000).toLocaleString());

        const minContribution = ethers.utils.formatUnits(await crowdsale.minContribution());
        setMinContribution(minContribution);
        const maxContribution = ethers.utils.formatUnits(await crowdsale.maxContribution());
        setMaxContribution(maxContribution);

        if (Date.now() > crowdsaleStartTime * 1000) {
            console.log(Date.now(), crowdsaleStartTime * 1000)
            setHasStarted(true);
        }

        setIsLoading(false);

    }

    useEffect(() => {
        if (isLoading) {
            loadBlockchainData();
        
        }
    }, [isLoading]);
    return (
        <Container>
            <Navigation />
            <h1 className="my-4 fire text-center">Introducing JUST TOKEN</h1>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                <p className='my-3 text-center'><strong>Crowdsale start date: </strong>{crowdsaleStartTime.toString()}</p> 
                <p className='text-center'><strong>Current price:</strong> {price} ETH</p>
                <p className='my-3'><strong>Min Contribution:</strong> {minContribution} JUST, <strong>Max Contribution:</strong> {maxContribution} JUST</p>
                <Buy provider={provider} price={price} crowdsale={crowdsale} setIsLoading={setIsLoading} hasStarted={hasStarted} />
                <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
                </>
            )}
            
            <hr />
            {account && <Info account={account} accountBalance={accountBalance} />}
        </Container>
    );
}

export default App;
