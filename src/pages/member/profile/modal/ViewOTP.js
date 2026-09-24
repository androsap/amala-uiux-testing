import React from 'react';
import { Form, Row, Col, Spin } from 'antd';
import { Button } from '../../../../components/Base/BaseComponent';

class App extends React.Component {
    componentDidMount() { };


    render() {
        const { resendOTP, isLoading } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 14 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
        };

        return (
            <React.Fragment>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24}>
                                <span style={{ fontSize: '17px', marginTop: 20 }}><strong>You're about to generate OTP</strong></span>
                                <span className='ant-form-text' style={{ marginTop: 15 }}>This{`${(resendOTP) ? '' : ' save'}`} action using One Time Password (OTP)</span>
                                <span className='ant-form-text' style={{ marginTop: 2, color: 'red' }}>OTP code will be send to member email</span>
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                    <Button htmlType='button' type='primary' label='Send OTP' onClick={this.props.handleSaveOTP} />
                                    <Button htmlType='button' type='default' label='Cancel' onClick={this.props.onCancel} />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
