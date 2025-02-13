// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import '@openzeppelin/contracts/access/Ownable2Step.sol';

contract PaymentTracker is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public usdt;
    uint256 public constant PAYMENT_AMOUNT = 1 * 10 ** 6;

    mapping(address => bool) public hasPaid;

    event PaymentReceived(address indexed payer);

    constructor(address _usdt) Ownable(msg.sender) {
        usdt = IERC20(_usdt);
    }

    function pay() external {
        require(!hasPaid[msg.sender], 'Already paid');
        usdt.safeTransferFrom(msg.sender, address(this), PAYMENT_AMOUNT);
        hasPaid[msg.sender] = true;

        emit PaymentReceived(msg.sender);
    }

    function checkPayment(address user) external view returns (bool) {
        return hasPaid[user];
    }

    function withdraw() external onlyOwner {
        uint256 balance = usdt.balanceOf(address(this));
        usdt.safeTransfer(msg.sender, balance);
    }
}
