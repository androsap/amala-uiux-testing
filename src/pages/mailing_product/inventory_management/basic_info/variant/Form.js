import React, { Component } from 'react';
import { api } from '../../../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest } from '../../../../../utilities/RequestService';
import { Alert, Button, InputText, TierSelect, TextArea } from '../../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventoryvariantid: (this.props && this.props.inventoryvariantid) ? this.props.inventoryvariantid : null,
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            changetypeqty: (this.props && this.props.changetypeqty) ? this.props.changetypeqty : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
                tierfielddisabled: false
            }
        }
    };

    checkPermission() {
        const { inventoryvariantid, permission, prefixmenuname, menucode, categorycode } = this.props;
        const { usermenu } = permission;
        let { actionsmasterpage, titlepage, changetypeqty } = this.state;

        if (inventoryvariantid) {
            titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let tierfielddisabled = false;
            let generalfielddisabled = false;

            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + '_UPDATE'])) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            } else if (actionsmasterpage === 'create') {
                specialfielddisabled = false;
            }

            if (changetypeqty) {
                tierfielddisabled = true;
                specialfielddisabled = false;
                titlepage = `${(changetypeqty === 'ADD_QTY') ? 'Add ' : 'Subtract '} Quantity`;
            }

            let fielddisabled = { specialfielddisabled, tierfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail();
        } else {
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) {
                this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
            } else {
                if (categorycode === 'CARD') this.componentTierSelect.retrieveData();
            }
        }
        this.props.setTitlePage(titlepage, 'titleformpage');
    };

    componentDidMount() {
        this.checkPermission();
    };

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { datasource, inventoryvariantid, changetypeqty, categorycode } = this.props;
        const variantlist = datasource.filter(obj => obj.inventoryvariantid === inventoryvariantid);
        const inventoryvariantname = (variantlist && variantlist[0] && variantlist[0]['inventoryvariantname']) ? variantlist[0]['inventoryvariantname'] : undefined;
        const tierid = (variantlist && variantlist[0] && variantlist[0]['tierid']) ? variantlist[0]['tierid'] : undefined;

        let fieldsvalue = { inventoryvariantname, tierid };
        if (!changetypeqty) {
            const quantity = (variantlist && variantlist[0] && variantlist[0]['quantity']) ? Number(variantlist[0]['quantity']) : 0;
            const notes = (variantlist && variantlist[0] && variantlist[0]['notes']) ? variantlist[0]['notes'] : undefined;

            fieldsvalue = { ...fieldsvalue, quantity, notes };
        }

        if (categorycode === 'CARD') this.componentTierSelect.retrieveData();
        await this.props.form.setFieldsValue(fieldsvalue);
        this.setState({ isLoading: false });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { actionsmasterpage, actionspage, changetypeqty } = this.state;
                const { inventoryvariantname, tierid, quantity, notes } = input || null;

                const data = { inventoryvariantname, tierid, quantity, notes };

                if (actionsmasterpage === 'create') {
                    if (actionspage === 'create') {
                        data.inventoryvariantid = moment().format('YYYYMMDDHHmmss');
                    } else if (actionspage === 'update') {
                        data.inventoryvariantid = this.props.inventoryvariantid;
                    }

                    this.props.handleSaveVariant(actionspage, data);
                    this.setState({ isLoading: false });
                } else if (actionsmasterpage === 'update') {

                    data.inventorycode = this.props.inventorycode;

                    let message = '';
                    let url = '';
                    if (actionspage === 'create') {
                        message = 'New data has been created';
                        url = api.url.inventorysys.createvariant;
                    } else if (changetypeqty) {
                        data.inventoryvariantid = this.props.inventoryvariantid;
                        data.inventorycode = this.props.inventorycode;
                        data.date = moment().format('YYYY-MM-DD');
                        message = 'Data has been updated';
                        url = (changetypeqty === 'ADD_QTY') ? api.url.inventorysys.addstock : api.url.inventorysys.substract ;
                    } else {
                        data.inventoryvariantid = this.props.inventoryvariantid;
                        message = 'Data has been updated';
                        url = api.url.inventorysys.updatevariant;
                    }

                    SaveRequest(url, data).then((response) => {
                        const { responsecode, responsemessage } = response.status;
                        if (responsecode.substring(0, 1) === '0') {
                            message = (responsemessage) ? responsemessage : message;
                            Alert.success(message);

                            this.props.handleClose();
                            this.props.handleRefresh();
                        } else Alert.error(responsemessage);
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    };

    handleForValidation = (rule, value, callback) => {
        if (Number(value) === 0 && value) callback(`Quantity must be greater than 0`);
        callback();
    };


    render() {
        const { prefixmenuname, menucode, categorycode } = this.props;
        const { actionsmasterpage, actionspage, fielddisabled, changetypeqty } = this.state;
        const { generalfielddisabled, tierfielddisabled, specialfielddisabled } = fielddisabled;
        const actioncode = (actionsmasterpage === 'create') ? 'CREATE' : 'UPDATE';
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <InputText form={this.props.form} labeltext='Variant Name' datafield='inventoryvariantname' validationrules={['required']} maxLength={45} disabled={(changetypeqty) ? true : generalfielddisabled} />
                                {(categorycode === 'CARD') ? <TierSelect ref={(e) => { this.componentTierSelect = e }} form={this.props.form} labeltext='Tier' datafield='tierid' validationrules={['required']} disabled={tierfielddisabled} /> : ''}
                                <InputText form={this.props.form} labeltext='Quantity' datafield='quantity' validationrules={['required', 'pattern.number', this.handleForValidation]} disabled={specialfielddisabled} />
                                <TextArea form={this.props.form} labeltext='Notes' datafield='notes' validationrules={['max.255']} disabled={generalfielddisabled} maxLength='255' />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            {
                                ((actionspage === 'create' || actionspage === 'update') && actionsmasterpage !== 'view') ? <Button htmlType='submit' type='primary' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
