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
                optionsBranch: []
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
        let sort = { branchname: 'asc' };
        let criteria = {}
        let url = api.url.branch.list;
        let column = [];
        this.setState({ isLoading: true });
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                const optionsBranch = result;
                this.setState({ fieldvalue: { ...this.state.fieldvalue, optionsBranch } }
                    , this.getEligibleBranch(result)
                );
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    getEligibleBranch = (options) => {
        let awardcode = this.props.awardcode;
        let criteria = { awardcode };
        let paging = { page: 1, limit: -1 };
        let sort = {};
        let url = api.url.awardeligiblebranch.list;
        let column = [];
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let allbranch = this.props.allbranch;

                if (allbranch) {
                    for (const field in options) {
                        this.props.form.setFieldsValue({ [options[field]['branchcode']]: true });
                    }
                } else {
                    for (const field in options) {
                        for (const fieldEligibleBranch in result) {
                            if (result[fieldEligibleBranch]['branchcode'] === options[field]['branchcode']) {
                                this.props.form.setFieldsValue({ [options[field]['branchcode']]: true })
                            }
                        }
                    }
                }
                this.props.form.setFieldsValue({ allbranch });
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

                let branch = [];
                for (const field in input) {
                    if (field !== 'allbranch') {
                        if (input[field]) { branch.push(field) }
                    }
                }

                let awardcode = this.props.awardcode;
                let allbranch = (input.allbranch) ? 1 : 0;
                let data = { awardcode, branch, allbranch };

                let message = 'Data has been updated';
                let url = api.url.awardeligiblebranch.update;

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
            myData.sort((a, b) => a.branchname > b.branchname);
            myData.map((item, i) => {
                return item;
            });
        }
        return myData;
    }

    checkallBranch(allbranch) {
        const { optionsBranch } = this.state.fieldvalue;

        const sortedBranch = this.sort(optionsBranch);

        let branchcode = '';
        for (const field in sortedBranch) {
            branchcode = sortedBranch[field]["branchcode"];
            if (allbranch) {
                this.props.form.setFieldsValue({ [branchcode]: true });
            } else {
                this.props.form.setFieldsValue({ [branchcode]: false });
            }
        }
    }

    handleAllBranch = (event) => {
        let allbranch = event === null ? null : event.target.checked;
        this.checkallBranch(allbranch);
    }

    handleSelected = (event) => {
        let value = event === null ? null : event.target.checked;
        if (!value) {
            this.props.form.setFieldsValue({ allbranch: false });
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { titlepage, actionspage, formrender, isLoading } = this.state;
        const { optionsBranch } = this.state.fieldvalue;
        const { generalfielddisabled } = this.state.fielddisabled;
        const { menucode, prefixmenuname } = this.props;

        const sortedBranch = this.sort(optionsBranch);
        var listBranch = '';
        if (sortedBranch.length) {
            listBranch = sortedBranch.map((val, key) =>
                <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                    <CheckboxBase form={this.props.form} datafield={val.branchcode} onChange={this.handleSelected} disabled={generalfielddisabled}> {val.branchname}</CheckboxBase>
                </Col>
            )
        } else {
            listBranch = <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center' }}>
                <Text strong>LOADING . . .</Text>
            </Col>
        }

        if (formrender) {
            //title bar on browser
            document.title = titlepage + " Eligible Branch | Loyalty Management System";
            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={21} xl={21} md={21} sm={24} s={24}>
                            <Title level={4}>{titlepage} Eligible Branch</Title>
                        </Col>
                        <Col xs={3} xl={3} md={3} sm={24} s={24}>
                            <CheckboxBase form={this.props.form} datafield='allbranch' onChange={this.handleAllBranch} disabled={generalfielddisabled}> Select All</CheckboxBase>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={isLoading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>

                            <Row gutter={24} style={{ marginBottom: 20 }}>
                                {listBranch}
                            </Row>
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