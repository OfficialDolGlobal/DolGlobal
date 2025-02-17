// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/access/Ownable2Step.sol';

contract PaymentTracker is Ownable {
    mapping(address => bool) public hasPaid;
    address payable public bot_wallet;

    event PaymentReceived(address indexed payer);

    constructor() Ownable(msg.sender) {
        bot_wallet = payable(msg.sender);
    }

    function changeBotWallet(address newAddress) external onlyOwner {
        bot_wallet = payable(newAddress);
    }

    function pay() external payable {
        require(msg.value == 1 ether, '1 Pol require to continue');
        require(!hasPaid[msg.sender], 'Already paid');
        hasPaid[msg.sender] = true;

        bot_wallet.transfer(msg.value);

        emit PaymentReceived(msg.sender);
    }

    function checkPayment(address user) external view returns (bool) {
        return hasPaid[user];
    }
}
