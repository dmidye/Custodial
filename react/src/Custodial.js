import React, { Component } from 'react'

class Custodial extends Component {

  render() {
    return (
        <div id="content">
        <form onSubmit={(event) => {
          event.preventDefault()
          //this.props.createTask(this.task.value)
        }}>
          
        </form>
      </div>
    );
  }
}

export default Custodial;