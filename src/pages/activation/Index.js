import React, { Component } from 'react';
import { RequestWithoutAuth, SaveRequest } from '../../utilities/RequestService';
import { Button, Alert, InputPassword } from '../../components/Base/BaseComponent';
import { api } from '../../config/Services';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
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
            createpassword: false,
            activationstatus: '',
            activationmessage: '',
            createpasswordstatus: '',
            createpasswordmessage: '',
            memberid: null
        }
    }

    componentDidMount() {
        document.title = "Activation | Loyalty Management System";

        let key = this.props.match.params.ID;
        let data = { key };
        let url = api.url.activation.retrievekey;
        this.setState({ isLoading: true });
        RequestWithoutAuth(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.memberid !== null && result.memberid !== "") {
                    url = api.url.activation.activation;
                    data = { key };
                    RequestWithoutAuth(url, data).then((response) => {
                        let { status } = response;
                        if (status.responsecode.substring(0, 1) === '0') {
                            let memberid = (result.memberid !== undefined) ? result.memberid : null;
                            this.setState({
                                activationstatus: status.responsecode,
                                activationmessage: status.responsemessage,
                                isLoading: false,
                                memberid,
                                createpassword: true
                            })
                        } else {
                            this.setState({
                                activationstatus: status.responsecode,
                                activationmessage: status.responsemessage,
                                isLoading: false
                            })
                        }
                    });
                } else {
                    this.setState({ activationstatus: "9999", activationmessage: "Member ID not found", isLoading: false });
                }
            } else {
                this.setState({ activationstatus: status.responsecode, activationmessage: status.responsemessage, isLoading: false });
            }
        });
    }

    handleOk = (activationmessage) => {
        this.setState({ createpassword: false, activationmessage })
    }

    render() {
        const { activationmessage, isLoading, createpassword, memberid } = this.state;

        return (
            <Row type="flex" justify="center" style={{ background: "#333 url('/assets/images/bg_dark.png')", height: '100vh' }}>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <div style={{ background: '#FFF', textAlign: 'center', marginTop: '60px', padding: '40px' }}>
                        {/* <img src="/assets/images/logo.png" alt="Asyst Logo" className="img-fluid" />
                        <Title level={3}>Loyalty Management System</Title> */}
                        <Divider>Create Password Member</Divider>
                        <Spin spinning={this.state.isLoading}>
                            <Text strong>
                                {
                                    (!createpassword && isLoading) ?
                                        "Please wait while your activation is processed" :
                                        activationmessage
                                }
                            </Text>
                            {
                                createpassword ?
                                    <div style={{ marginTop: '20px' }}>
                                        <CreatePassword {...this.props} memberid={memberid} handleOk={this.handleOk} />
                                    </div>
                                    : null
                            }
                            {/* <div style={{ marginTop: '40px' }}>
                                <Link to="/login">Back to login page</Link>
                            </div> */}
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
                // let memberid = '201908276zc3ti4';
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