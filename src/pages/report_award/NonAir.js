import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, PartnerSelect, TierSelect, BranchSelect, AwardTypeSelect, TicketOfficeSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Layout, Empty, Modal } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';
import { getProfile } from '../../utilities/AuthService';
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
                insertdatefromdisabled: true,
                insertdatetodisabled: true,
                validdatetodisabled: true
            }

        }
        this.componentTable = [];

        this.handleInsertDateFrom = this.handleInsertDateFrom.bind(this);
        this.handleValidDateFrom = this.handleValidDateFrom.bind(this);
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
        document.title = "Non Air Award Report | Loyalty Management System";

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
            let insertdatefrom = this.props.form.getFieldValue('insertdatefrom');
            let validdatefrom = this.props.form.getFieldValue('validdatefrom');
            let dateValidation = '';

            if (!err && (insertdatefrom || validdatefrom)) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;
                if (searching) {
                    const { partner } = criteria;

                    /* remapping criteria */
                    criteria.partner = (partner) ? [partner] : [];
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            } else {
                if (!err) {
                    dateValidation = "Insert Date or Valid Date is required";
                }
            }
            this.setState({ dateValidation });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = (this.state.reportype === 'HISTORICAL') ? api.url.nonairawardreport.generate : api.url.nonairawardreport.dailygenerate;
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
        let insertdatefromdisabled = true;
        let insertdatetodisabled = true;
        if (reportype === 'DAILY') {
            this.props.form.setFieldsValue({ insertdatefrom: moment(), insertdateto: moment() });
        } else if (reportype === 'HISTORICAL') {
            insertdatefromdisabled = false;
            this.props.form.setFieldsValue({ insertdatefrom: undefined, insertdateto: undefined });
        } else {
            this.props.form.setFieldsValue({ insertdatefrom: undefined, insertdateto: undefined });
        }

        let fielddisabled = { ...this.state.fielddisabled, insertdatefromdisabled, insertdatetodisabled };
        this.setState({ reportype, fielddisabled });

        let validdatefrom = this.props.form.getFieldValue('validdatefrom');
        if (!reportype && !validdatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                partner: undefined, memberstatus: undefined, tier: undefined, cardnumber: undefined, awardtype: undefined
            })
        }
    }

    handleInsertDateFrom = (insertdatefrom) => {
        let insertdatetodisabled = (insertdatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, insertdatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ insertdateto: undefined });

        let validdatefrom = this.props.form.getFieldValue('validdatefrom');
        if (!insertdatefrom && !validdatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                partner: undefined, memberstatus: undefined, tier: undefined, cardnumber: undefined, awardtype: undefined
            })
        }
    }

    handleValidDateFrom = (validdatefrom) => {
        let validdatetodisabled = (validdatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, validdatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ validdateto: undefined });

        let insertdatefrom = this.props.form.getFieldValue('insertdatefrom');
        if (!insertdatefrom && !validdatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                partner: undefined, memberstatus: undefined, tier: undefined, cardnumber: undefined, awardtype: undefined
            })
        }
    }

    render() {
        const { searching, reportype, fielddisabled, dateValidation, roleList, optionsTO } = this.state;
        const { insertdatefromdisabled, insertdatetodisabled, validdatetodisabled } = fielddisabled;
        const { rolecode } = getProfile();

        const insertdatefrom = this.props.form.getFieldValue('insertdatefrom');
        const validdatefrom = this.props.form.getFieldValue('validdatefrom');
        const specialfielddisabled = (insertdatefrom || validdatefrom) ? false : true;

        let findKey = {};
        if (roleList.length > 0) findKey = roleList.find(obj => obj.value === rolecode);

        let roleSPVBO = findKey && findKey.key === 'reporting.spvbo';
        let roleBO = findKey && findKey.key === 'reporting.bo';

        const configurationSearchForm = [
            { labeltext: "Report Type", datafield: "reportype", type: 'select', placeholder: 'Report Type', showDefaultSearch: true, options: optionsReportType, onChange: (e) => this.handleReportTypeChange(e), validationrules: ['required'] },
            {
                labeltext: "Insert Date From", datafield: "insertdatefrom", type: 'datepicker', placeholder: 'Insert Date From', showDefaultSearch: true,
                disabled: insertdatefromdisabled, onChange: (e) => this.handleInsertDateFrom(e), maxDate: moment().subtract(1, 'days')
            },
            {
                labeltext: "Insert Date To", datafield: "insertdateto", type: 'datepicker', placeholder: 'Insert Date To', showDefaultSearch: true,
                defaultPickerValue: insertdatefrom, disabled: !insertdatefrom ? true : insertdatetodisabled, validationrules: insertdatefrom ? ['required'] : [],
                minDate: moment(insertdatefrom), maxDate: (moment(insertdatefrom).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(insertdatefrom).add(3, 'M').subtract(1, 'days')
            },
            { labeltext: "Valid From", datafield: "validdatefrom", type: 'datepicker', placeholder: 'Valid From', showDefaultSearch: false, onChange: (e) => this.handleValidDateFrom(e) },
            {
                labeltext: "Valid Until", datafield: "validdateto", type: 'datepicker', placeholder: 'Valid Until', showDefaultSearch: false,
                defaultPickerValue: validdatefrom, disabled: !validdatefrom ? true : validdatetodisabled, validationrules: validdatefrom ? ['required'] : [],
                minDate: moment(validdatefrom), maxDate: moment(validdatefrom).add(3, 'M').subtract(1, 'days')
            },
            { labeltext: "Partner", datafield: "partner", type: 'component', placeholder: 'Partner', showDefaultSearch: false, component: PartnerSelect, disabled: specialfielddisabled },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: optionsStatus, disabled: specialfielddisabled },
            { labeltext: "Tier", datafield: "tier", type: 'component', placeholder: 'Tier', showDefaultSearch: false, component: TierSelect, disabled: specialfielddisabled },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'exact', placeholder: 'Card Number', showDefaultSearch: false, validationrules: ['pattern.number'], maxLength: 20, disabled: specialfielddisabled },
            { labeltext: "Award Type", datafield: "awardtype", type: 'component', placeholder: 'Award Type', showDefaultSearch: false, component: AwardTypeSelect, disabled: specialfielddisabled },
            /* validate role level */
            { labeltext: "Branch Office", datafield: "branchoffice", type: 'component', placeholder: 'Branch Office', showDefaultSearch: false, component: BranchSelect, disabled: (roleSPVBO || roleBO) },
            (roleBO) ?
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'select', placeholder: 'Ticket Office', showDefaultSearch: false, options: optionsTO } :
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'component', placeholder: 'Ticket Office', showDefaultSearch: false, component: TicketOfficeSelect, disabled: roleSPVBO }
        ];
        const configurationTable = {
            url: (reportype === 'HISTORICAL') ? api.url.nonairawardreport.list : api.url.nonairawardreport.dailylist,
            columnClassName: "nowrap",
            columns: [
                { type: 'field', title: 'Transaction ID', dataIndex: 'transactionid', sorter: true },
                {
                    type: 'field', title: 'Insert Date', dataIndex: 'insertdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Membership Number', dataIndex: 'membershipnumbers', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tier', sorter: true },
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Surname', dataIndex: 'surname', sorter: true },
                { type: 'field', title: 'Email Address', dataIndex: 'emailaddress', sorter: true },
                { type: 'field', title: 'Partner Code', dataIndex: 'nonairpartnercode', sorter: true },
                { type: 'field', title: 'Partner Name', dataIndex: 'nonairpartnername', sorter: true },
                { type: 'field', title: 'Definition', dataIndex: 'definition', sorter: true, width: '350px' },
                {
                    type: 'field', title: 'Valid From', dataIndex: 'validfrom', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Valid Until', dataIndex: 'validuntil', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Award Certificate No.', dataIndex: 'awardcertificateno', sorter: true },
                { type: 'field', title: 'Certificate Status', dataIndex: 'certificatestatus', sorter: true },
                { type: 'field', title: 'Redeemed Points', dataIndex: 'redeemedpoints', sorter: true },
                { type: 'field', title: 'Member Status', dataIndex: 'memberstatus', sorter: true },
                { type: 'field', title: 'Inserted by', dataIndex: 'insertedby', sorter: true },
                { type: 'field', title: 'BO Code', dataIndex: 'bocode', sorter: true },
                { type: 'field', title: 'Transaction Type', dataIndex: 'transactiontype', sorter: true },
                { type: 'field', title: 'Award Type Code', dataIndex: 'awardtypecode', sorter: true },
                { type: 'field', title: 'Self Usage', dataIndex: 'selfusage', sorter: true },
                { type: 'field', title: 'Ticket Office', dataIndex: 'ticketingoffice', sorter: true }
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Non Air Award Report</Title>
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