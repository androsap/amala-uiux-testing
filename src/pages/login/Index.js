import React, { Component } from 'react';
import { login, resetpassword, setPermission } from '../../utilities/AuthService';
import { RetrieveRequest, RequestWithoutAuth } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { getOptionsCustomIdentity, setIdToken, setTimeToken, setProfile, setAPIToken } from '../../utilities/AuthService';
import { InputText, Alert } from '../../components/Base/BaseComponent';
import { Row, Col, Layout, Typography, Form, Icon, Input, Button, Spin, Modal, Card } from 'antd';
import sha512 from 'js-sha512';
import packageJson from '../../../package.json';
import moment from 'moment';
import momentzone from 'moment-timezone';
import Reaptcha from 'reaptcha';
import ChangePasswordForm from './ChangePassword';
import Announcement, { AnnouncementModal } from './Announcement';

global.appVersion = packageJson.version;

const { Title, Text } = Typography;
const userException = ['andro', 'fitri', 'shadiq.almughni', 'rizal', 'andi.utami', 'riaputri', 'runi', 'ASYSTDIPOTJAHJN', 'damarsatya', 'm.hanief', 'ASYSTRICKOGUSTI', 'JKTNLSSUPLANYRA', 'JKTNLSGSCMRIDHO', 'JKTNLSGSPMFITRA', 'JKTNLGSPBERLIAN', 'JKTNLGSCIMAMMUL'];
const announcement = `Sorry, You are not able to access AMALA system during database maintenance activity for 360 minutes (on July 18, 2026 at 22.00 PM – July 19, 2026 at 04:00 AM (UTC+7)). Please try again after it. Thank you for your understanding`;
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			password2: "",
			username2: "",
			copassword: "",
			email: "",
			userfullname: "",
			inputuserfullname: "",
			inputbranchcode: null,
			inputtickoffid: "",
			newpassword: null,
			errors: {},
			isLoading: false,
			optionsBranchCode: [],
			branchcode: null,
			ticketofficedisabled: true,
			optionsTicketOffice: [],
			visible: false,
			verified: false,
			recaptchaResponse: null,
			isLoadingSelect2: {
				branchcode: false,
				ticketoffice: false
			},
			formType: ''
		}

		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onPassword2Change = this.onPassword2Change.bind(this);
		this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
		this.onUsername2Change = this.onUsername2Change.bind(this);
		this.onEmailChange = this.onEmailChange.bind(this);
		this.onUserFullNameChange = this.onUserFullNameChange.bind(this);
		this.onBranchCodeChange = this.onBranchCodeChange.bind(this);
		this.onTicketOffIdChange = this.onTicketOffIdChange.bind(this);

		this.movePage = React.createRef();
	}

	componentDidMount() {
		document.title = "Login | Loyalty Management System";
	}

	onUsernameChange(e) {
		this.setState({ username: e.target.value });
	}

	onPasswordChange(e) {
		this.setState({ password: e.target.value });
	}

	onPassword2Change(e) {
		this.setState({ password2: e.target.value });
	}

	onConfirmPasswordChange(e) {
		this.setState({ copassword: e.target.value });
	}

	onUsername2Change(e) {
		this.setState({ username2: e.target.value });
	}

	onEmailChange(e) {
		this.setState({ email: e.target.value });
	}

	onUserFullNameChange(e) {
		this.setState({ inputuserfullname: e.target.value });
	}

	onBranchCodeChange(e) {
		this.setState({ inputbranchcode: e.target.value });
	}

	onTicketOffIdChange(e) {
		this.setState({ inputtickoffid: e.target.value });
	}

	onVerify = recaptchaResponse => {
		this.setState({ verified: true, recaptchaResponse });
	}

	onExpired = recaptchaResponse => {
		this.setState({ verified: false });
		this.refs.refReCaptcha.reset()
	}

	handleValidation(field, type) {
		let errors = {};
		let status = true;

		if (type === 'login') {
			//username
			if (!field['username']) {
				errors['username'] = 'Required';
			}
			//password
			if (!field['password']) {
				errors['password'] = 'Required';
			}
		} else if (type === 'createpassword') {
			//username
			if (!field['username']) {
				errors['username'] = 'Required';
			}

			//password2
			if (!field['password2']) {
				errors['password2'] = 'Required';
			} else if (field['password2'].length < 8) {
				errors['password2'] = 'Minimum 8 characters';
			} else if (field['password2'].length > 45) {
				errors['password2'] = 'Maximum 45 characters';
			} else if (field['password2'] !== field['copassword']) {
				errors['copassword'] = 'Invalid confirm password';
			}


		} else if (type === 'username') {
			//username
			if (!field['username']) {
				errors['username'] = 'Required';
			}
		} else if (type === 'userfullname') {
			//userfullname
			if (!field['userfullname']) {
				errors['userfullname'] = 'Required';
			}
		} else if (type === 'branchticketoffice') {
			//branchcode
			if (!field['branchcode']) {
				errors['branchcode'] = 'Required';
			}
			//tickoffid
			if (!field['tickoffid']) {
				errors['tickoffid'] = 'Required';
			}
		}

		if (Object.getOwnPropertyNames(errors).length > 0) {
			status = false;
		}

		this.setState({ errors: errors });
		return status;
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isLoading: true });
				const formData = {};
				formData['username'] = values.username;
				formData['password'] = sha512(values.password);
				formData['recaptcha'] = this.state.recaptchaResponse;

				const callback = async (response) => {
					const { data } = response;
					const { responsecode, responsemessage } = data.status;
					const timeBefore = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') < momentzone.tz('2026-07-18 22:00:00', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
					const timeAfter = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') > momentzone.tz('2026-07-19 04:00:05', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

					this.refs.refReCaptcha.reset()
					if ((moment() < moment('2022-12-06 16:40:00')) || (moment() > moment('2022-12-06 16:50:00'))) {
						if (responsecode.substring(0, 1) === '0') {
							const { usermenu, enrollmentaccess } = data.result;
							await setAPIToken(data.result.bearer);
							await setIdToken(data.identity.signature);
							await setTimeToken();
							// await setProfile(data.result, formData.username);

							/* Get Detail User */
							let url = api.url.user.list;
							let criteria = { username: formData.username };
							await RetrieveRequest(url, criteria).then((response) => {
								const { result } = response;
								setProfile(data.result, formData.username, result[0]);

								let permissionMenu = { usermenu, enrollmentaccess };
								setPermission(permissionMenu);

								//redirect landing page after login
								(result[0].rolename === 'BOD') ? window.location.replace('/member') : window.location.replace('/');
							})
							// window.location.replace('/');
						} else if (responsecode === '9004') {
							this.setState({ username: formData.username });
							this.handleOpenModal('changePass');
						} else Alert.error(responsemessage);
					} else this.setState({ visible: true, formType: 'openAnnouncement' });
					this.setState({ isLoading: false });
				};

				login(formData, callback);
			}
		});
	};

	handleSubmitForgotPassword = (e, step) => {
		e.preventDefault();
		const formData = {};
		formData['username'] = this.state.username;
		formData['userfullname'] = this.state.inputuserfullname;
		formData['branchcode'] = this.state.inputbranchcode;
		formData['tickoffid'] = this.state.inputtickoffid;
		formData['password2'] = this.state.password2;
		formData['copassword'] = this.state.copassword;

		if (this.handleValidation(formData, step)) {
			if (step === 'username') {
				let username = formData.username;
				this.setState({ isLoading: true }, this.getData(username));
			} else if (step === 'userfullname') {
				let inputuserfullname = formData.userfullname;
				let userfullname = this.state.userfullname;

				if (inputuserfullname.toLowerCase() === userfullname.toLowerCase()) {
					document.getElementById("branchticketoffice-field").classList.add("active");
					document.getElementById("userfullname-field").classList.add("next");
					document.getElementById("userfullname-field").classList.remove("active");
				} else {
					Alert.error('Fullname not match');
				}
			} else if (step === 'branchticketoffice') {
				let inputbranchcode = formData.branchcode;
				let inputtickoffid = formData.tickoffid;
				let branchcode = this.state.branchcode;
				let tickoffid = this.state.tickoffid;

				if (inputbranchcode.toLowerCase() === branchcode.toLowerCase()) {
					if (inputtickoffid.toLowerCase() === tickoffid.toLowerCase()) {
						document.getElementById("createpassword-field").classList.add("active");
						document.getElementById("branchticketoffice-field").classList.add("next");
						document.getElementById("branchticketoffice-field").classList.remove("active");
					} else {
						Alert.error('Ticket Office ID not match');
					}
				} else {
					Alert.error('Branch code not match');
				}
			} else if (step === 'createpassword') {
				const { username, inputuserfullname, inputbranchcode, inputtickoffid } = this.state;
				if (username && inputuserfullname && inputbranchcode && inputtickoffid) {
					this.createPassword();
				} else {
					Alert.error('Please verify username, fullname, branch and ticket office data');
				}
			}
		}
	};

	getData(username) {
		let url = api.url.user.list;
		let paging = {};
		let column = [];
		let criteria = { username };
		let sort = {};
		//call loader
		this.setState({ isLoading: true });
		RetrieveRequest(url, paging, column, criteria, sort).then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0' && result.length !== 0) {
				let email = (result[0].email) ? result[0].email : null;
				let userfullname = (result[0].userfullname) ? result[0].userfullname : null;
				let branchcode = (result[0].branchcode) ? result[0].branchcode : null;
				let tickoffid = (result[0].tickoffid) ? result[0].tickoffid : null;

				this.setState({ email, userfullname, branchcode, tickoffid }, this.getOptionsBranch(username));

				document.getElementById("userfullname-field").classList.add("active");
				document.getElementById("username-field").classList.add("next");
				document.getElementById("username-field").classList.remove("active");
				this.setState({ isLoading: false });
			} else {
				Alert.error('Username not found');
				this.setState({ isLoading: false });
			}
		});
	};

	createPassword() {
		const formData = {};
		formData['username'] = this.state.username;
		formData['password2'] = this.state.password2;
		if (this.handleValidation(formData, 'forgot')) {
			this.setState({ isLoading: true });
			let username = formData.username;
			let newpassword = formData.password2;

			let message = '';
			resetpassword(username, newpassword).then((response) => {
				const { responsecode, responsemessage } = response.data.status;
				if (responsecode.substring(0, 1) === '0') {
					message = (responsemessage) ? responsemessage : message;
					Alert.success(message);

					this.resetState();

					document.getElementById("login-form").classList.add("active");
					document.getElementById("login-form").classList.remove("next");
					document.getElementById("createpassword-field").classList.add("next");
					document.getElementById("createpassword-field").classList.remove("active");
				} else {
					Alert.error(responsemessage);
				}
				//hide loader
				this.setState({ isLoading: false });
			});
		}
	};

	getOptionsBranch(username) {
		let url = api.url.branch.list;
		/*isLoading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, branchcode: true } }));
		getOptionsCustomIdentity(url, username).then((response) => {
			const { status, result } = response.data;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsBranchCode = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.branchname;
					result2['value'] = obj.branchcode;
					return result2;
				})

				this.setState(prevState => ({
					optionsBranchCode,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, branchcode: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	};

	getOptionsTicketOffice(username, branchcode) {
		let url = api.url.ticketoffice.list;
		let criteria = { branchcode };
		/*isLoading select2 get data*/
		this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, ticketoffice: true } }));
		getOptionsCustomIdentity(url, username, criteria).then((response) => {
			const { status, result } = response.data;
			if (status.responsecode.substring(0, 1) === '0') {
				//remapping for base option select2
				var optionsTicketOffice = result.map(obj => {
					var result2 = {};
					result2['label'] = obj.tickoffname;
					result2['value'] = obj.tickoffid;
					return result2;
				});

				let ticketofficedisabled = false;
				this.setState(prevState => ({
					ticketofficedisabled,
					optionsTicketOffice,
					isLoadingSelect2: { ...prevState.isLoadingSelect2, ticketoffice: false }
				}));
			} else {
				Alert.error(status.responsemessage);
			}
		});
	};

	handleBranchCodeChange = (event) => {
		let inputbranchcode = event === null ? null : event.value;
		let inputtickoffid = null;
		let ticketofficedisabled = true;

		if (inputbranchcode) {
			let username = this.state.username;
			this.getOptionsTicketOffice(username, inputbranchcode);
		}

		this.setState({ inputbranchcode, inputtickoffid, ticketofficedisabled });
	};

	handleTicketOfficeChange = (event) => {
		let inputtickoffid = event === null ? null : event.value;
		this.setState({ inputtickoffid });
	};

	resetState(showid, hideid) {
		this.setState({ password: "", password2: "", username2: "", email: "", errors: {}, isLoading: false });

		if (showid) { document.getElementById(showid).classList.add("active"); }
		if (hideid) { document.getElementById(hideid).classList.add("next"); }
	};

	handleOpenModal = (formType) => {
		this.setState({ visible: true, formType });
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { isLoading, username, visible, formType } = this.state;

		const titleBarModal = { resetPass: 'Reset Password', changePass: 'Change Password' };
		const isannouncement = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') < momentzone.tz('2026-07-19 04:00:05', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

		return (
			<Layout>
				<Modal title={titleBarModal[formType]} loading={isLoading} visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={620}>
					{
						(formType === 'resetPass') ? <ResetPasswordForm closeModal={this.handleCancel} /> :
							(formType === 'changePass') ? <ChangePasswordForm closeModal={this.handleCancel} username={username} /> :
								(formType === 'openAnnouncement') ? <AnnouncementModal messageSubTitle={announcement} /> : null
					}
				</Modal>
				<Spin spinning={isLoading}>
					<Row>
						<div className="dashboard-login">
							<Col xs={24} sm={24} md={9} lg={9} xl={9}>
								<div className="right-login">
									<div className="user-login" id="login-form">
										<img src="/assets/images/logo.png" alt="Asyst Logo" className="img-fluid" />
										<Title level={3}>Loyalty Management System</Title>
										<Form onSubmit={this.handleSubmit}>
											<Form.Item style={{ marginBottom: '1rem' }}>
												{
													getFieldDecorator('username', {
														rules: [{ required: true, message: 'Please input your username!' }],
													})(
														<Input
															prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
															placeholder="Username"
														/>,
													)
												}
											</Form.Item>
											<Form.Item>
												{
													getFieldDecorator('password', {
														rules: [{ required: true, message: 'Please input your Password!' }],
													})(
														<Input.Password
															prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
															type="password"
															placeholder="Password"
														/>,
													)}
											</Form.Item>
											<Form.Item>
												<Reaptcha ref="refReCaptcha" sitekey="6Lcj1SotAAAAAA1AmHFPHphse0kDO6zPM6hLKSxI" onVerify={this.onVerify} onExpire={this.onExpired} />
											</Form.Item>
											<Form.Item>
												<Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={!this.state.verified}>Log in</Button>
											</Form.Item>
											<span style={{ textAlign: 'center', display: 'block' }}>
												<a onClick={() => this.handleOpenModal('resetPass')}>Don't know your password ? <br /> Set your password here.</a>
											</span>
											<span style={{ textAlign: 'center', display: 'block', marginTop: '50px', color: '#aaaaaa', fontSize: '12px' }}>
												AMALA {global.appVersion} <br />PT. Aero Systems Indonesia ({moment().format("YYYY")}).
											</span>
										</Form>
									</div>
								</div>
							</Col>
							<Col xs={24} sm={24} md={15} lg={15} xl={15}>
								<div className="left-login">
									<img src="/assets/images/amala-login.png" alt="Asyst" />
								</div>
							</Col>
						</div>
					</Row>
				</Spin>
			</Layout>
		)
	}
}

