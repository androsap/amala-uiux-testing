import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RequestWithoutAuth, SaveRequest } from '../../utilities/RequestService';
import { Button, Alert, InputPassword } from '../../components/Base/BaseComponent';
import { api } from '../../config/Services';
import { Form, Row, Col, Divider, Typography, Spin, Button as AntButton } from 'antd';
import { validationPassword } from '../../utilities/Helpers';
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
            username: null
        }
    }

    componentDidMount() {
        document.title = "Reset Password | Loyalty Management System";

        let key = this.props.match.params.ID;
        let data = { key };
        let url = api.url.user.resetvalidation;
        this.setState({ isLoading: true });
        RequestWithoutAuth(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    username: (result.username) ? result.username : null,
                    activationstatus: status.responsecode,
                    // activationmessage: status.responsemessage,
                    resetpassword: true,
                    isLoading: false
                })
            } else {
                this.setState({ activationstatus: status.responsecode, activationmessage: status.responsemessage, isLoading: false });
            }
        });
    }

    handleOk = (activationmessage) => {
        this.setState({ resetpassword: false, activationmessage });

        setTimeout(function () {
            window.location.href = "/";
        }, 3000);
    }

    render() {
        const { activationmessage, isLoading, resetpassword, username } = this.state;
        return (
            <Row type="flex" justify="center" style={{ background: "#333 url('/assets/images/bg_dark.png')", height: '100vh' }}>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <div style={{ background: '#FFF', textAlign: 'center', marginTop: '60px', padding: '40px' }}>
                        <Divider>Reset Password</Divider>
                        <Spin spinning={this.state.isLoading}>
                            {
                                (!resetpassword && isLoading) ?
                                    <Text strong>Please wait is waiting for the validation process</Text>
                                    :
                                    <React.Fragment>
                                        <Text strong>
                                            {activationmessage}
                                        </Text>
                                    </React.Fragment>
                            }
                            {
                                resetpassword ?
                                    <div style={{ marginTop: '20px' }}>
                                        <CreatePassword {...this.props} username={username} handleOk={this.handleOk} />
                                    </div>
                                    :
                                    <Link to="/">
                                        <AntButton type="link" block style={{ marginTop: '20px' }}>
                                            Back to login page
                                        </AntButton>
                                    </Link>
                            }
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
                // let username = this.props.username;
                let key = this.props.match.params.ID;
                let newpassword = sha512(input.newpassword);

                let message = '';
                let url = api.url.user.resetpassword;
                let data = { key, newpassword };
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
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