import React from 'react';
import { Link } from 'react-router-dom';
import { CancelRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Menu, Dropdown, Icon, Button as AntButton } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';
import { MemberLockAlert } from '../../../components/Partials';

const { Title } = Typography;
const optionsActivityType = [
    { label: "Air", value: "AIR" },
    { label: "Non Air", value: "NON_AIR" }
];

const optionsActivityInfo = [
    { label: "Inserted", value: "INSERTED" },
    { label: "No Valid To Earn", value: "NO_VALID_TO_EARN" },
    { label: "Activity Rated", value: "ACTIVITY_RATED" },
    { label: "No Marketing Airline Found", value: "NO_MARKETING_AIRLINE_FOUND" },
    { label: "Rule No Exist", value: "RULE_NO_EXIST" },
    { label: "No Booking Class Found", value: "NO_BOOKING_CLASS_FOUND" },
    { label: "No Partner Found", value: "NO_PARTNER_FOUND" },
    { label: "No Partner Location Found", value: "NO_PARTNER_LOCATION_FOUND" },
    { label: "Invalid Name Check", value: "INVALID_NAME_CHECK" },
    { label: "No Operating Airiline For Air Activity", value: "NO_OPERATING_AIRLINE_FOR_AIR_ACTIVITY" },
    { label: "Activity Updated", value: "ACTIVITY_UPDATED" },
    { label: "Duplicate Activity", value: "DUPLICATE_ACTIVITY" },
    { label: "Customer Inactive", value: "CUSTOMER_INACTIVE" },
    { label: "Ready To Be Rated", value: "READY_TO_BE_RATED" },
    { label: "Member Tier Inactive", value: "MEMBER_TIER_INACTIVE" },
    { label: "Booking Class Not Eligible To Earn", value: "BOOKING_CLASS_NOT_ELIGIBLE_TO_EARN" },
    { label: "Invalid Flight Schedule", value: "INVALID_FLIGHT_SCHEDULE" },
    { label: "Invalid Frequent Flyer Designator", value: "INVALID_FREQUENT_FLYER_DESIGNATOR" },
    { label: "Card Number Is Inactive", value: "CARD_NUMBER_IS_INACTIVE" },
    { label: "Partner Not Eligible To Earn Mile", value: "PARTNER_NOT_ELIGIBLE_TO_EARN_MILE" },
    { label: "Activity Convert Incorrect", value: "ACTIVITY_CONVERT_INCORRECT" },
    { label: "Activity Volume Is Not Enough", value: "ACTIVITY_VOLUME_IS_NOT_ENOUGH" },
    { label: "No Activity Code", value: "NO_ACTIVITY_CODE" },
    { label: "Member Not Found", value: "MEMBER_NOT_FOUND" },
    { label: "Activity Date Empty", value: "ACTIVITY_DATE_EMPTY" },
    { label: "Firstname Invalid", value: "FIRSTNAME_INVALID" },
    { label: "Lastname Invalid", value: "LASTNAME_INVALID" },
    { label: "Future Transactions Not Allowed", value: "FUTURE_TRANSACTIONS_NOT_ALLOWED" },
    { label: "Empty Transaction ID", value: "EMPTY_TRANSACTION_ID" },
    { label: "Mileage More Then Allowed", value: "MILEAGE_MORE_THEN_ALLOWED" },
    { label: "Activity Miles Not Enough", value: "ACTIVITY_MILES_NOT_ENOUGH" },
    { label: "Partner Bulk Not Enough", value: "PARTNER_BULK_NOT_ENOUGH" },
    { label: "Earning Rule Not Found", value: "EARNING_RULE_NOT_FOUND" },
    { label: "Customer Deceased", value: "CUSTOMER_DECEASED" },
    { label: "Customer Fraud", value: "CUSTOMER_FRAUD" },
    { label: "Customer Inactive Email", value: "CUSTOMER_INACTIVEEMAIL" },
    { label: "Customer Merged", value: "CUSTOMER_MERGED" },
    { label: "Customer Terminated", value: "CUSTOMER_TERMINATED" },
    { label: "Customer Suspect Fraud", value: "CUSTOMER_SUSPECTEDFRAUD" },
    { label: "Customer Duplicate", value: "CUSTOMER_DUPLICATE" },
    { label: "Customer Suspect Duplicate", value: "CUSTOMER_SUSPECTEDDUPLICATE" },
    { label: "Customer Grace Period", value: "CUSTOMER_GRACEPERIOD" }
];

