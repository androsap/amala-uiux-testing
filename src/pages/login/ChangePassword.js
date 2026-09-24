import { api } from '../../config/Services';
import React, { Component } from 'react';
import { RequestWithoutAuth } from '../../utilities/RequestService';
import { InputPassword, Alert } from '../../components/Base/BaseComponent';
import { validationPassword } from '../../utilities/Helpers';
import { Row, Col, Form, Icon, Button, Spin, Alert as AntAlert } from 'antd';
import sha512 from 'js-sha512';
import momentzone from 'moment-timezone';

const userException = ['andro', 'fitri', 'shadiq.almughni', 'rizal', 'andi.utami', 'riaputri', 'runi', 'ASYSTDIPOTJAHJN', 'damarsatya', 'm.hanief', 'ASYSTRICKOGUSTI', 'JKTNLSSUPLANYRA', 'JKTNLSGSCMRIDHO', 'JKTNLSGSPMFITRA', 'JKTNLGSPBERLIAN', 'JKTNLGSCIMAMMUL'];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            changeSuccess: false,
            responsemessage: null
        }
    }

    saveAction = (e) => {
        e.preventDefault();
        const { form, username } = this.props || {};
        form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                let currentpassword = sha512(input.currentpassword);
                let newpassword = sha512(input.newpassword);

                let message = 'Data has been updated';
                let url = api.url.user.changepassword;
                let data = { username, currentpassword, newpassword };
                const timeBefore = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') < momentzone.tz('2026-07-18 22:00:00', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
                const timeAfter = momentzone.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') > momentzone.tz('2026-07-19 04:00:05', 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

                if ((timeBefore || timeAfter) || userException.includes(this.props.username)) {
                    RequestWithoutAuth(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
                            this.setState({ changeSuccess: true, responsemessage: message, isLoading: false });
                        } else {
                            Alert.error(responsemessage);
                            this.setState({ isLoading: false });
                        };
                    });
                } else {
                    Alert.information(this.props.announcement);
                    this.setState({ isLoading: false });
                }
            }
        })
    }

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

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newpassword')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
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
        const { isLoading, changeSuccess, responsemessage } = this.state;
        const { closeModal } = this.props;

        return (
            <Spin spinning={isLoading}>
                {
                    (changeSuccess) ?
                        <div>
                            <AntAlert
                                message={`${responsemessage}`}
                                description={<span>Now you can use a new password to log in to your account!</span>}
                                type="success"
                                showIcon
                                icon={<Icon type="check" style={{ marginTop: 5 }} />}
                                style={{ marginBottom: 10 }}
                            />
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="button" type="primary" onClick={closeModal}> OK </Button>
                            </Row>
                        </div> :
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <AntAlert
                                    message="Your password has expired"
                                    description={<span>Please change your password now and log in again!</span>}
                                    type="error"
                                    showIcon
                                    icon={<Icon type="lock" style={{ marginTop: 5 }} />}
                                    style={{ marginBottom: 10 }}
                                />
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                    <InputPassword form={this.props.form} labeltext="Current Password" datafield="currentpassword" validationrules={['required']} />
                                    <InputPassword form={this.props.form} labeltext="New Password" datafield="newpassword" validationrules={['required', this.validateToNextPassword, this.compareToCurrentPassword]} hasFeedback={true} />
                                    <InputPassword form={this.props.form} labeltext="Re-type new password" datafield="confirmpassword" validationrules={['required', this.compareToFirstPassword]} hasFeedback={true} />
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

export default Form.create()(App);