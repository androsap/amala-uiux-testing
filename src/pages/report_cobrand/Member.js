import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const StatusSelect = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'PENDING_APPROVAL', label: 'PENDING_APPROVAL' },
    { value: 'TERMINATE', label: 'TERMINATE' },
];

const ActivitySelect = [
    { value: 'ENROLLMENT', label: 'ENROLLMENT' },
    { value: 'TERMINATE', label: 'TERMINATE' },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            visible: false,
            criteria: {},
            criteriadata: {},
            fielddisabled: {
                createddatestartdisabled: true,
                createddateenddisabled: true,
                transactionenddatedisabled: true,
            }
        }
        this.componentTable = [];
    }

    componentDidMount() {
        document.title = "Cobrand Member Report | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.props.form.validateFieldsAndScroll((err) => {
            let dateValidation = '';
            let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;

            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                let searchingdata = Object.keys(criteriadata).filter(key => criteriadata[key] !== null).length > 0;
                if (searching || searchingdata) {
                    // const { activityTypeEnum } = criteria;
                    /* remapping criteria */
                    // criteria.activityTypeEnum = (activityTypeEnum !== 'ENROLLMENT') ? 'TERMINATE' : 'ENROLLMENT';
                    this.componentTable.handleSearchForm(criteria, criteriadata);
                }
                this.setState({ searching, searchingdata, criteria, criteriadata });
            } else {
                if (!err || !searching) {
                    dateValidation = "Transaction Date is required";
                }
            }
            this.setState({ dateValidation, searching, criteriadata });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.cobrandreport.generatemmbr;
            let criteria = this.state.criteria;
            let data = this.state.criteriadata;
            let sort = { enrollmentdate: 'desc' };
            let message = 'Generating report file...';
            RetrieveRequest(url, criteria, {}, [], sort, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode && responsecode.substring(0, 1) === '0') {
                    //window.location.href = response.result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    Modal.info({
                        content: (
                            <div>
                                <p>Your ID Report is {response.result.idgeneratereport}</p>
                                <Paragraph copyable={{ text: response.result.idgeneratereport }}>Copy ID Report.</Paragraph>
                            </div>
                        ),
                    });
                } else {
                    Alert.error(responsemessage);
                }
            });
        }

        confirm({
            title: 'Are you sure to generate this report file?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    handleCreatedDate = (trxdatestart, trxdateend) => {
        let createddatedisabled = (trxdatestart || trxdateend) ? true : false;

        let fielddisabled = { ...this.state.fielddisabled, createddatedisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ enrollmentdatestart: undefined, enrollmentdateend: undefined });
        this.props.form.resetFields(['enrollmentdatestart', []]);
        this.props.form.resetFields(['enrollmentdateend', []]);
        this.props.form.resetFields(['terminatedatestart', []]);
        this.props.form.resetFields(['terminatedateend', []]);
    }

    handleType = () => {
        this.props.form.resetFields(['enrollmentdatestart', []]);
        this.props.form.resetFields(['enrollmentdateend', []]);
        this.props.form.resetFields(['terminatedatestart', []]);
        this.props.form.resetFields(['terminatedateend', []]);
    }

    render() {
        const { searching, searchingdata, dateValidation } = this.state;
        const enrollmentdatestart = this.props.form.getFieldValue('enrollmentdatestart');
        const terminatedatestart = this.props.form.getFieldValue('terminatedatestart');
        const activityTypeEnum = this.props.form.getFieldValue('activityTypeEnum');
        const configurationSearchForm = [
            { 
                datafield: "activityTypeEnum", type: 'select', options: ActivitySelect, placeholder: 'Activity Type', showDefaultSearch: true, validationrules: ['required'], onChange: (e) => this.handleType(e) },
            {
                datafield: 'enrollmentdatestart', type: 'datepicker', placeholder: 'Enrollment Date Start', showDefaultSearch: true, maxDate: moment().subtract(1, 'days'), specialSearch: true,
                onChange: (e) => this.handleCreatedDate(e), validationrules: activityTypeEnum === 'ENROLLMENT' ? ['required'] : [''], disabled: activityTypeEnum === 'ENROLLMENT' ? false : true
            },
            {
                datafield: "enrollmentdateend", type: 'datepicker', placeholder: 'Enrollment Date End', showDefaultSearch: true, minDate: moment(enrollmentdatestart).add(0, 'days'), specialSearch: true,
                disabled: enrollmentdatestart ? false : true, validationrules: enrollmentdatestart ? ['required'] : [], 
                maxDate: (moment(enrollmentdatestart).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(enrollmentdatestart).add(3, 'M').subtract(1, 'days')
            },
            {
                datafield: 'terminatedatestart', type: 'datepicker', placeholder: 'Terminate Date Start', showDefaultSearch: true, maxDate: moment().subtract(1, 'days'), specialSearch: true,
                onChange: (e) => this.handleCreatedDate(e), validationrules: activityTypeEnum === 'TERMINATE' ? ['required'] : [''], disabled: activityTypeEnum === 'TERMINATE' ? false : true
            },
            {
                datafield: "terminatedateend", type: 'datepicker', placeholder: 'Terminate Date End', showDefaultSearch: true, minDate: moment(terminatedatestart).add(0, 'days'), specialSearch: true,
                disabled: terminatedatestart ? false : true, validationrules: terminatedatestart ? ['required'] : [], 
                maxDate: (moment(terminatedatestart).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(terminatedatestart).add(3, 'M').subtract(1, 'days')
            },
        ];
        const configurationTable = {
            url: api.url.cobrandreport.member,
            sort: { enrollmentdate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Status', dataIndex: 'statuscobrand', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true, width: 200,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tierid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Branch Code Enroll', dataIndex: 'branchcodeenroll', sorter: true, width: 150,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cobrand Type', dataIndex: 'cobrandtype', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true, width: 125,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: true, width: 140,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date Cobrand', dataIndex: 'endperiodcobrand', sorter: true, width: 150,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date Tier', dataIndex: 'endperiodtier', sorter: true, width: 125,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Terminate Date', dataIndex: 'terminatedate', sorter: true, width: 130,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Activity Type', dataIndex: 'activityTypeEnum', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member ID', dataIndex: 'memberid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        }
        console.log(activityTypeEnum)

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Cobrand Member Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Row type="flex" justify="end" style={{ marginBottom: 10 }} className={(searching && searchingdata) ? '' : 'hidden'}>
                        <Button htmlType="button" type="primary" size="small" icon="download" label="Generate Report ID" onClick={() => this.handleDownloadModal()} />
                    </Row>
                    {/* <Text form={this.props.form} type="danger">{dateValidation}</Text> */}
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching && searchingdata) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(searching && searchingdata) ? 'hidden' : ''}>Let's Find the Transaction</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(searching && searchingdata) ? 'hidden' : ''} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);