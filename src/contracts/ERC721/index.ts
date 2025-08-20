export const contractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CONTRACT_NAME is 
    ERC721Enumerable, 
    ERC721URIStorage, 
    ERC721Burnable, 
    Ownable, 
    ReentrancyGuard, 
    Pausable 
{
    using Counters for Counters.Counter;
    
    uint256 public constant MAX_SUPPLY = MAX_SUPPLY_;
    uint256 public mintPrice = MINT_PRICE; // in wei
    uint256 public maxMintPerWallet = MAX_MINT_PER_WALLET;
    
    Counters.Counter private _tokenIds;
    string private baseURI;
    bool public publicMintEnabled = PUBLIC_MINT_ENABLED;
    
    mapping(address => uint256) public mintedPerWallet;
    mapping(address => bool) public whitelist;
    
    event Minted(address indexed owner, uint256 tokenId);
    event PriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);

    modifier validMintAmount(uint256 amount) {
        require(amount > 0, "Invalid mint amount");
        require(_tokenIds.current() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _;
    }

    modifier validPayment(uint256 amount) {
        require(msg.value >= mintPrice * amount, "Insufficient payment");
        _;
    }

    constructor() ERC721("CONTRACT_NAME", "TOKEN_SYMBOL") Ownable(msg.sender) {
        baseURI = "BASE_URI";
    }

    function mint(uint256 amount) 
        external 
        payable 
        whenNotPaused 
        nonReentrant 
        validMintAmount(amount)
        validPayment(amount)
    {
        require(publicMintEnabled, "Public minting not enabled");
        require(
            mintedPerWallet[msg.sender] + amount <= maxMintPerWallet, 
            "Exceeds wallet limit"
        );

        _mintTokens(msg.sender, amount);
    }

    function ownerMint(address to, uint256 amount) 
        external 
        onlyOwner 
        validMintAmount(amount) 
    {
        _mintTokens(to, amount);
    }

    function _mintTokens(address to, uint256 amount) private {
        for (uint256 i = 0; i < amount; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();
            _safeMint(to, newTokenId);
            emit Minted(to, newTokenId);
        }
        mintedPerWallet[to] += amount;
    }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        
        string memory uri = ERC721URIStorage.tokenURI(tokenId);
        return bytes(uri).length > 0 ? uri : string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    }

    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
        emit PriceUpdated(_mintPrice);
    }

    function setMaxMintPerWallet(uint256 _maxMintPerWallet) external onlyOwner {
        maxMintPerWallet = _maxMintPerWallet;
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner {
        _setTokenURI(tokenId, _tokenURI);
    }

    function togglePublicMint() external onlyOwner {
        publicMintEnabled = !publicMintEnabled;
    }

    function addToWhitelist(address[] memory addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = true;
        }
    }

    function removeFromWhitelist(address[] memory addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whitelist[addresses[i]] = false;
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function totalSupply() public view override returns (uint256) {
        return _tokenIds.current();
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721Enumerable, ERC721URIStorage) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
`;
