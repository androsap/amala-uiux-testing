/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-30 13:31:54
 * @modify date 2020-07-30 13:31:54
 * @desc Confirmation Form
 */
import React, { Component } from 'react';
import { SaveRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button, Alert, SelectBase, SwitchButton, InputText } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Typography, Modal } from 'antd';
import moment from 'moment';
import { formatNumber } from '../../../utilities/Helpers';

import SaveForm from '../../my_approval/Confirmation';

const optionsPaymentMethod = [
    { label: 'Credit Card', value: 'CREDIT_CARD' },
    { label: 'Debit Card', value: 'DEBIT_CARD' },
    { label: 'Internet Banking', value: 'INTERNET_BANKING' },
    { label: 'Cash', value: 'CASH' },
    { label: 'Transfer Bank', value: 'TRANSFER_BANK' },
    { label: 'Other', value: 'OTHERS' }
];

const { Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            showsave: false,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    }

    componentDidMount() {
        let { buymileagedetail, actionsconfirmationpage, updateApproval, resultApproval, requestid } = this.props;
        const { reqdatas, responsedatas } = resultApproval || {};

        if (updateApproval) {
            const { paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode, membersecondaryemail } = (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ?
                reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
            buymileagedetail = { ...buymileagedetail, paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode, membersecondaryemail };
        };

        /* set primary email from member profile */
        if (actionsconfirmationpage === 'view') {
            let { paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode, updatememberemail, memberprimaryemail, membersecondaryemail } = buymileagedetail;

            let primaryemail = (memberprimaryemail) ? memberprimaryemail : undefined;
            let paymentmethodconfirm = (paymentmethod) ? paymentmethod : undefined;
            updatememberemail = (updatememberemail) ? updatememberemail : false;
            membersecondaryemail = (membersecondaryemail) ? membersecondaryemail : undefined;
            cardissuer = (cardissuer) ? cardissuer : undefined;
            cardidentifier = (cardidentifier) ? cardidentifier : undefined;
            refnumber = (refnumber) ? refnumber : undefined;
            transactioncode = (transactioncode) ? transactioncode : undefined;

            this.props.form.setFieldsValue({ updatememberemail, primaryemail, membersecondaryemail, paymentmethodconfirm, cardissuer, cardidentifier, refnumber, transactioncode });

            const generalfielddisabled = updateApproval ? false : true;
            const specialfielddisabled = updateApproval ? false : true;
            const fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
            this.setState({ fielddisabled });

            if (requestid) this.getApproval(requestid);

        } else {
            const { primaryemail } = this.props;
            this.props.form.setFieldsValue({ primaryemail });
        }
    };

    getApproval = (requestid) => {
        DetailRequest(api.url.requestapproval.detail, { requestid }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                const { reqdatas, responsedatas } = result;
                const { paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode, updatememberemail, membersecondaryemail } = (responsedatas === undefined || responsedatas === null) ?
                    reqdatas : responsedatas.result === undefined ? reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;

                this.props.form.setFieldsValue({ updatememberemail, membersecondaryemail, paymentmethodconfirm: paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode });
            } else Alert.error(responsemessage);
        });
    }

    saveAction = (e, type) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });

                const { updateApproval, resultApproval, match, buymileagedetail } = this.props;
                let memberbuymileageid = (this.props.memberbuymileageid) ? this.props.memberbuymileageid : null;
                let updatememberemail = (input.updatememberemail) ? input.updatememberemail : false;
                let membersecondaryemail = (input.membersecondaryemail) ? input.membersecondaryemail : null;
                let paymentmethod = (input.paymentmethodconfirm) ? input.paymentmethodconfirm : null;
                let cardissuer = (input.cardissuer) ? input.cardissuer : null;
                let cardidentifier = (input.cardidentifier) ? input.cardidentifier : null;
                let refnumber = (input.refnumber) ? input.refnumber : null;
                let transactioncode = (input.transactioncode) ? input.transactioncode : null;
                let paymentverificationtimeout = (buymileagedetail && buymileagedetail.paymentverificationtimeout) ? buymileagedetail.paymentverificationtimeout : null;

                let url = (type === 'REQUEST') ? api.url.requestapproval.create : (updateApproval) ? api.url.requestapproval.update : api.url.memberbuymileage.confirmation;
                let data = (type === 'REQUEST') ? {
                    referenceid: null, approvalby: null, approvaldate: null, remark: null,
                    memberid: match.params.ID, requesttype: 'BUYMILEAGE', requeststatus: 'NEW',
                    reqdatas: {
                        url: 'member/buymileageintegration/v1.2/confirm', memberbuymileageid, updatememberemail, membersecondaryemail, paymentmethod, cardissuer,
                        cardidentifier, refnumber, transactioncode, paymentverificationtimeout
                    }
                } : (updateApproval) ? {
                    ...resultApproval, remark: ((input.remark) ? input.remark : null),
                    reqdatas: {
                        url: 'member/buymileageintegration/v1.2/confirm', memberbuymileageid, updatememberemail, membersecondaryemail, paymentmethod, cardissuer,
                        cardidentifier, refnumber, transactioncode, paymentverificationtimeout
                    }
                } : { memberbuymileageid, updatememberemail, membersecondaryemail, paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode };

                SaveRequest(url, data).then(async (response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        Alert.success((responsemessage) ? responsemessage : 'New data has been updated');

                        if (!updateApproval) {
                            await this.props.refreshHeader();
                            await this.props.onClose();
                            await this.props.history.push('/member/form/' + this.props.match.params.ID + '/buy-mileage');
                            this.setState({ isLoading: false });
                        } else {
                            await this.props.history.push('/my-approval');
                            this.setState({ isLoading: false });
                        }
                    } else {
                        Alert.error(responsemessage);
                    }
                });
            }
        });
    };

    handleModal = (value, type) => {
        this.setState({ [type]: value })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { generalfielddisabled } = this.state.fielddisabled;
        const { actionspage, showsave } = this.state;
        const { buymileagedetail, actionsconfirmationpage, updateApproval } = this.props;
        const paymentmethod = this.props.form.getFieldValue('paymentmethodconfirm');
        const updatememberemail = this.props.form.getFieldValue('updatememberemail');

        const currencycode = (buymileagedetail && buymileagedetail.currencycode) ? buymileagedetail.currencycode : null;
        const buydate = (buymileagedetail && buymileagedetail.buydate) ? moment(buymileagedetail.buydate).format('DD/MM/YYYY HH:mm:ss') : '-';
        const totalamount = (buymileagedetail && (buymileagedetail.totalamount !== null && buymileagedetail.totalamount !== undefined)) ? formatNumber(buymileagedetail.totalamount) : '-';
        const totalmileage = (buymileagedetail && (buymileagedetail.totalmileage !== null && buymileagedetail.totalmileage !== undefined)) ? formatNumber(buymileagedetail.totalmileage) : '-';
        const paymentverificationtimeout = (buymileagedetail && (buymileagedetail.paymentverificationtimeout)) ? moment(buymileagedetail.paymentverificationtimeout).format('DD/MM/YYYY HH:mm:ss') : '-';

        //render form
        return (
            <Row>

                <Modal visible={showsave} footer={null} onCancel={() => this.handleModal(false, 'showsave')} destroyOnClose={true} width={400}>
                    <SaveForm {...this.props} onOk={this.saveAction} onClose={() => this.handleModal(false, 'showsave')} />
                </Modal>

                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 16, offset: 2 }} xl={{ span: 16, offset: 2 }}>
                                <Form.Item label='Payment Time Limit' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>
                                        <Text type='danger' strong style={{ display: 'block' }}>{paymentverificationtimeout}</Text>
                                    </span>
                                </Form.Item>
                                <Form.Item label='Buy Date' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{buydate}</span>
                                </Form.Item>
                                <Form.Item label='Total Milage' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{totalmileage}</span>
                                </Form.Item>
                                <Form.Item label='Total Price' style={{ margin: 0 }}>
                                    <span className='ant-form-text'>{currencycode + ' ' + totalamount}</span>
                                </Form.Item>
                                <InputText form={this.props.form} labeltext='Primary Email' datafield='primaryemail' validationrules={['required', 'pattern.email']} disabled={true} />
                                <SwitchButton form={this.props.form} labeltext='Update Member Email' datafield='updatememberemail' disabled={true} />
                                <InputText form={this.props.form} labeltext='Secondary Email' datafield='membersecondaryemail' validationrules={(updatememberemail) ? ['required', 'pattern.email'] : ['pattern.email']} disabled={generalfielddisabled} />
                                <SelectBase form={this.props.form} labeltext='Payment Method' datafield='paymentmethodconfirm' validationrules={['required']} options={optionsPaymentMethod} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext='Card Issuer' datafield='cardissuer' validationrules={(paymentmethod === 'CREDIT_CARD' || paymentmethod === 'DEBIT_CARD') ? ['required', 'pattern.alphanumeric'] : ['pattern.alphanumeric']} maxLength={10} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext='Card Identifier' datafield='cardidentifier' validationrules={(paymentmethod === 'CREDIT_CARD' || paymentmethod === 'DEBIT_CARD') ? ['required', 'pattern.alphanumeric'] : ['pattern.alphanumeric']} maxLength={4} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext='Ref Number' datafield='refnumber' disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext='Transaction Code' datafield='transactioncode' validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view' && actionsconfirmationpage === 'confirmation' && !updateApproval) ? <Button htmlType='button' type='primary' label='Request' onClick={(e) => this.saveAction(e, 'REQUEST')} menucode={'MBBUYMIL'} prefixmenuname={'MBBUYMIL'} actioncode='REQ' /> :
                                    (updateApproval) ? <Button htmlType='button' type='primary' label={'Update Approval'} onClick={() => this.handleModal(true, 'showsave')} /> : null
                            }
                            {
                                (actionspage !== 'view' && actionsconfirmationpage === 'confirmation' && !updateApproval) ? <Button htmlType='button' type='primary' label='Confirm' onClick={(e) => this.saveAction(e, 'BUY')} menucode={'MBBUYMIL'} prefixmenuname={'MBBUYMIL'} actioncode='BUY' /> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));