# Crowdsale

This project is a smart contract-based crowdsale platform built with Solidity and React. The Crowdsale contract facilitates the sale of a custom ERC20 token ("JUST TOKEN") to whitelisted participants. The contract ensures the following features:
- Whitelisted addresses can participate in the crowdsale.
- Crowdsale starts after a specified delay.
- Minimum and maximum contribution limits are enforced.
- Crowdsale can be finalized by the owner, transferring remaining tokens and ETH to the owner.


# Contracts

## Crowdsale.sol 
The `Crowdsale` contract handles the token sale and manages participants. Here are the key components and functionalities:
### Variables

- `Token public token`: The ERC20 token being sold.
- `uint256 public price`: Price of one token in wei.
- `address public owner`: Address of the contract owner.
- `uint256 public maxTokens`: Maximum number of tokens for sale.
- `uint256 public tokensSold`: Number of tokens sold.
- `uint256 public startTime`: Timestamp when the crowdsale starts.
- `uint256 public minContribution`: Minimum contribution in wei.
- `uint256 public maxContribution`: Maximum contribution in wei.
- `mapping(address => bool) public whitelist`: Addresses allowed to participate.

### Events

- `event Buy(uint256 amount, address buyer)`: Emitted when tokens are bought.
- `event Finalize(uint256 tokensSold, uint256 ethRaised)`: Emitted when crowdsale is finalized.
- `event AddedToWhitelist(address _address)`: Emitted when an address is added to the whitelist.
- `event RemovedFromWhitelist(address _address)`: Emitted when an address is removed from the whitelist.

### Constructor

Initializes the contract with token, price, maxTokens, minContribution, and maxContribution. Sets the crowdsale start time to 2 days after deployment.

### Modifiers

- `onlyWhitelisted()`: Ensures only whitelisted addresses can participate.
- `whenCrowdsaleStarted()`: Ensures the crowdsale has started.
- `validContribution(uint256 _amount)`: Ensures contributions are within the min and max limits.
- `onlyOwner()`: Ensures only the owner can call certain functions.

### Functions

- `addToWhitelist(address _address)`: Adds an address to the whitelist.
- `removeFromWhitelist(address _address)`: Removes an address from the whitelist.
- `isWhitelisted(address _address)`: Checks if an address is whitelisted.
- `buyTokens(uint256 _amount)`: Allows whitelisted addresses to buy tokens within contribution limits.
- `finalize()`: Finalizes the crowdsale, transferring remaining tokens and ETH to the owner.
- `setPrice(uint256 _price)`: Allows the owner to set the token price.

## Token.sol - 
the `Token` contract that is being sold. This is a common ERC20 token.

## Tests
Tests are written in javascript using hardhat and ethers.js. They cover the main functionality of the contracts.

## Deployment
The deployment script is written in javascript and uses hardhat to deploy the contracts.

## Frontend
The frontend is a simple react app that allows users to buy tokens and the owner to withdraw funds.

![App](./src/JUST%20TOKEN.png)

