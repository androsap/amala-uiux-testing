import React, { Component } from 'react';

class Searchbar extends Component {
    render() {
        return (
        	<div className="top-filter mt-2 mb-3">
        		<div className="row justify-content-md-center">
        			<div className="col-md-auto">
        				<form className="container-fluid form-filter inline">
        					<div className="row">
        						<div className="col-md-8">
        							<input type="text" ref="searchdata" className="form-control" placeholder="Search Data" title="Search Data" maxLength="50" />
        						</div>
        						<div className="col-md-4">
        							<button type="submit" title="Search" className="btn btn-outline-dark normal" {...this.props}><i className="mdi mdi-magnify"></i> Search</button>
        						</div>
        					</div>
        				</form>
        			</div>
        		</div>
        	</div>
        );
    }
}

export default Searchbar;