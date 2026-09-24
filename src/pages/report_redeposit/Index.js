import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, BranchSelect, TicketOfficeSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';
import { getProfile } from '../../utilities/AuthService';
import { jsUcfirst } from '../../utilities/Helpers';
import { getGeneralConfig } from '../../utilities/Helpers';
import { general_config } from '../../utilities/Constant';

const { Title, Paragraph } = Typography;
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
const optionsTrxType = [
    { value: 'CANCELLATION', label: 'Cancellation' },
    { value: 'SPENDING_CORRECTION', label: 'Spending Correction' }
];
const optionsCategoryType = [
    { value: 'AIR', label: 'Air' },
    { value: 'NONAIR', label: 'Non Air' }
];
const optionsSelfUsage = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
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
                redepositdatefromdisabled: true,
                redepositdatetodisabled: true
            }

        }
        this.componentTable = [];

        this.handleRedepositDateFrom = this.handleRedepositDateFrom.bind(this);
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
        document.title = "Redeposit Report | Loyalty Management System";

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
            if (!err) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    const { partner } = criteria;

                    /* remapping criteria */
                    criteria.partner = (partner) ? [partner] : [];
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            }
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = (this.state.reportype === 'HISTORICAL') ? api.url.redepositreport.generate : api.url.redepositreport.dailygenerate;
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
        let redepositdatefromdisabled = true;
        let redepositdatetodisabled = true;
        if (reportype === 'DAILY') {
            this.props.form.setFieldsValue({ redepositdatefrom: moment(), redepositdateto: moment() });
        } else if (reportype === 'HISTORICAL') {
            redepositdatefromdisabled = false;
            this.props.form.setFieldsValue({ redepositdatefrom: undefined, redepositdateto: undefined });
        } else {
            this.props.form.setFieldsValue({ redepositdatefrom: undefined, redepositdateto: undefined });
        }

        let fielddisabled = { ...this.state.fielddisabled, redepositdatefromdisabled, redepositdatetodisabled };
        this.setState({ reportype, fielddisabled });

        let redepositdatefrom = this.props.form.getFieldValue('redepositdatefrom');
        if (!reportype && !redepositdatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                memberstatus: undefined, transactiontype: undefined, categorytype: undefined, selfusage: undefined, memberid: undefined
            })
        }
    }

    handleRedepositDateFrom = (redepositdatefrom) => {
        let redepositdatetodisabled = (redepositdatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, redepositdatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ redepositdateto: undefined });

        if (!redepositdatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                memberstatus: undefined, transactiontype: undefined, categorytype: undefined, selfusage: undefined, memberid: undefined
            })
        }
    }

    render() {
        const { searching, reportype, fielddisabled, roleList, optionsTO } = this.state;
        const { redepositdatefromdisabled, redepositdatetodisabled } = fielddisabled;
        const { rolecode } = getProfile();

        const redepositdatefrom = this.props.form.getFieldValue('redepositdatefrom');
        const specialfielddisabled = (redepositdatefrom) ? false : true;

        let findKey = {};
        if (roleList.length > 0) findKey = roleList.find(obj => obj.value === rolecode);

        let roleSPVBO = findKey && findKey.key === 'reporting.spvbo';
        let roleBO = findKey && findKey.key === 'reporting.bo';

        const configurationSearchForm = [
            { labeltext: "Report Type", datafield: "reportype", type: 'select', placeholder: 'Report Type', showDefaultSearch: true, options: optionsReportType, validationrules: ['required'], onChange: (e) => this.handleReportTypeChange(e) },
            {
                labeltext: "Redeposit Date From", datafield: "redepositdatefrom", type: 'datepicker', placeholder: 'Redeposit Date From', showDefaultSearch: true,
                validationrules: redepositdatefromdisabled ? [] : ['required'], disabled: redepositdatefromdisabled, onChange: (e) => this.handleRedepositDateFrom(e), maxDate: moment().subtract(1, 'days')
            },
            {
                labeltext: "Redeposit Date To", datafield: "redepositdateto", type: 'datepicker', placeholder: 'Redeposit Date To', showDefaultSearch: true,
                defaultPickerValue: redepositdatefrom, validationrules: redepositdatefrom ? ['required'] : [], disabled: !redepositdatefrom ? true : redepositdatetodisabled,
                minDate: moment(redepositdatefrom), maxDate: (moment(redepositdatefrom).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(redepositdatefrom).add(3, 'M').subtract(1, 'days')
            },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: optionsStatus, disabled: specialfielddisabled },
            { labeltext: "Transaction Type", datafield: "transactiontype", type: 'select', placeholder: 'Transaction Type', showDefaultSearch: false, options: optionsTrxType, disabled: specialfielddisabled },
            { labeltext: "Category Type", datafield: "categorytype", type: 'select', placeholder: 'Category Type', showDefaultSearch: false, options: optionsCategoryType, disabled: specialfielddisabled },
            { labeltext: "Self Usage", datafield: "selfusage", type: 'select', placeholder: 'Self Usage', showDefaultSearch: false, options: optionsSelfUsage, disabled: specialfielddisabled },
            { labeltext: "Member ID", datafield: "memberid", type: 'exact', placeholder: 'Member ID', showDefaultSearch: false, validationrules: ['pattern.number'], maxLength: 20, disabled: specialfielddisabled },
            /* validate role level */
            { labeltext: "Branch Office", datafield: "branchoffice", type: 'component', placeholder: 'Branch Office', showDefaultSearch: false, component: BranchSelect, disabled: (roleSPVBO || roleBO) },
            (roleBO) ?
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'select', placeholder: 'Ticket Office', showDefaultSearch: false, options: optionsTO } :
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'component', placeholder: 'Ticket Office', showDefaultSearch: false, component: TicketOfficeSelect, disabled: roleSPVBO }
        ];
        const configurationTable = {
            url: (reportype === 'HISTORICAL') ? api.url.redepositreport.list : api.url.redepositreport.dailylist,
            columnClassName: "nowrap",
            columns: [
                { type: 'field', title: 'Transaction ID', dataIndex: 'transactionid', sorter: true },
                {
                    type: 'field', title: 'Date of Redeposit', dataIndex: 'dateofredeposit', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Member ID', dataIndex: 'memberid', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tier', sorter: true },
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Surname', dataIndex: 'surname', sorter: true },
                { type: 'field', title: 'Definition', dataIndex: 'definition', sorter: true },
                { type: 'field', title: 'Activity Redeposit', dataIndex: 'activityredeposit', sorter: true },
                { type: 'field', title: 'Redeposit Miles', dataIndex: 'redepositmiles', sorter: true },
                { type: 'field', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true },
                { type: 'field', title: 'Certificate No.', dataIndex: 'certificateno', sorter: true },
                { type: 'field', title: 'Inserted by', dataIndex: 'insertedby', sorter: true },
                { type: 'field', title: 'BO Code', dataIndex: 'bocode', sorter: true },
                {
                    type: 'html', title: 'Transaction Type', dataIndex: 'transactiontype', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value, '_') : '-' }
                },
                { type: 'field', title: 'Self Usage', dataIndex: 'selfusage', sorter: true },
                { type: 'field', title: 'Award Type Code', dataIndex: 'awardtypecode', sorter: true },
                {
                    type: 'html', title: 'Category Type', dataIndex: 'categorytype', sorter: true,
                    render: (value) => { return (value === 'AIR') ? 'Air' : 'Non Air' }
                },
                {
                    type: 'html', title: 'Insert Date', dataIndex: 'insertdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Member Status', dataIndex: 'memberstatus', sorter: true },
                { type: 'field', title: 'Ticket Office', dataIndex: 'ticketingoffice', sorter: true }
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Redeposit Report</Title>
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