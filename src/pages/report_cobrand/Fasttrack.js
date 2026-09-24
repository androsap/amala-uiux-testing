import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest, DetailRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, PartnerSelect, TierSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            visible: false,
            criteria: {},
            criteriadata: {},
            fielddisabled: {
                enrollmentdatestartdisabled: true,
                enrollmentdateenddisabled: true,
                transactionenddatedisabled: true,
            }
        }
        this.componentTable = [];
    }

    componentDidMount() {
        document.title = "Fast Track Report | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.props.form.validateFieldsAndScroll((err) => {
            let dateValidation = '';
            let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;

            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                let searchingdata = Object.keys(criteriadata).filter(key => criteriadata[key] !== null).length > 0;
                if (searching || searchingdata) {
                    this.componentTable.handleSearchForm(criteria, criteriadata);
                }
                this.setState({ searching, searchingdata, criteria, criteriadata });
            } else {
                if (!err || !searching) {
                    dateValidation = "Create Date is required";
                }
            }
            this.setState({ dateValidation, searching, criteriadata });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.cobrandreport.generateft;
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
    }

    render() {
        const { searching, searchingdata, dateValidation } = this.state;
        const enrollmentdatestart = this.props.form.getFieldValue('enrollmentdatestart');

        const configurationSearchForm = [
            { datafield: "partnercode", type: 'component', placeholder: 'Partner Code', component: PartnerSelect, showDefaultSearch: true, validationrules: ['required'], custom: true, customRender: true, criteria: {partnertype: 'NONAIR'}},
            {
                datafield: "enrollmentdatestart", type: 'datepicker', placeholder: 'Enrollment Date Start', showDefaultSearch: true, maxDate: moment().subtract(1, 'days'), specialSearch: true,
                onChange: (e) => this.handleCreatedDate(e), validationrules: ['required']
            },
            {
                datafield: "enrollmentdateend", type: 'datepicker', placeholder: 'Enrollment Date End', showDefaultSearch: true, minDate: moment(enrollmentdatestart).add(0, 'days'), specialSearch: true,
                validationrules: enrollmentdatestart ? ['required'] : [], disabled: enrollmentdatestart ? false : true, maxDate: (moment(enrollmentdatestart).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(enrollmentdatestart).add(3, 'M').subtract(1, 'days')
            },
        ];
        const configurationTable = {
            url: api.url.cobrandreport.fasttrack,
            sort: { enrollmentdate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Branch Office', dataIndex: 'branchcodeenroll', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tierid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Partner', dataIndex: 'partnercode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cobrand', dataIndex: 'cobrandtype', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Cobrand Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Period Tier', dataIndex: 'endperiodtier', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Member ID', dataIndex: 'memberid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Fast Track Report</Title>
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