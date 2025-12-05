// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TswiftToken
 * @dev ERC20 token for Tswift procurement system
 * Used for project funding and payments
 */
contract TswiftToken is ERC20, ERC20Burnable, Ownable {
    // Initial supply: 1 million tokens with 18 decimals
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    constructor() ERC20("Tswift Token", "TSWIFT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Mint new tokens (only owner)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from caller
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
    }

    /**
     * @dev Burn tokens from another address (requires approval)
     */
    function burnFrom(address account, uint256 amount) public override {
        super.burnFrom(account, amount);
    }
}
