
import React, { Component } from 'react';
import PayoutBtn from './Buttons/PayoutBtn';
import ContributeBtn from './Buttons/ContributeBtn';
import ClaimTimeoutBtn from './Buttons/ClaimTimeoutBtn';
// import Countdown, {calcTimeDelta} from 'react-countdown';




class DisplayCustodier extends Component {

  formatHours(custodier) {
    var time = custodier.hoursUntilExpiration
    if(time > 0) {
        var hours = Math.floor(time)
        var minutes = Math.floor((time-hours)*60)
        var seconds = ((((time-hours)*60)-minutes)*60).toFixed(0)

        return hours + " hours " + minutes + " minutes " + seconds + " seconds (approximate)"
    } else {
        custodier.expired = true
        return "Time's up! Contributors can now request a refund by clicking the Claim Timout button."
    }
  }

  displayCustodier() {
    var custodier = this.props.custodier
    if(!custodier.paidOut) {
        if(custodier.creator === this.props.account) {
            return (
                <div className="row mt-2">
                <div className="col-sm mt-1">
                    <strong>{custodier.name}</strong> ---- <i>{custodier.address}</i>
                </div>
                
                <div className="btn-toolbar col-sm mb-2">
                    <ContributeBtn loading={this.props.loading} 
                                contribute={this.props.contribute} 
                                custodier={custodier}
                                contribAmount={this.props.web3.utils.fromWei(custodier.contribAmount)}/>

                    <PayoutBtn loading={this.props.loading} 
                            payout={this.props.payout} 
                            custodier={custodier}/>

                    <ClaimTimeoutBtn loading={this.props.loading} 
                                    custodier={custodier}
                                    claimTimeout={this.props.claimTimeout}
                                    />
                </div>

                <label><strong>&nbsp;&nbsp;Balance:</strong> {this.props.web3.utils.fromWei(custodier.balance)} ether</label>
                <label><strong>Time left:</strong> {this.formatHours(custodier)}</label>
                
                <hr></hr>
                </div>
            )
        } else {
            return (
                
                <div className="row mt-2">
                <div className="col-sm mt-1">
                    <strong>{custodier.name}</strong> ---- <i>{custodier.address}</i>
                </div>
                
                <div className="btn-toolbar col-sm mb-2">
                <ContributeBtn loading={this.props.loading} 
                               contribute={this.props.contribute} 
                               custodier={custodier}
                               contribAmount={this.props.web3.utils.fromWei(custodier.contribAmount)}/>

                <ClaimTimeoutBtn loading={this.props.loading} 
                                 custodier={custodier}
                                 claimTimeout={this.props.claimTimeout}
                                 />
                 </div>    
                <label><strong>&nbsp;&nbsp;Balance:</strong> {this.props.web3.utils.fromWei(custodier.balance)} ether</label>
                <label><strong>Time left:</strong> {this.formatHours(custodier)}</label>

                              
                <hr></hr>
                </div>
            ) 
        }
    } else {
        return ""
    } 
  }

  render() {
        return (
            this.displayCustodier()
        )
    }
}
      
export default DisplayCustodier;
      