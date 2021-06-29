import React, {Component} from 'react';
import Layout from '../../../components/Layout'; 
import {Link, Router} from '../../../routes';
import {Input, Form, Button, Message} from 'semantic-ui-react';
import web3 from '../../../ethereum/web3';
import Campaign from '../../../ethereum/campaign';
import web3util from 'web3-utils';

class RequestNew extends Component {
  state = {value:'',description:'',recipient:''}

  static async getInitialProps(props){
    const {address} = props.query;
    return {address};
  }

  onSubmit = async (e) => {
     e.preventDefault();
     const campaign = Campaign(this.props.address);
     const { description, value, recipient} = this.state;
     
     try{
       const accounts = await web3.eth.getAccounts();
       await campaign.methods.createRequest(description, web3util.toWei(value,'ether'),recipient).send({
         from:accounts[0]
       });
     }
     catch{
     }
  }

  render(){
    return (
      <Layout>
         <Form onSubmit={this.onSubmit}>
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
            <Button primary> Create </Button>
         </Form>
      </Layout>
    )
  }
}

export default RequestNew;
