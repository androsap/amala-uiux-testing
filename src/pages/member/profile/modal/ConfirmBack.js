import React from 'react';
import { Form, Row, Col, Spin } from 'antd';
import { Alert, Button } from '../../../../components/Base/BaseComponent';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';

class App extends React.Component {
    componentDidMount() { };

    handleOK = () => {
        const memberid = this.props.match.params.ID;

        DetailRequest(api.url.memberotp.deletetime, { memberid, transactiontype: 'UPDATEPROFILE' }).then((response) => {
            const { status } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000') {
                this.props.handleOK();
            } else Alert.error(responsemessage);
        });
    };

    render() {
        const { isLoading } = this.props;
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
                                <span style={{ fontSize: '17px', marginTop: 20 }}><strong>Are you sure cancel change profile information ?</strong></span>
                                <span className='ant-form-text' style={{ marginTop: 15 }}>You will cancel change and need to generate OTP code again</span>
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                    <Button htmlType='button' type='danger' label='OK' onClick={this.handleOK} />
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