class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			resetSuccess: false,
			responsemessage: null
		}
	}

	saveAction = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, input) => {
			if (!err) {
				let message = '';
				let username = input.username;
				let data = { username };
				let url = api.url.user.resetuserpassword;
				this.setState({ isLoading: true });
				RequestWithoutAuth(url, data).then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;

						const timeBefore = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') < momentzone.tz('2026-07-12 22:00:00', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
						const timeAfter = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') > momentzone.tz('2026-07-13 04:00:05', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

						if ((timeBefore || timeAfter) || userException.includes(username)) {
							RequestWithoutAuth(url, data).then((response) => {
								const { responsecode, responsemessage } = response.status;
								if (responsecode.substring(0, 1) === '0') {
									message = (responsemessage) ? responsemessage : message;
									this.setState({ isLoading: false, resetSuccess: true, responsemessage: message });
								} else {
									Alert.error(responsemessage);
									this.setState({ isLoading: false });
								}
							});
						} else {
							Alert.information(announcement);
							this.setState({ isLoading: false });
						}
					} else {
						Alert.error(responsemessage);
						this.setState({ isLoading: false });
					}
				});
			}
		})
	}

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
		};
		const { resetSuccess, responsemessage } = this.state;

		return (
			<Spin spinning={this.state.isLoading}>
				{
					(resetSuccess) ? <div style={{ textAlign: 'center' }}><Text strong>{responsemessage}</Text></div> :
						<Form {...formItemLayout} onSubmit={this.saveAction}>
							<Row gutter={24}>
								<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
									<InputText form={this.props.form} labeltext="Username / Email" datafield="username" placeholder="Username / Email" validationrules={['required']} />

								</Col>
							</Row>
							<Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
								<Button htmlType="submit" type="primary"> Submit </Button>
							</Row>
						</Form>
				}
			</Spin>
		)
	}
}

const ResetPasswordForm = Form.create()(ResetPassword);
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(App);
export default WrappedNormalLoginForm;