import React, { Component } from 'react';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputText } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';

const prefixmenuname = 'COMPART';
const menucode = 'COMPART';

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
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
        this.closeAndRefresh = React.createRef();
    }

    checkPermission() {
        let airlinecode = this.props.airlinecode;
        let compartmentcode = this.props.compartmentcode;
        const { permission } = this.props;
        const { usermenu } = permission;
        if (airlinecode && compartmentcode) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"] || !this.props.active) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.props.setTitlePage(titlepage);
            this.getDetail(airlinecode, compartmentcode);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (airlinecode, compartmentcode) => {
        let url = api.url.compartment.list;
        let criteria = { airlinecode, compartmentcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let airlinecode = (result[0].airlinecode) ? result[0].airlinecode : '';
                    let compartmentcode = (result[0].compartmentcode) ? result[0].compartmentcode : '';
                    let compartmentname = (result[0].compartmentname) ? result[0].compartmentname : '';
                    let rank = (result[0].rank !== null && result[0].rank !== undefined) ? result[0].rank.toString() : '';

                    let setValue = { airlinecode, compartmentcode, compartmentname, rank };
                    this.props.form.setFieldsValue(setValue);
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
                let airlinecode = this.props.airlinecode;
                let compartmentcode = input.compartmentcode.toUpperCase();
                let compartmentname = input.compartmentname;
                let rank = input.rank;

                let data = { airlinecode, compartmentcode, compartmentname, rank };

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.compartment.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.compartment.update;
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

    render() {
        const { actionspage } = this.state;
        const { generalfielddisabled, specialfielddisabled } = this.state.fielddisabled;
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
                                <InputText form={this.props.form} labeltext="Airline Code" datafield={this.props.airlinecode} defaultValue={this.props.airlinecode} disabled />
                                <InputText form={this.props.form} labeltext="Compartment Code" datafield="compartmentcode" maxLength={1} validationrules={['required', 'pattern.letter']} disabled={specialfielddisabled} />
                                <InputText form={this.props.form} labeltext="Compartment Name" datafield="compartmentname" maxLength={45} validationrules={['required', 'pattern.alphanumericspace']} disabled={generalfielddisabled} />
                                <InputText form={this.props.form} labeltext="Rank" datafield="rank" maxLength={45} validationrules={['required', 'pattern.number']} disabled={generalfielddisabled} />
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