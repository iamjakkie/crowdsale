import { Container } from "react-bootstrap";
import { ethers } from "ethers";


import Navigation from "./components/Navigation";
import { useEffect } from "react";


function App() {

    const loadBlockchainData = async () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(provider);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        console.log(account);
    }

    useEffect(() => {
        loadBlockchainData();
    });
    return (
        <Container>
            <Navigation />
            {/* { Read from state } */}
        </Container>
    );
}

export default App;
