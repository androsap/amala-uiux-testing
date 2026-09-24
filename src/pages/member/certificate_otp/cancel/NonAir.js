import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Col, Row, Card, Form, Typography, Modal, Spin } from 'antd';
import moment from 'moment';
import { Button, SwitchButton, InputText, Alert } from '../../../../components/Base/BaseComponent';
import { getProfile } from '../../../../utilities/AuthService';
import CeritificateDetails from '../../../../components/Certificate/Air/CertificateDetails';
import ConfirmationPage from './Confirmation';
import { jsUcfirst } from '../../../../utilities/Helpers';

const { Title } = Typography;

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            standardfee: true,
            cancelunit: null,
            cancelfee: null,
            typeButton: null,
            certificateprice: null,
            showConfirmation: false,
        }
    }

    getDerivedStateFromProps(props) {
        this.getFee(props.certificatedetails.awardcode);
    }

    componentDidMount() {
        this.getFee(this.props.certificatedetails.awardcode);
    }

    getFee(awardcode) {
        let url = api.url.awardmaster.retrievecancelupdate;
        let data = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                //call loader
                this.setState({
                    isLoading: false,
                    cancelunit: (result.cancelunit) ? result.cancelunit : null,
                    cancelfee: (result.cancelfee) ? result.cancelfee : '0'
                });
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    saveAction = (expiredawardmiles) => {
        const { standardfee, typeButton } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const callback = () => {
                    this.setState({ isLoading: true });
                    //define parameter
                    let username = getProfile().username;
                    let memberid = this.props.match.params.ID;
                    let certificateid = this.props.match.params.certificateid;
                    let certificateprice = this.props.certificatedetails.certificateprice;
                    let awardcode = this.props.certificatedetails.awardcode;
                    let trxdate = moment(new Date()).format('YYYY-MM-DD');
                    let standarfee = input.standardfee;
                    let fee = standardfee ? Number.parseInt(document.getElementById('totalstandardfee').innerText, 0) : Number.parseInt(input.fee, 0);
                    let price = Number.parseInt(certificateprice, 0);
                    let redeemairactivityid = [];
                    let categorycode = this.props.categorycode;
                    let message = 'Data has been updated';
                    let url = (typeButton === 'CANCEL') ? api.url.redemptioncertificate.cancel : api.url.requestapproval.create;
                    let data = (typeButton === 'CANCEL') ? { username, trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid } : {
                        referenceid: null, memberid: memberid, requesttype: "CANCEL", requeststatus: "NEW", approvalby: null, approvaldate: null, remark: null, reqdatas:
                            { url: 'redemption/transaction/v1.2/cancel', expiredawardmiles, username, trxdate, certificateid, memberid, awardcode, price, standarfee, fee, redeemairactivityid, categorycode }
                    };

                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);
                            this.props.refreshHeader();

                            this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp');
                        } else {
                            if (responsecode === '9005' && responsemessage.includes('This Certificate is Waiting for Approval')) {
                                Alert.information(responsemessage);
                            } else Alert.error(responsemessage);
                        }
                        //hide loader
                        this.setState({ isLoading: false });
                    })
                }

                callback();
                Modal.destroyAll();
            }
        });
    }

    handleStandardFee = (value) => {
        this.props.form.setFieldsValue({ fee: undefined });
        this.setState({ standardfee: value });
    }


    showConfirmation = (e, typeButton) => {
        e.preventDefault();

        this.setState({ showConfirmation: true, typeButton });
    }

    handleCancel = () => {
        this.setState({ showConfirmation: false });
    }

    handleShowNewCertificate = () => {
        this.props.history.push('/member/form/' + this.props.match.params.ID + 'certificateotp');
    }

    render() {
        const { certificatedetails } = this.props;
        const { isLoading, showConfirmation, standardfee, cancelunit, cancelfee, typeButton } = this.state;
        const memberid = this.props.match.params.ID;
        const certificateid = this.props.match.params.certificateid;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 12 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 12 } }
        };

        var percentagefee = Math.ceil(certificatedetails.certificateprice * cancelfee / 100);

        return (
            <Form {...formItemLayout} onSubmit={(e) => this.showConfirmation(e)}>

                {
                    (showConfirmation) ?
                        <ConfirmationPage title={`Certificate ${jsUcfirst(typeButton)}${typeButton === 'CANCEL' ? 'lation' : ' Cancellation'}`} awardcategory="NONAIR"
                            certificateid={certificateid} memberid={memberid} typeButton={typeButton} isLoading={isLoading}
                            certificatedetails={this.props.certificatedetails}
                            visible={showConfirmation} handleClose={this.handleCancel} onSubmit={(expiredawardmiles) => this.saveAction(expiredawardmiles)}
                            handleShowNewCertificate={this.handleShowNewCertificate} /> : null
                }
                <Spin spinning={isLoading}>
                    <CeritificateDetails {...this.props.certificatedetails} fromCancel={true}/>
                    <Card title="Cancellation Fee" bordered={false} className="card-shadow" style={{ marginBottom: 10 }}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={22} xl={22}>
                                <SwitchButton form={this.props.form} labeltext="Standard Fee" datafield="standardfee" onChange={this.handleStandardFee} defaultChecked disabled={true} />
                                {
                                    (standardfee) ?
                                        <Form.Item label="Fee">
                                            <Title level={4} className="ant-form-text" id="totalstandardfee">{(cancelunit === 'PERCENTAGE') ? percentagefee : (cancelunit === 'MILEAGE') ? cancelfee : '0'}</Title>
                                        </Form.Item>
                                        : <InputText labelCol={{ span: 12 }} wrapperCol={{ span: 4 }} form={this.props.form} labeltext="Fee" datafield="fee" validationrules={['required', 'pattern.number']} maxLength={6} />
                                }
                            </Col>
                        </Row>
                    </Card>
                    <Col style={{ textAlign: 'center', marginTop: 15 }} xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Button htmlType="button" type="primary" label="Confirm" className={(certificatedetails.status === 'VOUCHER_ISSUED') ? '' : 'hidden'} style={{ marginRight: 10 }}
                            menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'CANCEL'} onClick={(e) => this.showConfirmation(e, 'CANCEL')}></Button>
                        <Button htmlType="button" type="primary" label="Request" className={(certificatedetails.status === 'VOUCHER_ISSUED') ? '' : 'hidden'} style={{ marginLeft: 10 }}
                            menucode={'CERTIF'} prefixmenuname={'CERTIF'} actioncode={'REQCNCLE'} onClick={(e) => this.showConfirmation(e, 'REQUEST')}></Button>
                        {/* <Button url={"/member/form/" + memberid + "/certificate"} htmlType="link" type="default" label="Back" /> */}
                    </Col>
                </Spin>
            </Form>
        )
    }
}

// export default Layout;
export default Form.create()(Layout);