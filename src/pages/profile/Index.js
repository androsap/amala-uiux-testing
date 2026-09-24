import React, { Component } from 'react';
import { RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { getProfile } from '../../utilities/AuthService';
import { api } from '../../config/Services';
import ErrorGeneral from '../error/ErrorGeneral';
import { validationPassword } from '../../utilities/Helpers';
import { connect } from "react-redux";
import { InputText, Button, Alert, InputPassword } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Tabs, Icon } from 'antd';
import sha512 from 'js-sha512';

const { Title } = Typography;
const { TabPane } = Tabs;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			responseCode: '0',
			responseMessage: '',
			formrender: true,
			fieldvalue: {

			},
			fielddisabled: {
				specialfielddisabled: false,
				generalfielddisabled: false
			}
		}
	}

	componentDidMount() {
		this.getDetail();
		document.title = "Profile | Loyalty Management System";
	}

	getDetail = () => {
		let profile = getProfile();
		let username = profile.username;
		let url = api.url.user.list;
		let paging = {};
		let column = [];
		let criteria = { username };
		let sort = {};
		//call loader
		this.setState({ loading: true });
		RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
			const { status, result } = response;
			if (status.responsecode.substring(0, 1) === '0' && result) {
				if (result.length !== 0) {
					let username = (result[0].username) ? result[0].username : '';
					let userfullname = (result[0].userfullname) ? result[0].userfullname : '';
					let useremail = (result[0].useremail) ? result[0].useremail : '';
					let rolename = (result[0].rolename) ? result[0].rolename : '';

					let setFieldsValue = { username, userfullname, useremail, rolename };
					this.props.form.setFieldsValue(setFieldsValue);
					this.setState({ loading: false });
				} else {
					this.setState({ responseMessage: 'Data not found', formrender: false });
				}
			} else {
				this.setState({
					responseCode: status.responsecode,
					responseMessage: status.responsemessage,
					formrender: false
				});
			}
		});
	}

	saveAction = (e) => {
		e.preventDefault();
		const { actionspage } = this.state;

		this.props.form.validateFieldsAndScroll((err, input) => {
			if (!err) {
				this.setState({ isLoading: true });
				//define parameter
				let membershiptypeid = input.membershiptypeid;
				let membershiptypename = input.membershiptypename;

				let data = { membershiptypeid, membershiptypename };

				let message = '';
				let url = '';
				if (actionspage === 'create') {
					message = 'New data has been created';
					url = api.url.membershiptype.create;
				} else {
					message = 'Data has been updated';
					url = api.url.membershiptype.update;
				}

				SaveRequest(url, data).then((response) => {
					const { responsecode, responsemessage } = response.status;
					if (responsecode.substring(0, 1) === '0') {
						message = (responsemessage) ? responsemessage : message;
						Alert.success(message);
						this.props.history.push('/membership-type');
					} else {
						Alert.error(responsemessage);
					}
					//hide loader
					this.setState({ isLoading: false });
				})
			}
		});
	};

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
		};
		const { formrender } = this.state;

		if (formrender) {
			//render form
			return (
				<Row>
					<Tabs defaultActiveKey="1" tabPosition={(window.innerWidth < 768) ? 'top' : 'left'}>
						<TabPane tab={<span> <Icon type="profile" /> Profile </span>} key="1" forceRender={true}>
							<Form {...formItemLayout} onSubmit={this.saveAction}>
								<Row>
									<Col xs={24} xl={22}>
										<Title level={3}>Edit Profile</Title>
									</Col>
									<Divider />
								</Row>
								<Row gutter={24}>
									<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 4 }} xl={{ span: 12, offset: 4 }}>
										<InputText form={this.props.form} labeltext="Username" datafield="username" validationrules={['required']} disabled={true} />
										<InputText form={this.props.form} labeltext="Full Name" datafield="userfullname" validationrules={['required']} disabled={true} />
										<InputText form={this.props.form} labeltext="Email" datafield="useremail" validationrules={['required']} disabled={true} />
										<InputText form={this.props.form} labeltext="Role" datafield="rolename" validationrules={['required']} disabled={true} />
									</Col>
								</Row>
							</Form>
						</TabPane>
						<TabPane tab={<span> <Icon type="key" /> Change Password </span>} key="2" >
							<ChangePassword />
						</TabPane>
					</Tabs>
				</Row>
			)
		} else {
			return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
		}
	}
}

class ChangePasswordForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		}
	}

	saveAction = (e) => {
		e.preventDefault();
		this.props.form.validateFieldsAndScroll((err, input) => {
			if (!err) {
				this.setState({ isLoading: true });
				let profile = getProfile();
				let username = profile.username;
				let currentpassword = sha512(input.currentpassword);
				let newpassword = sha512(input.newpassword);

				let message = 'Data has been updated';
				let url = api.url.user.changepassword;
				let data = { username, currentpassword, newpassword };
				var requestData = SaveRequest(url, data);
				if (requestData) {
					requestData.then((response) => {
						const { responsecode, responsemessage } = response.status;
						if (responsecode.substring(0, 1) === '0') {
							message = (responsemessage) ? responsemessage : message;
							Alert.success(message);
							this.props.form.resetFields();
						} else {
							Alert.error(responsemessage);
						}
						//hide loader
						this.setState({ isLoading: false });
					})
				}
			}
		});
	}

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('newpassword')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value) {
			let validation = validationPassword(value);
			if (validation) {
				callback(validation);
			}
			form.validateFields(['confirmpassword'], { force: true });
		}
		callback();
	};

	compareToCurrentPassword = (rule, value, callback) => {
		const { form } = this.props;
		const currentpassword = form.getFieldValue('currentpassword');

		let diff = '';
		if (value.length >= currentpassword.length) value.split('').forEach((val, i) => {
			if (val !== currentpassword.charAt(i)) diff += val
		});
		else if (value.length < currentpassword.length) currentpassword.split('').forEach((val, i) => { if (val !== value.charAt(i)) diff += val });

		if (value && diff.length < 2) callback('At least 2 different characters from Current Password.');
		else callback();
	};

	render() {
		const formItemLayout = {
			labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
			wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
		};
		return (
			<Spin spinning={this.state.isLoading}>
				<Form {...formItemLayout} onSubmit={this.saveAction}>
					<Row>
						<Col xs={24} xl={22}>
							<Title level={3}>Change Password</Title>
						</Col>
						<Divider />
					</Row>
					<Row gutter={24}>
						<Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
							<InputPassword form={this.props.form} labeltext="Current Password" datafield="currentpassword" validationrules={['required']} />
							<InputPassword form={this.props.form} labeltext="New Password" datafield="newpassword" validationrules={['required', this.validateToNextPassword, this.compareToCurrentPassword]} hasFeedback={true} />
							<InputPassword form={this.props.form} labeltext="Re-type new password" datafield="confirmpassword" validationrules={['required', this.compareToFirstPassword]} hasFeedback={true} />
						</Col>
					</Row>
					<Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
						<Button htmlType="submit" type="default" label="Save" />
					</Row>
				</Form>
			</Spin>
		)
	}
}

const ChangePassword = Form.create()(ChangePasswordForm);

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));