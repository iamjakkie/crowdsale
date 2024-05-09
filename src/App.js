import { Container } from "react-bootstrap";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import Navigation from "./components/Navigation";



function App() {

    const [account, setAccount] = useState(null);

    const loadBlockchainData = async () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        console.log(account);
        setAccount(account);
    }

    useEffect(() => {
        loadBlockchainData();
    });
    return (
        <Container>
            <Navigation />
            <div>{account}</div>
        </Container>
    );
}

export default App;
