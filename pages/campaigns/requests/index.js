import React, {Component} from 'react';
import Layout from '../../../components/Layout'; 
import {Link} from '../../../routes';
import {Button, Table} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

  static async getInitialProps(props){
    const {address} = props.query;
    const campaign = Campaign(address);
    const reqCount = await campaign.methods.getRequestsCount().call(); 
    const approverCount = await campaign.methods.approverCount().call();
    
    const requests = await Promise.all(
       Array(parseInt(reqCount)).fill().map((element,index)=>{
          return campaign.methods.requests(index).call();
       })
    );
    return {address, requests, reqCount, approverCount};
  }

  renderRows() {
    return this.props.requests.map((request,index)=>{
       return <RequestRow
          request={request}
          key={index}
          id={index}
          address={this.props.address}
          approverCount={this.props.approverCount}
       />
    });
  }

  render(){

    const {Header, Row, HeaderCell, Body} = Table;
    return(
       <Layout>
          <h3> Requests </h3>
          <Link route={`/campaigns/${this.props.address}/requests/new`}>
             <a> <Button style={{marginBottom:'10px'}} primary floated="right"> Add Request </Button> </a>
          </Link>
          <Table>
             <Header>
               <Row>
                  <HeaderCell> ID </HeaderCell>
                  <HeaderCell> Description </HeaderCell>
                  <HeaderCell> Amount (ETH) </HeaderCell>
                  <HeaderCell> Recipient </HeaderCell>
                  <HeaderCell> Approval Count </HeaderCell>
                  <HeaderCell> Approved </HeaderCell>
                  <HeaderCell> Finalized </HeaderCell>
               </Row>
             </Header>
             <Body>
               {this.renderRows()}
             </Body>
          </Table>
          <div> Found {this.props.reqCount} requests </div>
       </Layout>
    )

  }
}

export default RequestIndex;
