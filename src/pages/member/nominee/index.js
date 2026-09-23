import React from "react";
import { Col, Row, Form, Typography, Modal } from "antd";
import { api } from "../../../config/Services";
import { BasicRequest } from "../../../utilities/RequestService";
import { Alert } from "../../../components/Base/BaseComponent";
import Error404 from '../../error/Error404';

const { Title, Text } = Typography;
const { confirm } = Modal;

class ProfileUpdateOtp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			approvalstatus: null,
			responsecode: "0000",
			fieldvalue: {
				recaptchaResponse: null,
			},
		};
	};

	componentDidMount() {
		document.title = "Verification Member Nominee | Loyalty Management System";
		this.verifyNominee()
	}

	verifyNominee = () => {
		const token = this.props.location.pathname.split("/")[3];
		const type = this.props.location.pathname.split("/")[5];

		confirm({
			title:
				type === "1"
					? "Are you sure to verify this request nominee?"
					: "Are you sure to reject this request nominee?",
			onOk: async () => {
				const url = api.url.member.verifyemail;
				const response = await BasicRequest(url, {
					token,
					action: type === "1" ? "approve" : "reject",
				});
				const { responsecode, responsemessage } = response.status;
				if (responsecode === "0000") {
					Alert.success(responsemessage);
					this.setState({ responsecode })
				} else {
					Alert.error(responsemessage);
					this.setState({ responsecode })
				}
			},
			onCancel: () => {
				this.props.history.goBack();
			},
		});
	};

	render() {
		const { responsecode, isLoading } = this.state;
		const type = this.props.location.pathname.split("/")[5];
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 8 } },
			wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
		};

		const mobileScreen = window.screen.width < 600;
		if (responsecode !== '0000') {
			return <Error404 {...this.props} type={'member'} />
		} else {
			return (
				<Row>
					<Form {...formItemLayout}>
						<Row>
							<Row type="flex" justify="center">
								<Col className="gutter-row" xs={24} style={{ textAlign: "center", marginTop: 250 }}>
									<Row type="flex" justify="center" style={{ margin: mobileScreen ? '30px 0px 0px 0px' : '30px 0px' }}>
										<img src="https://amala-pdt.garuda-indonesia.com/assets/images/logoGA.png" alt="GA Logo" width={180} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
										<img src="https://amala-pdt.garuda-indonesia.com/assets/images/logo.png" alt="Asyst Logo" width={130} />
									</Row>
									<Row>
										<img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/profile.png" alt="Member Logo" width={180} height={'100%'} style={{ marginBottom: 20 }} />
									</Row>
									<Title level={2}>Verification of Member Nominee</Title>
									<Text strong style={{ marginTop: 20 }}>
										You are about to {type === "1" ? "verify" : "reject"} member nominee.
									</Text>
									<br></br>
									<Text strong style={{ marginTop: 30 }}>
										By verifying, I agree to add new member nominee. This action cannot be undone.
									</Text>
								</Col>
							</Row>
							<Row type="flex" justify="center" style={{ marginTop: 20 }}>
							</Row>
						</Row>
					</Form>
				</Row >
			);
		}
	}
}

export default ProfileUpdateOtp;