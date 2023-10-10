// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract FundStorage {
    event FundsStored(uint256 id, IERC20 token, uint256 amount, address sender, address caller, uint256 newBalance);
    event FundsWithdrawn(
        uint256 id,
        IERC20 token,
        uint256 amount,
        address destination,
        address caller,
        uint256 newBalance
    );

    // AccountOwner     ->    AccountId   ->  TokenAddress -> Amount
    mapping(address => mapping(uint256 => mapping(address => uint256))) public accountsMapping;

    /**
     * Get the balance of an account
     * @param _id AccountId
     * @param _token TokenAddress
     * @return Balance
     */
    function accountBalance(uint256 _id, IERC20 _token) external view returns (uint256) {
        return accountsMapping[msg.sender][_id][address(_token)];
    }

    /**
     * Pull tokens from sender and store them in the contract
     * @param _id AccountId
     * @param _token TokenAddress
     * @param _amount Amount
     * @param _sender Witch address to pull tokens from
     */
    function store(uint256 _id, IERC20 _token, uint256 _amount, address _sender) external {
        _token.transferFrom(_sender, address(this), _amount);
        accountsMapping[msg.sender][_id][address(_token)] += _amount;
        emit FundsStored(_id, _token, _amount, _sender, msg.sender, accountsMapping[msg.sender][_id][address(_token)]);
    }

    /**
     * Withdraw tokens from the contract and send them to the recipient
     * @param _id AccountId
     * @param _token TokenAddress
     * @param _amount Amount
     * @param _recipient Witch address to send tokens to
     */
    function widthdraw(uint256 _id, IERC20 _token, uint256 _amount, address _recipient) external {
        accountsMapping[msg.sender][_id][address(_token)] -= _amount;
        _token.transfer(_recipient, _amount);
        emit FundsWithdrawn(
            _id,
            _token,
            _amount,
            _recipient,
            msg.sender,
            accountsMapping[msg.sender][_id][address(_token)]
        );
    }
}
