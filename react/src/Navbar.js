import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
        <nav className="navbar navbar-dark navbar-static-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-sm-3 col-md-2 mr-0 ml" href="/#" target="_blank" rel="noreferrer">Custodial</a>
            <i><a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/#" target="_blank" rel="noreferrer">You: {this.props.account}</a></i>
        </nav>
    );
  }
}

export default Navbar;