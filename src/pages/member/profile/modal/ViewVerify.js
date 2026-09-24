import React from 'react';
import { configuration } from '../../../../config/Config';
import { Form, Alert as AlertMessage, Row, Col, Spin, Typography } from 'antd';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Button, Alert } from '../../../../components/Base/BaseComponent';
import { api } from '../../../../config/Services';

const { Text } = Typography;
const MEMBERID = configuration.MEMBERID;
class App extends React.Component {
    componentDidMount() { };

    sendVerify = () => {
        const memberid = this.props.match.params.ID;
        const url = api.url.member.sendverifyemail;

        localStorage.setItem(MEMBERID, memberid);

        DetailRequest(url, { memberid }).then((response) => {
            let { status } = response;
            if (status.responsecode === '0000') {
                Alert.success(status.responsemessage);
                this.props.onCancel();
            } else Alert.error(status.responsemessage);
        })
    };

    render() {
        const { email, isLoading } = this.props;
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
                                <span style={{ fontSize: '17px', marginTop: 20 }}><strong>Are you sure send verification to this email?</strong></span>
                                <AlertMessage
                                    style={{ marginTop: 15 }}
                                    message={<Text strong>{email}</Text>}
                                    description={`Verification email will be send to this member email`} type="warning"
                                />

                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                    <Button htmlType='button' type='primary' label='Yes, send email' onClick={this.sendVerify} />
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
