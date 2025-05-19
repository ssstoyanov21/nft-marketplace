// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;
    address nftOwner;

    constructor() ERC721("SSH21", "S21") {
        nftOwner = msg.sender;
        for (uint256 i = 0; i < 10; i++) {
            tokenCount++;
            _mint(msg.sender, tokenCount);
        }
    }

    function mint(string memory _tokenURI) external returns (uint256) {
        require(msg.sender == nftOwner, "Only owner can mint ");
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);  
    }
}