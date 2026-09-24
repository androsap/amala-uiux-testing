import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { SaveRequest } from '../../../../utilities/RequestService';
import { Alert, Button, VendorRegionSelect, SelectBase, SwitchButton, VendorSelect, DateRangeBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import { VendorType } from '../../../../data';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mailingproductvendorid: (this.props && this.props.mailingproductvendorid) ? this.props.mailingproductvendorid : null,
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            vendortype: 'CASH',
            defaultChecked: false,
            regions: [],
            allvendoroptions: [],
            allregionsoptions: [],
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
                regionfielddisabled: false,
            }
        }
    };

    checkPermission = async () => {
        const { mailingproductvendorid, permission, prefixmenuname, menucode, period } = this.props;
        const { actionsmasterpage } = this.state;
        const { usermenu } = permission;

        if (mailingproductvendorid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + '_UPDATE'])) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            };

            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail();
        } else {
            this.props.form.setFieldsValue({ date: [period[0], period[1]] });
            if (!usermenu[menucode][prefixmenuname + '_UPDATE']) this.setState({ responseMessage: `Sorry, your role can't perform this action`, formrender: false });
        };

        await this.componentVendorRegionSelect.retrieveData();
        await this.componentVendorRegionSelect.getAllOption();
    };

    componentDidMount = async () => {
        await this.checkPermission();
    };

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { vendortype, vendorcode, allregion, startdate, enddate } = this.props.vendors;
        const date = [moment(startdate), moment(enddate)];
        const regions = (this.props.vendors.regions) ? this.props.vendors.regions.map((obj) => obj.regioncode) : [];

        const fielddisabled = { ...this.state.fielddisabled, regionfielddisabled: (vendortype !== 'COURIER') ? true : false }
        const fieldsvalue = { vendortype, vendorcode, allregion, date, regions };

        this.props.form.setFieldsValue(fieldsvalue);
        await this.componentVendorSelect.retrieveData({ vendortype });
        await this.componentVendorSelect.getAllOption();
        this.setState({ vendortype, regions, fielddisabled, isLoading: false });
    };

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { actionsmasterpage, actionspage, allvendoroptions } = this.state;
                const { vendortype, vendorcode, allregion, regions, date } = input || null;
                const { mailingproductvendorid, mailingproductcode } = this.props;
                const finalRegions = [];

                for (var i = 0; i < regions.length; i++) {
                    const duplicate = this.handleDuplicate(regions[i]);
                    if (duplicate !== undefined) {
                        finalRegions.push(duplicate)
                    } else finalRegions.push({ regioncode: regions[i] });
                }

                let data = {
                    vendortype, allregion, vendorcode,
                    regions: finalRegions,
                    vendorname: allvendoroptions.find(val => val.value === vendorcode).label,
                    startdate: (date && date[0]) ? moment(date[0]).format('YYYY-MM-DD') : null,
                    enddate: (date && date[1]) ? moment(date[1]).format('YYYY-MM-DD') : null
                };

                if (actionsmasterpage === 'create') {
                    if (actionspage === 'create') {
                        data.mailingproductvendorid = moment().format('YYYYMMDDHHmmss');
                    } else if (actionspage === 'update') data.mailingproductvendorid = mailingproductvendorid;

                    this.props.handleSavePrice(actionspage, data, 'showvendorform');
                    this.setState({ isLoading: false });

                } else if (actionsmasterpage === 'update') {
                    let url = '';
                    if (actionspage === 'create') {
                        data.mailingproductcode = mailingproductcode;
                        url = api.url.mailingproduct.vendor.create;
                    } else {
                        data.mailingproductcode = mailingproductcode;
                        data.mailingproductvendorid = mailingproductvendorid;
                        url = api.url.mailingproduct.vendor.update;
                    }
                    SaveRequest(url, data).then((response) => {
                        const { status = {} } = response || {};
                        if (status.responsecode === '0000') {
                            Alert.success(status.responsemessage);

                            this.props.handleClose();
                            this.props.handleRefreshTable(mailingproductcode, 'vendors');
                        } else Alert.error(status.responsemessage);
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    };

    handleDuplicate = (region) => {
        return this.state.regions.find(e => e.regioncode === region);
    };

    handleVendor = async (value) => {
        if (value !== 'COURIER' && value !== undefined) {
            this.componentVendorRegionSelect.getAllOption('fromButton');
        } else this.props.form.resetFields(['regions', []]);

        if (value) {
            await this.componentVendorSelect.retrieveData({ vendortype: value });
            await this.componentVendorSelect.getAllOption();
        };

        this.props.form.resetFields(['vendorcode', []]);
        this.props.form.setFieldsValue({ allregion: (value !== 'COURIER' && value !== undefined) ? true : false });
        this.setState({ defaultChecked: (value !== 'COURIER') ? true : false, fielddisabled: { ...this.state.fielddisabled, regionfielddisabled: (value !== 'COURIER') ? true : false } });
    };

    handleAllregion = (value) => {
        if (value) {
            this.componentVendorRegionSelect.getAllOption('fromButton');
        } else {
            this.props.form.resetFields(['regions', []]);
            this.setState({ regions: [] });
        };
    };

    getAllOption = async (options, type) => {
        if (type === 'dataVendorRegionOnly') {
            this.setState({ allregionsoptions: options })
        } else if (type === 'dataVendorOnly') {
            this.setState({ allvendoroptions: options })
        } else {
            let regions = options.map(a => a.value);
            this.setState({ regions });
            await this.props.form.setFieldsValue({ regions });
        };
    };

    handleRegion = (value) => {
        const { allregionsoptions } = this.state;

        this.props.form.setFieldsValue({ allregion: (value.length === allregionsoptions.length) ? true : false });
    };

    render() {
        const { prefixmenuname, menucode, actioncode, producttype, period } = this.props;
        const { fielddisabled, defaultChecked } = this.state;
        const { generalfielddisabled, regionfielddisabled } = fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        const OptionsVendorType = (producttype === 'CARD') ? VendorType : VendorType.slice(0, 2);
        const vendorfielddisabled = (generalfielddisabled) ? generalfielddisabled : this.props.form.getFieldValue('vendortype') ? false : true;

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <SelectBase form={this.props.form} labeltext='Vendor Type' datafield='vendortype' options={OptionsVendorType} onChange={this.handleVendor} validationrules={[`required`]} disabled={generalfielddisabled} />
                                <VendorSelect ref={(e) => { this.componentVendorSelect = e }} form={this.props.form} labeltext='Vendor' datafield='vendorcode' validationrules={['required']} getAllOption={this.getAllOption} disabled={vendorfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext='Date' datafield='date' placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment(period[0]).subtract(1, 'days')} maxDate={moment(period[1])} />
                                <Col xs={11} sm={11} md={11}>
                                    <SwitchButton labelCol={{ span: 18 }} wrapperCol={{ span: 6, push: 1 }} form={this.props.form} labeltext='All Region' datafield='allregion' validationrules={['required']}
                                        defaultChecked={defaultChecked} onChange={this.handleAllregion} disabled={regionfielddisabled} />
                                </Col>
                                <Col xs={13} sm={13} md={13}>
                                    <VendorRegionSelect ref={(e) => { this.componentVendorRegionSelect = e }} wrapperCol={{ span: 24, push: 1 }} form={this.props.form} mode='multiple' datafield='regions' placeholder='Region'
                                        disabled={regionfielddisabled} validationrules={['required']} allOption={true} getAllOption={this.getAllOption} onChange={this.handleRegion} />
                                </Col>
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 10 }}>
                            <Button htmlType='submit' type='default' label='Save' menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));