const optionsStatus = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Member Activity | Loyalty Management System";
    }

    deleteData(activityid, activitytype) {
        let url = (activitytype === 'AIR') ? api.url.memberairactivity.cancelwithrating : api.url.membernonairactivity.cancelwithrating;
        let data = { activityid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
                this.props.refreshHeader();
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        CancelRequest(url, data, callback, 'Are you sure cancel this data ?');
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname, memberlock, permission } = this.props;
        const memberid = this.props.match.params.ID;
        const { blockaccrual } = memberlock || {};

        const configurationTable = {
            url: api.url.memberactivity.list,
            criteria: { memberid },
            sort: { createddate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Activity Date', dataIndex: 'activitydate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Type', dataIndex: 'activitytype', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, "_") : '-' }
                },
                {
                    type: 'html', title: 'Partner', dataIndex: 'partnercode', sorter: true,
                    render: (value, row, index) => { return (row.activitytype === 'NON_AIR') ? row.partnercode : row.marketingairlinecode }
                },
                {
                    type: 'html', title: 'Activity Name', dataIndex: 'activityname', sorter: false, width: '15%',
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Activity Info', dataIndex: 'activityinfo', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, "_") : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '14%',
                    render: (value, row, index) => {
                        const isAccelerator = row.nonairactivitytype && row.nonairactivitytype === 'ACCELERATOR';
                        return (
                            <span>
                                {
                                    (row.status === 'INACTIVE' || isAccelerator || blockaccrual) ? <Button url={this.props.match.url + (row.activitytype === 'AIR' ? '/air/form/' : '/nonair/form/') + row.activityid} size="small" label={"View"} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> :
                                        <Button url={this.props.match.url + (row.activitytype === 'AIR' ? '/air/form/' : '/nonair/form/') + row.activityid} size="small" label={"Edit"} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                }
                                {
                                    (row.status !== 'INACTIVE' && !isAccelerator) ?
                                        <Button htmlType="button" size="small" label="Cancel" type="danger" visible={!blockaccrual} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.activityid, row.activitytype)} /> : null
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Activity Date", datafield: "activitydate", type: 'datepicker', placeholder: 'Activity Date', showDefaultSearch: true },
            { labeltext: "Type", datafield: "activitytype", type: 'select', placeholder: 'Type', showDefaultSearch: true, options: optionsActivityType },
            { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
            { labeltext: "Activity Info", datafield: "activityinfo", type: 'select', placeholder: 'Activity Info', showDefaultSearch: true, options: optionsActivityInfo },
            { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', showDefaultSearch: false, options: optionsStatus },
        ];

        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <Link to={"/" + this.props.match.url.split('/')[1] + "/form/" + memberid + "/activity/air/form"}> Air </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to={"/" + this.props.match.url.split('/')[1] + "/form/" + memberid + "/activity/nonair/form"}> Non Air </Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <React.Fragment>
                <Row style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <Row>
                        <Col xs={24} sm={20}>
                            <Title level={4}>Manage Activity</Title>
                        </Col>
                        {(permission && permission.usermenu !== undefined && permission.usermenu['MBRACT']['MBRACT_CREATE']) ?
                            <Col xs={24} sm={4} align="right">
                                <Dropdown overlay={menu}>
                                    <AntButton type="primary">
                                        Create <Icon type="down" />
                                    </AntButton >
                                </Dropdown>
                            </Col>
                            : null}
                        <Divider />
                    </Row>
                    {(blockaccrual) ? <MemberLockAlert memberlock={memberlock} /> : ''}
                    <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);