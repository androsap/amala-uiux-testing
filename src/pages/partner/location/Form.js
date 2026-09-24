import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputText, CountrySelect, StateSelect, CitySelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const prefixmenuname = 'PARTNLOC';
const menucode = 'PARTNLOC';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                airportiatacode: null,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statefielddisabled: true,
                cityfielddisabled: true
            }
        }
        this.closeAndRefresh = React.createRef();
    }

    checkPermission() {
        let id = this.props.partnerlocationcode;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let statefielddisabled = false;
            let cityfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.props.active) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                statefielddisabled = true;
                cityfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled, statefielddisabled, cityfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            } else {
                this.componentCountrySelect.retrieveData();
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (partnerlocationcode, actionspage) => {
        let url = api.url.partnerlocation.list;
        let criteria = { partnerlocationcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let partnercode = (result[0].partnercode) ? result[0].partnercode : '';
                    let partnerlocationcode = (result[0].partnerlocationcode) ? result[0].partnerlocationcode : '';
                    let country = (result[0].country) ? result[0].country : null;
                    let countryname = (result[0].countryname) ? result[0].countryname : null;
                    let state = (result[0].state) ? result[0].state : null;
                    let statename = (result[0].statename) ? result[0].statename : null;
                    let city = (result[0].city) ? result[0].city : null;
                    let cityname = (result[0].cityname) ? result[0].cityname : null;

                    let setValue = { partnercode, partnerlocationcode, country, state, city };
                    this.props.form.setFieldsValue(setValue);

                    //add select inactive
                    this.componentCountrySelect.retrieveData({}, { country, countryname }, actionspage);
                    this.componentStateSelect.retrieveData({}, { state, statename }, actionspage);
                    this.componentCitySelect.retrieveData({}, { city, cityname }, actionspage);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });
                //define parameter
                let partnercode = this.props.partnercode;
                let partnerlocationcode = input.partnerlocationcode.toUpperCase();
                let country = input.country;
                let state = input.state;
                let city = input.city;

                let data = { partnercode, partnerlocationcode, country, state, city };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.partnerlocation.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.partnerlocation.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ loading: false });
                })
            }
        });
    }

    closeModalSuccess = () => {
        this.closeAndRefresh.current.click();
    }

    onChangeCountry = (country) => {
        let criteria = { country };
        this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ state: undefined, city: undefined });
        let statefielddisabled = (country) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statefielddisabled } });
    }

    onChangeState = (state) => {
        let criteria = { state };
        this.componentCitySelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ city: undefined });
        let cityfielddisabled = (state) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, cityfielddisabled } });
    }

    render() {
        const { actionspage } = this.state;
        const { specialfielddisabled, generalfielddisabled, statefielddisabled, cityfielddisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <Row>
                <Spin spinning={this.state.loading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <InputText form={this.props.form} labeltext="Partner Code" datafield={this.props.partnercode} defaultValue={this.props.partnercode} disabled />
                                <InputText form={this.props.form} labeltext="Location Code" datafield="partnerlocationcode" maxLength={20} validationrules={['required', 'pattern.alphanumeric']} disabled={specialfielddisabled} />
                                <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="country" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="state" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeState} disabled={statefielddisabled} />
                                <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="city" form={this.props.form} validationrules={[`required`]} disabled={cityfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create' && this.props.active) ?
                                    <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                    : (actionspage === 'update' && this.props.active) ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                        : null
                            }
                            <button type="button" ref={this.closeAndRefresh} onClick={this.props.closemodalrefresh} className="hidden">Close Refresh</button>
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));