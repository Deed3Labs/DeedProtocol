// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./LeaseAgreement.sol";
contract DepositManager{
  //Mapping leaseId=>depositAmounts
  mapping(uint256=>uint32) public leaseDeposits;
  address private leaseAgreementAddress;
  IERC20 public paymentToken;
  constructor(address _leaseAgreement, address _paymentToken){
    require(_leaseAgreement != address(0), "Invalid LeaseAgreement address");
    require(_paymentToken != address(0), "Invalid payment token address");
    leaseAgreementAddress=_leaseAgreement;
    paymentToken=IERC20(_paymentToken);

  }
  function addLeaseBalance(uint256 _leaseId, uint32 _amount) external {
    require(msg.sender==leaseAgreementAddress,"Sender must be leaseAgreement");
    // require()
    leaseDeposits[_leaseId] += _amount; 
  }
  function removeLeaseBalance(uint256 _leaseId, uint32 _amount) internal {
    require(msg.sender==leaseAgreementAddress,"Sender must be leaseAgreement");
    leaseDeposits[_leaseId] -= _amount; 
  }
  function withdrawFromDeposit(uint _leaseId,uint32 _amount,address _to) external{
  require(msg.sender==leaseAgreementAddress,"Sender must be leaseAgreement");
  require(_amount<= leaseDeposits[_leaseId],"Withdraw amount exceeds lease balance");
  paymentToken.transfer(_to,_amount);
  removeLeaseBalance(_leaseId,_amount);
  }
}   