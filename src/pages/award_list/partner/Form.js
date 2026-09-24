import React, { Component } from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { PartnerLocationSelect, PartnerSelect, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title } = Typography;

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
            fieldvalue: {
                categorytype: this.props.categorytype
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                partnerlocationfielddisabled: true
            }
        }
    }

    checkPermission() {
        let id = this.props.awardcode;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = (awardcode, actionspage) => {
        let url = api.url.awardmaster.detailpartner;
        let data = { awardcode };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let partnercode = (result.partnercode) ? result.partnercode : undefined;
                let awardpartnerlocation = (result.awardpartnerlocation) ? result.awardpartnerlocation.map((obj) => { return obj.partnerlocationcode }) : [];

                let setValue = { partnercode, awardpartnerlocation };
                this.props.form.setFieldsValue(setValue);

                let criteriaPartner = { partnertype: this.props.categorytype };
                this.componentPartnerSelect.retrieveData(criteriaPartner);

                if (partnercode) {
                    let partnerlocationfielddisabled = (actionspage !== 'view') ? false : true;
                    let fielddisabled = { ...this.state.fielddisabled, partnerlocationfielddisabled };
                    let criteriaPartnerLocation = { partnercode };
                    this.componentPartnerLocationSelect.retrieveData(criteriaPartnerLocation);
                    this.setState({ fielddisabled });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let awardcode = this.props.awardcode;
                let partnercode = input.partnercode;
                let awardpartnerlocation = (input.awardpartnerlocation) ? input.awardpartnerlocation.map((obj) => { return { partnerlocationcode: obj } }) : [];

                let data = { awardcode, partnercode, awardpartnerlocation };

                let message = 'Data has been updated';
                let url = api.url.awardmaster.updatepartner;
                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    onChangePartnerCode = (partnercode) => {
        let criteria = { partnercode };
        let partnerlocationfielddisabled = false;
        let awardpartnerlocation = [];
        this.props.form.setFieldsValue({ awardpartnerlocation });
        this.componentPartnerLocationSelect.retrieveData(criteria);
        this.setState({ fielddisabled: { ...this.state.fielddisabled, partnerlocationfielddisabled } });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender } = this.state;
        const { partnerlocationfielddisabled, generalfielddisabled } = this.state.fielddisabled;
        const { categorytype } = this.state.fieldvalue;
        const { menucode, prefixmenuname } = this.props;

        console.log("categorytype", categorytype)
        if (formrender) {
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>{titlepage} Partner</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 4 }}>
                                    <PartnerSelect ref={(e) => { this.componentPartnerSelect = e }} form={this.props.form} labeltext="Partner" datafield="partnercode" validationrules={['required']} onChange={this.onChangePartnerCode} disabled={generalfielddisabled} />
                                    <PartnerLocationSelect mode="multiple" ref={(e) => { this.componentPartnerLocationSelect = e }} form={this.props.form} className={(categorytype === 'AIR') ? 'hidden' : ''} labeltext="Partner Location" datafield="awardpartnerlocation" validationrules={(categorytype === 'AIR') ? [] : ['required']} disabled={partnerlocationfielddisabled} />
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                            : null
                                } &nbsp;
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