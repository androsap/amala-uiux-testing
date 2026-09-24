import React, { Component } from 'react';
import { Result, Button, Row, Col, Typography } from 'antd';

const { Title, Text } = Typography;
class Error404 extends Component {
	componentDidMount() {
		document.title = "Page Not Found | Loyalty Management System";
	}

	render() {
		const { type } = this.props;
		const pathname = this.props.location?.pathname || '';
		const hideBackButton = pathname.includes('/nominee/confirmation') || pathname.includes('/otp/verification');

		if (type === 'member') {
			return (
				<>
					<Row type="flex" justify="center" align="middle" style={{ minHeight: "80vh", padding: "24px 16px", textAlign: "center" }}>
						<Col xs={24} sm={20} md={16} lg={12} xl={10}>
							<Row type="flex" justify="center" style={{ height: "100%" }}>
								<img src="https://amala-pdt.garuda-indonesia.com/assets/images/member-404-notfound.webp" alt="member-404" style={{ width: "100%", maxWidth: 320 }} />
							</Row>
							<Title style={{ color: "#202D5C", fontSize: "clamp(64px, 18vw, 120px)", fontWeight: 700, lineHeight: 1, margin: "0 0 16px 0" }}>404</Title>
							<Title level={2} style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(22px, 6vw, 36px)", margin: "8px 0 0" }}>Page Not Found</Title>
							<Text type="secondary" style={{ display: "block", maxWidth: 420, margin: "12px auto 0", fontSize: "clamp(13px, 3.5vw, 15px)", padding: "0 8px" }}>We're sorry, the page you request could not be found.</Text>
						</Col>
					</Row>

					<Row type="flex" justify="center" style={{ padding: "0 16px" }}>
						<Col xs={24} sm={22} md={20} lg={18} xl={16}>
							<Row type="flex" justify="center" style={{ marginTop: 20 }}>
								<div style={{ height: 1, width: 240, background: "rgba(32, 45, 92, 0.3)" }} />
							</Row>

							<Row type="flex" justify="center" align="middle" style={{ marginTop: 24, marginBottom: 32 }}>
								<Text style={{ color: "#6B7280", fontSize: "clamp(8px, 3.5vw, 10px)", fontWeight: 600, marginLeft: 6 }}>Copyright © {new Date().getFullYear()}. Powered by</Text>
								<img src="https://amala.garuda-indonesia.com/assets/images/logo.png" alt="PT. Aero System Indonesia" style={{ height: 16, width: "auto" }} />
							</Row>
						</Col>
					</Row>
				</>
			);
		} else return (
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button type="primary" onClick={e => { e.preventDefault(); this.props.history.goBack(); }} className={hideBackButton ? "hidden" : ""}>Back</Button>}
			/>
		)
	}
}

export default Error404;