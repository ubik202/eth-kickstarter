pragma solidity ^0.4.17;

//Ethereum-based Kickstarter clone where contributors vote to approve expenditures by a campaign manager
contract Campaign {

    //struct which represents a request made by the manager to spend money from the contract
    struct Request {
        string description;
        uint value;
        address recipient;
        bool completed;
    }
    
    //address of the person managing the campaign
    address public manager;
  
    //minimum amount a person should contribute to become a 'contributor'
    uint public minimumContribution;
   
    //list of contributors with approval power
    address[] public approvers;
    
    //list of request made by the manager
    Request[] public requests;

    //make sure the person sending the tx is the manager
    modifier restricted() {
        require(manager == msg.sender);
        _;
    }
    
    //constructor
    function Campaign(uint minimumContr) public {
        manager = msg.sender;
        minimumContribution = minimumContr;
    }
  
    //become a contributor by sending an amount over the minimumContribution
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers.push(msg.sender);
    }  
    
    //become a contributor by sending an amount over the minimumContribution
    function createRequest(string description, uint value, address recipient) public restricted {
        
        Request newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            completed: false
        });
        
        request.push(newRequest);
    }  
}
