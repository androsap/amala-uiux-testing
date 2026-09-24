import React, { Component } from 'react';
import { SaveRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Form, Row, Col, Spin } from 'antd';
import { Button, Alert, TextArea, SelectBase, InputText, SwitchButton, CountrySelect, StateSelect, CitySelect, BranchSelect, TicketOfficeSelect } from '../../../components/Base/BaseComponent';
import moment from 'moment';
import { SendTo } from '../../../data'

const optionsReorder = [
    { value: 'PRINTING', label: 'READY TO PRINT' },
    { value: 'PACKING', label: 'READY TO PACK' },
    { value: 'DELIVERING', label: 'READY TO PICK-UP' }
];

const optionsReorder2 = [
    { value: 'PACKING', label: 'READY TO PACK' },
    { value: 'DELIVERING', label: 'READY TO PICK-UP' }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            fielddisabled: {
                generalfielddisabled: false,
                statecodefielddisabled: true,
                citycodefielddisabled: true,
                addressfielddisabled: true,
                ticketdisabled: true
            }
        }
    };

    componentDidMount() {
        this.props.form.setFieldsValue({ reordernumber: this.props.data.reordernumber + 1 });
        this.props.form.setFieldsValue({ reorderdate: moment(new Date()).format('YYYY-MM-DD') });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let orderreturnid = this.props.match.params.ID;
                let returnto = 'GA';
                let notes = (input.notes) ? input.notes : null;
                let reordernumber = (input.reordernumber) ? input.reordernumber : null;
                let reorderto = (input.reorderto) ? input.reorderto : null;
                let reorderdate = (input.reorderdate) ? input.reorderdate : null;
                let status = 'REORDER';
                let branchcode = this.props.data.branchcode;
                let issamedestination = (input.issamedestination) ? true : false;

                //neworderdestination
                let sendto = (input.sendto) ? input.sendto : null;
                let address = (input.address) ? input.address : null;
                let country = (input.country) ? input.country : null;
                let state = (input.state) ? input.state : null;
                let city = (input.city) ? input.city : null;
                let postalcode = (input.postalcode) ? input.postalcode : null;
                let ticketingoffice = (input.ticketingofficecode) ? input.ticketingofficecode : null;
                let branchcode2 = (input.branchcode) ? input.branchcode : null;

                let data = {
                    orderreturnid, returnto, notes, reordernumber, reorderto, reorderdate, status, branchcode, issamedestination,
                    neworderdestination: { sendto, address, country, state, city, postalcode, ticketingoffice, branchcode: branchcode2 }
                };
                let message = 'New data has been updated';
                let url = api.url.return.update;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/order-management/return');
                    } else Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                });
            }
        });
    };

    onChangeBranchcode = (branchcode) => {
        let criteria = { branchcode };
        this.componentTicketOfficeSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ ticketoffice: undefined });
        this.props.form.resetFields(['ticketingofficecode', []]);
        this.props.form.resetFields(['address', []]);
        this.checkingTicketOffice(branchcode);
    };

    checkingTicketOffice = (branchcode) => {
        let url = api.url.branch.list;
        let criteria = { branchcode };
        RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { ticketoffices } = response.result[0] || {};
            if (responsecode === '0000') {
                if (response.result.length !== 0 && ticketoffices.length !== 0 && ticketoffices.filter(obj => obj.active === true)[0]) {
                    this.props.form.setFieldsValue({ ticketoffices });
                    let ticketdisabled = false;
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, ticketdisabled } });
                } else {
                    Alert.information('No Ticket Office found, please choose other Branch Code');
                    this.props.form.resetFields(['ticketingofficecode', []]);
                };
            } else {
                Alert.error(responsemessage);
                this.props.form.resetFields(['ticketingofficecode', []]);
            };
        });
    }

    onChangeTicketOffice = (tickoffid) => {
        let url = api.url.ticketoffice.list;
        let criteria = { tickoffid };
        RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { address } = response.result[0] || {};
            if (responsecode === '0000') {
                if (response.result.length !== 0 && address) {
                    this.props.form.setFieldsValue({ address });
                } else {
                    Alert.information('No address found, please fill in manually');
                    let addressfielddisabled = false;
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, addressfielddisabled } });
                    this.props.form.resetFields(['address', []]);
                };
            } else {
                Alert.error(responsemessage);
                this.props.form.resetFields(['address', []]);
            };
        });
    };

    onChangeCountry = (countrycode) => {
        let criteria = { countrycode };
        this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ statecode: undefined, citycode: undefined });
        let statecodefielddisabled = (countrycode) ? false : true;
        let citycodefielddisabled = true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled, citycodefielddisabled } });
    }

    onChangeState = (statecode) => {
        let criteria = { statecode };
        this.componentCitySelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ citycode: undefined });
        let citycodefielddisabled = (statecode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, citycodefielddisabled } });
    }

    onChange = async (value, type, field) => {
        let { fieldvalue } = this.state;

        await this.setState({ isLoading: true, fieldvalue: { ...fieldvalue, [type]: value } });
        if (type === 'sendto' && value) {
            this.props.form.resetFields(['address', 'city', 'country', 'state', 'postalcode', []]);
            if (value === 'OTHERS') {
                await this.componentCountrySelect.retrieveData();
                await this.handleResetAddress(field);
                await this.setState({ isLoading: false });
            } else if (value === 'HOME') {
                await this.componentCountrySelect.retrieveData();
                await this.getAddress(field);
            } else {
                await this.componentBranchSelect.retrieveData();
                await this.componentTicketOfficeSelect.retrieveData();
                await this.handleResetAddress(field);
                await this.setState({ isLoading: false });
            };
        } else if (type === 'fieldBO' && value) {
            if (field === 'branch') {
                fieldvalue = { ...fieldvalue, branchname: this.componentBranchSelect.getValue(value, 'label') };
            } else if (field === 'ticketoffice') fieldvalue = { ...fieldvalue, ticketofficename: this.componentTicketOfficeSelect.getValue(value, 'label') }
            await this.setState({ fieldvalue, isLoading: false })
        } else if (type === 'fieldHomeOthers' && value) {
            if (field === 'country') {
                fieldvalue = { ...fieldvalue, countryname: this.componentCountrySelect.getValue(value, 'label') };
            } else if (field === 'state') {
                fieldvalue = { ...fieldvalue, statename: this.componentStateSelect.getValue(value, 'label') };
            } else if (field === 'city') fieldvalue = { ...fieldvalue, cityname: this.componentCitySelect.getValue(value, 'label') };
            await this.setState({ fieldvalue, isLoading: false })
        } else await this.setState({ isLoading: false })
    };

    handleResetAddress = (field) => {
        if (!field) this.setState({ fieldvalue: { ...this.state.fieldvalue, address: null, statename: null, cityname: null, countryname: null, postalcode: null, branchname: null, ticketofficename: null } });
    };

    getAddress = async (field) => {
        let url = api.url.memberaddress.list;
        let criteria = {
            memberid: this.props.memberid,
            active: true,
            ispreffered: true
        };
        await RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;

            if (responsecode === '0000') {
                if (response.result.length !== 0) {
                    const { address, citycode, countrycode, statecode, postalcode, addresstype, companyname } = response.result[0] || undefined;

                    this.componentStateSelect.retrieveData({ countrycode });
                    this.componentCitySelect.retrieveData({ statecode });

                    setTimeout(() => {
                        const countryname = this.componentCountrySelect.getValue(countrycode, 'label');
                        const statename = this.componentStateSelect.getValue(statecode, 'label');
                        const cityname = this.componentCitySelect.getValue(citycode, 'label');

                        this.props.form.setFieldsValue({
                            citycode: (citycode) ? citycode : (field) ? this.state.fieldvalue.citycode : null,
                            countrycode: (countrycode) ? countrycode : (field) ? this.state.fieldvalue.countrycode : null,
                            statecode: (statecode) ? statecode : (field) ? this.state.fieldvalue.statecode : null,
                            postalcode: (postalcode) ? postalcode : (field) ? this.state.fieldvalue.postalcode : null,
                            address: (addresstype === 'BUSINESS') ? `${companyname}${(address) ? `- ${address}` : (field) ? this.state.fieldvalue.address : null}` :
                                (address) ? address : (field) ? this.state.fieldvalue.address : null
                        });
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                                fieldvalue: {
                                    ...this.state.fieldvalue,
                                    statename: (statename) ? statename : this.state.fieldvalue.statename,
                                    cityname: (cityname) ? cityname : this.state.fieldvalue.cityname,
                                    countryname: (countryname) ? countryname : this.state.fieldvalue.countryname,
                                    address: (address) ? address : this.state.fieldvalue.address,
                                    postalcode: (postalcode) ? postalcode : this.state.fieldvalue.postalcode
                                },
                                fielddisabled: {
                                    addressfielddisabled: (address) ? true : false,
                                    countryfielddisabled: (countrycode) ? true : false,
                                    statecodefielddisabled: (statecode) ? true : false,
                                    citycodefielddisabled: (citycode) ? true : false,
                                    postalcodefielddisabled: (postalcode) ? true : false
                                }
                            });
                        }, 10);
                    }, 500);
                } else {
                    Alert.information('No preferred address found, please fill in manually');
                    this.setState({ isLoading: false })
                    this.props.form.resetFields(['sendto', []]);
                }
            } else Alert.error(responsemessage);
        });
    };

    onChangeSame = () => {
        this.props.form.resetFields(['sendto', 'address', 'country', 'state', 'city', 'postalcode', 'branchcode', 'ticketingofficecode', []]);
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 17 } }
        };

        const { generalfielddisabled, statecodefielddisabled, citycodefielddisabled, addressfielddisabled, ticketdisabled } = this.state.fielddisabled;
        const mailingproducttype = this.props.data.mailingproducttype;
        const issamedestination = this.props.form.getFieldValue('issamedestination');
        const sendto = this.props.form.getFieldValue('sendto');

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <InputText form={this.props.form} labeltext='Date' datafield='reorderdate' disabled={true} />
                                {
                                    mailingproducttype === 'MERCHANT' ?
                                        <SelectBase form={this.props.form} labeltext='Reorder To' datafield='reorderto' validationrules={['required']} options={optionsReorder2} disabled={generalfielddisabled} />
                                        :
                                        <SelectBase form={this.props.form} labeltext='Reorder To' datafield='reorderto' validationrules={['required']} options={optionsReorder} disabled={generalfielddisabled} />
                                }
                                <InputText form={this.props.form} labeltext='Reorder Number' datafield='reordernumber' disabled={true} />
                            </Col>
                            <Col style={{ marginLeft: '-6px' }} className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 20 }} xl={{ span: 20 }}>
                                <SwitchButton labelCol={{ span: 9 }} form={this.props.form} labeltext='Use Same Destination Address' datafield='issamedestination' defaultChecked={true} onChange={this.onChangeSame} />
                            </Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext='Send to' datafield='sendto' options={SendTo} validationrules={issamedestination ? [] : ['required']} disabled={issamedestination ? true : false} onChange={e => this.onChange(e, 'sendto')} />
                                {
                                    (sendto && sendto !== 'BO') ?
                                        <Row>
                                            <TextArea form={this.props.form} labeltext='Destination Address' datafield='address' validationrules={['required']} maxLength={255} disabled={issamedestination ? true : false} maxRows={3}/>
                                            <CountrySelect style={{ marginLeft: 172 }} wrapperCol={{ span: 24 }} ref={(e) => { this.componentCountrySelect = e }} placeholder='Country' datafield="country" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeCountry} disabled={issamedestination ? true : false} />
                                            <StateSelect style={{ marginLeft: 172 }} wrapperCol={{ span: 24 }} ref={(e) => { this.componentStateSelect = e }} placeholder='State' datafield="state" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeState} disabled={issamedestination ? true : sendto === 'OTHERS' ? statecodefielddisabled : false} />
                                            <CitySelect style={{ marginLeft: 172 }} wrapperCol={{ span: 24 }} ref={(e) => { this.componentCitySelect = e }} placeholder='City' datafield="city" form={this.props.form} validationrules={[`required`]} disabled={issamedestination ? true : sendto === 'OTHERS' ? citycodefielddisabled : false} />
                                            <InputText style={{ marginLeft: 86 }} wrapperCol={{ span: 20 }} form={this.props.form} placeholder='Postal Code' datafield='postalcode' />
                                        </Row>
                                        : (sendto === 'BO') ?
                                            <Row>
                                                <BranchSelect ref={(e) => { this.componentBranchSelect = e }} form={this.props.form} labeltext='Branch Office' datafield='branchcode' validationrules={['required']} disabled={false} onChange={this.onChangeBranchcode} custom={true}/>
                                                <TicketOfficeSelect ref={(e) => { this.componentTicketOfficeSelect = e }} form={this.props.form} labeltext='Ticket Office' datafield='ticketingofficecode' validationrules={['required']} disabled={ticketdisabled} onChange={this.onChangeTicketOffice} />
                                                <TextArea form={this.props.form} labeltext="Address" datafield="address" validationrules={['required']} maxLength={255} disabled={addressfielddisabled} maxRows={3}/>
                                            </Row>
                                            : null
                                }
                                <TextArea form={this.props.form} labeltext='Notes For Vendor/GA' datafield='notes' validationrules={['required']} maxLength={255} disabled={generalfielddisabled} maxRows={7} />
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='default' label='Submit' />
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));