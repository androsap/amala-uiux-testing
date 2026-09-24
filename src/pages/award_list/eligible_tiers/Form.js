import React, { Component } from 'react';
import { SaveRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { CheckboxBase, Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin } from 'antd';

const { Title, Text } = Typography;

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
                optionsTiers: []
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false,
                cancelfielddisabled: true,
                updatefielddisabled: true
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
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { ...this.state.fielddisabled, specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
        this.getTiers();
    }

    getTiers = () => {
        let paging = { limit: -1, page: 1 }
        let sort = { tiername: 'asc' };
        let criteria = {}
        let url = api.url.tier.list;
        let column = [];
        this.setState({ isLoading: true });
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                const options = [];
                for (const field in result) {
                    if (options[result[field].membershipid] === undefined) { options[result[field].membershipid] = {}; }

                    options[result[field].membershipid].membershipname = result[field].membershipname;
                    options[result[field].membershipid].membershipid = result[field].membershipid;

                    if (options[result[field].membershipid].tiers === undefined) { options[result[field].membershipid].tiers = []; }

                    let tiers = {};
                    tiers.tierid = result[field].tierid;
                    tiers.tiername = result[field].tiername;
                    options[result[field].membershipid].tiers.push(tiers);
                }

                var key = 0;
                let optionsTiers = [];
                for (const field in options) {
                    optionsTiers[key] = options[field];
                    key++;
                }

                this.setState({ fieldvalue: { ...this.state.fieldvalue, optionsTiers } }, this.getEligibleTiers(result));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getEligibleTiers = (options) => {
        let awardcode = this.props.awardcode;
        let criteria = { awardcode };
        let paging = { page: 1, limit: -1 };
        let sort = {};
        let url = api.url.awardeligibletiers.list;
        let column = [];
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let alltiers = this.props.alltiers;

                if (alltiers) {
                    /* LIST OF TIERS */
                    for (const field in options) {
                        this.props.form.setFieldsValue({ [options[field]['tierid']]: true });
                    }
                } else {
                    for (const field in options) {
                        for (const fieldEligibleTier in result) {
                            if (result[fieldEligibleTier]['tierid'] === options[field]['tierid']) {
                                this.props.form.setFieldsValue({ [options[field]['tierid']]: true })
                            }
                        }
                    }
                }
                this.props.form.setFieldsValue({ alltiers });
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

                let tiers = [];
                for (const field in input) {
                    if (field !== 'alltiers') {
                        if (input[field]) { tiers.push(field) }
                    }
                }

                let awardcode = this.props.awardcode;
                let alltiers = (input.alltiers) ? 1 : 0;
                let data = { awardcode, tiers, alltiers };

                let message = 'Data has been updated';
                let url = api.url.awardeligibletiers.update;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);

                        this.props.refreshMainPage();
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    sort(datas) {
        var myData = {};
        if (datas.length > 0) {
            myData = [...datas];
            myData.sort((a, b) => a.membershipname > b.membershipname);
            myData.map((item, i) => {
                return item;
            });
        }
        return myData;
    }

    checkalltiers(alltiers) {
        const { optionsTiers } = this.state.fieldvalue;

        const sortedCountry = this.sort(optionsTiers);

        let tierid = '';
        for (const field in sortedCountry) {
            for (const field2 in sortedCountry[field]["tiers"]) {
                tierid = sortedCountry[field]["tiers"][field2]["tierid"];
                if (alltiers) {
                    this.props.form.setFieldsValue({ [tierid]: true });
                } else {
                    this.props.form.setFieldsValue({ [tierid]: false });
                }
            }
        }
    }

    handleAllCountries = (event) => {
        let alltiers = event === null ? null : event.target.checked;
        this.checkalltiers(alltiers);
    }

    handleSelected = (event) => {
        let value = event === null ? null : event.target.checked;
        if (!value) {
            this.props.form.setFieldsValue({ alltiers: false });
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, isLoading } = this.state;
        const { optionsTiers } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        const sortedTier = this.sort(optionsTiers);
        var listTier = '';
        if (sortedTier.length) {
            listTier = sortedTier.map((val_1, key_1) =>
                <Row gutter={24} style={{ marginBottom: 20 }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Text strong>{val_1.membershipname}</Text>
                        <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                    </Col>
                    {
                        val_1.tiers.map((val_2, key_2) =>
                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                <CheckboxBase form={this.props.form} datafield={val_2.tierid} onChange={this.handleSelected} disabled={generalfielddisabled}> {val_2.tiername}</CheckboxBase>
                            </Col>
                        )
                    }
                </Row>
            )
        } else {
            listTier = <Row gutter={24} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center' }}>
                    <Text strong>LOADING . . .</Text>
                </Col>
            </Row>
        }

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Eligible Countries | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={21} xl={21} md={21} sm={24} s={24}>
                            <Title level={4}>{titlepage} Eligible Tiers</Title>
                        </Col>
                        <Col xs={3} xl={3} md={3} sm={24} s={24}>
                            <CheckboxBase form={this.props.form} datafield='alltiers' onChange={this.handleAllCountries} disabled={generalfielddisabled}> Select All</CheckboxBase>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            {listTier}
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                {
                                    (actionspage === 'create') ?
                                        <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        : (actionspage === 'update') ?
                                            <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
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