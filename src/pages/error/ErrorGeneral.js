import React, { Component } from 'react';
import { Result, Button } from 'antd';

class ErrorGeneral extends Component {
	componentDidMount() {
		document.title = "Something Went Wrong | Loyalty Management System";
	}

	render() {
		let result = (this.props.custom) ? {
			status: "warning",
			subTitle: (<span>
				<strong style={{ fontSize: 16, color:"black" }}>
					Something Went Wrong
				</strong>
				<p style={{ fontSize: 25,  color:"black"}}>{this.props.message}</p>
				
			</span>
			),
			type: (this.props.type),
			extra: (this.props.type && this.props.type === 'modal') ? null : <Button type="primary" key="console" onClick={e => { e.preventDefault(); this.props.history.goBack(); }}>Back</Button>
		} : {
			status: "warning",
			title: "Something Went Wrong",
			subTitle: (this.props.message),
			type: (this.props.type),
			extra: (this.props.type && this.props.type === 'modal') ? null : <Button type="primary" key="console" onClick={e => { e.preventDefault(); this.props.history.goBack(); }}>Back</Button>
		};

		return (<Result {...result} />)
	}
}

export default ErrorGeneral;