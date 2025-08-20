export const contractCode = `
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CONTRACT_NAME is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    uint8 private _decimals;
    uint256 public maxSupply;
    bool public mintingFinished = false;

    event MintingFinished();
    event Mint(address indexed to, uint256 amount);

    modifier canMint() {
        require(!mintingFinished, "Minting is finished");
        _;
    }

    modifier validDestination(address to) {
        require(to != address(0), "Invalid address");
        require(to != address(this), "Cannot send to contract");
        _;
    }

    constructor() 
        ERC20("CONTRACT_NAME", "TOKEN_SYMBOL") 
        Ownable(msg.sender)
        ERC20Permit("CONTRACT_NAME")
    {
        _decimals = DECIMALS;
        maxSupply = MAX_SUPPLY * 10 ** _decimals;
        
        // Mint initial supply to contract creator
        if (INITIAL_SUPPLY > 0) {
            _mint(msg.sender, INITIAL_SUPPLY * 10 ** _decimals);
        }
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) 
        public 
        onlyOwner 
        canMint 
        validDestination(to) 
        returns (bool) 
    {
        require(totalSupply() + amount <= maxSupply, "Exceeds maximum supply");
        _mint(to, amount);
        emit Mint(to, amount);
        return true;
    }

    function mintBatch(address[] memory recipients, uint256[] memory amounts) 
        public 
        onlyOwner 
        canMint 
        returns (bool) 
    {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= maxSupply, "Exceeds maximum supply");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid address");
            _mint(recipients[i], amounts[i]);
            emit Mint(recipients[i], amounts[i]);
        }
        
        return true;
    }

    function finishMinting() public onlyOwner canMint returns (bool) {
        mintingFinished = true;
        emit MintingFinished();
        return true;
    }

    function setMaxSupply(uint256 _maxSupply) public onlyOwner {
        require(_maxSupply >= totalSupply(), "Max supply cannot be less than current supply");
        maxSupply = _maxSupply;
    }
}
`;
