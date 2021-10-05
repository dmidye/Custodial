import React, { Component } from 'react';
//import DisplayCustodier from './DisplayCustodier';

class SearchCustodier extends Component {
    
    render() {
        return (
            <div>
                <form onSubmit={this.props.handleSearchCustodierSubmit}>
                    <div className="input-group">
                        <input 
                        ref={(input) => {
                            this.addressToFind = input 
                        }} 
                        onChange={this.props.handleSearchChange} 
                        id="addressToFind" 
                        className="form-control" 
                        type="text" 
                        placeholder="Search Custodier Address"/>
                        <button type="submit" className="btn btn-dark">Search</button>
                    </div>
                </form>
                {/* { this.displaySearchedCustodier } */}
           </div>
        )
    }
}
      
export default SearchCustodier;