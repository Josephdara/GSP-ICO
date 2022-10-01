// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IGSP.sol";

contract GlorySoundToken is ERC20, Ownable {

    IGSP GlorySound;
    uint256 public constant tokenPrice = 0.005 ether;
    uint256 public constant tokensPerNFT = 50 * 10**18;
    uint256 public constant maxTokenCap = 100000 * 10**18;
    mapping(uint256 => bool) public tokenIDsClaimed;

    constructor(address _GSPContract) ERC20("Glory Sound Token", "GST"){
        GlorySound = IGSP(_GSPContract);
    }

    function claim() public{
        address sender = msg.sender;
        uint256 balance = GlorySound.balanceOf(sender);
        require(balance>0, " You own no Glory Sound Punks");
        uint256 amount = 0;
        for(uint256 i = 0; i< balance; i++){
            uint256 tokenID = GlorySound.tokenOfOwnerByIndex(sender, i);
            if(!tokenIDsClaimed[tokenID]){
                amount += 1;
                tokenIDsClaimed[tokenID] = true;
            }
        }
        require(amount > 0, "Tokens Claimed");
        _mint(msg.sender, amount * tokensPerNFT);

    }
    function mint( uint256 amount) public payable {
        uint256 _requiredValue = tokenPrice * amount;
        require(msg.value >= _requiredValue, "Ether Value too Little");
        uint256 amountStructured = amount * 10 ** 18;
        require(totalSupply() + amountStructured <= maxTokenCap, "Exceeds the token Supply cap" );
        _mint(msg.sender, amountStructured);
    }

    receive () external payable{}
    fallback() external payable{}

   
    
}

