
import React, { Component } from 'react';
import DisplayCustodier from './DisplayCustodier';

class DisplayCustodiers extends Component {
  render() {
    return (
        <div>
            {this.props.custodiers.map((custodier, i) => {
                return(
                    <DisplayCustodier 
                        contribute={this.props.contribute}
                        payout={this.props.payout}
                        claimTimeout={this.props.claimTimeout}
                        web3={this.props.web3}
                        custodier={custodier}
                        account={this.props.account} 
                        loading={this.props.loading} 
                        key={i} />
                )
            })}
        </div>
        );
    }
}
      
export default DisplayCustodiers;
      