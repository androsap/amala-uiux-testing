import React from 'react';
import { DetailRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button, Alert, InputText } from '../../components/Base/BaseComponent';
import { Form, Spin, Row, Col, Typography, Empty } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: false,
            actionspage: 'create',
            titlepage: 'Verify New',
            voucherData: {}
        };
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        let id = this.props.certificateid;
        if (id) {
            let titlepage = 'Detail';
            let actionspage = 'view';
            //change into update page
            this.setState({ titlepage, actionspage });
            this.props.setTitlePage(titlepage);
            this.getDetail(id, actionspage);
        }
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    getDetail(certificateid, actionspage) {
        let url = (actionspage === 'view') ? api.url.redemptioncertificate.detail : api.url.redemptioncertificate.voucherverification;
        let data = { certificateid };
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const { result } = response;
                const { redeemusers } = result;
                if (result.length !== 0) {
                    // voucher detail data
                    let vouchernumber = (redeemusers.certificateid) ? redeemusers.certificateid : '-';
                    let bookingcode = (result.bookingcode) ? result.bookingcode : '-';
                    let issuedby = (redeemusers.ticketofficeuser) ? redeemusers.ticketofficeuser : '-';
                    let redeemby = (redeemusers.redeemby) ? redeemusers.redeemby : '-';
                    let redeemdate = (redeemusers.redeemdate) ? moment(redeemusers.redeemdate).format('DD/MM/YYYY') : '-';
                    let issueddate = (redeemusers.issueddate) ? moment(redeemusers.issueddate).format('DD/MM/YYYY') : '-';
                    let voucherexpireddate = (redeemusers.endvaliditydate) ? moment(redeemusers.endvaliditydate).format('DD/MM/YYYY') : '-';
                    // voucher user data
                    let salutation = (redeemusers.salutationcode) ? redeemusers.salutationcode : '-';
                    let name = (redeemusers.name) ? redeemusers.name : '-';
                    let familyname = (redeemusers.familyname) ? redeemusers.familyname : '-';
                    let membercardnumber = (redeemusers.memberiduser) ? redeemusers.memberiduser : '-';
                    let voucherData = { vouchernumber, bookingcode, issuedby, redeemby, redeemdate, issueddate, voucherexpireddate, salutation, name, familyname, membercardnumber }
                    this.setState({ loading: false, voucherData });
                }
            } else {
                this.setState({ responseCode: response.status.responsecode, responseMessage: response.status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    verifyAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true, formrender: true });
                //define parameter
                let certificateid = input.certificateid;
                this.getDetail(certificateid);
            }
        });
    }

    redeemAction = (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        //define parameter
        let certificateid = this.state.voucherData.vouchernumber;

        let url = api.url.redemptioncertificate.updatestatus;
        let data = { certificateid };
        let message = 'Data has been redeemed';

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                message = (responsemessage) ? responsemessage : message;
                Alert.success(message);
                this.closeModalSuccess();
            } else {
                Alert.error(responsemessage);
            }
            this.setState({ loading: false });
        })
    }

    render() {
        // const { cancelModal } = this.props;
        const { formrender, loading, actionspage, voucherData } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
            colon: false
        };
        const formItemStyle = {
            style: { marginTop: 0, marginBottom: 0 }
        }

        let voucherDetail = '';
        if (Object.keys(voucherData).length) {
            voucherDetail =
                <Row>
                    <Row className="searching-form">
                        <Title level={4}>Voucher Details</Title>
                        <Col span={24}>
                            <Form.Item label="Voucher Number" {...formItemStyle} labelCol={{ span: 4 }}>
                                <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>: {voucherData.vouchernumber}</span>
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Form.Item label="Booking Code" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.bookingcode}</span>
                            </Form.Item>
                            <Form.Item label="Issued by" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.issuedby}</span>
                            </Form.Item>
                            <Form.Item label="Issued Date" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.issueddate}</span>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Redeem by" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.redeemby}</span>
                            </Form.Item>
                            <Form.Item label="Redeem Date" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.redeemdate}</span>
                            </Form.Item>
                            <Form.Item label="Expired Date" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.voucherexpireddate}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row className="searching-form" style={{ marginTop: 15 }}>
                        <Title level={4}>Voucher User</Title>
                        <Col span={14}>
                            <Form.Item label="Salutation" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.salutation}</span>
                            </Form.Item>
                            <Form.Item label="Name" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.name}</span>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="Family Name" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.familyname}</span>
                            </Form.Item>
                            <Form.Item label="Card Number" {...formItemStyle}>
                                <span className="ant-form-text">: {voucherData.membercardnumber}</span>
                            </Form.Item>
                        </Col>
                    </Row>
                </Row>
        }

        return (
            <React.Fragment>
                <Spin spinning={loading}>
                    <Form {...formItemLayout} onSubmit={this.verifyAction}>
                        <Row style={{ display: (actionspage === 'view') ? 'none' : 'block' }}>
                            <Col span={20}>
                                <InputText form={this.props.form} labeltext="Voucher Number" datafield="certificateid" validationrules={['required']} />
                            </Col>
                            <Col span={4} style={{ padding: 4 }}>
                                <Button htmlType="submit" type="primary" label="Verify" />
                            </Col>
                        </Row>
                        {
                            (formrender) ? voucherDetail : <Empty description={<h3>{this.state.responseMessage}</h3>} />
                        }
                        {
                            (actionspage !== 'view' && Object.keys(voucherData).length) ?
                                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 30 }}>
                                    {/* <Button htmlType="button" type="default" label="Cancel" onClick={cancelModal} /> */}
                                    <Button htmlType="button" type="primary" label="Redeem Voucher" onClick={(e) => this.redeemAction(e)} />
                                    <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                                </Row> : ''
                        }

                    </Form>
                </Spin>
            </React.Fragment>
        )
    }
}

export default Form.create()(App);