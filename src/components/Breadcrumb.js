import React, { Component } from 'react';
import moment from 'moment';

class Breadcrumb extends Component {
    render() {
    	let path = (this.props.path) ? this.props.path.split('/') : [];
    	let date = moment().format('DD MMMM YYYY');
        return (
        		<div className="flex-hr">
        			<div className="dashboard-breadcrumb clean mb-0">
        				<ul className="list-unstyled">
        				{
        					path.map((val, key) => 
		        				(key === 0) ? <li key={key}><i className="mdi mdi-home"></i>&nbsp;{val}&nbsp;</li> : <li key={key}>&nbsp;{val}&nbsp;</li>
		        			)
		        		}
        				</ul>
        			</div>
        			<div className="today-state"> <i className="mdi mdi-calendar"></i>
        				<p>&nbsp;Today, {date}</p>
        			</div>
        		</div>
        );
    }
}

export default Breadcrumb;