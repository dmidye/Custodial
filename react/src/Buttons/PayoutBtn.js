
import React, { Component } from 'react';

class PayoutBtn extends Component {
  render() {
    return (
        <button disabled={this.props.loading} 
                type="button"
                onClick={() => this.props.payout(this.props.custodier)} 
                className="btn btn-danger btn-space">Payout
        </button>
        );
    }
}
      
export default PayoutBtn;
      