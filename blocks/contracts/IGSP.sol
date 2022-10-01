// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;


interface IGSP {
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenID);

    function balanceOf(address owner) external view returns(uint256 balance);
}