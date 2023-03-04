//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract QuickMintCollection is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public collectionOwner;

    constructor(string memory _collectionName, string memory _collectionSymbol, address _collectionOwner) 
                ERC721(_collectionName, _collectionSymbol) {
                    collectionOwner = _collectionOwner;
                }

    function quickMint(string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(collectionOwner, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

}
