pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {

    Token public token;

    constructor(Token _token) {
        token = _token;
    }

}