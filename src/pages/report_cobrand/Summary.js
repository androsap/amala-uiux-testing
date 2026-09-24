import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, CobrandSelect, TierSelect } from '../../components/Base/BaseComponent';
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
                createddateenddisabled: true,
                transactionenddatedisabled: true,
            }

        }
        this.componentTable = [];
    }

    componentDidMount() {
        document.title = "Cobrand Summary Report | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.props.form.validateFieldsAndScroll((err) => {
            let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
            let searchingdata = null;

            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                searchingdata = Object.keys(criteriadata).filter(key => criteriadata[key] !== null).length > 0;
                
                if (searching || searchingdata) {
                    this.componentTable.handleSearchForm(criteria, criteriadata);
                }
                this.setState({ searching, searchingdata, criteria, criteriadata });
            }
            this.setState({ searching, searchingdata });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.cobrandreport.generatesum;
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

    handleCreatedDate = (transactionstartdate, transactionenddate) => {
        let createddatedisabled = (transactionstartdate || transactionenddate) ? true : false;

        let fielddisabled = { ...this.state.fielddisabled, createddatedisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ createddatestart: undefined, createddateend: undefined });
        this.props.form.resetFields(['createddatestart', []]);
        this.props.form.resetFields(['createddateend', []]);
        this.props.form.resetFields(['transactionenddate', []]);
    }

    render() {
        const { searching, fielddisabled } = this.state;
        const { createddatedisabled } = fielddisabled;
        const transactionstartdate = this.props.form.getFieldValue('transactionstartdate');
        const transactionenddate = this.props.form.getFieldValue('transactionenddate');
        const createddatestart = this.props.form.getFieldValue('createddatestart');

        const configurationSearchForm = [
            {
                labeltext: 'Cobrand Code', datafield: "cobrandcode", type: 'component', placeholder: 'Cobrand Code', component: CobrandSelect, showDefaultSearch: true, disabled: false,
                validationrules: transactionstartdate || createddatestart ? [] : ['required'], custom: true
            },
            {
                labeltext: 'Transaction Date Start', datafield: "transactionstartdate", type: 'datepicker', placeholder: 'Transaction Date Start', showDefaultSearch: true, maxDate: moment().subtract(1, 'days'),
                onChange: (e) => this.handleCreatedDate(e), validationrules: ['required']
            },
            {
                labeltext: 'Transaction Date End', datafield: "transactionenddate", type: 'datepicker', placeholder: 'Transaction Date End', showDefaultSearch: true, minDate: moment(transactionstartdate).add(0, 'days'),
                disabled: transactionstartdate ? false : true, validationrules: transactionstartdate ? ['required'] : [], maxDate: (moment(transactionstartdate).add(12, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(transactionstartdate).add(12, 'M').subtract(1, 'days')
            },
            // {
            //     labeltext: 'Create Date Start', datafield: "createddatestart", type: 'datepicker', placeholder: 'Create Date Start', showDefaultSearch: true, maxDate: moment().subtract(0, 'days'),
            //     disabled: transactionstartdate || transactionenddate ? createddatedisabled : false, onChange: (e) => this.handleCreatedDate(e)
            // },
            // {
            //     labeltext: 'Create Date End', datafield: "createddateend", type: 'datepicker', placeholder: 'Create Date End', showDefaultSearch: true, minDate: moment(createddatestart).add(0, 'days'),
            //     disabled: createddatestart ? false : true
            // },
            { labeltext: "Partner Code", datafield: "partnercode", type: 'component', placeholder: 'Partner Code', component: CobrandSelect, showDefaultSearch: false, partner: true },
            { labeltext: "Tier", datafield: "tierid", type: 'component', placeholder: 'Tier', component: TierSelect, showDefaultSearch: false, custom: true },
        ];
        const configurationTable = {
            url: api.url.cobrandreport.summary,
            sort: {},
            columns: [
                // {
                //     type: 'html', title: 'Transaction Date', dataIndex: 'transactiondate', sorter: true, width: 140,
                //     render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                // },
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true, width: 200,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true, width: 125,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true, width: 120,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Tier', dataIndex: 'tierid', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'group', title: 'Accrual', width: 155, align: 'right', childcolumns: [
                        {
                            type: 'field', title: 'Total GA', dataIndex: 'totalaccrualGA', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                        {
                            type: 'field', title: 'Total Sky Team', dataIndex: 'totalaccrualSkyTeam', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                        {
                            type: 'field', title: 'Total Non Sky Team', dataIndex: 'totalaccrualNonSkyteam', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                        {
                            type: 'field', title: 'Total Non Air', dataIndex: 'totalaccrualNonair', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                    ]
                },
                {
                    type: 'group', title: 'Redemption', width: 155, align: 'right', childcolumns: [
                        {
                            type: 'field', title: 'Total GA', dataIndex: 'totalredemptionGA', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                        {
                            type: 'field', title: 'Total Sky Team', dataIndex: 'totalredemptionSkyTeam', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                        {
                            type: 'field', title: 'Total Non Sky Team', dataIndex: 'totalredemptionNonSkyteam', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                        {
                            type: 'field', title: 'Total Non Air', dataIndex: 'totalredemptionNonair', sorter: true,
                            render: (value) => { return (value) ? value : '-' }
                        },
                    ]
                },

                // {
                //     type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true, width: 120,
                //     render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                // },
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
                            <Title level={3}>Cobrand Summary Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Row type="flex" justify="end" style={{ marginBottom: 10 }} className={(searching) ? '' : 'hidden'}>
                        <Button htmlType="button" type="primary" size="small" icon="download" label="Generate Report ID" onClick={() => this.handleDownloadModal()} />
                    </Row>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} className={(searching) ? '' : 'hidden'} didmount={false} />
                    <Title level={2} style={{ textAlign: 'center' }} className={(!searching) ? '' : 'hidden'}>Let's Find the Transaction</Title>
                    <Empty image="../assets/images/searching.svg" imageStyle={{ height: 200 }} description="" className={(!searching) ? '' : 'hidden'} />
                </Layout.Content>
            </Layout>
        );
    }
}

export default Form.create()(App);