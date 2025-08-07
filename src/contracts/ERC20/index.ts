export const contractCode = `
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CONTRACT_NAME is ERC20 {
    constructor() ERC20("CONTRACT_NAME", "TOKEN_SYMBOL") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
`;
