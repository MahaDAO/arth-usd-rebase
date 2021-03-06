//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ARTHGmuRebaseERC20} from "./ARTHGmuRebaseERC20.sol";

contract ArthUSDWrapper is ARTHGmuRebaseERC20 {
    IERC20 public arth;

    event Deposit(address indexed who, uint256 amount);
    event Withdraw(address indexed who, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        address _arth,
        address _gmuOracle,
        address _governance
    ) ARTHGmuRebaseERC20(_name, _symbol, _gmuOracle, _governance) {
        arth = IERC20(_arth);
    }

    /**
     * @dev Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.
     */
    function depositFor(address account, uint256 gons)
        public
        virtual
        returns (bool)
    {
        SafeERC20.safeTransferFrom(arth, _msgSender(), address(this), gons);
        _mint(account, gons);
        emit Deposit(account, gons);
        return true;
    }

    function deposit(uint256 gons) public virtual returns (bool) {
        return depositFor(_msgSender(), gons);
    }

    /**
     * @dev Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.
     */
    function withdrawTo(address account, uint256 gons)
        public
        virtual
        returns (bool)
    {
        _burn(_msgSender(), gons);
        SafeERC20.safeTransfer(arth, account, gons);
        emit Withdraw(account, gons);
        return true;
    }

    function withdraw(uint256 gons) public virtual returns (bool) {
        return withdrawTo(_msgSender(), gons);
    }
}
