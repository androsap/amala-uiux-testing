import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, VendorRegionSelect, RadioButton, InputText, SwitchButton, SelectBase, CorporateSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Typography, Divider } from 'antd';
import moment from 'moment';

const { Title } = Typography;


const optionsSlaType = [
    { label: "Days", value: "DAYS" },
    { label: "Weeks", value: "WEEKS" },
    { label: "Months", value: "MONTHS" }
];

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
            sla: [],
            fieldvalue: {
                slatype: null,
                slaid: null,
                regioncode: null,
                vendortype: null,
                regionOptions: [],
                regioncode: [],
                regioncode: [],
                regionOptions: []
            },
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false,
                slacodedaysdisabled: true,
                slacodeweeksdisabled: true,
                slacodemonthsdisabled: true,
            }
        }
    }

    checkPermission = async () => {
        let id = this.props.slaid;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let slacodedaysdisabled = true;
            let slacodeweeksdisabled = true;
            let slacodemonthsdisabled = true;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled, slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
            await this.componentVendorRegionSelect.retrieveData();
            await this.componentVendorRegionSelect.getAllOption();
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (slaid) => {
        let url = api.url.vendorsla.detail;
        let criteria = { slaid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let regioncode = (result.slaregion) ? result.slaregion.map((obj, key) => { return obj.regioncode }) : [];
                let allregion = (result.allregion) ? result.allregion : false;
                let slatype = (result.slatype) ? result.slatype : null;
                let slaindays = (result.slaindays) ? result.slaindays : null;
                let slainweeks = (result.slainweeks) ? result.slainweeks : null;
                let slainmonths = (result.slainmonths) ? result.slainmonths : null;

                const slacodedaysdisabled = (slatype === "DAYS") ? false : true;
                const slacodeweeksdisabled = (slatype === "WEEKS") ? false : true;
                const slacodemonthsdisabled = (slatype === "MONTHS") ? false : true;

                const fielddisabled = { ...this.state.fielddisabled, slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled };
                const fieldsvalue = { allregion, regioncode, slatype, slaindays, slainweeks, slainmonths };
                this.props.form.setFieldsValue(fieldsvalue);
                this.componentVendorRegionSelect.getAllOption();
                this.setState({ isLoading: false, fielddisabled });

                let fieldvalue = { ...this.state.fieldvalue };
                this.setState({ fieldvalue });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    // getDetail = async () => {
    //     this.setState({ isLoading: true });
    //     const { datasource, slaid } = this.props;
    //     const detailregion = datasource.filter(obj => obj.slaid === slaid);

    //     const regioncode = (detailregion && detailregion[0] && detailregion[0]['regioncode']) ? detailregion[0]['regioncode'] : undefined;
    //     const slatype = (detailregion && detailregion[0] && detailregion[0]['slatype']) ? detailregion[0]['slatype'] : undefined;
    //     const slaindays = (detailregion && detailregion[0] && detailregion[0]['slaindays'] && (detailregion[0]['slaindays'] !== undefined || detailregion[0]['slaindays'] !== null)) ? detailregion[0]['slaindays'] : undefined;
    //     const slainweeks = (detailregion && detailregion[0] && detailregion[0]['slainweeks'] && (detailregion[0]['slainweeks'] !== undefined || detailregion[0]['slainweeks'] !== null)) ? detailregion[0]['slainweeks'] : undefined;
    //     const slainmonths = (detailregion && detailregion[0] && detailregion[0]['slainmonths'] && (detailregion[0]['slainmonths'] !== undefined || detailregion[0]['slainmonths'] !== null)) ? detailregion[0]['slainmonths'] : undefined;

    //     const slacodedaysdisabled = (slatype === "DAYS") ? false : true;
    //     const slacodeweeksdisabled = (slatype === "WEEKS") ? false : true;
    //     const slacodemonthsdisabled = (slatype === "MONTHS") ? false : true;

    //     const fielddisabled = { ...this.state.fielddisabled, slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled };
    //     const fieldsvalue = { regioncode, slatype, slaindays, slainweeks, slainmonths };
    //     await this.props.form.setFieldsValue(fieldsvalue);
    //     this.setState({ isLoading: false, fielddisabled });
    // }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                /* show loading */
                this.setState({ isLoading: true });
                const { actionspage } = this.state;

                let allregion = (input.allregion) ? true : false;
                let slaid = (actionspage === 'update') ? this.props.slaid : null;
                let vendorcode = this.props.vendorcode;
                let regioncode = (input.regioncode) ? input.regioncode : [];
                let slatype = (input.slatype) ? input.slatype : null;
                let slaindays = (input.slaindays) ? input.slaindays : null;
                let slainweeks = (input.slainweeks) ? input.slainweeks : null;
                let slainmonths = (input.slainmonths) ? input.slainmonths : null;

                // let region = [];
                // regioncode.map((val) => region.push({ regioncode: val }));

                const data = { allregion, slaid, vendorcode, regioncode, slatype, slaindays, slainweeks, slainmonths };
                
                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.vendorsla.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.vendorsla.update;
                    data.slaid = this.props.slaid;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.changePage({ page: 'index' });
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                });
            };
        });
    }

    onChangeSla = (event) => {
        let slatype = event === null ? null : event.target.value;
        this.props.form.resetFields(['slaindays', 'slainweeks', 'slainmonths', []]);
        this.props.form.setFieldsValue({ slatype: undefined });

        let slacodedaysdisabled = (slatype === 'DAYS') ? false : true;
        let slacodeweeksdisabled = (slatype === 'WEEKS') ? false : true;
        let slacodemonthsdisabled = (slatype === 'MONTHS') ? false : true;
        let fieldvalue = { ...this.state.fieldvalue, slatype };
        let fielddisabled = { ...this.state.fielddisabled, slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled };
        this.setState({ fieldvalue, fielddisabled });
    }

    handleChangePage(page) {
        this.props.changePage({ page });
    }

    handleAllregion = (value) => {
        if (value) {
            this.componentVendorRegionSelect.getAllOption('fromButton');
        } else {
            this.props.form.resetFields(['regioncode', []]);
            this.setState({ regioncode: [] });
        };
    };

    getAllOption = async (options, type) => {
        if (type === 'dataVendorRegionOnly') {
            this.setState({ allregionsoptions: options })
        } else if (type === 'dataVendorOnly') {
            this.setState({ allvendoroptions: options })
        } else {
            let regioncode = options.map(a => a.value);
            this.setState({ regioncode });
            await this.props.form.setFieldsValue({ regioncode });
        }
    };

    handleRegion = (value) => {
        const { allregionsoptions } = this.state;

        this.props.form.setFieldsValue({ allregion: (value.length === allregionsoptions.length) ? true : false });
    };

    render() {
        const { actionspage, fielddisabled, titlepage, defaultChecked } = this.state;
        const { slacodedaysdisabled, slacodeweeksdisabled, slacodemonthsdisabled } = fielddisabled;
        const allregion = this.props.form.getFieldValue('allregion');

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>{titlepage} SLA</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 1 }} xl={{ span: 18 }}>
                                <SwitchButton form={this.props.form} labeltext='All Region' datafield='allregion' onChange={this.handleAllregion} />
                                <VendorRegionSelect labeltext='Region' ref={(e) => { this.componentVendorRegionSelect = e }} form={this.props.form} mode='multiple' datafield='regioncode'
                                    validationrules={['required']} allOption={true} getAllOption={this.getAllOption} onChange={this.handleRegion} forceRender={true} disabled={allregion ? true : false}/>
                                <RadioButton labeltext='SLA Type' datafield='slatype' form={this.props.form} options={optionsSlaType} validationrules={[`required`]} onChange={this.onChangeSla} />
                                <InputText labeltext="SLA Days" datafield="slaindays" form={this.props.form} validationrules={(slacodedaysdisabled) ? [''] : ['required', `pattern.number`, `minnumber.1`]} maxLength={2} disabled={slacodedaysdisabled} />
                                <InputText labeltext="SLA Weeks" datafield="slainweeks" form={this.props.form} validationrules={(slacodeweeksdisabled) ? [''] : ['required', `pattern.number`, `minnumber.1`]} maxLength={2} disabled={slacodeweeksdisabled} />
                                <InputText labeltext="SLA Months" datafield="slainmonths" form={this.props.form} validationrules={(slacodemonthsdisabled) ? [''] : ['required', `pattern.number`, `minnumber.1`]} maxLength={2} disabled={slacodemonthsdisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create') ?
                                    <Button htmlType="submit" type="default" label="Save" actioncode="CREATE"></Button>
                                    : (actionspage === 'update') ?
                                        <Button htmlType="submit" type="default" label="Save" actioncode="UPDATE"></Button>
                                        : null
                            }
                            <Button htmlType="button" type="default" label="Back" onClick={() => this.handleChangePage('index')} />
                        </Row>

                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));