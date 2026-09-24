import React from 'react';
import { Button } from '../../../components/Base/BaseComponent';
import { Form, Typography, Row } from 'antd';

const { Title } = Typography;

class App extends React.Component {
    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
            colon: false
        };
        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 0
            }
        }

        const { newpassword } = this.props;

        return (
            <React.Fragment>
                <Form {...formItemLayout}>
                    <Title level={4}>The password for this member has been reset successfully.</Title>
                    <Row className="searching-form">
                        <Form.Item label="New Password" {...formItemStyle}>
                            <span className="ant-form-text">: {newpassword}</span>
                        </Form.Item>
                    </Row>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                        <Button htmlType="button" type="default" label="OK" onClick={this.props.onClose} /></Row>
                </Form>
            </React.Fragment>
        )
    }
}

export default Form.create()(App);