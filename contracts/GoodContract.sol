//SPDX-License-Identifier:MIT

pragma solidity ^0.8.17;


contract GoodContract{
    mapping(address => uint256) public balances;

    function addBalance() public payable{
        balances[msg.sender] += msg.value;
    }

    function withdraw() public payable {
        require(balances[msg.sender] > 0, "No sufficient balance");

        (bool success, ) = msg.sender.call{value:balances[msg.sender]}("");
        require(success, "Failed to send ether");

        balances[msg.sender] = 0;
    }
}