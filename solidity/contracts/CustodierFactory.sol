pragma solidity ^0.5.0;
// this contract will produce custodier instances

import "./Custodier.sol";
contract CustodierFactory { 

    address owner;
    event CreatedCustodier(address custodier);
    uint public custodierCount;
    mapping(uint => address) public custodiers;

    constructor() public {
        owner = msg.sender;
    }

    function createCustodier(string memory _name, uint _contribAmount, uint _millisecondsUntilExpiration) public returns(address) {
        custodierCount++;
        Custodier newCustodier = new Custodier(_name, _contribAmount, msg.sender, _millisecondsUntilExpiration);
        custodiers[custodierCount] = address(newCustodier);
        emit CreatedCustodier(address(newCustodier));

        return address(newCustodier);
    }
}