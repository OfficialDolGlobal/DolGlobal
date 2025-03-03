// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IUniswapOracle {
    function returnPrice(
        uint128 amountIn,
        uint32 secondsAgo
    ) external view returns (uint);
}
