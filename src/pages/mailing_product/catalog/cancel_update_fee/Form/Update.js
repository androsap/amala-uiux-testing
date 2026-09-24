import React, { Component } from 'react';
import { api } from '../../../../../config/Services';
import { SaveRequest } from '../../../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, RadioButton, SwitchButton, InputText } from '../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Modal, Alert as AlertAntd } from 'antd';
import { ValueType } from '../../../../../data';

import FixUpdateTable from './TableFee';
import FeeForm from './Modal';

class Update extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            titlemodalpage: 'Create',
            formrender: true,
            visible: {
                showupdatefee: false
            },
            fieldvalue: {
                feelist: []
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    };

    checkPermission() {
        const mailingproductcode = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (mailingproductcode) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail();
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            }
        }
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = () => {
        const { canupdated, updateunit, updatefee, cancancelled, cancelfee, cancelunit } = this.props.mailingproduct || {};

        const updatefeemileage = (!updatefee) ? null : (updatefee.length === 0) ? null : (updateunit === 'FIX') ? null : updatefee.find(obj => obj.paymenttype === 'MILEAGE').amount;
        const updatefeecash = (!updatefee) ? null : (updatefee.length === 0) ? null : (updateunit === 'FIX') ? null : updatefee.find(obj => obj.paymenttype === 'CASH').amount;
        const setValue = { canupdated, updateunit, updatefeemileage, updatefeecash };
        const fieldvalue = { ...this.state.fieldvalue, cancancelled, cancelfee, cancelunit, feelist: updatefee };

        this.setState({ fieldvalue, isLoading: false })
        this.props.form.setFieldsValue(setValue);
    };

    saveAction = (e) => {
        e.preventDefault();
        const { mailingproduct } = this.props;
        const { feelist, cancancelled, cancelfee, cancelunit } = this.state.fieldvalue;

        this.props.form.validateFieldsAndScroll((err, input) => {
            const { canupdated, updateunit, updatefeemileage, updatefeecash } = input || {};
            const { mailingproductcode, mailingproductname, producttype, lettercode, inventorycode, useletter,
                customtrxcode, maxreorder, triggermethod, startdate, enddate, active } = mailingproduct || {};

            if (!err) {
                this.setState({ isLoading: true });

                let url = api.url.mailingproduct.cancelupdate.update;
                let data = {
                    mailingproductcode, mailingproductname, producttype, lettercode, inventorycode, cancelunit,
                    triggermethod, startdate, enddate, active, canupdated, updateunit, customtrxcode, maxreorder, cancelfee,
                    useletter: false,
                    cancancelled: (cancancelled) ? cancancelled : false,
                    updatefee: (canupdated) ? (updateunit === 'FIX') ? feelist : [
                        {
                            feetype: 'UPDATE',
                            paymenttype: 'CASH',
                            currencycode: 'IDR',
                            amount: Number(updatefeecash)
                        }, {
                            feetype: 'UPDATE',
                            paymenttype: 'MILEAGE',
                            currencycode: '',
                            amount: Number(updatefeemileage)
                        }
                    ] : []
                };

                if (!canupdated || (canupdated && updateunit === 'FIX' && feelist.length !== 0) || (canupdated && updateunit === 'PERCENTAGE')) {
                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode === '0000') {
                            Alert.success((responsemessage) ? responsemessage : 'Data has been updated');
                        } else Alert.error(responsemessage);
                        this.props.getDetail();
                    });
                } else Alert.error('Update fee can not be null, Please setup fee');
                setTimeout(() => { this.setState({ isLoading: false }) }, 500);
            };
        });
    };

    handleReset = (type) => {
        if (type === 'updateunit') this.props.form.resetFields(['updateunit', []]);
        this.props.form.resetFields(['updatefeemileage', 'updatefeecash', []]);
        this.setState({ fieldvalue: { ...this.state.fieldvalue, feelist: [] } });
    };

    handleVisible = (value, type) => {
        this.setState({ visible: { ...this.state.visible, [type]: value } });
    };

    setTitlePage = (titlemodalpage) => {
        this.setState({ titlemodalpage });
    };

    handleSaveFee = (actionsfeepage, value) => {
        if (actionsfeepage === 'create') {
            this.setState({
                fieldvalue: { ...this.state.fieldvalue, feelist: [...this.state.fieldvalue.feelist, value] },
                visible: { ...this.state.visible, showupdatefee: false }
            });
        } else if (actionsfeepage === 'update') {
            let { feeid, feelist } = this.state.fieldvalue;

            feelist = feelist.map((obj, key) => {
                if (obj.feeid === feeid) { obj = value }
                return obj;
            });

            this.setState({
                fieldvalue: { ...this.state.fieldvalue, feelist },
                visible: { ...this.state.visible, showupdatefee: false }
            });
        }
    };

    handleEditFee = (feeid) => {
        this.setState({
            fieldvalue: { ...this.state.fieldvalue, feeid },
            visible: { ...this.state.visible, showupdatefee: true }
        });
    };

    handleDeleteFee = (feeid) => {
        let feelist = this.state.fieldvalue.feelist.filter(obj => obj.feeid !== feeid);
        this.setState({ fieldvalue: { ...this.state.fieldvalue, feelist, feeid: null } });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 9 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 } }
        };
        const { actionspage, formrender, visible, titlemodalpage, fielddisabled, fieldvalue } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const { generalfielddisabled } = fielddisabled;
        const { feelist, feeid } = fieldvalue;
        const { showupdatefee } = visible;

        const canupdated = this.props.form.getFieldValue('canupdated');
        const updateunit = this.props.form.getFieldValue('updateunit');

        if (formrender) {
            return (
                <Row>

                    <Modal visible={showupdatefee} title={`${titlemodalpage} Update Fee`} onCancel={() => this.handleVisible(false, 'showupdatefee')} footer={null} destroyOnClose={true} width={680}>
                        <FeeForm menucode={menucode} prefixmenuname={prefixmenuname} feeid={feeid} feelist={feelist} actionspage={actionspage} type={'update'}
                            handleSaveFee={this.handleSaveFee} handleClose={() => this.handleCloseModal(false, 'showupdatefee')} setTitlePage={this.setTitlePage} />
                    </Modal>

                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24} style={{ marginTop: 20 }}>
                                {(window.innerWidth <= 960) ? <Col className='gutter-row' xs={24} sm={24} md={24} lg={6} style={{ padding: -10, marginBottom: 20 }}>
                                    <AlertAntd message={<strong>Information</strong>} type='info' description='Please submit before leave this page to save current change' />
                                </Col> : null}
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 14, offset: 1 }} xl={{ span: 13, offset: 3 }} style={{ marginTop: 15 }}>
                                    <SwitchButton form={this.props.form} labeltext='Can be Updated' datafield='canupdated' disabled={generalfielddisabled} onChange={() => this.handleReset('updateunit')} />
                                    <RadioButton form={this.props.form} labeltext='Update Units' datafield='updateunit' options={ValueType} validationrules={(canupdated) ? ['required'] : []} disabled={(canupdated) ? false : true} onChange={this.handleReset} />
                                    <InputText form={this.props.form} className={(updateunit) ? (updateunit === 'FIX') ? 'hidden' : '' : 'hidden'} labeltext='Update Fee (Mileage)' datafield='updatefeemileage' maxLength={16} suffix={'%'} validationrules={(canupdated && updateunit === 'PERCENTAGE') ? [`required`, `pattern.number`] : []} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} className={(updateunit) ? (updateunit === 'FIX') ? 'hidden' : '' : 'hidden'} labeltext='Update Fee (Cash)' datafield='updatefeecash' maxLength={16} suffix={'%'} validationrules={(canupdated && updateunit === 'PERCENTAGE') ? [`required`, `pattern.number`] : []} disabled={generalfielddisabled} />
                                    {(updateunit === 'PERCENTAGE') ? null : <Form.Item label={(canupdated && updateunit) ? <label className='ant-form-item-required' title='Update Fee'>Update Fee</label> : 'Update Fee'}>
                                        <Button htmlType='button' type='default' size='default' label='Setup Fee' onClick={() => this.handleVisible(true, 'showupdatefee')} disabled={(canupdated && updateunit) ? false : true} />
                                    </Form.Item>}
                                </Col>
                                {(window.innerWidth > 960) ? <Col className='gutter-row' lg={9} xl={8} style={{ padding: -10, marginBottom: 20 }}>
                                    <AlertAntd message={<strong>Information</strong>} type='info' description='Please submit before leave this page to save current change' />
                                </Col> : null}
                            </Row>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 1 }} xl={{ span: 16, offset: 2 }} style={{ marginTop: 30 }}>
                                    {
                                        (updateunit === 'PERCENTAGE') ? null : <FixUpdateTable {...this.props} datasource={feelist} actionspage={actionspage} handleEditFee={this.handleEditFee} handleDeleteFee={this.handleDeleteFee} />
                                    }
                                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                        <Button htmlType='submit' type='primary' label='Submit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE'></Button>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Row >
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    };
}

export default Update;