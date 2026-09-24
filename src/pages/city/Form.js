
import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { RetrieveRequest, SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral, InputText, CountrySelect, StateSelect } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
            fieldvalue: {
                citycode: null,
                active: true
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                statecodefielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            let statecodefielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
                statecodefielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled, statecodefielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
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

    getDetail = (citycode, actionspage) => {
        let url = api.url.city.list;
        let criteria = { citycode };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let citycode = result[0].citycode ? result[0].citycode : null;
                    let cityname = result[0].cityname ? result[0].cityname : null;
                    let countrycode = result[0].countrycode ? result[0].countrycode : null;
                    let countryname = result[0].countryname ? result[0].countryname : null;
                    let statecode = result[0].statecode ? result[0].statecode : null;
                    let statename = result[0].statename ? result[0].statename : null;
                    let active = (result[0].active !== undefined) ? result[0].active : null;
                    let generalfielddisabled = (actionspage !== "view") ? !active : true;
                    let statecodefielddisabled = (actionspage !== "view") ? !active : true;

                    let setValue = { citycode, cityname, countrycode, statecode };
                    this.props.form.setFieldsValue(setValue);
                    let fieldvalue = { citycode, active };
                    let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled, statecodefielddisabled };
                    this.setState({ fieldvalue, fielddisabled });

                    //add select inactive
                    this.componentCountrySelect.retrieveData({}, { countrycode, countryname }, actionspage);
                    this.componentStateSelect.retrieveData({ countrycode }, { statecode, statename }, actionspage);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ isLoading: true });

                let data = {};
                Object.keys(values).map(function (key) {
                    var exclude = ['citycode'];
                    if (exclude.includes(key)) {
                        return data[key] = (values[key] !== undefined) ? values[key].toUpperCase() : null;
                    } else {
                        return data[key] = (values[key] !== undefined) ? values[key] : null;
                    }
                });

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.city.create;
                } else {
                    data.citycode = this.props.match.params.ID;
                    message = 'Data has been updated';
                    url = api.url.city.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/city');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ isLoading: false });
                })
            }
        });
    }

    deleteData(citycode, active) {
        let url = (active) ? api.url.city.deactivate : api.url.city.activate;
        let data = { citycode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    onChangeCountry = (countrycode) => {
        let criteria = { countrycode };
        this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ statecode: undefined });
        let statecodefielddisabled = (countrycode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { specialfielddisabled, generalfielddisabled, statecodefielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;
        const { citycode, active } = this.state.fieldvalue;

        if (formrender) {
            document.title = titlepage + " City | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} City</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <InputText labeltext="City Code" datafield="citycode" form={this.props.form} maxLength={10} validationrules={[`required`, `max.10`, `pattern.nospace`]} disabled={specialfielddisabled} />
                                    <InputText labeltext="City Name" datafield="cityname" form={this.props.form} maxLength={45} validationrules={[`required`, `max.45`, `pattern.letterspace`]} disabled={generalfielddisabled} />
                                    <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                    <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update' && active) ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                }
                                {
                                    (actionspage !== 'create') ?
                                        (active) ?
                                            <Button htmlType="button" type="danger" label="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(citycode, active)} /> :
                                            <Button htmlType="button" type="primary" label="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(citycode, active)} /> : ""
                                }
                                <Button url="/city" htmlType="link" type="default" label="Back" />
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
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));