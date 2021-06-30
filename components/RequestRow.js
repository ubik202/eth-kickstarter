import React, {Component} from 'react';
import {Button, Table, Icon} from 'semantic-ui-react';
import web3utils from 'web3-utils';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

class RequestRow extends Component{
  
   onApprove = async () => {
     const campaign = Campaign(this.props.address);
     const accounts = await web3.eth.getAccounts(); 
     await campaign.methods.approveRequest(this.props.id).send({
        from:accounts[0]
     });
     Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
   }

   onFinalize = async () => {
     const campaign = Campaign(this.props.address);
     const accounts = await web3.eth.getAccounts(); 
     await campaign.methods.finalizeRequest(this.props.id).send({
        from:accounts[0]
     });
     Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
   }


render(){
   
   const {Cell,Row} = Table;
   const {approverCount, id, request} = this.props;
   const readyToFinalize = request.approvalCount > approverCount/2;

   return(
      <Row disabled={request.completed} positive={readyToFinalize && !request.completed}>
         <Cell>{id}</Cell>
         <Cell>{request.description}</Cell>
         <Cell>{web3utils.fromWei(request.value,'ether')}</Cell>
         <Cell>{request.recipient}</Cell>
         <Cell>{request.approvalCount}/{approverCount}</Cell>
         <Cell>
             {request.completed ? <Icon name="checkmark"/> : (
                 <Button color='green' basic onClick={this.onApprove}> Approve </Button> 
              )}
         </Cell>
         <Cell>
             {request.completed ? <Icon name="checkmark" /> : (
                 <Button color='teal' basic onClick={this.onFinalize}> Finalize </Button> )}
         </Cell>
      </Row>
   )
}
}

export default RequestRow;
