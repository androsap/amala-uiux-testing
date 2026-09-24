import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, MembershipTypeSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

const optionsEnroll = [
    { value: 'MOBILE', label: 'MOBILE' },
    { value: 'WEBSITE', label: 'WEBSITE' },
    { value: 'BO', label: 'BO' },
    { value: 'CHECKIN', label: 'CHECK-IN' },
    { value: 'PARTNER', label: 'PARTNER' },
    { value: 'COBRAND', label: 'COBRAND' },
    { value: 'CHARITY', label: 'CHARITY' },
    { value: 'CORPORATE', label: 'CORPORATE' }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            criteria: {},
            fielddisabled: {
                membershipdatedisabled: true
            }
        }
        this.componentTable = [];

        this.handlemembershipperiodfrom = this.handlemembershipperiodfrom.bind(this);
    }

    componentDidMount() {
        document.title = "Terminate Member Report | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            let membershipperiodfrom = this.props.form.getFieldValue('membershipperiodfrom');
            let dateValidation = '';

            if (!err && (membershipperiodfrom)) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            } else {
                if (!err) {
                    dateValidation = "Membership Date From is required";
                }
            }
            this.setState({ dateValidation });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.terminatememberreport.generate;
            let criteria = this.state.criteria;
            let message = 'Generating report file...';
            RetrieveRequest(url, criteria, {}, [], {}).then((response) => {
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
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    handlemembershipperiodfrom = (membershipperiodfrom) => {
        let membershipdatedisabled = (membershipperiodfrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, membershipdatedisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ membershipperiodto: undefined });
    }

    render() {
        const { searching, fielddisabled } = this.state;
        const { membershipdatedisabled } = fielddisabled;
        const membershipperiodfrom = this.props.form.getFieldValue('membershipperiodfrom');

        const configurationSearchForm = [
            { labeltext: "Member Type", datafield: "membertype", type: 'component', placeholder: 'Member Type', showDefaultSearch: true, component: MembershipTypeSelect },
            { labeltext: "Enroll Channel", datafield: "enrollchannel", type: 'select', placeholder: 'Enroll Channel', showDefaultSearch: true, options: optionsEnroll },
            {
                labeltext: "Membership Date From", datafield: "membershipperiodfrom", type: 'datepicker', placeholder: 'Membership Date From', showDefaultSearch: true,
                onChange: (e) => this.handlemembershipperiodfrom(e), maxDate: moment().subtract(1, 'days'), validationrules: ['required']
            },
            {
                labeltext: "Membership Date To", datafield: "membershipperiodto", type: 'datepicker', placeholder: 'Membership Date To', showDefaultSearch: true,
                defaultPickerValue: membershipperiodfrom, validationrules: membershipperiodfrom ? ['required'] : [], disabled: !membershipperiodfrom ? true : membershipdatedisabled,
                minDate: moment(membershipperiodfrom), maxDate: (moment(membershipperiodfrom).add(3, 'M').subtract(0, 'days') > moment().subtract(0, 'days')) ? moment().subtract(0, 'days') : moment(membershipperiodfrom).add(3, 'M').subtract(0, 'days')
            }
        ];
        const configurationTable = {
            url: api.url.terminatememberreport.list,
            columnClassName: "nowrap",
            columns: [
                { type: 'field', title: 'Member ID', dataIndex: 'memberid', sorter: true },
                { type: 'field', title: 'Member Type', dataIndex: 'membertype', sorter: true },
                { type: 'field', title: 'Enroll Channel', dataIndex: 'enrollchannel', sorter: true },
                {
                    type: 'field', title: 'Membership Period', dataIndex: 'membershipperiod', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Terminate Date', dataIndex: 'terminatedate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Terminate Member Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
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