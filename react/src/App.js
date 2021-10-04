import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import { CUSTODIER_ABI, CUSTODIER_FACTORY_ADDRESS, CUSTODIER_FACTORY_ABI } from './config.js'
import Navbar from './Navbar'
import CreateCustodier from './CreateCustodier'
import DisplayCustodiers from './DisplayCustodiers'
import Spinner from 'react-bootstrap/Spinner'

class App extends Component {
  componentDidMount() {
    this.loadBlockchainData()
    this.setState({ loading: false })
  }

  constructor(props) {
    super(props)
    this.state = { 
      accounts: [],
      account: '',
      custodierCount: 0,
      custodiers: [],
      creator: false,
      loading: false
    }

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleContribAmountChange = this.handleContribAmountChange.bind(this)
    this.handleDaysChange = this.handleDaysChange.bind(this)
    this.contribute = this.contribute.bind(this)
    this.payout = this.payout.bind(this)
    this.claimTimeout = this.claimTimeout.bind(this)
  }

  async loadBlockchainData() {
    // TODO: Automatically detect user account change https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
    if(window.ethereum) {
      //check if MetaMask exists
      const web3 = new Web3(window.ethereum)
    
      //assign to values to variables: web3, netId, accounts
      //const netId = await web3.eth.net.getId() // each network (rinkeby, mainnet, kovan, etc) has their own netId
      const accounts = await web3.eth.getAccounts()
      
      //check if account is detected, then load balance&setStates, elsepush alert
      if(typeof accounts[0] !== 'undefined') {
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({ accounts: accounts, account: accounts[0], balance: balance, web3: web3 })     
      } else {
        //window.alert('Please login with MetaMask')
          if (window.ethereum) {
            const accounts = await window.ethereum.send('eth_requestAccounts');
            this.setState({ accounts: accounts, account: accounts[0]})
          }
      }

      //in try block load contracts
      try {
        const custodierFactory = new web3.eth.Contract(CUSTODIER_FACTORY_ABI, CUSTODIER_FACTORY_ADDRESS)
        this.setState({ custodierFactory })
        const custodierCount = await custodierFactory.methods.custodierCount().call()
        this.setState({ custodierCount })
                
        for (var i = 1; i <= custodierCount; i++) {
          const address = await custodierFactory.methods.custodiers(i).call({gas: 4000000})
          try {
            const contract = new this.state.web3.eth.Contract(CUSTODIER_ABI, address)
            const name = await contract.methods.name().call()
            const contribAmount = await contract.methods.contribAmount().call()
            const creator = await contract.methods.creator().call()
            const balance = await web3.eth.getBalance(address)
            const paidOut = await contract.methods.paidOut().call()
            const millisecondsUntilExpiration = await contract.methods.millisecondsUntilExpiration().call()
            const daysUntilExpiration = millisecondsUntilExpiration/1000/60/60/24
            const creationTimestamp = await contract.methods.creationTimestamp().call()
            const contributed = await contract.methods.contributed(this.state.account).call()

            var blockNumber = await web3.eth.getBlockNumber();
            var block = await web3.eth.getBlock(blockNumber)
            var timestamp = block.timestamp
            var secondsSinceCreation = timestamp - creationTimestamp
            var secondsUntilExpiration = (daysUntilExpiration*86400) - secondsSinceCreation
            var hoursUntilExpiration = secondsUntilExpiration / 60 / 60     

            const custodier = {
                address: address, 
                name: name, 
                contribAmount: contribAmount, 
                hoursUntilExpiration: hoursUntilExpiration, 
                creator: creator, 
                balance: balance, 
                paidOut: paidOut,
                expired: false,
                contributed: contributed
            }
            this.setState({
              custodiers: [...this.state.custodiers, custodier]
            })
          } catch (e) {
              console.log("Could not fetch contract. The custodier,", address + ", has likely been completed and is no longer accessible")
          }
        }
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to current network...')
      }
    //if MetaMask not exists push alert
    } else {
      window.alert('Please install MetaMask')
    }
  }

  createCustodier(name, contribAmount, millisecondsUntilExpiration) {
    this.setState({ loading: true })

    this.state.custodierFactory.methods.createCustodier(name, contribAmount, millisecondsUntilExpiration).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        window.location.reload();
      }).on('error', (error) => {
        console.log("Transaction error. Possible user rejection.")
        this.setState({ loading: false })
      })
  }


  contribute(custodier) {
    this.setState({ loading: true })
    const contract = new this.state.web3.eth.Contract(CUSTODIER_ABI, custodier.address)

    contract.methods.contribute().send({ from: this.state.account, value: custodier.contribAmount, gas: 4000000 })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        custodier.balance += custodier.contribAmount
        window.location.reload();
      }).on('error', (error) => {
        console.log("Transaction error. Possible user rejection.")
        this.setState({ loading: false })
      })
  }

  payout(custodier) {
    this.setState({ loading: true })
    const contract = new this.state.web3.eth.Contract(CUSTODIER_ABI, custodier.address)
    
    contract.methods.payOut().send({ from: this.state.account, gas: 4000000 })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        custodier.balance = 0
        window.location.reload();
      }).on('error', (error) => {
        console.log("Transaction error. Possible user rejection.")
        this.setState({ loading: false })
      })
  }

  claimTimeout(custodier) {
    this.setState({ loading: true })
    const contract = new this.state.web3.eth.Contract(CUSTODIER_ABI, custodier.address)

    contract.methods.claimTimeout().send({ from: this.state.account, gas: 4000000 })
      .once('receipt', (receipt) => {
        var temp = this.state.custodierCount - 1
        this.setState({ loading: false, custodierCount: temp })
        window.location.reload();
      }).on('error', (error) => {
        console.log("Transaction error. Possible user rejection.")
        console.log(error)
        this.setState({ loading: false })
      })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const name = event.target.name.value
    const contribAmount = this.state.web3.utils.toWei(event.target.contribAmount.value, "ether")
    const daysUntilExpiration = event.target.daysUntilExpiration.value
    const millisecondsUntilExpiration = (daysUntilExpiration*24*60*60*1000).toFixed(0)

    this.createCustodier(name, contribAmount, millisecondsUntilExpiration)
  }

  handleNameChange(event) {
    this.setState({name: event.target.name});
  }

  handleContribAmountChange(event) {
    this.setState({contribAmount: event.target.contribAmount});
  }

  handleDaysChange(event) {
    this.setState({daysUntilExpiration: event.target.daysUntilExpiration});
  }

  displaySpinnerWhenLoading() {
    if(this.state.loading) {
      return (
        <div>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <label>&nbsp;Doing something...</label></div>
      )
    }
  }

  render() {
    return (
      <div>
      <Navbar account={this.state.account}/>
      <div className="container-fluid">
         <CreateCustodier 
            handleSubmit={this.handleSubmit} 
            handleNameChange={this.handleNameChange}
            handleContribAmountChange={this.handleContribAmountChange} 
            handleDaysChange={this.handleDaysChange}
            loading={this.state.loading} />

            {this.displaySpinnerWhenLoading()}

            <hr/>
            <br></br>
            <strong>TOTAL CUSTODIERS CREATED: {this.state.custodierCount}</strong>
            <br></br>
            <br></br>
            <strong><u>CUSTODIER CONTRACTS OPEN:</u></strong>

          <DisplayCustodiers 
              contribute={this.contribute}
              payout={this.payout}
              claimTimeout={this.claimTimeout}
              web3={this.state.web3}
              custodiers={this.state.custodiers}
              account={this.state.account} 
              loading={this.state.loading} />
      </div>
    </div>
    );
  }
}

export default App;