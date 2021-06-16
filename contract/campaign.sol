pragma solidity ^0.4.17;

//Factory which deploys any number of Campaigns
contract CompaignFactory{
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContr) public {
        address newCampaign = new Campaign(minimumContr,msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

//Ethereum-based Kickstarter clone where contributors vote to approve expenditures by a campaign manager
contract Campaign {

    //struct which represents a request made by the manager to spend money from the contract
    struct Request {
        string description;
        uint value;
        address recipient;
        bool completed;
        uint approvalCount;
        mapping(address=>bool) approvals;
    }
    
    //address of the person managing the campaign
    address public manager;
  
    //minimum amount a person should contribute to become a 'contributor'
    uint public minimumContribution;
   
    //list of contributors with approval power
    mapping (address => bool) public approvers;
    
    //total number of approvers
    uint public approverCount;
    
    //list of request made by the manager
    Request[] public requests;

    //make sure the person sending the tx is the manager
    modifier restricted() {
        require(manager == msg.sender);
        _;
    }
    
    //constructor
    function Campaign(uint minimumContr,address creator) public {
        manager = creator;
        minimumContribution = minimumContr;
    }
  
    //become a contributor by sending an amount over the minimumContribution
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approverCount++;
    }  
    
    //manager can create a request to spend money
    function createRequest(string description, uint value, address recipient) public restricted {
        
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            completed: false,
            approvalCount : 0
        });
        
        requests.push(newRequest);
    }  
    
    //a contributor can approve a request for payment by the campaign manager
    function approveRequest(uint reqIndex) public {
        Request storage request = requests[reqIndex];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    //after a sufficient number of contributors approve a request, the campaign manager can finalize the request
    function finalizeRequest(uint reqIndex) public restricted {
        Request storage request = requests[reqIndex];
        require(!request.completed);
        require(request.approvalCount > (approverCount/2));
        request.completed = true;
        request.recipient.transfer(request.value);
    }
    
}
