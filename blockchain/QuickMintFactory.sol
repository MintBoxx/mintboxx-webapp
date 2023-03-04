//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./QuickMintCollection.sol";

contract QuickMintFactory {
   
    struct User {
        address userAddress;
        QuickMintCollection userCollectionAddress;
        bool exist;
    }

    mapping(address => User) public userQuickMintCollection;

    function CreateNewUserCollection(string memory _collectionName, string memory _collectionSymbol, string memory _tokenURI) public {
        require(userQuickMintCollection[msg.sender].exist == false, "User Collection Already exists");
        QuickMintCollection collection = new QuickMintCollection(_collectionName, _collectionSymbol, msg.sender);
        User memory user = User(msg.sender, collection, true);
        userQuickMintCollection[msg.sender] = user;
        QuickMintCollection(collection).quickMint(_tokenURI);
    }

    function userCollectionExists(address _userAddress) public view returns(bool) {
        return userQuickMintCollection[_userAddress].exist;
    }

}
