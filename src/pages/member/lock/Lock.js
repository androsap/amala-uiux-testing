import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Button, Alert, CheckboxBase, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Modal } from 'antd';
import moment from 'moment';

const { confirm } = Modal;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Approval',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true
        }
    }

    saveAction = (e) => {
        e.preventDefault();

        const callback = (input) => {
            this.setState({ isLoading: true });
            //define parameter
            let memberid = this.props.memberid;
            let blockaccrual = (input.blockaccrual) ? input.blockaccrual : false;
            let blockredeem = (input.blockredeem) ? input.blockredeem : false;
            let blocktransfer = (input.blocktransfer) ? input.blocktransfer : false;
            let blockreceive = (input.blockreceive) ? input.blockreceive : false;
            let blockbuy = false;
            let reason = (input.reason) ? input.reason : null;
            let startdate = moment(new Date());

            let url = api.url.memberlock.create;
            let data = { memberid, blockaccrual, blockredeem, blocktransfer, blockreceive, blockbuy, reason, startdate };
            let message = 'Member has been locked';
            SaveRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    this.props.getMemberLock();
                    this.props.onClose();
                } else {
                    Alert.error(responsemessage);
                }
                //hide loader
                this.setState({ isLoading: false });
            })
        }

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                confirm({
                    title: 'Are you sure?',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk(e) {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            callback(input);
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel() { },
                });
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } },
        };
        const { formrender } = this.state;
        const { form } = this.props;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 6, offset: 6 }} xl={{ span: 6, offset: 6 }}>
                                    <CheckboxBase form={form} datafield='blockaccrual'> Not eligible for Accrual</CheckboxBase>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
                                    <CheckboxBase form={form} datafield='blocktransfer'> Not eligible for Transfer</CheckboxBase>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 6, offset: 6 }} xl={{ span: 6, offset: 6 }}>
                                <CheckboxBase form={form} datafield='blockredeem'> Not eligible for Redeem</CheckboxBase>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
                                    <CheckboxBase form={form} datafield='blockreceive'> Not eligible for Receive</CheckboxBase>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={{ span: 19, offset: 0 }} lg={{ span: 19, offset: 0 }} xl={{ span: 19, offset: 0 }} style={{ marginTop: 12 }}>
                                    <TextArea form={form} labeltext="Reason" datafield="reason" validationrules={['required']} maxLength={255} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="submit" type="danger" label="Start Locking" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));