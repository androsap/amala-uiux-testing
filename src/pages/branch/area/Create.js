import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, CountrySelect, StateSelect, CitySelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

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
                statecodefielddisabled: true,
                citycodefielddisabled: true
            },
        }
        this.closeAndRefresh = React.createRef();
    }

    componentDidMount() {
        this.componentCountrySelect.retrieveData();
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ loading: true });

                //define parameter
                let type = this.props.areatype.toUpperCase();
                let branchcode = this.props.branchcode.toUpperCase();
                let countrycode = input.countrycode.toUpperCase();
                let statecode = input.statecode ? input.statecode.toUpperCase() : '';
                let citycode = input.citycode ? input.citycode.toUpperCase() : '';

                let message = 'New data has been created';
                let url = api.url.brancharea.create;
                let data = this.props.areatype === 'CITY' ? { branchcode, type, countrycode, statecode, citycode } : { branchcode, type, countrycode };

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.closeModalSuccess();
                        // this.props.history.push('/branch');
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

    onChangeCountry = (countrycode) => {
        let criteria = { countrycode };
        if (criteria && this.props.areatype === 'CITY') this.componentStateSelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ statecode: undefined, citycode: undefined });
        let statecodefielddisabled = (countrycode) ? false : true;
        let citycodefielddisabled = (countrycode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, statecodefielddisabled, citycodefielddisabled } });
    }

    onChangeState = (statecode) => {
        let criteria = { statecode };
        if (criteria) this.componentCitySelect.retrieveData(criteria);
        this.props.form.setFieldsValue({ citycode: undefined });
        let citycodefielddisabled = (statecode) ? false : true;
        this.setState({ fielddisabled: { ...this.state.fielddisabled, citycodefielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { generalfielddisabled, statecodefielddisabled, citycodefielddisabled } = this.state.fielddisabled;

        let cityOption = '';
        if (this.props.areatype === "CITY") {
            cityOption =
                <div>
                    <StateSelect ref={(e) => { this.componentStateSelect = e }} labeltext="State" datafield="statecode" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeState} disabled={statecodefielddisabled} />
                    <CitySelect ref={(e) => { this.componentCitySelect = e }} labeltext="City" datafield="citycode" form={this.props.form} validationrules={[`required`]} disabled={citycodefielddisabled} />
                </div>
        }

        return (
            <Row>
                <Spin spinning={this.state.loading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <CountrySelect ref={(e) => { this.componentCountrySelect = e }} labeltext="Country" datafield="countrycode" form={this.props.form} validationrules={[`required`]} onChange={this.onChangeCountry} disabled={generalfielddisabled} />
                                {cityOption}
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            <Button htmlType="submit" type="default" label="Save"></Button>
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