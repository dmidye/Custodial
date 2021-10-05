
import React, { Component } from 'react';

class PayoutBtn extends Component {
  
  disabled(loading, expired) {
    if(expired || loading) {
      return true
    } else {
      return false
    }
  }

  render() {
    return (
        <button disabled={this.disabled(this.props.loading, this.props.custodier.expired)}
                type="button"
                onClick={() => this.props.payout(this.props.custodier)} 
                className="btn btn-danger btn-space">Payout
        </button>
        );
    }
}
      
export default PayoutBtn;
      