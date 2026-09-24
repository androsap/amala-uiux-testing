import React, { Component } from 'react';
import { Spin, Modal, Form, Row, Col, Alert as AlertAnt } from 'antd';
import { InputText, Button, Alert } from '../../../components/Base/BaseComponent';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';

class App extends Component {
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
                let certificateid = (input.certificateid !== undefined) ? input.certificateid : null;
                let ticketnumber = (input.ticketnumber !== undefined) ? input.ticketnumber : null;

                let message = 'New data has been created';
                let url = api.url.redemptioncertificate.addticketnumber;
                let data = { certificateid, ticketnumber };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.handleClose();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };

        const { certificateid, cardnumber, name, familyname } = this.props;

        return (
            <Modal
                title="Ticket Number"
                visible={this.props.visible}
                onOk={this.props.handleClose}
                onCancel={this.props.handleClose}
                footer={null} destroyOnClose={true}
                width={720}
            >
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <AlertAnt message="Please fill in the ticket number first from the previous redemption transaction" type="error" style={{ marginBottom: '10px' }} />
                                <InputText form={this.props.form} labeltext="Certificate ID" datafield="certificateid" validationrules={['required']} defaultValue={certificateid} className="hidden" disabled={true} />
                                <Form.Item label="Certificate ID" style={{ margin: 0 }}>
                                    <span className="ant-form-text">{certificateid}</span>
                                </Form.Item>
                                <Form.Item label="Card Number" style={{ margin: 0 }}>
                                    <span className="ant-form-text">{cardnumber}</span>
                                </Form.Item>
                                <Form.Item label="Name" style={{ margin: 0 }}>
                                    <span className="ant-form-text">{name} {familyname}</span>
                                </Form.Item>
                                <InputText form={this.props.form} labeltext="Ticket Number" datafield="ticketnumber" validationrules={['required', 'pattern.number']} maxLength={13} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save" ></Button>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

export default Form.create()(App);