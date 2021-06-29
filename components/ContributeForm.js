import react, {Component} from 'react';
import {Form, Button, Input, Message, Label} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import web3utils from 'web3-utils';
import {Router} from '../routes';

class ContributeForm extends Component {
   state = {value:'',loading:false,errorMessage:''};

   isNumeric = (n) => {
     return !isNaN(parseFloat(n)) && isFinite(n);
   };

   onInputChange = (e) => {
      if (this.isNumeric(e.target.value) || e.target.value=='')
        this.setState({value:e.target.value});
   }

   onSubmit = async (e) => {
     e.preventDefault();
     this.setState({loading:true,errorMessage:''});
     const campaign = Campaign(this.props.address);

     try {
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3utils.toWei(this.state.value,'ether')
        });
     
        Router.replaceRoute(`/campaigns/${this.props.address}`);
        
     }
     catch(err){
        this.setState({errorMessage:err.message});
     }

     this.setState({loading:false,value :''});
   }

   render(){
      return (
         <Form onSubmit={this.onSubmit}  error={!!this.state.errorMessage}>
            <label> Contribute </label> 
            <Input 
               value={this.state.value}
               onChange={event => this.onInputChange(event)}
               label="ETH"
               labelPosition="right" 
            />
            <Button primary loading={this.state.loading} disabled={this.state.loading}> Contribute </Button>
            <Message error header="Error" content={this.state.errorMessage} />
         </Form>
      )
   }
}

export default ContributeForm;
