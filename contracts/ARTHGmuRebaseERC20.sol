//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IGMUOracle } from "./interfaces/IGMUOracle.sol";
import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { ERC20RebasePermit } from "./ERC20RebasePermit.sol";

contract ARTHGmuRebaseERC20 is ERC20RebasePermit, Ownable {
    using SafeMath for uint256;
    IGMUOracle public gmuOracle;

    uint8 public decimals = 18;
    string public symbol;

    constructor(
        string memory _name,
        string memory _symbol,
        address _gmuOracle,
        address governance,
        uint256 chainId
    ) ERC20RebasePermit(_name, chainId) {
        symbol = _symbol;
        gmuOracle = IGMUOracle(_gmuOracle);
        _transferOwnership(governance); // transfer ownership to governance
    }
}
