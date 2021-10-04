import React, { Component } from 'react';

class CreateCustodier extends Component {

  render() {
    return (
        <div className="form-group mt-3">
        <form onSubmit={this.props.handleSubmit}>
          <input 
              id="name"
              ref={(input) => {
                this.name = input
              }}
              type="text"
              className="form-control"
              placeholder="Name of Org"
              defaultValue=""
              onChange={this.props.handleNameChange}
              required />
            <div className="d-flex justify-content-between">
              <input
                id="contribAmount"
                ref={(input) => {
                  this.contribAmount = input
                }}
                type="number"
                step="0.000001"
                className="form-control mt-2"
                placeholder="Contribution Amount"
                defaultValue=""
                onChange={this.props.handleContribAmountChange}
                required />
                <label className="mt-3">&nbsp;&nbsp;Ether</label>
              </div>
              <input
                id="daysUntilExpiration"
                ref={(input) => {
                  this.daysUntilExpiration = input
                }}
                type="number"
                step=".001"
                className="form-control mt-2"
                placeholder="Days Until Expiration"
                defaultValue=""
                onChange={this.props.handleDaysChange}
                required />
            
            <button 
                type="submit" 
                className="btn btn-primary mt-2" 
                disabled={this.props.loading}>Create Custodier
            </button>
          </form>
          </div>
    );
  }
}

export default CreateCustodier;
