export const contractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CONTRACT_NAME is ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = MAX_SUPPLY_;
    uint256 private _tokenIds;

    string private baseURI;

    event Minted(address indexed owner, uint256 tokenId);

    constructor() ERC721("CONTRACT_NAME", "TOKEN_SYMBOL") Ownable(msg.sender) {
        baseURI = "BASE_URI";
    }

    function mint() external {
        require(_tokenIds < MAX_SUPPLY, "Max NFT supply reached");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);

        emit Minted(msg.sender, newTokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }
}
 `;
