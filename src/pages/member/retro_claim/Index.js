import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase, AirlineSelect } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../../utilities/Helpers';
import ActivityInfoForm from '../../rc_manager/ActivityInfo';

const { Title } = Typography;
const optionsRequestInfo = [
    { label: "Wait For Verification", value: "WAIT_FOR_VERIFICATION" },
    { label: "Override Rejected By User", value: "OVERRIDE_REJECTED_BY_USER" },
    { label: "Override Approved By User", value: "OVERRIDE_APPROVED_BY_USER" },
    { label: "Retro Request Approved", value: "RETRO_REQUEST_APPROVED" },
    { label: "Retro Request Created", value: "RETRO_REQUEST_CREATED" },
    { label: "Retro Request Rejected", value: "RETRO_REQUEST_REJECTED" },
    { label: "Duplicate With Activity", value: "DUPLICATE_WITH_ACTIVITY" },
    { label: "Invalid Name Check", value: "INVALID_NAME_CHECK" },
    { label: "Waiting For Manual Verification", value: "WAITING_FOR_MANUAL_VERIFICATION" },
    { label: "Duplicate Request", value: "DUPLICATE_REQUEST" },
    { label: "Activity Rating Failed", value: "ACTIVITY_RATING_FAILED" },
    { label: "Retro Report Send To FFP Skyteam", value: "RETRO_REPORT_SENT_TO_FFP_SKYTEAM" },
    { label: "Retro Request Not In Period", value: "RETRO_REQUEST_NOTINPERIOD" }
]
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            retrofrom: this.props.match.params.RETROFROM,
            showActivityInfo: false,
            activityid: null
        }
    }
    componentDidMount() {
        document.title = "Retro Claim Management | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleModalActivityInfo = (activityid) => {
        this.setState({ showActivityInfo: true, activityid })
    }

    handleCancelActivityInfo = () => {
        this.setState({ showActivityInfo: false });
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { activityid, showActivityInfo } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.retroclaim.list,
            criteria: { memberid },
            sort: { requestdate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Request Date', dataIndex: 'requestdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Departure Date', dataIndex: 'departuredate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Flight Information', dataIndex: 'flightinformation',
                    render: (value, row, index) => {
                        let operatingairline = (row.operatingairline) ? row.operatingairline : null;
                        let operatingfltnumber = (row.operatingfltnumber) ? row.operatingfltnumber : null;
                        if (operatingairline || operatingairline) {
                            return operatingairline + " " + operatingfltnumber;
                        } else {
                            return "-";
                        }
                    }
                },
                // {
                //     type: 'html', title: 'Airline', dataIndex: 'operatingairline', sorter: true,
                //     render: (value, row, index) => { return (value) ? value : "-" }
                // },
                // {
                //     type: 'html', title: 'Flight Number', dataIndex: 'operatingfltnumber', sorter: true,
                //     render: (value, row, index) => { return (value) ? value : "-" }
                // },
                {
                    type: 'html', title: 'Route', dataIndex: 'route', sorter: false, width: '10%',
                    render: (value, row, index) => { return row.origin + " - " + row.destination }
                },
                {
                    type: 'html', title: 'Ticket Name', dataIndex: 'ticketname', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Ticket Number', dataIndex: 'ticketnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Request Info', dataIndex: 'reqinfo', sorter: true,
                    render: (value, row, index) => {
                        let label = '-';
                        if (value === 'RETRO_REQUEST_NOTINPERIOD') {
                            label = 'Retro Request Not In Period'
                        } else {
                            label = (value) ? jsUcfirst(value, "_") : "-"
                        }
                        if (row.activityid) {
                            return <Link to="#" onClick={() => this.handleModalActivityInfo(row.activityid)}>{label}</Link>;
                        } else {
                            return label;
                        }
                    }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdby',
                    render: (value, row, index) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={this.props.match.url + '/form/' + row.retroclaimid} size="small" title="View" icon="eye" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ACCESS" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Request Date", datafield: "requestdate", type: 'datepicker', placeholder: 'Request Date', showDefaultSearch: true },
            { labeltext: "Departure Date", datafield: "departuredate", type: 'datepicker', placeholder: 'Departure Date', showDefaultSearch: true },
            { labeltext: "Airline", datafield: "operatingairline", type: 'component', component: AirlineSelect, placeholder: 'Airline', showDefaultSearch: false, custom: true },
            { labeltext: "Flight Number", datafield: "operatingfltnumber", type: 'text', placeholder: 'Flight Number', showDefaultSearch: false },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: false },
            { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: false },
            { labeltext: "Ticket Name", datafield: "ticketname", type: 'text', placeholder: 'Ticket Name', showDefaultSearch: false },
            { labeltext: "Ticket Number", datafield: "ticketnumber", type: 'text', placeholder: 'Ticket Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "Request Info", datafield: "reqinfo", type: 'select', placeholder: 'Request Info', options: optionsRequestInfo, showDefaultSearch: false },
        ];

        return (
            <React.Fragment>
                <Modal
                    title="Actvity Information"
                    visible={showActivityInfo}
                    onCancel={this.handleCancelActivityInfo}
                    destroyOnClose={true}
                    footer={null}
                >
                    <ActivityInfoForm activityid={activityid} closemodalrefresh={this.handleCancelActivityInfo} />
                </Modal>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Retro Claim</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} ref={(e) => { this.componentSearch = e }} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);