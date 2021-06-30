import React, {Component} from 'react';
import Layout from '../../../components/Layout'; 
import {Link, Router} from '../../../routes';
import {Input, Form, Button, Message} from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import Campaign from '../../../ethereum/campaign';
import web3util from 'web3-utils';

class RequestNew extends Component {
  state = {value:'',description:'',recipient:'',loading:false,errorMessage:''}

  static async getInitialProps(props){
    const {address} = props.query;
    return {address};
  }

  onSubmit = async (e) => {
     e.preventDefault();
     this.setState({errorMessage:'',loading:true})
     const campaign = Campaign(this.props.address);
     const { description, value, recipient} = this.state;
     
     try{
       const accounts = await web3.eth.getAccounts();
       await campaign.methods.createRequest(description, web3util.toWei(value,'ether'),recipient).send({
         from:accounts[0]
       });
       Router.pushRoute(`/campaigns/${this.props.address}/requests`);
     }
     catch(err){
      this.setState({errorMessage:err.message})    
     }

     this.setState({loading:false})
  }

  render(){
    return (
      <Layout>
         <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Link route={`/campaigns/${this.props.address}/requests`}>
              <a>  Back  </a>
            </Link>
            <h3> Create a Request </h3>
            <Form.Field>
               <label> Description </label>
               <Input
                  value={this.state.description}
                  onChange={e=>this.setState({description:e.target.value})} 
               />
            </Form.Field>
            <Form.Field>
               <label> Value (ETH) </label>
               <Input
                  value={this.state.value}
                  onChange={e=>this.setState({value:e.target.value})}
               />
            </Form.Field>
            <Form.Field>
               <label> Recipient </label>
               <Input 
                  value={this.state.recipient}
                  onChange={e=>this.setState({recipient:e.target.value})}
               />
            </Form.Field>
            <Message error header="Error" content={this.state.errorMessage} />
            <Button primary loading={this.state.loading} disabled={this.state.loading}> Create </Button>
         </Form>
      </Layout>
    )
  }
}

export default RequestNew;
