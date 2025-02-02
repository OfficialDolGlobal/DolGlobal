// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './IPoolManager.sol';

contract Top5 is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct UserTop5 {
        address addressTop5;
        uint maxValue;
        uint valueReached;
        uint price;
    }
    uint maxValue;
    uint lastUpdate;

    UserTop5 user;
    bool public availableToBuy;
    IERC20 immutable usdt;

    IPoolManager private poolManager;

    event UsdtSent(address indexed to, uint256 amount);

    constructor(address _usdt) Ownable(msg.sender) {
        require(_usdt != address(0), 'USDT address cannot be zero');
        usdt = IERC20(_usdt);
    }
    function setPoolManager(address _poolManager) external onlyOwner {
        poolManager = IPoolManager(_poolManager);
    }

    function setConfig(uint _maxValue, uint price) external onlyOwner {
        maxValue = _maxValue;
        user.price = price;
        availableToBuy = true;
        lastUpdate = block.timestamp;
    }
    function buyTop5() external {
        require(availableToBuy, 'Unavailable now');
        require(
            block.timestamp > lastUpdate + 1 days ||
                msg.sender == user.addressTop5,
            'Purchase allowed after 24h or if you are a top 5 user.'
        );
        user.addressTop5 = msg.sender;
        user.maxValue = maxValue;
        availableToBuy = false;
        uint price = user.price;
        usdt.safeTransferFrom(msg.sender, address(this), price);

        usdt.approve(address(poolManager), price);
        poolManager.sendToReservePool(price);
    }

    function viewRemainingBalance() external view returns (uint remaining) {
        return user.maxValue - user.valueReached;
    }

    function increaseValue(uint amount) external nonReentrant {
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        if (user.addressTop5 == address(0)) {
            usdt.approve(address(poolManager), amount);
            poolManager.sendToReservePool(amount);
        } else {
            user.valueReached += amount;
            usdt.safeTransfer(user.addressTop5, amount);
            emit UsdtSent(user.addressTop5, amount);
        }
    }
}
