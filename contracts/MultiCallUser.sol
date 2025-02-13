// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import './IUserDolGlobal.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';

contract MultiCallUser is Ownable2Step {
    IUserDolGlobal userDolContract;

    event TransactionFailed(
        address indexed user,
        string functionName,
        string reason
    );

    constructor(address userContract) Ownable(msg.sender) {
        userDolContract = IUserDolGlobal(userContract);
    }

    function setUserContract(address userContract) external onlyOwner {
        userDolContract = IUserDolGlobal(userContract);
    }

    function createBatchTransactions(
        address[] calldata users,
        address[] calldata sponsors
    ) external onlyOwner {
        require(users.length == sponsors.length, 'Invalid');
        for (uint i = 0; i < users.length; i++) {
            try
                userDolContract.createUser(users[i], sponsors[i])
            {} catch Error(string memory reason) {
                emit TransactionFailed(users[i], 'createUser', reason);
            } catch {
                emit TransactionFailed(users[i], 'createUser', 'Unknown error');
            }
        }
    }
}
