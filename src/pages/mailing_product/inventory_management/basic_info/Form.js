import React, { Component } from 'react';
import { SaveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { InputText, Button, Alert, TextArea, SelectBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Modal } from 'antd';
import { InventoryCategory } from '../../../../data'
import { jsUcfirst } from '../../../../utilities/Helpers';
import ErrorGeneral from '../../../error/ErrorGeneral';

import VariantTable from './variant/Index';
import VariantForm from './variant/Form';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                variantlist: [],
                categorycode: 'card',
                visible: false,
                specifictype: null,
                titleformpage: 'Create',
                inventoryname: 'New Inventory',
                inventoryvariantid: null
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
            }
        }
    };

    componentDidMount() {
        this.setState({ isLoading: true })
        setTimeout(() => {
            const { state } = this.props;
            const { actionspage, fielddisabled, fieldvalue, formrender, isLoading, responseCode, responseMessage, titlepage } = state || {};
            const { data } = fieldvalue || {};
            const { variant, inventoryname, inventorycode, categorycode, totalquantity, notes } = data || {};
            const id = this.props.match.params.ID;

            if (id) {
                this.setState({
                    ...this.state, actionspage, formrender, isLoading, responseCode, responseMessage, titlepage, fielddisabled,
                    fieldvalue: { ...this.props.fieldvalue, variantlist: variant, inventoryname },
                });
                this.props.form.setFieldsValue({ inventoryname, inventorycode, categorycode, totalquantity, notes });
            };
            this.setState({ isLoading: false });
        }, 1000);
    };

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { inventoryname, inventorycode, categorycode, totalquantity, notes } = input || {};

                let url = (actionspage === 'create') ? api.url.inventorysys.create : api.url.inventorysys.update;
                let data = {
                    inventoryname, inventorycode, categorycode, totalquantity, notes,
                    variants: (actionspage === 'create') ? this.state.fieldvalue.variantlist : this.props.state.fieldvalue.data.variants
                };

                if ((actionspage === 'create') && (this.state.fieldvalue.variantlist.length === 0)) {
                    Alert.error('Variants are required, Please input variant');
                    this.setState({ isLoading: false });
                } else {
                    SaveRequest(url, data).then((response) => {
                        const { status } = response;
                        const { responsecode, responsemessage } = status;
                        if (responsecode === '0000') {
                            Alert.success((responsemessage) ? responsemessage : `Data has been ${(actionspage === 'create') ? 'created' : 'updated'}`);
                            this.props.history.goBack();
                        } else {
                            Alert.error(responsemessage);
                            this.setState({ isLoading: false });
                        }
                    })
                }
            }
        });
    };

    handleChange = (value, type) => {
        if (value && (type === 'visible')) {
            const categorycode = this.props.form.getFieldValue('categorycode');
            if (!categorycode) {
                Alert.error('Please choose categorycode first');
            } else this.setState({ fieldvalue: { ...this.state.fieldvalue, [type]: value, inventoryvariantid: null } });
        } else this.setState({ fieldvalue: { ...this.state.fieldvalue, [type]: value } });
    };

    handleActionVariant = (inventoryvariantid, type) => {
        if (type === 'edit') {
            let fieldvalue = { ...this.state.fieldvalue, inventoryvariantid, visible: true, };

            this.setState({ fieldvalue });
        } else {
            let { variantlist } = this.state.fieldvalue;
            variantlist = variantlist.filter(obj => obj.inventoryvariantid !== inventoryvariantid);
            let totalquantity = variantlist.map((item) => Number(item.quantity)).reduce((prev, curr) => prev + curr, 0);

            this.props.form.setFieldsValue({ totalquantity });
            this.setState({ fieldvalue: { ...this.state.fieldvalue, variantlist } });
        }
    };

    handleSaveVariant = (actionsvariantpage, value) => {
        const { actionspage } = this.state;
        if (actionspage === 'create') {
            if (actionsvariantpage === 'create') {
                let variantlist = { variantlist: [...this.state.fieldvalue.variantlist, value] };
                let fieldvalue = { ...this.state.fieldvalue, ...variantlist, visible: false };
                let totalquantity = variantlist.variantlist.map((item) => Number(item.quantity)).reduce((prev, curr) => prev + curr, 0);

                this.props.form.setFieldsValue({ totalquantity })
                this.setState({ fieldvalue });
            } else if (actionsvariantpage === 'update') {
                let { inventoryvariantid, variantlist } = this.state.fieldvalue;

                variantlist = variantlist.map((obj, key) => {
                    if (obj.inventoryvariantid === inventoryvariantid) { obj = value }
                    return obj;
                });

                let fieldvalue = { ...this.state.fieldvalue, variantlist, visible: false };
                let totalquantity = variantlist.map((item) => Number(item.quantity)).reduce((prev, curr) => prev + curr, 0);

                this.props.form.setFieldsValue({ totalquantity })
                this.setState({ fieldvalue });
            }
        }
    };

    handleRefresh = () => {
        this.props.handleRefresh(this.props.match.params.ID);
    };

    render() {
        const { menucode, prefixmenuname, form, state } = this.props;
        const { actionspage, formrender, isLoading, fieldvalue, fielddisabled } = this.state;
        const { inventoryname, visible, titleformpage, buymileageid, inventoryvariantid, variantlist, categorycode } = fieldvalue || {};
        const { titlepage } = state || {};
        const { generalfielddisabled, specialfielddisabled } = fielddisabled || {};

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        if (formrender) {
            document.title = titlepage + ' Inventory | Loyalty Management System';
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} {jsUcfirst(inventoryname, ' ')}</Title>
                        </Col>
                        <Divider />
                    </Row>

                    <Modal visible={visible} title={titleformpage + ' Variant'} onCancel={() => this.handleChange(false, 'visible')} footer={null} destroyOnClose={true} width={680}>
                        <VariantForm menucode={menucode} prefixmenuname={prefixmenuname} buymileageid={buymileageid} inventoryvariantid={inventoryvariantid} datasource={variantlist} actionspage={actionspage} handleSaveVariant={this.handleSaveVariant}
                            handleRefresh={this.handleRefresh} handleClose={() => this.handleChange(false, 'visible')} setTitlePage={this.handleChange} categorycode={categorycode} />
                    </Modal>

                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText form={form} labeltext='Inventory Code' datafield='inventorycode' validationrules={['required']} maxLength={45} disabled={specialfielddisabled} />
                                    <SelectBase form={form} labeltext='Category' datafield='categorycode' validationrules={['required']} onChange={(val) => this.handleChange(val, 'categorycode')} disabled={specialfielddisabled} options={InventoryCategory} />
                                    <InputText form={form} labeltext='Name' datafield='inventoryname' validationrules={['required']} maxLength={255} disabled={generalfielddisabled} />
                                    <InputText form={form} labeltext='Total Quantity' datafield='totalquantity' maxLength={255} disabled={true} />
                                    <TextArea form={this.props.form} labeltext='Notes' datafield='notes' validationrules={['max.255']} disabled={generalfielddisabled} maxLength='255' normal={false} />
                                    {(actionspage === 'create') ? <Form.Item label={<label class="ant-form-item-required" title="Setup Variant">Setup Variant</label>}>
                                        <Button htmlType='button' type='primary' size='default' label='Setup' onClick={() => this.handleChange(true, 'visible')} />
                                    </Form.Item> : null}
                                </Col>

                                {(actionspage === 'create') ? <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 3 }} xl={{ span: 18, offset: 3 }} style={{ marginTop: 10 }}>
                                    <VariantTable {...this.props} datasource={variantlist} actionspage={actionspage} categorycode={categorycode} handleRefresh={this.getDetail} handleEditPrice={(val) => this.handleActionVariant(val, 'edit')} handleDelete={(val) => this.handleActionVariant(val, 'delete')} />
                                </Col> : null}
                            </Row>
                            <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                                <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={(actionspage === 'create') ? 'CREATE' : 'UPDATE'}></Button>
                                &nbsp;
                                <Button htmlType='button' type='default' label='Back' onClick={() => { this.props.history.goBack() }} />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
