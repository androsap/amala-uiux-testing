import React from 'react';
import { Button, TextArea } from '../../components/Base/BaseComponent';
import { Form, Typography, Row, Col, Icon } from 'antd';

const { Text } = Typography;

class App extends React.Component {

    render() {
        return (
            <Row gutter={24}>
                <Row style={{marginLeft: 10}}>
                    <Col xs={{ span: 2 }}>
                        <Icon type="question-circle" style={{fontSize: 20}} theme="twoTone" />
                    </Col>
                    <Col xs={{ span: 21 }}>
                        <Text strong><div style={{marginLeft: 10}}>Are you sure update this request ?</div></Text>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24} style={{marginTop: 15}}>
                            <TextArea wrapperCol={{ span: 22 }} form={this.props.form} placeholder="Add Notes here ( Optional )" datafield="remark" maxLength={255} />
                        </Col>
                    </Col>
                </Row>
                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                    <Button htmlType="button" type="default" label="Cancel" onClick={this.props.onClose} />
                    <Button htmlType="button" type="primary" label="OK" onClick={this.props.onOk} />
                </Row>
            </Row>
        )
    }
}

export default Form.create()(App);
