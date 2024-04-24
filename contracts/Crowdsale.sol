pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {

    Token public token;
    uint256 public price;

    constructor(Token _token, uint256 _price) {
        token = _token;
        price = _price;
    }

    function buyTokens(uint256 _amount) public payable{
        
        token.transfer(msg.sender, _amount); 
    }

}