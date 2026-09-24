import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { InputText, Button, Alert, DateRangeBase, TextArea } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';

const prefixmenuname = 'MBCOTOUR';
const menucode = 'MBCOTOUR';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            actionspage: 'create',
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        let id = this.props.tourcodeid;
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
            this.getDetail(id, actionspage);
        }
    }

    getDetail = (tourcodeid, actionspage) => {
        let url = api.url.tourcode.list;
        let criteria = { tourcodeid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let tourcodeid = (result[0].tourcodeid) ? result[0].tourcodeid : undefined;
                    let tourcode = (result[0].tourcode) ? result[0].tourcode : undefined;
                    let startdate = (result[0].startdate) ? moment(result[0].startdate) : null;
                    let enddate = (result[0].enddate) ? moment(result[0].enddate) : null;
                    let date = [startdate, enddate];
                    let description = (result[0].description) ? result[0].description : undefined;

                    let generalfielddisabled = (actionspage === 'view') ? true : false;
                    actionspage = (actionspage === 'view') ? 'view' : 'edit';
                    this.setState({
                        actionspage,
                        fielddisabled: { ...this.state.fielddisabled, generalfielddisabled }
                    });

                    let titlepage = (actionspage === 'view') ? 'View' : 'Edit';
                    this.props.setTitlePage(titlepage);

                    let setValue = { tourcodeid, tourcode, date, description };
                    this.props.form.setFieldsValue(setValue);
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
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let corporatecode = this.props.profile.corporatecode;
                let tourcode = (input.tourcode) ? input.tourcode.toUpperCase() : undefined;
                let startdate = (input.date && input.date[0]) ? moment(input.date[0]).format("YYYY-MM-DD") : null;
                let enddate = (input.date && input.date[1]) ? moment(input.date[1]).format("YYYY-MM-DD") : null;
                let description = (input.description) ? input.description : undefined;

                let url = '';
                let data = { tourcode, corporatecode, startdate, enddate, description };
                let message = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.tourcode.create;
                } else {
                    message = 'New data has been updated';
                    url = api.url.tourcode.update;
                    data.tourcodeid = this.props.tourcodeid;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.refreshHeader();
                        this.props.onClose();
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
        const { generalfielddisabled } = this.state.fielddisabled;
        const { actionspage } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } }
        };

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 14, offset: 4 }} xl={{ span: 14, offset: 4 }}>
                                <InputText form={this.props.form} labeltext="Tour Code" datafield="tourcode" validationrules={['required', 'pattern.alphanumeric']} maxLength={45} disabled={generalfielddisabled} />
                                <TextArea form={this.props.form} labeltext="Description" datafield="description" maxLength="255" disabled={generalfielddisabled} />
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} disabled={generalfielddisabled} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage !== 'view') ? <Button htmlType="submit" type="default" label="Save" /> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));