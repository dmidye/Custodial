pragma solidity ^0.5.0;
// this contract represents an instance of a custodier
// Will be created by CustodierFactory

contract Custodier {
    address public creator;
    string public name;
    uint public contribAmount;
    uint public creationTimestamp;
    uint private expirationDate;
    uint public millisecondsUntilExpiration;
    address payable[] public contributors;
    mapping(address => uint) public balances;
    uint public contribCount = 0; // number of contributors
    bool public paidOut  = false; // use to determine whether to show custodier on frontend

    constructor(string memory _name, uint _contribAmount, address _creator, uint _millisecondsUntilExpiration) public {
        name = _name;
        creator = _creator;
        contribAmount = _contribAmount; // the amount agreed to contribute ex. "everyone contribute .001 eth"
        creationTimestamp = block.timestamp; // block.timestamp returns seconds
        millisecondsUntilExpiration = _millisecondsUntilExpiration;
        expirationDate = creationTimestamp + (_millisecondsUntilExpiration/1000);
    }

    function contribute() public payable {
        require(!contributed(msg.sender)); // require they haven't already contributed
        require(msg.value == contribAmount);

        contribCount++;
        contributors.push(msg.sender);
        balances[msg.sender] = msg.value;  // add sender to balances (might not need)
    }

    // payout() will have to be adjusted a lot
    // will need to receive placements(array of addresses where index = rank?)
    // loop through ranked addresses and send ether based on that
    // for now it's just paying out based on order contributed
    function payOut() public {
        require(msg.sender == creator);// "payout" button is also not shown to non-creators
        
        // this hard coded loop fails if there is only one contributor.
        // leaving it because this whole method will need to be reworked anyway
        uint payout = address(this).balance / 2;
        for (uint i = 0; i < 2; i++) { // payout to first 2 for now
            contributors[i].transfer(payout);
        }

        paidOut = true;
    }

    function contributed(address _addr) public view returns(bool) {
        for (uint i = 0; i < contributors.length; i++) {
            if(contributors[i] == _addr) {
                return true; // address has already contributed
            } 
        }
        return false;
    }
    
    // used as a fallback for contributors in case the creator doesn't payout or loses wallet
    // Creator will give an amount of days to represent the length of the custodiership 
    // If time runs out, any contributor can request a timeout that refunds all contributors
    function claimTimeout() public {
        require((block.timestamp > expirationDate && contributed(msg.sender)) || msg.sender == creator);
        if(contributors.length > 0) {
            uint payout = address(this).balance / contributors.length;
            for (uint i = 0; i < contributors.length; i++) {
                contributors[i].transfer(payout);
            }
            paidOut = true;
        }
        // selfdestruct even if there are no contributors(creator ends contract early)
        selfdestruct(address(0x0)); // delete the contract
    }


    // function receiveScores(uint[] _scores) {
        //TODO: implement this function to receive randomly generated scores
        //      idea is that, to test payouts, we need scores associated with addresses
        //      that can be paid out based on score.
        //      Scores to come from front end once the time period is over
    // }

   
    
    function () external payable {} // fallback that is probably dangerous 
}