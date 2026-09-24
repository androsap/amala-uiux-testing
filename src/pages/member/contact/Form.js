import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { getGeneralConfig } from '../../../utilities/Helpers';
import { general_config } from '../../../utilities/Constant';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { InputText, Button, Alert, CountryPhoneSelect, CheckboxBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const prefixmenuname = 'MMBRCNTC';
const menucode = 'MMBRCNTC';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {},
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        }
    }

    checkPermission() {
        let id = this.props.memberphoneid;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id);
        } else {
            this.componentPhoneCountryCodeSelect.retrieveData();

            /* SET DEFAULT FIELD BUSINESS COUNTRY */
            const callback = (countrycode) => {
                this.props.form.setFieldsValue({ countrycode });
            }
            getGeneralConfig(general_config.default_country, callback);
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail(id) {
        let dataDetail = this.props.dataDetail;

        let setFieldValue = {
            countrycode: (dataDetail.countrycode) ? dataDetail.countrycode : undefined,
            regioncode: (dataDetail.regioncode) ? dataDetail.regioncode : undefined,
            phonenumber: (dataDetail.phonenumber) ? dataDetail.phonenumber : undefined,
            extension: (dataDetail.extension) ? dataDetail.extension : undefined,
            valid: (dataDetail.valid) ? dataDetail.valid : false,
            active: (dataDetail.active) ? dataDetail.active : false
        };
        this.props.form.setFieldsValue(setFieldValue);
        this.componentPhoneCountryCodeSelect.retrieveData();
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        let { phonetype } = this.props;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let memberid = this.props.match.params.ID;
                let countrycode = input.countrycode;
                let regioncode = input.regioncode;
                let phonenumber = input.phonenumber;
                let extension = (input.extension) ? input.extension : null;

                let message = '';
                let url = '';
                let data = { memberid, phonetype, countrycode, regioncode, phonenumber, extension };
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.membercontact.create;

                    data.preferrednumber = false;
                    data = [data];
                } else {
                    message = 'Data has been updated';
                    url = api.url.membercontact.update;

                    data.memberphoneid = this.props.memberphoneid;
                    data.active = (input.active) ? input.active : false;
                    data.valid = (input.valid) ? input.valid : false;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshHeader();
                        this.props.refreshList();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { formrender, actionspage } = this.state;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname, permission, phonetype } = this.props;
        const { usermenu } = permission;

        if (formrender) {
            //render form
            return (
                <Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 4 }} xl={{ span: 16, offset: 4 }}>
                                    <CountryPhoneSelect ref={(e) => { this.componentPhoneCountryCodeSelect = e }} form={this.props.form} labeltext="Country Code" datafield="countrycode" validationrules={['required']} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} className={(phonetype === 'MOBILE') ? 'hidden' : ''} labeltext="Region Code" datafield="regioncode" validationrules={(phonetype === 'MOBILE') ? ['pattern.number', 'max.3'] : ['required', 'pattern.number', 'max.3']} maxLength={3} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} labeltext="Phone Number" datafield="phonenumber" validationrules={['required', 'pattern.number', 'max.20']} maxLength={20} disabled={generalfielddisabled} />
                                    <InputText form={this.props.form} className={(phonetype === 'MOBILE') ? 'hidden' : ''} labeltext="Extension" datafield="extension" validationrules={['pattern.number', 'max.20']} maxLength={20} disabled={generalfielddisabled} />
                                    {/* <Form.Item label="Valid" className={(actionspage === 'create') ? 'hidden' : ''}>
                                        <CheckboxBase form={this.props.form} datafield='valid' disabled={generalfielddisabled} />
                                    </Form.Item> */}

                                    <Row gutter={24} style={{ marginBottom: 12 }} className={(actionspage === 'create') ? 'hidden' : ''}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 16, offset: 8 }} xl={{ span: 16, offset: 8 }}>
                                            <CheckboxBase form={this.props.form} datafield='valid' disabled={generalfielddisabled}> Valid</CheckboxBase>
                                            <CheckboxBase form={this.props.form} datafield='active' disabled={generalfielddisabled}> Active</CheckboxBase>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (usermenu[menucode][prefixmenuname + "_UPDATE"]) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                        : null
                                }
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));