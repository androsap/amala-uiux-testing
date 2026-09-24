import React from 'react';
import { api } from '../../config/Services';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button, Alert, SearchForm, PartnerSelect, AirportSelect, TierSelect, BranchSelect, CompartmentSelect, SubclassSelect, AirlineSelect, TicketOfficeSelect } from '../../components/Base/BaseComponent';
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            criteria: {},
            roleList: [],
            optionsTO: [],
            fielddisabled: {
                insertdatetodisabled: true,
                activitydatetodisabled: true,
                partnerdisabled: true,
                airlinesdisabled: true,
                compartmentclassdisabled: true,
                subclassdisabled: true
            }
        }
        this.componentTable = [];

        this.handleInsertDateFrom = this.handleInsertDateFrom.bind(this);
        this.handleActivityDateFrom = this.handleActivityDateFrom.bind(this);
        this.handlePartnerChange = this.handlePartnerChange.bind(this);
        this.handleAirlinesChange = this.handleAirlinesChange.bind(this);
        this.handleCompartmentChange = this.handleCompartmentChange.bind(this);
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
        document.title = "Air Accrual Report | Loyalty Management System";

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
            let activitydatefrom = this.props.form.getFieldValue('activitydatefrom');
            let dateValidation = '';

            if (!err && (insertdatefrom || activitydatefrom)) {
                let searching = Object.keys(criteria).filter(key => criteria[key] !== null).length > 0;

                if (searching) {
                    const { partner, airlines } = criteria;
                    /* remapping criteria */
                    criteria.partner = (partner) ? [partner] : [];
                    criteria.airlines = (airlines) ? [airlines] : [];
                    this.componentTable.handleSearchForm(criteria);
                }
                this.setState({ searching, criteria });
            } else {
                if (!err) {
                    dateValidation = "Insert Date or Activity Date is required";
                }
            }
            this.setState({ dateValidation });
        })
    }

    handleDownloadModal = () => {
        const callback = () => {
            let url = api.url.airaccrualreport.generate;
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

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleInsertDateFrom = (insertdatefrom) => {
        let insertdatetodisabled = (insertdatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, insertdatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ insertdateto: undefined });

        let activitydatefrom = this.props.form.getFieldValue('activitydatefrom');
        if (!insertdatefrom && !activitydatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });
            this.props.form.setFieldsValue({
                insertdateto: undefined, partner: undefined, airlines: undefined, compartmentclass: undefined, subclass: undefined,
                memberstatus: undefined, origin: undefined, destination: undefined, activitydateto: undefined, tier: undefined, cardnumber: undefined
            })
        }
    }

    handleActivityDateFrom = (activitydatefrom) => {
        let activitydatetodisabled = (activitydatefrom) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, activitydatetodisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ activitydateto: undefined });

        let insertdatefrom = this.props.form.getFieldValue('insertdatefrom');
        if (!insertdatefrom && !activitydatefrom) {
            this.setState({ ...this.state.fielddisabled, partnerdisabled: true });

            this.props.form.setFieldsValue({
                insertdateto: undefined, partner: undefined, airlines: undefined, compartmentclass: undefined, subclass: undefined,
                memberstatus: undefined, origin: undefined, destination: undefined, tier: undefined, cardnumber: undefined
            })
        }
    }

    /* handle partner change */
    handlePartnerChange = (partnercode) => {
        let airlinesdisabled = true;
        let compartmentclassdisabled = true;
        let subclassdisabled = true;
        if (partnercode) {
            airlinesdisabled = false;
            this.componentSearchForm.component.airlines.retrieveData({ partnercode });
        }
        let fielddisabled = { ...this.state.fielddisabled, airlinesdisabled, compartmentclassdisabled, subclassdisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ airlines: undefined, compartmentclass: undefined, subclass: undefined });
    }

    /* handle airline change */
    handleAirlinesChange = (airlinecode) => {
        let compartmentclassdisabled = true;
        let subclassdisabled = true;
        if (airlinecode) {
            compartmentclassdisabled = false;
            this.componentSearchForm.component.compartmentclass.retrieveData({ airlinecode });
        }
        let fielddisabled = { ...this.state.fielddisabled, compartmentclassdisabled, subclassdisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ compartmentclass: undefined, subclass: undefined });
    }

    /* handle compartment change */
    handleCompartmentChange = (compartmentcode) => {
        let subclassdisabled = true;
        if (compartmentcode) {
            subclassdisabled = false;

            let airlinecode = this.props.form.getFieldValue('airlines');
            this.componentSearchForm.component.subclass.retrieveData({ airlinecode, compartmentcode });
        }
        let fielddisabled = { ...this.state.fielddisabled, subclassdisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ subclass: undefined });
    }

    render() {
        const { searching, fielddisabled, dateValidation, roleList, optionsTO } = this.state;
        const { insertdatetodisabled, activitydatetodisabled, airlinesdisabled, compartmentclassdisabled, subclassdisabled } = fielddisabled;
        const { rolecode } = getProfile();

        const partner = this.props.form.getFieldValue('partner');
        const insertdatefrom = this.props.form.getFieldValue('insertdatefrom');
        const activitydatefrom = this.props.form.getFieldValue('activitydatefrom');
        const specialfielddisabled = (insertdatefrom || activitydatefrom) ? false : true;

        let findKey = {};
        if (roleList.length > 0) findKey = roleList.find(obj => obj.value === rolecode);

        let roleSPVBO = findKey && findKey.key === 'reporting.spvbo';
        let roleBO = findKey && findKey.key === 'reporting.bo';
        const configurationSearchForm = [
            {
                labeltext: "Insert Date From", datafield: "insertdatefrom", type: 'datepicker', placeholder: 'Insert Date From', showDefaultSearch: true,
                onChange: this.handleInsertDateFrom, maxDate: moment().subtract(1, 'days')
            },
            {
                labeltext: "Insert Date To", datafield: "insertdateto", type: 'datepicker', placeholder: 'Insert Date To', showDefaultSearch: true,
                defaultPickerValue: insertdatefrom, validationrules: insertdatefrom ? ['required'] : [], disabled: !insertdatefrom ? true : insertdatetodisabled,
                minDate: moment(insertdatefrom), maxDate: (moment(insertdatefrom).add(3, 'M').subtract(1, 'days') > moment().subtract(1, 'days')) ? moment().subtract(1, 'days') : moment(insertdatefrom).add(3, 'M').subtract(1, 'days')
            },
            { labeltext: "Activity Date From", datafield: "activitydatefrom", type: 'datepicker', placeholder: 'Activity Date From', showDefaultSearch: true, onChange: (e) => this.handleActivityDateFrom(e) },
            {
                labeltext: "Activity Date To", datafield: "activitydateto", type: 'datepicker', placeholder: 'Activity Date To', showDefaultSearch: true,
                defaultPickerValue: activitydatefrom, disabled: !activitydatefrom ? true : activitydatetodisabled, validationrules: activitydatefrom ? ['required'] : [],
                minDate: moment(activitydatefrom), maxDate: moment(activitydatefrom).add(3, 'M').subtract(1, 'days')
            },
            {
                labeltext: "Partner", datafield: "partner", type: 'component', placeholder: 'Partner', showDefaultSearch: false, component: PartnerSelect,
                onChange: (e) => this.handlePartnerChange(e), disabled: specialfielddisabled
            },
            {
                labeltext: "Airline", datafield: "airlines", type: 'component', placeholder: 'Airline', showDefaultSearch: false, component: AirlineSelect,
                disabled: partner ? airlinesdisabled : true, validationrules: partner ? ['required'] : [], onChange: (e) => this.handleAirlinesChange(e)
            },
            {
                labeltext: "Compartment Class", datafield: "compartmentclass", type: 'component', placeholder: 'Compartment Class', showDefaultSearch: false, component: CompartmentSelect,
                disabled: partner ? compartmentclassdisabled : true, onChange: (e) => this.handleCompartmentChange(e)
            },
            { labeltext: "Subclass", datafield: "subclass", type: 'component', placeholder: 'Subclass', showDefaultSearch: false, component: SubclassSelect, disabled: partner ? subclassdisabled : true },
            { labeltext: "Member Status", datafield: "memberstatus", type: 'select', placeholder: 'Member Status', showDefaultSearch: false, options: optionsStatus, disabled: specialfielddisabled },
            { labeltext: "Origin", datafield: "origin", type: 'component', placeholder: 'Origin', showDefaultSearch: false, component: AirportSelect, multipleSelect: true, disabled: specialfielddisabled },
            { labeltext: "Destination", datafield: "destination", type: 'component', placeholder: 'Destination', showDefaultSearch: false, component: AirportSelect, multipleSelect: true, disabled: specialfielddisabled },
            { labeltext: "Tier", datafield: "tier", type: 'component', placeholder: 'Tier', showDefaultSearch: false, component: TierSelect, disabled: specialfielddisabled },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'exact', placeholder: 'Card Number', showDefaultSearch: false, validationrules: ['pattern.number'], maxLength: 20, disabled: specialfielddisabled },
            /* validate role level */
            { labeltext: "Branch Office", datafield: "branchoffice", type: 'component', placeholder: 'Branch Office', showDefaultSearch: false, component: BranchSelect, disabled: (roleSPVBO || roleBO) },
            (roleBO) ?
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'select', placeholder: 'Ticket Office', showDefaultSearch: false, options: optionsTO } :
                { labeltext: "Ticket Office", datafield: "ticketingoffice", type: 'component', placeholder: 'Ticket Office', showDefaultSearch: false, component: TicketOfficeSelect, disabled: roleSPVBO }
        ];
        const configurationTable = {
            url: api.url.airaccrualreport.list,
            columnClassName: "nowrap",
            columns: [
                { type: 'field', title: 'Transaction ID', dataIndex: 'transactionid', sorter: true },
                {
                    type: 'field', title: 'Insert Date', dataIndex: 'insertdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Membership Number', dataIndex: 'membershipnumber', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tier', sorter: true },
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Surname', dataIndex: 'surname', sorter: true },
                { type: 'field', title: 'Email Address', dataIndex: 'emailaddress', sorter: true },
                { type: 'field', title: 'Partner', dataIndex: 'partner', sorter: true },
                {
                    type: 'field', title: 'Activity Classification', dataIndex: 'activityclassification', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'DOT', dataIndex: 'dot', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Origin', dataIndex: 'org', sorter: true },
                { type: 'field', title: 'Destination', dataIndex: 'dest', sorter: true },
                { type: 'field', title: 'Sector', dataIndex: 'sector', sorter: true },
                { type: 'field', title: 'Marketing Flight Number', dataIndex: 'marketingflightnumber', sorter: true },
                { type: 'field', title: 'Operating Flight Number', dataIndex: 'operatingflightnumber', sorter: true },
                { type: 'field', title: 'Booking Class', dataIndex: 'bookingclass', sorter: true },
                { type: 'field', title: 'Tier Points', dataIndex: 'tierpoints', sorter: true },
                { type: 'field', title: 'Award Points', dataIndex: 'awardpoints', sorter: true },
                { type: 'field', title: 'Billing Base Points', dataIndex: 'billingbasepoints', sorter: true },
                {
                    type: 'field', title: 'Billing Bonus Points', dataIndex: 'billingbonuspoints', sorter: true,
                    render: (value) => { return (value !== null) ? value : '-' }
                },
                { type: 'field', title: 'Pax Name', dataIndex: 'paxname', sorter: true },
                { type: 'field', title: 'Marketing Airline', dataIndex: 'marketingairline', sorter: true },
                { type: 'field', title: 'Operating Airline', dataIndex: 'operatingairline', sorter: true },
                { type: 'field', title: 'Booking Code', dataIndex: 'bookingcode', sorter: true },
                { type: 'field', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true },
                { type: 'field', title: 'Flown Class', dataIndex: 'flownclass', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                { type: 'field', title: 'Member Status', dataIndex: 'memberstatus', sorter: true },
                { type: 'field', title: 'Inserted by', dataIndex: 'insertedby', sorter: true },
                { type: 'field', title: 'BO Code', dataIndex: 'bocode', sorter: true },
                { type: 'field', title: 'Transaction Type', dataIndex: 'transactiontype', sorter: true },
                { type: 'field', title: 'Ticket Office', dataIndex: 'ticketingoffice', sorter: true }
            ]
        }

        return (
            <Layout>
                <Layout.Content style={{ margin: '16px 0', padding: '24px', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Air Accrual Report</Title>
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