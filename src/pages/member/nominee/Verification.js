import React from "react";
import { Result, Col, Row, Form, Skeleton, Typography, Modal } from "antd";
import { api } from "../../../config/Services";
import { BasicRequest } from "../../../utilities/RequestService";
import { Alert, Button } from "../../../components/Base/BaseComponent";
import Reaptcha from "reaptcha";
import Error404 from "../../error/Error404";

const { Title, Text } = Typography;
const { confirm } = Modal;

class ProfileUpdateOtp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			approvalstatus: null,
			fieldvalue: {
				recaptchaResponse: null,
			},
		};
	};

	componentDidMount() {
		document.title = "Verification Member Nominee | Loyalty Management System";

		const redemptionnomineecode = this.props.match.params.redemptionnomineecode;
		BasicRequest(api.url.memberredemptionnominee.public.list, { redemptionnomineecode }, "criteria").then((response) => {
			const { status, result } = response;
			const { responsecode } = status;
			if (responsecode === "0000") {
				this.setState({
					approvalstatus: result[0]?.approvalstatus || '',
					firstname: result[0]?.firstname || '',
					lastname: result[0]?.lastname || '',
					result
				});
			}
			this.setState({ isLoading: false });
		});
	}

	verifyNominee = (type) => {
		const callback = () => {
			let approvalstatus = type;
			let redemptionnomineecode = this.props.match.params.redemptionnomineecode;
			let url = api.url.memberredemptionnominee.public.updatestatus;
			const { fieldvalue } = this.state;

			BasicRequest(url, { redemptionnomineecode, approvalstatus, recaptcha: fieldvalue.recaptchaResponse }).then((response) => {
				const { status } = response;
				const { responsecode, responsemessage } = status;
				if (responsecode === '0000') {
					Alert.success(responsemessage);
					this.setState({ approvalstatus: type });
				} else {
					Alert.error(responsemessage);
				}
			});
		};
		confirm({
			title: type === 'APPROVED' ? 'Are you sure to verify this request nominee?' : 'Are you sure to reject this request nominee?',
			onOk() {
				return new Promise((resolve, reject) => {
					setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
					callback();
				}).catch(() => console.log('Oops errors!'));
			},
			onCancel() { },
		});
	};

	onVerify = recaptchaResponse => {
		this.setState({ fieldvalue: { ...this.state.fieldvalue, recaptchaResponse } });
	};

	onExpired = () => {
		this.setState({ fieldvalue: { ...this.state.fieldvalue, recaptchaResponse: null } });
		this.refs.refReCaptcha.reset()

	};

	render() {
		const { isLoading, approvalstatus, firstname, lastname, fieldvalue, result } = this.state;
		const { recaptchaResponse } = fieldvalue
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 8 } },
			wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
		};

		const mobileScreen = window.screen.width < 600;

		if ((result && result.length === 0)) {
			return <Error404 {...this.props}></Error404>
		}
		if (isLoading || approvalstatus === null) {
			return <Skeleton active={true}></Skeleton>;
		} else if (approvalstatus === 'APPROVED' || approvalstatus === 'REJECTED') {
			return (
				<Row type="flex" justify="center">
					<Col>
						<Row type="flex" justify="center" style={{ margin: mobileScreen ? '70px 0px 0px 0px' : '70px 0px' }}>
							<img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 280} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
							<img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 180} />
						</Row>
						<Result
							status={approvalstatus === "REJECTED" ? "error" : "success"}
							title={approvalstatus === "REJECTED" ? "REJECTED" : "CONGRATULATIONS!"}
							subTitle={approvalstatus === "REJECTED" ? `${firstname + " " + lastname} as nominee has been rejected` : `${firstname + " " + lastname} as nominee has been verified successfully`}
						/>
					</Col>
				</Row>
			)
		} else if (approvalstatus === 'WAITING_VERIFICATION') {
			return (
				<Row>
					<Form {...formItemLayout}>
						<Row>
							<Row type="flex" justify="center">
								<Col className="gutter-row" xs={24} style={{ textAlign: "center", marginTop: 20 }}>
									<Row type="flex" justify="center" style={{ margin: mobileScreen ? '70px 0px 0px 0px' : '70px 0px' }}>
										<img src="https://amala-pdt.garuda-indonesia.com/assets/images/logoGA.png" alt="GA Logo" width={180} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
										<img src="https://amala-pdt.garuda-indonesia.com/assets/images/logo.png" alt="Asyst Logo" width={130} />
									</Row>
									<Row>
										<img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/profile.png" alt="Member Logo" width={180} height={'100%'} style={{ marginBottom: 20 }} />
									</Row>
									<Title level={2}>Verification of Member Nominee</Title>
									<Text strong style={{ marginTop: 20 }}>
										You are about to verify {firstname + " " + lastname} as the addition of member nominee.
									</Text>
									<br></br>
									<Text strong style={{ marginTop: 30 }}>
										By verifying, I agree to add new member nominee. This action cannot be undone.
									</Text>
								</Col>
							</Row>
							<Row type="flex" justify="center" style={{ marginTop: 20 }}>

								<Col>
									<Reaptcha ref="refReCaptcha" sitekey="6Lc_XwUgAAAAAOzg3JZbh1ZLbNc_Zk2MJLB9TM3W" onVerify={this.onVerify} onExpire={this.onExpired} />
								</Col>
							</Row>
							<Row type="flex" justify="center" style={{ margin: 15 }}>
								<Button
									htmlType="button"
									type="primary"
									label="Verify"
									onClick={() => this.verifyNominee("APPROVED")}
									disabled={!recaptchaResponse}
								/>
								<Button
									htmlType="button"
									type="danger"
									label="Reject"
									onClick={() => this.verifyNominee("REJECTED")}
									disabled={!recaptchaResponse}
								/>
							</Row>
						</Row>
					</Form>
				</Row>
			);
		}
	}
}

export default ProfileUpdateOtp;