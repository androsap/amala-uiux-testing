import React from 'react';
import { Button } from '../../components/Base/BaseComponent';
import { Form, Typography, Row, Col, Icon } from 'antd';

const { Title } = Typography;

class ReviseConfirmation extends React.Component {

    render() {
        const { requesttype } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 24 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 24 } }
        };

        return (
            <Form {...formItemLayout}>
                <Row style={{ padding: '30px 20px 0 10px' }}>
                    <Col span={2}>
                        <Icon type='exclamation-circle' theme='filled' style={{ color: '#f7b665', fontSize: '150%', padding: '5px' }} />
                    </Col>
                    <Col span={22}>
                        <Title level={4} style={{ marginLeft: 20 }}>Your Approval has been FAILED</Title>
                        {requesttype === 'CANCEL' ? '' : <Title level={4} style={{ marginLeft: 20, marginTop: -10 }}>Please revise the request</Title>}
                    </Col>
                </Row>
                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                    {requesttype === 'CANCEL' ? '' : <Button className='btn-warning' htmlType='button' type='primary' size='default' label='Revise' onClick={() => this.props.handleRevise()} />}
                    <Button htmlType='button' type='default' label='Cancel' onClick={() => { this.props.handleCancel() }} />
                </Row>
            </Form>
        )
    }
}

export default Form.create()(ReviseConfirmation);