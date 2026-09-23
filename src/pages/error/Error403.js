import React, { Component } from 'react';
import { Result, Button } from 'antd';

class Error404 extends Component {
	componentDidMount() {
		document.title = "Page Not Found | Loyalty Management System";
	}

	render() {
		return (
			<Result
				status="403"
				title="403"
                subTitle="Sorry, you are not authorized to access this page."
				extra={<Button type="primary" onClick={e => {e.preventDefault(); this.props.history.goBack();}}>Back</Button>}
			/>
		)
	}
}

export default Error404;