import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, TierSelect, BranchSelect, TicketOfficeSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';
import { getProfile } from '../../utilities/AuthService';
import { jsUcfirst } from '../../utilities/Helpers';
import { getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const optionsStatus = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVEEMAIL', label: 'INACTIVE EMAIL' },
    { value: 'MERGED', label: 'MERGED' },
    { value: 'DECEASED', label: 'DECEASED' },
    { value: 'TEST', label: 'TEST' },
    { value: 'DUPLICATE', label: 'DUPLICATE' },
    { value: 'SUSPECTDUPLICATE', label: 'SUSPECT DUPLICATE' },
    { value: 'SUSPECTEDFRAUD', label: 'SUSPECTED FRAUD' },
    { value: 'FRAUD', label: 'FRAUD' },
    { value: 'TERMINATED', label: 'TERMINATED' }
];
const optionsReportType = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'HISTORICAL', label: 'Historical' }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            visible: false,
            criteria: {},
            reportype: null,
            roleList: [],
            optionsTO: [],
            fielddisabled: {
                buydatefromdisabled: true,
                buydatetodisabled: true,
                transactiondatetodisabled: true,
            }

        }
        this.componentTable = [];

        this.handleBuyDateFrom = this.handleBuyDateFrom.bind(this);
        this.handleTransactionDateFrom = this.handleTransactionDateFrom.bind(this);
    }

    retrieveTO = () => {
        let url = api.url.ticketoffice.list;
        let criteria = { active: true, branchcode: getProfile().branchcode }
        let paging = { limit: -1, page: 1 }
        let sort = { tickoffname: 'asc' };
        RetrieveRequest(url, criteria, paging, [], sort).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsTO = response.result.map(obj => {
                    var result2 = { 'label': obj.tickoffname, 'value': obj.tickoffid };
                    return result2;
                });
                this.setState({ optionsTO });
            } else {
                Alert.error(responsemessage);
            }
        });
    }

    componentDidMount() {
        document.title = "Buy Mileage Report | Loyalty Management System";

        const { form } = this.props;
        let { branchcode, tickoffid } = getProfile() || null;
        form.setFieldsValue({ branchoffice: branchcode });
        form.setFieldsValue({ ticketingoffice: tickoffid });

        const callbackGeneralConfig = (objRole) => {
            this.setState({ roleList: [...this.state.roleList, objRole] });
        }
        const forReport = true;
        /* get general configuration reporting based on Role */
        getGeneralConfig(general_config.reporting_allaccess, callbackGeneralConfig, forReport);
        getGeneralConfig(general_config.reporting_spvgarudamilescc, callbackGeneralConfig, forReport);
        getGeneralConfig(general_config.reporting_ho, callbackGeneralConfig, forReport);
        getGeneralConfig(general_config.reporting_bo, callbackGeneralConfig, forReport);
        getGeneralConfig(general_config.reporting_spvbo, callbackGeneralConfig, forReport);

        this.retrieveTO();
    }

    handleSearchForm = (criteria) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            let buydatefrom = this.props.form.getFieldValue('buydatefrom');
            let transactiondatefrom = this.props.form.getFieldValue('transactiondatefrom');
            let dateValidation = '';

            if (!err && (buydatefrom || transactiondatefrom)) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            } else {
                if (!err) {
                    dateValidation = "Buy Date or Transaction Date is required";
                }
            }
            this.setState({ dateValidation });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = (this.state.reportype === 'HISTORICAL') ? api.url.buymileagereport.generate : api.url.buymileagereport.dailygenerate;
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

    handleReportTypeChange = (reportype) => {
        let buydatefromdisabled = true;
        let buydatetodisabled = true;
        if (reportype === 'DAILY') {
            this.props.form.setFieldsValue({ buydatefrom: moment(), buydateto: moment() });
        } else if (reportype === 'HISTORICAL') {
            buydatefromdisabled = false;
            this.props.form.setFieldsValue({ buydatefrom: undefined, buydateto: undefined });
        } else {
            this.props.form.setFieldsValue({ buydatefrom: undefined, buydateto: undefined });
        }

        let fielddisabled = { ...this.state.fielddisabled, buydatefromdisabled, buydatetodisabled };
        this.setState({ reportype, fielddisabled });

        let transactiondatefrom = this.props.form.getFieldValue('transactiondatefrom');
        if (!reportype && !transactiondatefrom) {
            this.setState({ ...this.state.fielddisabled });
            this.props.form.setFieldsValue({
                transactiontype: undefined, memberstatus: undefined, tier: undefined
            })
        }
    }

    handleBuyDateFrom = (buydatefrom) => {
        let buydatetodisabled = (buydatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, buydatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ buydateto: undefined });

        let transactiondatefrom = this.props.form.getFieldValue('transactiondatefrom');
        if (!buydatefrom && !transactiondatefrom) {
            this.setState({ ...this.state.fielddisabled });
            this.props.form.setFieldsValue({
                transactiontype: undefined, memberstatus: undefined, tier: undefined
            })
        }
    }

    handleTransactionDateFrom = (transactiondatefrom) => {
        let transactiondatetodisabled = (transactiondatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, transactiondatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ transactiondateto: undefined });

        let buydatefrom = this.props.form.getFieldValue('buydatefrom');
        if (!buydatefrom && !transactiondatefrom) {
            this.setState({ ...this.state.fielddisabled });
            this.props.form.setFieldsValue({
                transactiontype: undefined, memberstatus: undefined, tier: undefined
            })
        }
    }

    render() {
        const { searching, reportype, fielddisabled, dateValidation, roleList, optionsTO } = this.state;
        const { buydatefromdisabled, buydatetodisabled, transactiondatetodisabled } = fielddisabled;
        const { rolecode } = getProfile();

        const buydatefrom = this.props.form.getFieldValue('buydatefrom');
        const transactiondatefrom = this.props.form.getFieldValue('transactiondatefrom');
        const specialfielddisabled = (buydatefrom || transactiondatefrom) ? false : true;

        let findKey = {};
        if (roleList.length > 0) findKey = roleList.find(obj => obj.value === rolecode);

        let roleSPVBO = findKey && findKey.key === 'reporting.spvbo';
        let roleBO = findKey && findKey.key === 'reporting.bo';

        const configurationSearchForm = [
            { labeltext: "Report Type", datafield: "reportype", type: 'select', placeholder: 'Report Type', showDefaultSearch: true, options: optionsReportType, onChange: (e) => this.handleReportTypeChange(e), validationrules: ['required'] },
            {
                labeltext: "Buy Date From", datafield: "buydatefrom", type: 'datepicker', placeholder: 'Buy Date From', showDefaultSearch: true,
                disabled: buydatefromdisabled, onChange: (e) => this.handleBuyDateFrom(e), maxDate: moment().subtract(1, 'days')
            },
            {
                labeltext: "Buy Date To", datafield: "buydateto", type: 'datepicker', placeholder: 'Buy Date To', showDefaultSearch: true,
                defaultPickerValue: buydatefrom, disabled: !buydatefrom ? true : buydatetodisabled, validationrules: buydatefrom ? ['required'] : [],
                minDate: moment(buydatefrom), maxDate: (moment(buydatefrom).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(buydatefrom).add(3, 'M').subtract(1, 'days')
            },
            { labeltext: "Transaction Date From", datafield: "transactiondatefrom", type: 'datepicker', placeholder: 'Transaction Date From', showDefaultSearch: false, onChange: (e) => this.handleTransactionDateFrom(e) },
            {
                labeltext: "Transaction Date To", datafield: "transactiondateto", type: 'datepicker', placeholder: 'Transaction Date To', showDefaultSearch: false,
                defaultPickerValue: transactiondatefrom, disabled: !transactiondatefrom ? true : transactiondatetodisabled, validationrules: transactiondatefrom ? ['required'] : [],
                minDate: moment(transactiondatefrom), maxDate: moment(transactiondatefrom).add(3, 'M').subtract(1, 'days')
            },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: optionsStatus, disabled: specialfielddisabled },
            { labeltext: "Tier", datafield: "tier", type: 'component', placeholder: 'Tier', showDefaultSearch: false, component: TierSelect, disabled: specialfielddisabled },
            /* validate role level */
            { labeltext: "Branch Office", datafield: "branchoffice", type: 'component', placeholder: 'Branch Office', showDefaultSearch: false, component: BranchSelect, disabled: (roleSPVBO || roleBO) },
            (roleBO) ?
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'select', placeholder: 'Ticket Office', showDefaultSearch: false, options: optionsTO } :
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'component', placeholder: 'Ticket Office', showDefaultSearch: false, component: TicketOfficeSelect, disabled: roleSPVBO }
        ];
        const configurationTable = {
            url: (reportype === 'HISTORICAL') ? api.url.buymileagereport.list : api.url.buymileagereport.dailylist,
            columnClassName: "nowrap",
            columns: [
                {
                    type: 'html', title: 'Buy Date', dataIndex: 'buydate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Card Number', dataIndex: 'card_number', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Member Status', dataIndex: 'member_status', sorter: true,
                    render: (value) => { return jsUcfirst(value) }
                },
                { type: 'field', title: 'Name on Card', dataIndex: 'name_on_card', sorter: true },
                { type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true },
                { type: 'field', title: 'Last Name', dataIndex: 'lastname', sorter: true },
                { type: 'field', title: 'Member Email', dataIndex: 'member_email', sorter: true },
                { type: 'field', title: 'Tier ID', dataIndex: 'tier_id', sorter: true },
                { type: 'field', title: 'Currency Code', dataIndex: 'currencycode', sorter: true },
                { type: 'field', title: 'Unit Type', dataIndex: 'unittype', sorter: true },
                { type: 'field', title: 'Buy Mileage ID', dataIndex: 'buymilleageid', sorter: true },
                { type: 'field', title: 'Buy Mileage Name', dataIndex: 'buymileagename', sorter: true },
                { type: 'field', title: 'Buy Mileage Type', dataIndex: 'buymileagetype', sorter: true },
                { type: 'field', title: 'Quantity', dataIndex: 'quantity', sorter: true },
                {
                    type: 'html', title: 'Promo', dataIndex: 'promo', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Payment Time Limit', dataIndex: 'payment_deadline', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Total Mileage', dataIndex: 'totalmileage', sorter: true },
                { type: 'field', title: 'VAT', dataIndex: 'vat', sorter: true },
                { type: 'field', title: 'VAT Amount', dataIndex: 'vatamount', sorter: true },
                { type: 'field', title: 'Total Amount', dataIndex: 'totalamount', sorter: true },
                { type: 'field', title: 'Primary Email', dataIndex: 'primary_email', sorter: true },
                { type: 'field', title: 'Update Member Email', dataIndex: 'update_member_email', sorter: true },
                {
                    type: 'html', title: 'Secondary Email', dataIndex: 'secondary_email', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Payment Method', dataIndex: 'payment_method', sorter: true },
                {
                    type: 'html', title: 'Card Issuer', dataIndex: 'card_issuer', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Ref Number', dataIndex: 'ref_number', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Transaction Code', dataIndex: 'transaction_code', sorter: true },
                { type: 'field', title: 'Transaction Type', dataIndex: 'transaction_type', sorter: true },
                {
                    type: 'html', title: 'Transaction Date', dataIndex: 'transaction_date', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Award Miles', dataIndex: 'award_miles', sorter: true },
                { type: 'field', title: 'Tier Miles', dataIndex: 'tier_miles', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                { type: 'field', title: 'Transaction ID', dataIndex: 'trx_id', sorter: true },
                { type: 'field', title: 'Status Buy Mileage', dataIndex: 'status_buy_milleage', sorter: true },
                {
                    type: 'html', title: 'Transaction Created Date', dataIndex: 'transaction_created_date', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Buy Created Date', dataIndex: 'buy_created_date', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Transaction Created by', dataIndex: 'transaction_created_by', sorter: true },
                { type: 'field', title: 'Buy Created by', dataIndex: 'buy_created_by', sorter: true },
                { type: 'field', title: 'Branch Code', dataIndex: 'branch_code', sorter: true },
                { type: 'field', title: 'Catalogue', dataIndex: 'catalogue', sorter: true },
                { type: 'field', title: 'Ticket Office', dataIndex: 'ticketingoffice', sorter: true },
                {
                    type: 'html', title: 'Card Identifier', dataIndex: 'card_identifier', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                }
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Buy Mileage Report</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <Text form={this.props.form} type="danger">{dateValidation}</Text>
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