import React, { Component } from 'react';

class ContributeBtn extends Component {

  disabled(loading, contributed) {
    if(contributed || loading) {
      return true
    } else {
      return false
    }
  }
  render() {
    return (
        <button disabled={this.disabled(this.props.loading, this.props.custodier.contributed)} 
                type="button"
                onClick={() => this.props.contribute(this.props.custodier)} 
                className="btn btn-success btn-space">Contribute {this.props.contribAmount} ether
        </button>
        );
    }
}
      
export default ContributeBtn;
      