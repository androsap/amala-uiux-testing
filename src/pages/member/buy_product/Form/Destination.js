import React from 'react';
import { api } from '../../../../config/Services';
import { Button, VendorRegionSelect, SelectBase, TextArea, SwitchButton, CountrySelect, StateSelect, CitySelect, InputText, CatalogMailingDetails, VendorBuyProductDetail, Alert, BranchSelect, TicketOfficeSelect } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { NonPrintingPriorityHandling, PrintingPriorityHandling, SendTo } from '../../../../data'
import { RetrieveRequest } from '../../../../utilities/RequestService';
import AddressBuyProductDetail from '../../../../components/Information/AddressBuyProductDetail';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            vendorproduct: [],
            fieldvalue: {
                sendto: null,
                region: undefined,
                address: null,
                statename: null,
                cityname: null,
                countryname: null,
                postalcode: null,
                branchname: null,
                ticketofficename: null
            },
            fielddisabled: {
                addressfielddisabled: false,
                countryfielddisabled: false,
                statecodefielddisabled: false,
                citycodefielddisabled: false,
                postalcodefielddisabled: false,
                ticketofficefielddisabled: true
            }
        }
    };

    componentDidMount = () => {
        const { historyPage, data } = this.props;

        if (historyPage) {
            const { address, citycode, countrycode, postalcode, region, sendto, statecode, usecouriervendor, usepackagingvendor, usepreferenceaddress,
                useprintingvendor, branchcode, branchname, ticketoffice, printingpriorityhandling, printingnotes, packagingpriorityhandling,
                courierpriorityhandling, couriernotes, awb, ticketofficename, packagingnotes, cityname, countryname, statename } = data || {};

            this.setState({
                isLoading: true,
                fieldvalue: {
                    ...this.state.fieldvalue,
                    sendto, usepreferenceaddress, region, branchname, ticketofficename,
                    countryname, statename, address, postalcode, citycode, statecode, countrycode, cityname,
                }
            });
            setTimeout(() => {
                this.onChange(sendto, 'sendto', historyPage);
                if (sendto === 'OTHERS') {
                    this.componentStateSelect.retrieveData({ statecode });
                    this.componentCitySelect.retrieveData({ citycode });
                };
                setTimeout(() => {
                    this.props.form.setFieldsValue({
                        address, citycode, countrycode, postalcode, region, sendto, statecode, usecouriervendor, usepackagingvendor, usepreferenceaddress, useprintingvendor, branchcode,
                        ticketoffice, printingpriorityhandling, printingnotes, packagingpriorityhandling, packagingnotes, courierpriorityhandling, couriernotes, awb
                    })
                }, 300);
            }, 200);
        };

        this.getDetail();
        this.componentVendorRegionSelect.retrieveData();
    };

    getDetail = () => {
        const { mailingproductcode, orderdate } = this.props.product;

        const url = api.url.mailingproduct.vendor.retrieve;
        const criteria = { mailingproductcode };
        const sort = { createdDate: 'desc' };
        const data = { date: moment(orderdate).format('YYYY-MM-DD') };

        RetrieveRequest(url, criteria, {}, [], sort, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                this.setState({ vendorproduct: result });
            } else Alert.error(response.status.responsemessage)
        });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                const { vendorproduct, fieldvalue } = this.state;
                const { cityname, countryname, statename, branchname, ticketofficename } = fieldvalue;
                const { sendto, address, countrycode, statecode, citycode, postalcode, region, useprintingvendor, usepackagingvendor, usecouriervendor, awb,
                    branchcode, ticketoffice, printingpriorityhandling, printingnotes, packagingpriorityhandling, packagingnotes, courierpriorityhandling, couriernotes } = input || {};
                const data = {
                    sendto, address, countrycode, statecode, citycode, postalcode, region, useprintingvendor, usepackagingvendor, usecouriervendor, awb, ticketofficename, branchname, statename,
                    branchcode, ticketoffice, printingpriorityhandling, printingnotes, packagingpriorityhandling, packagingnotes, courierpriorityhandling, couriernotes, cityname, countryname, vendorproduct
                };

                this.props.handleNext(false, 'destinationform', data);
            };
        })
    };

    onChange = async (value, type, field) => {
        let { fieldvalue } = this.state;

        await this.setState({ isLoading: true, fieldvalue: { ...fieldvalue, [type]: value } });
        if (type === 'sendto' && value) {
            this.props.form.resetFields(['address', 'citycode', 'countrycode', 'statecode', 'postalcode', []]);
            if (value === 'OTHERS') {
                await this.componentCountrySelect.retrieveData();
                await this.handleResetAddress(field);
                await this.setState({ isLoading: false });
            } else if (value === 'HOME') {
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
                await this.props.form.setFieldsValue({ ticketoffice: null });
                await this.componentTicketOfficeSelect.retrieveData({ branchcode: value });
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
            memberid: this.props.match.params.ID,
            active: true,
            ispreffered: true
        };
        await RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;

            if (responsecode === '0000') {
                if (response.result.length !== 0) {
                    const { address, citycode, countrycode, statecode, postalcode, companyname, cityname, countryname, statename } = response.result[0] || undefined;

                    setTimeout(() => {

                        this.props.form.setFieldsValue({
                            citycode: (citycode) ? citycode : (field) ? this.state.fieldvalue.citycode : null,
                            countrycode: (countrycode) ? countrycode : (field) ? this.state.fieldvalue.countrycode : null,
                            statecode: (statecode) ? statecode : (field) ? this.state.fieldvalue.statecode : null,
                            postalcode: (postalcode) ? postalcode : (field) ? this.state.fieldvalue.postalcode : null,
                            address: (address) ? `${companyname || ''} \n${address || ''} \n${cityname || ''} \n${statename || ''} \n${countryname || ''} \n${postalcode || ''}` : ''
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
                                    postalcode: (postalcode) ? postalcode : this.state.fieldvalue.postalcode,
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
                    this.setState({isLoading: false})
                    Alert.information('No preferred address found, please select send to Others');
                }
            } else Alert.error(responsemessage);
        });
    };

    onChangeAddress = (value, type) => {
        if (type === 'countrycode') {
            this.componentStateSelect.retrieveData({ [type]: value });
            this.onChange(value, 'fieldHomeOthers', 'country');
        } else {
            this.componentCitySelect.retrieveData({ [type]: value });
            this.onChange(value, 'fieldHomeOthers', 'state');
        }
        this.props.form.setFieldsValue({ statecode: undefined, citycode: undefined });
    };

    onChangeTicketOffice = (tickoffid) => {
        let url = api.url.ticketoffice.list;
        let criteria = { tickoffid };
        RetrieveRequest(url, criteria).then((response) => {
            const { responsecode, responsemessage } = response.status;
            const { address } = response.result[0] || {};
            if (responsecode === '0000') {
                if (response.result.length !== 0 && address) {
                    this.props.form.setFieldsValue({ address });
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, ticketofficefielddisabled: true } })
                } else {
                    Alert.information('No address found, please fill in manually');
                    this.props.form.resetFields(['address', []]);
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, ticketofficefielddisabled: false } })
                };
            } else {
                Alert.error(responsemessage);
                this.props.form.resetFields(['address', []]);
                this.setState({ fielddisabled: { ...this.state.fielddisabled, ticketofficefielddisabled: true } })
            };
        });
        this.onChange(tickoffid, 'fieldBO', 'ticketoffice');
    };

    render() {
        const { actionspage, generalfielddisabled, product } = this.props;
        const { mailingproduct, variantdata, inventoryvariantid } = product || {};
        const { producttype } = mailingproduct || {};
        const { fieldvalue, fielddisabled, isLoading, vendorproduct } = this.state;
        const { sendto, region, branchname, ticketofficename, countryname, postalcode, statename, cityname } = fieldvalue || {};
        const { ticketofficefielddisabled } = fielddisabled || {};
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        const branchcode = (this.props.form.getFieldValue('branchcode'));
        const useprintingvendor = (this.props.form.getFieldValue('useprintingvendor'));
        const usepackagingvendor = (this.props.form.getFieldValue('usepackagingvendor'));
        const usecouriervendor = (this.props.form.getFieldValue('usecouriervendor'));
        const postalcodeOther = (this.props.form.getFieldValue('postalcode'));
        const address = (this.props.form.getFieldValue('address'));

        const vendorInformation = { useprintingvendor, usepackagingvendor, usecouriervendor, mailingproduct, region, vendorproduct };
        const addressInformation = { sendto, countryname, statename, cityname, postalcode, postalcodeOther, branchname, ticketofficename, address, mailingproduct, region };

        const vendorfielddisabled = false;
        const addressfielddisabled = (sendto === 'HOME') ? this.state.fielddisabled.addressfielddisabled : generalfielddisabled;
        const countryfielddisabled = (actionspage === 'create') ? ((sendto === 'HOME') ? this.state.fielddisabled.countryfielddisabled : false) : generalfielddisabled;
        const statecodefielddisabled = (actionspage === 'create') ? ((sendto === 'HOME') ? this.state.fielddisabled.statecodefielddisabled : this.props.form.getFieldValue('countrycode') ? false : true) : generalfielddisabled;
        const citycodefielddisabled = (actionspage === 'create') ? ((sendto === 'HOME') ? this.state.fielddisabled.citycodefielddisabled : this.props.form.getFieldValue('statecode') ? false : true) : generalfielddisabled;
        const postalcodefielddisabled = (actionspage === 'create') ? ((sendto === 'HOME') ? this.state.fielddisabled.postalcodefielddisabled : this.props.form.getFieldValue('citycode') ? false : true) : generalfielddisabled;
        const courirregionfielddisabled = (usecouriervendor) ? false : true;

        return (
            <React.Fragment>
                <Form {...formItemLayout}>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} lg={{ span: 15 }}>
                                <SelectBase form={this.props.form} labeltext='Send to' datafield='sendto' options={SendTo} validationrules={['required']} disabled={false} onChange={e => this.onChange(e, 'sendto')} />
                                {
                                    (sendto === 'OTHERS') ? <Row>
                                        <InputText form={this.props.form} labeltext='Address' datafield='address' disabled={addressfielddisabled} />
                                        <Col className='gutter-row' xs={24} sm={{ span: 24, push: 8 }} >
                                            <CountrySelect ref={(e) => { this.componentCountrySelect = e }} placeholder='Country' datafield='countrycode' form={this.props.form} disabled={countryfielddisabled} validationrules={['required']} onChange={(e) => this.onChangeAddress(e, 'countrycode')} />
                                            <StateSelect ref={(e) => { this.componentStateSelect = e }} placeholder='State' datafield='statecode' form={this.props.form} disabled={statecodefielddisabled} validationrules={['required']} onChange={(e) => this.onChangeAddress(e, 'statecode')} />
                                            <CitySelect ref={(e) => { this.componentCitySelect = e }} placeholder='City' datafield='citycode' form={this.props.form} disabled={citycodefielddisabled} onChange={(val) => this.onChange(val, 'fieldHomeOthers', 'city')} />
                                            <InputText form={this.props.form} placeholder='Postal Code' datafield='postalcode' disabled={postalcodefielddisabled} />
                                        </Col></Row> : (sendto === 'BO') ? <Row>
                                            <BranchSelect ref={(e) => { this.componentBranchSelect = e }} form={this.props.form} labeltext='Branch Office' datafield='branchcode' validationrules={['required']} disabled={false} onChange={(val) => this.onChange(val, 'fieldBO', 'branch', branchcode)} />
                                            <TicketOfficeSelect ref={(e) => { this.componentTicketOfficeSelect = e }} form={this.props.form} labeltext='Ticket Office' datafield='ticketoffice' validationrules={['required']} disabled={(branchcode) ? false : true} onChange={(val) => this.onChangeTicketOffice(val)} />
                                            <TextArea form={this.props.form} labeltext='Address' datafield='address' disabled={ticketofficefielddisabled} maxLength={255} />
                                        </Row> : (sendto === 'HOME') ? <Row>
                                            <TextArea form={this.props.form} labeltext='Address' datafield='address' disabled={true} maxRows={7} />
                                        </Row> : null
                                }
                                {
                                    (producttype === 'CARD') ? <Row>
                                        <Row>
                                            <Col xs={24} sm={{ span: 13, push: 1 }}>
                                                <SwitchButton labelCol={{ span: 13 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext='Use Printing Vendor' datafield='useprintingvendor' defaultChecked={false} disabled={vendorfielddisabled} />
                                            </Col>
                                            <Col xs={24} sm={11}>
                                                <SelectBase wrapperCol={{ span: 24 }} form={this.props.form} placeholder='Priority Handling' datafield='printingpriorityhandling' options={PrintingPriorityHandling} validationrules={(useprintingvendor) ? ['required'] : []} disabled={vendorfielddisabled} />
                                            </Col>
                                        </Row>
                                        <TextArea form={this.props.form} labeltext='Printing Notes' datafield='printingnotes' disabled={generalfielddisabled} maxLength={255} />
                                    </Row> : null
                                }
                                <Row>
                                    <Col xs={24} sm={{ span: 13, push: 1 }}>
                                        <SwitchButton labelCol={{ span: 13 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext='Use Packaging Vendor' datafield='usepackagingvendor' defaultChecked={false} disabled={vendorfielddisabled} />
                                    </Col>
                                    <Col xs={24} sm={11}>
                                        <SelectBase wrapperCol={{ span: 24 }} form={this.props.form} placeholder='Priority Handling' datafield='packagingpriorityhandling' options={PrintingPriorityHandling} validationrules={(usepackagingvendor) ? ['required'] : []} disabled={vendorfielddisabled} />
                                    </Col>
                                </Row>
                                <TextArea form={this.props.form} labeltext='Packaging Notes' datafield='packagingnotes' disabled={generalfielddisabled} maxLength={255} />
                                <Row>
                                    <Col xs={24} sm={{ span: 13, push: 1 }}>
                                        <SwitchButton labelCol={{ span: 13 }} wrapperCol={{ span: 11 }} form={this.props.form} labeltext='Use Courier Vendor' datafield='usecouriervendor' defaultChecked={false} disabled={vendorfielddisabled} />
                                    </Col>
                                    <Col xs={24} sm={11}>
                                        <VendorRegionSelect wrapperCol={{ span: 24 }} ref={(e) => { this.componentVendorRegionSelect = e }} form={this.props.form} placeholder='Courier Vendor Region' datafield='region' disabled={courirregionfielddisabled} validationrules={(usecouriervendor) ? ['required'] : []} onChange={(e) => this.onChange(e, 'region')} />
                                    </Col>
                                </Row>
                                <SelectBase form={this.props.form} placeholder='Priority Handling' labeltext='Priority Handling' datafield='courierpriorityhandling' options={NonPrintingPriorityHandling} validationrules={(usecouriervendor) ? ['required'] : []} disabled={vendorfielddisabled} />
                                <TextArea form={this.props.form} labeltext='Courier Notes' datafield='couriernotes' disabled={generalfielddisabled} maxLength={255} />
                                <InputText form={this.props.form} labeltext='AWB' datafield='awb' disabled={generalfielddisabled} />
                            </Col>
                            <Col className='gutter-row' xs={24} lg={{ span: 9 }} >
                                <CatalogMailingDetails mailingproduct={mailingproduct} variantdata={variantdata} inventoryvariantid={inventoryvariantid} />
                                <AddressBuyProductDetail addressInformation={addressInformation} />
                                <VendorBuyProductDetail vendorInformation={vendorInformation} />
                                <Button htmlType='button' type='primary' label='Next Confirmation' block={true} onClick={this.saveAction} />
                            </Col>
                        </Row>
                    </Spin>
                </Form>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);