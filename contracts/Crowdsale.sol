pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {

    Token public token;
    uint256 public price;
    address public owner;
    uint256 public maxTokens;
    uint256 public tokensSold;

    mapping(address => bool) public whitelist;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);
    event AddedToWhitelist(address _address);
    event RemovedFromWhitelist(address _address);

    constructor(Token _token, uint256 _price, uint256 _maxTokens) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
    }

    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "You are not whitelisted");
        _;
    }

    function addToWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
        emit AddedToWhitelist(_address);
    }

    function removeFromWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
        emit RemovedFromWhitelist(_address);
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }

    function buyTokens(uint256 _amount) public payable onlyWhitelisted{
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