pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {

    Token public token;
    uint256 public price;
    address public owner;
    uint256 public maxTokens;
    uint256 public tokensSold;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);

    constructor(Token _token, uint256 _price) {
        owner = msg.sender;
        token = _token;
        price = _price;
        // maxTokens = _maxTokens;
    }

    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    function buyTokens(uint256 _amount) public payable{
        require(msg.value >= (_amount/1e18) * price, "Amount is not equal to the price");
        require(token.balanceOf(address(this)) >= _amount, "Not enough tokens in the contract");
        require(token.transfer(msg.sender, _amount));

        tokensSold += _amount;

        emit Buy(_amount, msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function finalize() public onlyOwner{
        // require(msg.sender == owner);
        require(token.transfer(owner, token.balanceOf(address(this))));
        // send eth to crowdsale creator
        uint256 value = address(this).balance;
        (bool sent, ) = owner.call{value:value}("");
        require(sent, "Failed to send Ether");

        emit Finalize(tokensSold, value);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

}