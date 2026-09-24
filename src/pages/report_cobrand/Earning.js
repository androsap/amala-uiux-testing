import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const ActivitySelect = [
    { value: 'GA', label: 'GA' },
    { value: 'AIR-SKYTEAM', label: 'Air SkyTeam' },
    { value: 'AIR-NON SKYTEAM', label: 'Air Non-SkyTeam' },
    { value: 'NONAIR', label: 'Non-Air' },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            searchingdata: false,
            visible: false,
            criteria: {},
            criteriadata: {},
            fielddisabled: {
                createddatedisabled: false,
                trxdatedisabled: false,
            }

        }
        this.componentTable = [];
    }

    componentDidMount() {
        document.title = "Earning Cobrand Member Report | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.props.form.validateFieldsAndScroll((err) => {
            let dateValidation = '';
            let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
            let searchingdata = null;

            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                searchingdata = Object.keys(criteriadata).filter(key => criteriadata[key] !== null).length > 0;
                
                if (searching || searchingdata) {
                    this.componentTable.handleSearchForm(criteria, criteriadata);
                }
                this.setState({ searching, searchingdata, criteria, criteriadata });
            } else {
                if (!err || !searching) {
                    dateValidation = "Transaction Date is required";
                }
            }
            this.setState({ dateValidation, searching, searchingdata });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.cobrandreport.generatetrx;
            let criteria = this.state.criteria;
            let data = this.state.criteriadata;
            let message = 'Generating report file...';
            RetrieveRequest(url, criteria, {}, [], {}, data).then((response) => {
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
        this.props.form.setFieldsValue({ createddatestart: undefined, createddateend: undefined });
        this.props.form.resetFields(['createddatestart', []]);
        this.props.form.resetFields(['createddateend', []]);
        this.props.form.resetFields(['transactiondateend', []]);
    }

    render() {
        const { searching, searchingdata, fielddisabled, dateValidation } = this.state;
        const { createddatedisabled } = fielddisabled;
        const transactiondatestart = this.props.form.getFieldValue('transactiondatestart');
        const transactiondateend = this.props.form.getFieldValue('transactiondateend');
        const createddatestart = this.props.form.getFieldValue('createddatestart');

        const configurationSearchForm = [
            { datafield: "activitytype", type: 'select', options: ActivitySelect, placeholder: 'Activity Type', showDefaultSearch: true, validationrules: transactiondatestart || createddatestart ? [] : ['required'] },
            {
                datafield: "transactiondatestart", type: 'datepicker', placeholder: 'Transaction Date Start', showDefaultSearch: true, maxDate: moment().subtract(1, 'days'), specialSearch: true,
                onChange: (e) => this.handleCreatedDate(e)
            },
            {
                datafield: "transactiondateend", type: 'datepicker', placeholder: 'Transaction Date End', showDefaultSearch: true, minDate: moment(transactiondatestart).add(0, 'days'), specialSearch: true,
                disabled: transactiondatestart ? false : true, validationrules: transactiondatestart ? ['required'] : [], maxDate: (moment(transactiondatestart).add(12, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(transactiondatestart).add(12, 'M').subtract(1, 'days')
            },
            {
                datafield: "createddatestart", type: 'datepicker', placeholder: 'Create Date Start', showDefaultSearch: true, maxDate: moment().subtract(1, 'days'), specialSearch: true,
                disabled: transactiondatestart || transactiondateend ? createddatedisabled : false, onChange: (e) => this.handleCreatedDate(e)
            },
            {
                datafield: "createddateend", type: 'datepicker', placeholder: 'Create Date End', showDefaultSearch: true, minDate: moment(createddatestart).add(0, 'days'), specialSearch: true,
                disabled: createddatestart ? false : true, validationrules: createddatestart ? ['required'] : [], maxDate: (moment(createddatestart).add(12, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(createddatestart).add(12, 'M').subtract(1, 'days')
            },
        ];
        const configurationTable = {
            url: api.url.cobrandreport.earning,
            sort: { transactiondate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Activity Type', dataIndex: 'activitytype', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true, width: 125,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Transaction Date', dataIndex: 'transactiondate', sorter: true, width: 135,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true, width: 125,
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
                    type: 'field', title: 'Cobrand Type', dataIndex: 'cobrandtype', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tierid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true, width: 115, align: 'right',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true, width: 100, align: 'right',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Origin', dataIndex: 'origin', sorter: true, 
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Destination', dataIndex: 'destination', sorter: true, 
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Booking Class', dataIndex: 'bookingclass', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Booking Code', dataIndex: 'bookingcode', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Activity Name', dataIndex: 'activityname', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member ID', dataIndex: 'memberid', sorter: true, width: 120,
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Earning Cobrand Member Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Row type="flex" justify="end" style={{ marginBottom: 10 }} className={(searching || searchingdata) ? '' : 'hidden'}>
                        <Button htmlType="button" type="primary" size="small" icon="download" label="Generate Report ID" onClick={() => this.handleDownloadModal()} />
                    </Row>
                    {/* <Text form={this.props.form} type="danger">{dateValidation}</Text> */}
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching || searchingdata) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? (!searchingdata) ? '' : 'hidden' : 'hidden'}>Let's Find the Transaction</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? (!searchingdata) ? '' : 'hidden' : 'hidden'} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);