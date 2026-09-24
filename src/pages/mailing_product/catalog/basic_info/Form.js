import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { DetailRequest, SaveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputNumber, InputText, TextArea, SelectBase, InventorySelect, CustomTransactionSelect, DateRangeBase, LetterSelect, SwitchButton } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';
import { ProductType } from '../../../../data'
import moment from 'moment';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            producttype: null,
            mailingproductname: 'Mailing Product',
            active: null,
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    };

    checkPermission() {
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        const id = this.props.match.params.ID;

        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            };

            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id);
        } else {
            if (!usermenu[menucode][prefixmenuname + '_CREATE']) this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
        }

        this.componentCustomTransactionSelect.retrieveData();
        this.componentLetterSelect.retrieveData();
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = (mailingproductcode) => {
        this.setState({ isLoading: true });
        DetailRequest(api.url.mailingproduct.detail, { mailingproductcode }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                const { mailingproductname, producttype, lettercode, maxreorder, notes, customtrxcode, startdate, enddate, inventorycode, active, useletter } = result || {};

                this.handleChange(inventorycode, 'inventory');
                this.props.form.setFieldsValue({
                    mailingproductname, producttype, maxreorder, inventorycode, notes, customtrxcode,
                    lettercode: (useletter && lettercode) ? lettercode : null,
                    period: [moment(startdate), moment(enddate)],
                    useletter: (useletter) ? useletter : false,
                    usemaxreorder: (maxreorder) ? true : false
                });

                this.setState({ producttype, mailingproductname, active });
            } else Alert.error(status.responsemessage);
            this.setState({ isLoading: false });
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const mailingproductcode = this.props.match.params.ID;
                const { prices, vendors, actionspage, active } = this.state;
                const { mailingproductname, producttype, lettercode, maxreorder, notes, customtrxcode, period, inventorycode, usemaxreorder, useletter } = input || null;

                let url = (actionspage === 'create') ? api.url.mailingproduct.create : api.url.mailingproduct.update;
                let data = {
                    mailingproductname, producttype, notes, customtrxcode, prices, inventorycode, usemaxreorder,
                    maxreorder: Number(maxreorder),
                    triggermethod: 'MANUAL',
                    productvendor: vendors,
                    isfree: false,
                    useletter: (useletter) ? useletter : false,
                    lettercode: (lettercode && useletter) ? lettercode : null,
                    active: (actionspage === 'create') ? false : active,
                    startdate: moment(period[0]).format('YYYY-MM-DD'),
                    enddate: moment(period[1]).format('YYYY-MM-DD'),
                };

                if (actionspage === 'update') data['mailingproductcode'] = mailingproductcode;

                SaveRequest(url, data).then((response) => {
                    const { status = {} } = response || {};

                    if (status.responsecode === '0000') {
                        Alert.success(status.responsemessage);
                        this.props.history.push('/mailing-product');
                    } else Alert.error(status.responsemessage);

                    this.setState({ isLoading: false });
                });
            }
        });
    };

    handleChange = (e, type) => {
        this.componentInventorySelect.retrieveData({ categorycode: e });
        this.setState({ [type]: e });
    };

    handleChangeSwitch = (val, type) => {
        if (!val) this.props.form.resetFields([`${type}`, []]);
    };

    handleChangeStatus = () => {
        const { active } = this.state;
        const mailingproductcode = this.props.match.params.ID;
        const url = (active) ? api.url.mailingproduct.deactivate : api.url.mailingproduct.activate;

        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.getDetail(mailingproductcode);
        };

        DeleteRequest(url, { mailingproductcode }, callback, active);
    };

    render() {
        const { titlepage, actionspage, formrender, fielddisabled, mailingproductname, active, isLoading } = this.state;
        const { generalfielddisabled, specialfielddisabled } = fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, md: { span: (actionspage === 'create') ? 9 : 7 }, lg: { span: (actionspage === 'create') ? 9 : 10 }, xl: { span: (actionspage === 'create') ? 9 : 10, pull: (actionspage === 'create') ? 0 : 2 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: (actionspage === 'create') ? 12 : 17 }, lg: { span: (actionspage === 'create') ? 12 : 14 }, xl: { span: (actionspage === 'create') ? 11 : 14, pull: (actionspage === 'create') ? 0 : 2 } }
        };

        const inventoryfielddisabled = this.props.form.getFieldValue('producttype') ? specialfielddisabled : true;
        const useletter = this.props.form.getFieldValue('useletter');
        const usemaxreorder = this.props.form.getFieldValue('usemaxreorder');

        const labelButton = (active) ? 'Deactivate' : 'Activate';
        const typeButton = (active) ? 'danger' : '';
        const classNameButton = (active) ? '' : 'btn-custom-green';

        if (formrender) {
            document.title = `${this.state.titlepage} Mailing Product | Loyalty Management System`;

            return (
                <Row>
                    {(actionspage === 'create') ? <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}><Button htmlType={'html'} url={`/mailing-product`} shape='circle' icon='left' style={{ marginRight: 15 }} />{titlepage} {mailingproductname}</Title>
                        </Col>
                        <Divider />
                    </Row> : null}

                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 1 }} xl={{ span: 18, offset: 2 }}>
                                    <InputText form={this.props.form} labeltext='Name' datafield='mailingproductname' maxLength={225} validationrules={[`required`, `max.255`, `pattern.alphanumericspace`]} disabled={generalfielddisabled} />
                                    <SelectBase form={this.props.form} labeltext='Product Type' datafield='producttype' options={ProductType} validationrules={[`required`]} onChange={(e) => this.handleChange(e, 'producttype')} usingTitle={true} disabled={specialfielddisabled} />
                                    <InventorySelect form={this.props.form} labeltext='Inventory' datafield='inventorycode' ref={(e) => { this.componentInventorySelect = e }} validationrules={[`required`]} onChange={(e) => this.handleChange(e, 'inventory')} disabled={inventoryfielddisabled} />
                                    <Row gutter={3}>
                                        <Col xs={24} sm={14} md={(actionspage === 'create') ? 13 : 10} lg={(actionspage === 'create') ? 13 : 14} xl={{ span: (actionspage === 'create') ? 13 : 14, pull: (actionspage === 'create') ? 0 : 2 }}>
                                            <SwitchButton labelCol={{ span: 18, pull: 1 }} wrapperCol={{ span: 6 }} form={this.props.form} labeltext='Use Letter' datafield='useletter' onChange={(val) => this.handleChangeSwitch(val, 'lettercode')} disabled={generalfielddisabled} />
                                        </Col>
                                        <Col xs={24} sm={10} md={(actionspage === 'create') ? 8 : 14} lg={(actionspage === 'create') ? 8 : 10} xl={{ span: (actionspage === 'create') ? 8 : 10, pull: (actionspage === 'create') ? 1 : 2 }}>
                                            <LetterSelect wrapperCol={{ span: 24 }} form={this.props.form} placeholder='Letter' datafield='lettercode' ref={(e) => { this.componentLetterSelect = e }} disabled={(useletter) ? generalfielddisabled : true} validationrules={(useletter) ? [`required`] : []} usingTitle={true} />
                                        </Col>
                                    </Row>
                                    <Row gutter={3}>
                                        <Col xs={24} sm={14} md={(actionspage === 'create') ? 13 : 10} lg={(actionspage === 'create') ? 13 : 14} xl={{ span: (actionspage === 'create') ? 13 : 14, pull: (actionspage === 'create') ? 0 : 2 }}>
                                            <SwitchButton labelCol={{ span: 18, pull: 1 }} wrapperCol={{ span: 6 }} form={this.props.form} labeltext='Use Max Reorder' datafield='usemaxreorder' onChange={(val) => this.handleChangeSwitch(val, 'maxreorder')} disabled={generalfielddisabled} />
                                        </Col>
                                        <Col xs={24} sm={10} md={(actionspage === 'create') ? 8 : 14} lg={(actionspage === 'create') ? 8 : 10} xl={{ span: (actionspage === 'create') ? 8 : 10, pull: (actionspage === 'create') ? 1 : 2 }}>
                                            <InputNumber wrapperCol={{ span: 24 }} form={this.props.form} datafield='maxreorder' min={1} max={99999} style={{ width: '100%' }} disabled={(usemaxreorder) ? generalfielddisabled : true} validationrules={(usemaxreorder) ? [`required`] : []} />
                                        </Col>
                                    </Row>
                                    <CustomTransactionSelect form={this.props.form} labeltext='Custom Transaction' datafield='customtrxcode' ref={(e) => { this.componentCustomTransactionSelect = e }} validationrules={['required']} usingTitle={true} disabled={generalfielddisabled} />
                                    <DateRangeBase form={this.props.form} labeltext='Period' datafield='period' placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(new Date())} disabled={generalfielddisabled} />
                                    <TextArea labeltext='Notes' datafield='notes' form={this.props.form} maxLength={225} validationrules={[`max.255`, `pattern.alphanumericspace`]} disabled={generalfielddisabled} />
                                </Col>
                            </Row>

                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                {(actionspage === 'view') ? null : <Row>
                                    <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'update' && active) ? 'UPDATE' : 'CREATE'} />
                                    {
                                        (active === null) ? null : <Button htmlType='button' type={typeButton} className={classNameButton} label={labelButton} onClick={this.handleChangeStatus} />
                                    }
                                </Row>}
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />)
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));