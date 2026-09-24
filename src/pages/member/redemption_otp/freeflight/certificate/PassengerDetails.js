import React, { Component } from 'react';
import { Form, Col, Card } from 'antd';

class Layout extends Component {
    componentDidMount() {
        this.props.retrieveSession();
    }

    render() {
        let salutation = (this.props.salutation) ? this.props.salutation : '-';
        let name = (this.props.name) ? this.props.name : '-';
        let familyname = (this.props.familyname) ? this.props.familyname : '-';
        let memberid = (this.props.memberid) ? this.props.memberid : '-';
        let selfusage = (this.props.selfusage) ? 'YES' : 'NO';
        let travelertype = (this.props.travelertype) ? this.props.travelertype : '-';

        return (
            <Card title='Passenger Details' bordered={false} style={{ marginBottom: 10 }}>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Form.Item label='Salutation' style={{ margin: 0 }}>
                        <span className='ant-form-text'>{salutation}</span>
                    </Form.Item>
                    <Form.Item label='Name' style={{ margin: 0 }}>
                        <span className='ant-form-text'>{name}</span>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Form.Item label='Family Name' style={{ margin: 0 }}>
                        <span className='ant-form-text'>{familyname}</span>
                    </Form.Item>
                    <Form.Item label='Member ID' style={{ margin: 0 }}>
                        <span className='ant-form-text'>{memberid}</span>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Form.Item label='Traveler Type' style={{ margin: 0 }}>
                        <span className='ant-form-text'>{travelertype}</span>
                    </Form.Item>
                    <Form.Item label='Self Usage' style={{ margin: 0 }}>
                        <span className='ant-form-text'>{selfusage}</span>
                    </Form.Item>
                </Col>
            </Card>
        )
    }
}

export default Layout;