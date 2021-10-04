import React, { Component } from 'react';

class ClaimTimeoutBtn extends Component {
  // renderTimeoutBtn(expired) {
  //   if(expired) {
  //     return (
  //       <button disabled={this.props.loading} 
  //               type="button"
  //               onClick={() => this.props.claimTimeout(this.props.custodier)} 
  //               className="btn btn-warning btn-space">Claim Timeout
  //       </button>
  //     );
  //   } else {
  //       return null
  //   }
  // }

  render() {
    if(this.props.custodier.expired) {
      return (
        <button disabled={this.props.loading} 
                type="button"
                onClick={() => this.props.claimTimeout(this.props.custodier)} 
                className="btn btn-warning btn-space">Claim Timeout
        </button>
      );
    } else {
      return null
    }
  }
}
      
export default ClaimTimeoutBtn;