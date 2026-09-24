import React, { Component } from 'react';
import { RequestWithoutAuth, SaveRequest } from '../../../utilities/RequestService';
import { Button, Alert, InputPassword, InputText } from '../../../components/Base/BaseComponent';
import { api } from '../../../config/Services';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { validationPassword } from '../../../utilities/Helpers';
import sha512 from 'js-sha512';

const { Text } = Typography;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
            isLoading: false,
            token: null,
            resetpassword: false,
            activationstatus: '',
            activationmessage: '',
            createpasswordstatus: '',
            createpasswordmessage: '',
            memberid: null
        }
    }

    componentDidMount() {
        document.title = "Reset Password Member | Loyalty Management System";

        let key = this.props.match.params.ID;
        if (key !== undefined && key !== null) {
            let data = { key };
            let url = api.url.activation.resetvalidation;
            this.setState({ isLoading: true });
            RequestWithoutAuth(url, data).then((response) => {
                let { status, result } = response;
                if (status.responsecode.substring(0, 1) === '0') {
                    this.setState({
                        memberid: (result.memberid) ? result.memberid : null,
                        activationstatus: status.responsecode,
                        activationmessage: status.responsemessage,
                        resetpassword: true,
                        isLoading: false
                    })
                } else {
                    this.setState({ activationstatus: status.responsecode, activationmessage: status.responsemessage, isLoading: false });
                }
            });
        }
    }

    handleOk = (activationmessage) => {
        this.setState({ resetpassword: false, activationmessage })
    }

    render() {
        const { activationmessage, isLoading, resetpassword, memberid } = this.state;
        let key = this.props.match.params.ID;

        if (key !== undefined && key !== null) {
            return (
                <Row type="flex" justify="center" style={{ background: "#333 url('/assets/images/bg_dark.png')", height: '100vh' }}>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div style={{ background: '#FFF', textAlign: 'center', marginTop: '60px', padding: '40px' }}>
                            {/* <img src="/assets/images/logo.png" alt="Asyst Logo" className="img-fluid" />
                            <Title level={3}>Loyalty Management System</Title> */}
                            <Divider>Reset Password Member</Divider>
                            <Spin spinning={this.state.isLoading}>
                                <Text strong>
                                    {
                                        (!resetpassword && isLoading) ?
                                            "Please wait is waiting for the validation process" :
                                            activationmessage
                                    }
                                </Text>
                                {
                                    resetpassword ?
                                        <div style={{ marginTop: '20px' }}>
                                            <CreatePassword {...this.props} memberid={memberid} handleOk={this.handleOk} />
                                        </div>
                                        : null
                                }
                            </Spin>
                        </div>
                    </Col>
                </Row>
            )
        } else {
            return (<ResetPassword {...this.props} />)
        }
    }
}

export class ResetPassword extends Component {
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
                let url = api.url.activation.resetpassword;
                this.setState({ isLoading: true });
                RequestWithoutAuth(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;

                        this.setState({ resetSuccess: true, responsemessage: message });
                        // Alert.success(message);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                });
            }
        })
    }

    render() {
        const { isLoading, resetSuccess, responsemessage } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        return (
            <Row type="flex" justify="center" style={{ background: "#333 url('/assets/images/bg_dark.png')", height: '100vh' }}>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                    <div style={{ background: '#FFF', marginTop: '60px', padding: '40px' }}>
                        <div style={{ textAlign: 'center' }}>
                            {/* <img src="/assets/images/logo.png" alt="Asyst Logo" className="img-fluid" />
                            <Title level={3}>Loyalty Management System</Title> */}
                            <Divider>Reset Password Member</Divider>
                        </div>

                        <Spin spinning={isLoading}>
                            <Text style={{ textAlign: 'center' }}>Please let me know your GarudaMiles Number or Email, we will send you link to reset your password to your email</Text>
                            <Form {...formItemLayout} onSubmit={this.saveAction} style={{ marginTop: '30px' }}>
                                {
                                    (resetSuccess) ?
                                        <div style={{ textAlign: 'center' }}><Text strong>{responsemessage}</Text></div> :
                                        <React.Fragment>
                                            <Row gutter={24}>
                                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                                    <InputText form={this.props.form} labeltext="GarudaMiles Number / Email" datafield="username" placeholder="GarudaMiles Number or Email" validationrules={['required']} />
                                                </Col>
                                            </Row>
                                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                                <Button htmlType="submit" type="primary" label="Send" />
                                            </Row>
                                        </React.Fragment>
                                }
                            </Form>
                        </Spin>
                    </div>
                </Col>
            </Row>
        )
    }
}

export class CreatePassword extends Component {
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
                //define parameter
                let memberid = this.props.memberid;
                let forceupdate = true;
                let currentpassword = "amala";
                let newpassword = sha512(input.newpassword);

                let message = '';
                let url = api.url.member.changepassword;
                let data = { memberid, forceupdate, currentpassword, newpassword };
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.handleOk(message);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
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

    render() {
        const { isLoading } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout} onSubmit={this.saveAction}>
                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                            <InputPassword form={this.props.form} labeltext="New Password" datafield="newpassword" validationrules={['required', this.validateToNextPassword]} hasFeedback={true} />
                            <InputPassword form={this.props.form} labeltext="Confirm Password" datafield="confirmpassword" validationrules={['required', this.compareToFirstPassword]} hasFeedback={true} />
                        </Col>
                    </Row>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="submit" type="primary" label="Create" />
                    </Row>
                </Form>
            </Spin>
        )
    }
}

export default Form.create()(App);