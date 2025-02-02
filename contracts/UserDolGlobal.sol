// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

import './IDolGlobalCollection.sol';
import './IPoolManager.sol';
import './ITop5.sol';
import './ITopG.sol';

struct UserStruct {
    bool registered;
    bool faceId;
    uint8 totalLevels;
    address[40] levels;
    address[] referrals;
}

contract UserDolGlobal is Ownable2Step, ReentrancyGuard {
    using SafeERC20 for IERC20;

    event UserAdded(address indexed user, address indexed sponsor);
    event SetFaceId(address indexed user, bool flag);

    mapping(address => UserStruct) private users;
    mapping(address => uint) public userTotalEarned;
    mapping(address => uint) public userTotalLosted;
    mapping(address => mapping(uint => uint)) private userTotalEarnedDaily;
    mapping(address => bool) public blacklisted;

    uint constant MAX_CLAIM_DAILY = 10000e6;
    uint maxDailyTop5Individual = 5000e6;
    uint maxDailyG100Grupped = 100000e6;
    uint maxDailyG10Grupped = 10000e6;

    uint constant PERCENTAGE_FIXED = 25;

    IERC20 private immutable usdt;
    IERC20 private immutable dolGlobal;
    IDolGlobalCollection private collection;
    IPoolManager private poolManager;
    address private top1;
    address private top2;
    address private top3;
    address private top4;
    address private top5;
    ITopG private g100;
    ITopG private g10;

    constructor(
        address _usdt,
        address _dolGlobal,
        address _top1,
        address _top2,
        address _top3,
        address _top4,
        address _top5,
        address _g100,
        address _g10
    ) Ownable(msg.sender) {
        address[] memory referrals;
        address[40] memory levels40;

        top1 = _top1;
        top2 = _top2;
        top3 = _top3;
        top4 = _top4;
        top5 = _top5;
        g100 = ITopG(_g100);
        g10 = ITopG(_g10);

        users[_top1] = UserStruct({
            registered: false,
            faceId: false,
            totalLevels: 0,
            levels: levels40,
            referrals: referrals
        });
        levels40[0] = _top1;
        users[_top2] = UserStruct({
            registered: false,
            faceId: false,
            totalLevels: 1,
            levels: levels40,
            referrals: referrals
        });
        levels40[0] = _top2;
        levels40[1] = _top1;
        users[_top1].referrals.push(_top2);
        users[_top3] = UserStruct({
            registered: false,
            faceId: false,
            totalLevels: 2,
            levels: levels40,
            referrals: referrals
        });
        levels40[0] = _top3;
        levels40[1] = _top2;
        levels40[2] = _top1;
        users[_top2].referrals.push(_top3);

        users[_top4] = UserStruct({
            registered: false,
            faceId: false,
            totalLevels: 3,
            levels: levels40,
            referrals: referrals
        });
        levels40[0] = _top4;
        levels40[1] = _top3;
        levels40[2] = _top2;
        levels40[3] = _top1;
        users[_top3].referrals.push(_top4);

        users[_top5] = UserStruct({
            registered: false,
            faceId: false,
            totalLevels: 4,
            levels: levels40,
            referrals: referrals
        });
        levels40[0] = _top5;
        levels40[1] = _top4;
        levels40[2] = _top3;
        levels40[3] = _top2;
        levels40[4] = _top1;
        users[_top4].referrals.push(_top5);
        users[_top5].referrals.push(_g100);

        users[_g100] = UserStruct({
            registered: false,
            faceId: false,
            totalLevels: 5,
            levels: levels40,
            referrals: referrals
        });
        users[_g100].referrals.push(_g10);

        levels40[0] = _g100;
        levels40[1] = _top5;
        levels40[2] = _top4;
        levels40[3] = _top3;
        levels40[4] = _top2;
        levels40[5] = _top1;

        users[_g10] = UserStruct({
            registered: true,
            faceId: true,
            totalLevels: 6,
            levels: levels40,
            referrals: referrals
        });

        usdt = IERC20(_usdt);
        dolGlobal = IERC20(_dolGlobal);
    }
    function changeBlackList(address user, bool flag) external onlyOwner {
        blacklisted[user] = flag;
    }

    function setMaxClaims(
        uint _maxDailyTop5Individual,
        uint _maxDailyG100Grupped,
        uint _maxDailyG10Grupped
    ) external onlyOwner {
        maxDailyTop5Individual = _maxDailyTop5Individual;
        maxDailyG100Grupped = _maxDailyG100Grupped;
        maxDailyG10Grupped = _maxDailyG10Grupped;
    }

    function setPoolManager(address _poolManager) external onlyOwner {
        poolManager = IPoolManager(_poolManager);
    }
    function setDolGlobalCollection(address _collection) external onlyOwner {
        collection = IDolGlobalCollection(_collection);
    }
    function setFaceId(address user, bool flag) external onlyOwner {
        users[user].faceId = flag;
        emit SetFaceId(user, flag);
    }
    function createUser(address user, address _sponsor) public onlyOwner {
        require(_sponsor != address(0), 'Zero address');
        require(user != address(0), 'Zero address');

        require(!users[user].registered, 'Already Registered');
        require(users[_sponsor].registered, 'Invalid Sponsor');

        UserStruct storage newUser = users[user];
        address[40] memory levels;
        newUser.registered = true;
        newUser.levels = levels;
        newUser.levels[0] = _sponsor;
        users[_sponsor].referrals.push(user);
        UserStruct storage sponsor = users[_sponsor];
        for (uint8 i = 1; i <= sponsor.totalLevels && i < 40; i++) {
            newUser.levels[i] = sponsor.levels[i - 1];
        }

        newUser.totalLevels = uint8(
            sponsor.totalLevels + 1 <= 40 ? sponsor.totalLevels + 1 : 40
        );
        emit UserAdded(user, _sponsor);
    }
    function viewTotalEarnedInADay(
        address user,
        uint timestamp
    ) external view returns (uint) {
        return userTotalEarnedDaily[user][getDayStartTimestamp(timestamp)];
    }
    function getUser(
        address _address
    ) external view returns (UserStruct memory) {
        return users[_address];
    }
    function getDayStartTimestamp(uint timestamp) public pure returns (uint) {
        return timestamp - (timestamp % 86400);
    }
    function distributeUnilevelUsdt(
        address user,
        uint amount
    ) external nonReentrant {
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        amount = (amount * 100) / 38;
        uint excess;
        uint totalLevels = users[user].totalLevels;
        address[40] memory levels = (users[user].levels);

        if (users[user].totalLevels == 0) {
            excess = (amount * 38) / 100;
        } else if (totalLevels == 1) {
            excess = (amount * 28) / 100;
        } else if (totalLevels == 2) {
            excess = (amount * 23) / 100;
        } else if (totalLevels == 3) {
            excess = (amount * 21) / 100;
        } else if (totalLevels == 4) {
            excess = (amount * 19) / 100;
        } else if (totalLevels == 5) {
            excess = (amount * 18) / 100;
        } else if (totalLevels == 6) {
            excess = (amount * 17) / 100;
        } else if (totalLevels > 6) {
            excess = (((40 - totalLevels) * amount) * 5) / 1000;
        }
        for (uint8 i = 0; i < totalLevels; i++) {
            uint percentage;
            if (i < 7) {
                percentage = calculateUnilevelUsdt(i + 1);
            } else {
                percentage = calculateUnilevelUsdt(7);
            }
            if (blacklisted[levels[i]]) {
                excess += (amount * percentage) / 1000;
                userTotalLosted[levels[i]] += (amount * percentage) / 1000;
                continue;
            }
            if (isG100(levels[i])) {
                uint valueToReserve = distributeG100(
                    levels[i],
                    amount,
                    percentage
                );
                usdt.approve(address(poolManager), valueToReserve);
                poolManager.sendToReservePool(valueToReserve);

                continue;
            }
            if (isG10(levels[i])) {
                uint valueToReserve = distributeG10(
                    levels[i],
                    amount,
                    percentage
                );
                usdt.approve(address(poolManager), valueToReserve);
                poolManager.sendToReservePool(valueToReserve);
                continue;
            }
            if (isTop5(levels[i])) {
                uint valueToReserve = distributeTop5(
                    levels[i],
                    amount,
                    percentage
                );
                usdt.approve(address(poolManager), valueToReserve);
                poolManager.sendToReservePool(valueToReserve);
                continue;
            }
            uint value = collection.availableUnilevel(levels[i]);
            if (value > 0) {
                uint share = (amount * percentage) / 1000;

                if (
                    userTotalEarnedDaily[levels[i]][
                        getDayStartTimestamp(block.timestamp)
                    ] +
                        share <
                    MAX_CLAIM_DAILY
                ) {
                    if (value > share) {
                        usdt.safeTransfer(levels[i], share);

                        userTotalEarned[levels[i]] += share;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += share;

                        collection.increaseGain(levels[i], share);
                    } else {
                        uint remaining = share - value;
                        usdt.safeTransfer(levels[i], value);

                        userTotalEarned[levels[i]] += value;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += value;
                        collection.increaseGain(levels[i], value);
                        excess += remaining;
                        userTotalLosted[levels[i]] += remaining;
                    }
                } else {
                    uint newShare = MAX_CLAIM_DAILY -
                        (
                            userTotalEarnedDaily[levels[i]][
                                getDayStartTimestamp(block.timestamp)
                            ]
                        );

                    excess += share - newShare;
                    userTotalLosted[levels[i]] += share - newShare;

                    if (value > newShare) {
                        usdt.safeTransfer(levels[i], newShare);

                        userTotalEarned[levels[i]] += newShare;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += newShare;

                        collection.increaseGain(levels[i], newShare);
                    } else {
                        uint remaining = newShare - value;
                        usdt.safeTransfer(levels[i], value);

                        userTotalEarned[levels[i]] += value;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += value;
                        collection.increaseGain(levels[i], value);
                        excess += remaining;
                        userTotalLosted[levels[i]] += remaining;
                    }
                }
            } else {
                excess += ((amount) * percentage) / 1000;
                userTotalLosted[levels[i]] += ((amount) * percentage) / 1000;
            }
        }

        if (excess > 0) {
            usdt.approve(address(poolManager), excess);
            poolManager.increaseLiquidityReservePool(excess);
        }
    }
    function distributeUnilevelIguality(
        address user,
        uint amount
    ) external nonReentrant {
        usdt.safeTransferFrom(msg.sender, address(this), amount);
        uint totalLevels = users[user].totalLevels;
        address[40] memory levels = (users[user].levels);

        uint excess = (((40 - totalLevels) * amount) * PERCENTAGE_FIXED) / 1000;
        for (uint8 i = 0; i < totalLevels; i++) {
            if (blacklisted[levels[i]]) {
                excess += (amount * PERCENTAGE_FIXED) / 1000;
                userTotalLosted[levels[i]] +=
                    (amount * PERCENTAGE_FIXED) /
                    1000;
                continue;
            }

            if (isG100(levels[i])) {
                uint valueToReserve = distributeG100(
                    levels[i],
                    amount,
                    PERCENTAGE_FIXED
                );
                usdt.approve(address(poolManager), valueToReserve);
                poolManager.sendToReservePool(valueToReserve);
                continue;
            }
            if (isG10(levels[i])) {
                uint valueToReserve = distributeG10(
                    levels[i],
                    amount,
                    PERCENTAGE_FIXED
                );
                usdt.approve(address(poolManager), valueToReserve);
                poolManager.sendToReservePool(valueToReserve);
                continue;
            }
            if (isTop5(levels[i])) {
                uint valueToReserve = distributeTop5(
                    levels[i],
                    amount,
                    PERCENTAGE_FIXED
                );
                usdt.approve(address(poolManager), valueToReserve);
                poolManager.sendToReservePool(valueToReserve);
                continue;
            }
            uint value = collection.availableUnilevel(levels[i]);
            if (value > 0) {
                uint share = (amount * PERCENTAGE_FIXED) / 1000;

                if (
                    userTotalEarnedDaily[levels[i]][
                        getDayStartTimestamp(block.timestamp)
                    ] +
                        share <
                    MAX_CLAIM_DAILY
                ) {
                    if (value > share) {
                        usdt.safeTransfer(levels[i], share);

                        userTotalEarned[levels[i]] += share;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += share;

                        collection.increaseGain(levels[i], share);
                    } else {
                        uint remaining = share - value;
                        usdt.safeTransfer(levels[i], value);

                        userTotalEarned[levels[i]] += value;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += value;
                        collection.increaseGain(levels[i], value);
                        excess += remaining;
                        userTotalLosted[levels[i]] += remaining;
                    }
                } else {
                    uint newShare = MAX_CLAIM_DAILY -
                        (
                            userTotalEarnedDaily[levels[i]][
                                getDayStartTimestamp(block.timestamp)
                            ]
                        );
                    excess += share - newShare;
                    userTotalLosted[levels[i]] += share - newShare;

                    if (value > newShare) {
                        usdt.safeTransfer(levels[i], newShare);

                        userTotalEarned[levels[i]] += newShare;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += newShare;

                        collection.increaseGain(levels[i], newShare);
                    } else {
                        uint remaining = newShare - value;
                        usdt.safeTransfer(levels[i], value);

                        userTotalEarned[levels[i]] += value;
                        userTotalEarnedDaily[levels[i]][
                            getDayStartTimestamp(block.timestamp)
                        ] += value;
                        collection.increaseGain(levels[i], value);
                        excess += remaining;
                        userTotalLosted[levels[i]] += remaining;
                    }
                }
            } else {
                excess += ((amount) * PERCENTAGE_FIXED) / 1000;
                userTotalLosted[levels[i]] +=
                    ((amount) * PERCENTAGE_FIXED) /
                    1000;
            }
        }

        if (excess > 0) {
            usdt.approve(address(poolManager), excess);
            poolManager.increaseLiquidityReservePool(excess);
        }
    }

    function isG100(address level) internal view returns (bool) {
        if (level == address(g100)) {
            return true;
        }
        return false;
    }
    function isG10(address level) internal view returns (bool) {
        if (level == address(g10)) {
            return true;
        }
        return false;
    }

    function isTop5(address level) internal view returns (bool) {
        if (
            level == top1 ||
            level == top2 ||
            level == top3 ||
            level == top4 ||
            level == top5
        ) {
            return true;
        }
        return false;
    }

    function distributeTop5(
        address addressTop5,
        uint amount,
        uint percentage
    ) internal returns (uint excess) {
        ITop5 top5Internal = ITop5(address(addressTop5));
        uint remainingBalanceToFinishTop5 = top5Internal.viewRemainingBalance();
        if (remainingBalanceToFinishTop5 > 0) {
            uint share = (amount * percentage) / 1000;
            uint gainToday = userTotalEarnedDaily[addressTop5][
                getDayStartTimestamp(block.timestamp)
            ];

            if (share > remainingBalanceToFinishTop5) {
                uint newShare = remainingBalanceToFinishTop5;
                excess += share - newShare;
                if (gainToday + newShare > maxDailyTop5Individual) {
                    uint remainingDaily = maxDailyTop5Individual - (gainToday);
                    userTotalEarnedDaily[addressTop5][
                        getDayStartTimestamp(block.timestamp)
                    ] += remainingDaily;
                    usdt.approve(addressTop5, remainingDaily);
                    top5Internal.increaseValue(remainingDaily);
                    excess += newShare - remainingDaily;
                } else {
                    usdt.approve(addressTop5, newShare);
                    userTotalEarnedDaily[addressTop5][
                        getDayStartTimestamp(block.timestamp)
                    ] += newShare;
                    top5Internal.increaseValue(newShare);
                }
            } else {
                if (gainToday + share > (maxDailyTop5Individual)) {
                    uint remainingDaily = maxDailyTop5Individual - (gainToday);
                    userTotalEarnedDaily[addressTop5][
                        getDayStartTimestamp(block.timestamp)
                    ] += remainingDaily;
                    usdt.approve(addressTop5, remainingDaily);
                    top5Internal.increaseValue(remainingDaily);
                    excess += share - remainingDaily;
                } else {
                    usdt.approve(addressTop5, share);
                    userTotalEarnedDaily[addressTop5][
                        getDayStartTimestamp(block.timestamp)
                    ] += share;
                    top5Internal.increaseValue(share);
                }
            }
        } else {
            excess = (amount * percentage) / 1000;
        }
    }
    function distributeG100(
        address addressG100,
        uint amount,
        uint percentage
    ) internal returns (uint excess) {
        uint valueToG100 = (amount * percentage) / 1000;
        if (
            valueToG100 +
                userTotalEarnedDaily[addressG100][
                    getDayStartTimestamp(block.timestamp)
                ] >=
            maxDailyG100Grupped
        ) {
            uint valueRemaining = maxDailyG100Grupped -
                userTotalEarnedDaily[addressG100][
                    getDayStartTimestamp(block.timestamp)
                ];
            userTotalEarnedDaily[addressG100][
                getDayStartTimestamp(block.timestamp)
            ] += valueRemaining;
            usdt.approve(addressG100, valueRemaining);
            g100.increaseBalance(valueRemaining);
            excess += valueToG100 - valueRemaining;
        } else {
            userTotalEarnedDaily[addressG100][
                getDayStartTimestamp(block.timestamp)
            ] += valueToG100;
            usdt.approve(addressG100, valueToG100);
            g100.increaseBalance(valueToG100);
        }
    }
    function distributeG10(
        address addressG10,
        uint amount,
        uint percentage
    ) internal returns (uint excess) {
        uint valueToG10 = (amount * percentage) / 1000;
        if (
            valueToG10 +
                userTotalEarnedDaily[addressG10][
                    getDayStartTimestamp(block.timestamp)
                ] >=
            maxDailyG10Grupped
        ) {
            if (!g10.isRoofActivated()) {
                g10.activeRoof();
            }
            uint valueRemaining = maxDailyG10Grupped -
                userTotalEarnedDaily[addressG10][
                    getDayStartTimestamp(block.timestamp)
                ];
            userTotalEarnedDaily[addressG10][
                getDayStartTimestamp(block.timestamp)
            ] += valueRemaining;
            usdt.approve(addressG10, valueRemaining);
            g10.increaseBalance(valueRemaining);
            excess += valueToG10 - valueRemaining;
        } else {
            userTotalEarnedDaily[addressG10][
                getDayStartTimestamp(block.timestamp)
            ] += valueToG10;
            usdt.approve(addressG10, valueToG10);
            g10.increaseBalance(valueToG10);
        }
    }

    function calculateUnilevelUsdt(uint level) internal pure returns (uint) {
        if (level == 1) return 100;
        else if (level == 2) return 50;
        else if (level == 3) return 20;
        else if (level == 4) return 20;
        else if (level == 5) return 10;
        else if (level == 6) return 10;
        else if (level == 7) return 5;
        else return 5;
    }
}
