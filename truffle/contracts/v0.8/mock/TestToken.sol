// SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-newone/token/ERC20/ERC20.sol";

contract TestToken is ERC20("Token1", "TOK1") {

    function mint(address rec, uint amount) public {
        _mint(rec, amount);
    }
}
