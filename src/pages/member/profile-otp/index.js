import React from "react";
import { Result, Col, Row, Form, Skeleton, Typography, Statistic, Icon } from "antd";
import { api } from "../../../config/Services";
import { EmailChecklist } from "../../../components/IconSVG/index";
import { BasicRequest } from "../../../utilities/RequestService";
import { setIdToken, setTimeToken, setProfile, setAPIToken } from "../../../utilities/AuthService";
import { Alert, Button, MemberOTPSkeleton } from "../../../components/Base/BaseComponent";
import { jwtDecode } from "jwt-decode";

import Error404 from '../../../pages/error/Error404';
import OtpInput from "react-otp-input";
import moment from "moment";
import momentzone from "moment-timezone";

const { Title, Text } = Typography;
const { Countdown } = Statistic;

class ProfileUpdateOtp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			otprender: true,
			verified: false,
			fieldvalue: {
				generatedtime: 0,
				expiredtime: 0,
			},
		};
	};

	componentDidMount() {
		const browser = navigator.userAgent;

		this.setState({ browser, isLoading: true });
		document.title = "Verification OTP | Loyalty Management System";

		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				})
			},
			(error) => {
				console.error('Error getting location:', error);
			}
		);

		fetch('https://api.ipify.org?format=json')
			.then(response => response.json())
			.then(data => {
				this.setState({ ip: data.ip })
			})
			.catch(error => {
				console.error('Error fetching IP:', error);
			});

		this.getOTPSession();
	};

	getOTPSession = () => {
		this.setState({ isLoading: true });
		const otpkey = this.props.match.params.otpkey;

		BasicRequest(api.url.memberotp.public.secondstimelimit, { otpkey }).then((response) => {
			const { status, result } = response || {};
			const { generatedtime, expiredtime, memberid, secondstimelimit, transactiontype } = result || {};

			if (status.responsecode === "0000") {
				if (result && secondstimelimit > 0) {
					const timeExpiredServer = moment(expiredtime).format('YYYY/MM/DD HH:mm:ss')
					const currentLocalTimetoServer = momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');

					if (timeExpiredServer && (moment(currentLocalTimetoServer) <= moment(timeExpiredServer))) {
						this.setState({
							memberid, transactiontype,
							isLoading: false,
							otprender: true,
							fieldvalue: { ...this.state.fieldvalue, generatedtime, expiredtime },
						});
					} else this.setState({ isLoading: false, errortype: 'expired', otprender: false, messageSubTitle: "Please contact our Call Center to generate a new OTP and continue your request." });
					this.setState({ fieldvalue: { ...this.state.fieldvalue } });
				} else this.setState({ isLoading: false, errortype: 'expired', otprender: false, messageSubTitle: "Please contact our Call Center to generate a new OTP and continue your request." });
			} else if (status.responsecode === "9005") {
				this.setState({ isLoading: false, errortype: 'expired', otprender: false, messageSubTitle: "Please contact our Call Center to generate a new OTP and continue your request." });
			} else this.setState({ isLoading: false, errortype: 'notfound', otprender: false });
		});
	};

	handleOTP = (value, type) => {
		const { otpvalue, transactiontype, memberid, fieldvalue, browser, ip, longitude, latitude } = this.state;

		if (type === "verifyotp") {
			this.setState({ isLoading: true });
			const data = {
				memberid, browser, ip, transactiontype,
				otpcode: Number(otpvalue),
				channel: "BO",
				longitude: (longitude) ? `${longitude}` : null,
				latitude: (latitude) ? `${latitude}` : null
			}

			BasicRequest(api.url.memberotp.public.verification, data).then((response) => {
				const { status, result } = response;
				const { responsecode, responsemessage } = status || {};
				const { transactiontype, verificationstatus } = result ? result : "";
				if (responsecode === "0000") {
					let message = responsemessage ? responsemessage : "";
					this.setState({ transactiontype, verificationstatus, verified: true, isLoading: false });
					Alert.success(message);
				} else if (responsecode === "0003") {
					this.setState({ isLoading: false, errortype: 'maxattempt', otprender: false, messageSubTitle: responsemessage });
				} else {
					Alert.error(responsemessage);
					this.setState({ isLoading: false });
				}
			});
		} else this.setState({ otpvalue: value });
	};

	handleChangeOTP = (value) => {
		this.setState({ otpvalue: value });
	};

	render() {
		const { isLoading, otpvalue, otprender, fieldvalue, verified, errortype, messageSubTitle } = this.state;
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 8 } },
			wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
		};

		const mobileScreen = window.screen.width < 600;

		const timeExpiredServer = (fieldvalue) ? moment(fieldvalue.expiredtime).format('YYYY/MM/DD HH:mm:ss') : momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
		const currentLocalTimetoServer = momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
		const difference = (timeExpiredServer) ? moment(timeExpiredServer).diff(currentLocalTimetoServer) : null;
		const countdown = Date.now() + difference;

		if (isLoading) {
			return <MemberOTPSkeleton />
		} else if (errortype === 'notfound') {
			return <Error404 {...this.props} type={'member'} />
		} else if (verified) {
			return (
				<Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
					<Col>
						<Row type="flex" justify="center" style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
							<img src="https://amala.garuda-indonesia.com/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 120 : 250} height={'auto'} style={{ marginRight: (mobileScreen) ? 48 : 80 }} />
							<img src="https://amala.garuda-indonesia.com/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 80 : 140} height={mobileScreen ? 24 : 48} style={{ marginTop: (mobileScreen) ? 6 : 0 }} />
						</Row>
						<Result
							icon={<Icon component={EmailChecklist} {...this.props} />}
							status="success"
							title={<Title level={2} style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(22px, 6vw, 36px)", margin: "8px 0 0" }}>Congratulations!</Title>}
							subTitle={<Text type="secondary" style={{ display: "block", maxWidth: 420, margin: "12px auto 0", fontSize: "clamp(13px, 3.5vw, 15px)", padding: "0 8px" }}>OTP verified successfully. You can close this page</Text>}
						/>
					</Col>
				</Row>
			)
		} else return (
			<Row>
				{(otprender) ? (
					<Form>
						<Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
							<Col style={{ width: '100%', maxWidth: mobileScreen ? 340 : 560, textAlign: 'center' }}>
								<Row type="flex" justify="center" align="middle" style={{ margin: "40px 0px 80px 0px" }}>
									<img src="https://amala.garuda-indonesia.com/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 120 : 250} height="auto" style={{ marginRight: mobileScreen ? 48 : 80 }} />
									<img src="https://amala.garuda-indonesia.com/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 80 : 140} height={mobileScreen ? 24 : 48} style={{ marginTop: mobileScreen ? 6 : 0 }} />
								</Row>

								<Title level={2} style={{ marginBottom: 16 }}>Verification</Title>

								<div style={{ marginBottom: 16 }}>
									<Text strong style={{ display: 'block' }}>Please insert OTP Code before</Text>
									<Countdown
										valueStyle={{ fontSize: 16, fontWeight: 'bold' }}
										value={countdown}
										format="mm:ss"
										onFinish={() => {
											this.setState({ otprender: false, messageSubTitle: "The OTP code has expired, please retry for a new code" });
										}}
									/>
								</div>

								<Row type="flex" justify="center" style={{ marginBottom: 16 }}>
									<OtpInput
										value={otpvalue}
										shouldAutoFocus={true}
										onChange={this.handleChangeOTP}
										numInputs={6}
										renderSeparator={<span>&nbsp;&nbsp;</span>}
										renderInput={(props) => <input {...props} />}
										inputStyle={{
											width: 50,
											height: 50,
											borderRadius: "8px",
											borderColor: "rgba(0, 0, 0, 0.65)",
										}}
									/>
								</Row>

								<Text strong style={{ display: 'block', marginBottom: 24 }}>
									Please contact customer service if you don't receive an email or resend code
								</Text>

								<Row type="flex" justify="center">
									<Col>
										<Button
											htmlType="button"
											type="primary"
											label="Verify"
											onClick={(val) => this.handleOTP(val, "verifyotp")}
											disabled={!(otpvalue && otpvalue.length === 6)}
										/>
									</Col>
								</Row>
							</Col>
						</Row>
					</Form>
				) : (
					<Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
						<Col>
							<Row type="flex" justify="center" style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
								<img src="https://amala.garuda-indonesia.com/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 120 : 250} height={'auto'} style={{ marginRight: (mobileScreen) ? 48 : 80 }} />
								<img src="https://amala.garuda-indonesia.com/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 80 : 140} height={mobileScreen ? 24 : 48} style={{ marginTop: (mobileScreen) ? 6 : 0 }} />
							</Row>
							<Result
								icon={
									(errortype === 'maxattempt') ? <img src="https://amala-pdt.garuda-indonesia.com/assets/images/member-more-3.webp" alt="Expired" width={mobileScreen ? 200 : 260} /> :
										<img src="https://amala-pdt.garuda-indonesia.com/assets/images/member-times-up.webp" alt="Expired" width={mobileScreen ? 200 : 260} />
								}
								status="error"
								title={<Title level={2} style={{ color: "#1A1A1A", fontWeight: 700, fontSize: "clamp(22px, 6vw, 36px)", margin: "8px 0 0" }}>{(errortype === 'maxattempt') ? "Maximum Attempts" : "OTP has Expired"}</Title>}
								subTitle={<Text type="secondary" style={{ display: "block", maxWidth: 420, margin: "12px auto 0", fontSize: "clamp(13px, 3.5vw, 15px)", padding: "0 8px" }}>{messageSubTitle}</Text>}
							/>
						</Col>
					</Row>
				)}
			</Row>
		);
	}
}

export default ProfileUpdateOtp;