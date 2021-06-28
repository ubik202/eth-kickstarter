import React, {Component} from 'react';
import Layout from '../../components/Layout';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import {Router} from '../../routes';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
  state = {
    minimumContribution:'',
    errorMessage:null,
    loading: false
  };

  isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  onInputChange = (e) => {
    if (this.isNumeric(e.target.value) || e.target.value=='')
      this.setState({minimumContribution:e.target.value});
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading:true,errorMessage:false});
    try{
       const accounts = await web3.eth.getAccounts();
       await factory.methods
         .createCampaign(this.state.minimumContribution)
         .send({
            from:accounts[0]                
         });
         Router.pushRoute('/');
       }
    catch(err){
      this.setState({errorMessage:err.message})    
    }

    this.setState({loading:false});
  }

  render() {
    return (
    <Layout>
      <h3>Create a New Campaign</h3>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field> 
          <Input 
            label='Wei' 
            labelPosition='right'
            value={this.state.minimumContribution}
            onChange={e=>this.onInputChange(e)}
          />
        </Form.Field>
        <Message error header="Error" content={this.state.errorMessage} />
           
        <Button primary loading={this.state.loading} disabled={this.state.loading}> Create </Button>
      </Form>
    </Layout>
  )}

}

export default CampaignNew;
