import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import {Button, Card, Grid} from 'semantic-ui-react';
import web3utils from 'web3-utils';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes';

class CampaignShow extends Component {
   static async getInitialProps(props){
      const campaign = Campaign(props.query.address);
      const summary = await campaign.methods.getSummary().call();
      console.log(summary);
       
      return {
        minimumContribution:summary['0'], 
        balance:summary['1'],
        reqCount:summary['2'],
        approversCount:summary['3'],
        manager:summary['4'],
        address:props.query.address
      };
   }

   renderCards = () => {
      const {minimumContribution, balance, reqCount, approversCount, manager} = this.props;
      const items = [
         {
           header:manager,
           meta:'Address of Manager',
           description:'The manager created this campaign and can request to withdraw money',
           style: {overflowWrap: 'break-word'},
         },
         {
           header:web3utils.fromWei(balance,'ether'),
           meta:'Balance (ETH)',
           description:'The total balance contributed to the campaign',
           style: {overflowWrap: 'break-word'},
         },

         {
           header:minimumContribution,
           meta:'Minimum Contribution',
           description:'The minimum amount required to become a contributor to the project',
           style: {overflowWrap: 'break-word'},
         },
         {
           header:approversCount,
           meta:'Approvers Count',
           description:'Number of approvers currently on the campaign',
           style: {overflowWrap: 'break-word'},
         },
         {
           header:reqCount,
           meta:'Request Count',
           description:'Number of Requests on this project',
           style: {overflowWrap: 'break-word'},
         },



      ]
      return <Card.Group items={items}/> 
   }

   render(){
      return (
        <Layout>
           <h3> Campaign </h3>
           <Grid>
              <Grid.Row>
                 <Grid.Column width={10}>
                    {this.renderCards()}
                </Grid.Column>
                 <Grid.Column width={6}>
                    <ContributeForm address={this.props.address}/>
                 </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                 <Grid.Column>
                    <Link route={`/campaigns/${this.props.address}/requests`}>
                       <a> <Button primary> View Requests </Button> </a>
                    </Link>
                 </Grid.Column>
 
              </Grid.Row>
           </Grid>
        </Layout>
      )
   }
}

export default CampaignShow;
