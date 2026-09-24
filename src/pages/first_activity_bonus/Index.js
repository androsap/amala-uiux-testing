import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;
const optionsEnrollChannel = [
    { value: 'MOBILE', label: 'MOBILE' },
    { value: 'WEBSITE', label: 'WEBSITE' },
    { value: 'BO', label: 'BO' },
    { value: 'CHECKIN', label: 'CHECK-IN' },
    { value: 'PARTNER', label: 'PARTNER' },
    { value: 'COBRAND', label: 'COBRAND' },
    { value: 'CHARITY', label: 'CHARITY' },
    { value: 'CORPORATE', label: 'CORPORATE' }
]
const configurationSearchForm = [
    { labeltext: "Membership", datafield: "membershipname", type: 'text', placeholder: 'Membership Name', showDefaultSearch: true },
    { labeltext: "Tier", datafield: "tiername", type: 'text', placeholder: 'Tier Name', showDefaultSearch: true },
    { labeltext: "Channel", datafield: "enrollchannel", type: 'select', placeholder: 'Channel', showDefaultSearch: true, options: optionsEnrollChannel },
    { labeltext: "Tier Miles", datafield: "tiermiles", type: 'text', placeholder: 'Tier Miles', showDefaultSearch: false },
    { labeltext: "Award Miles", datafield: "awardmiles", type: 'text', placeholder: 'Award Miles', showDefaultSearch: false },
    { labeltext: "Frequency", datafield: "frequency", type: 'text', placeholder: 'Frequency', showDefaultSearch: false },
    { labeltext: "Activity Start Period", datafield: "activitystartperiod", type: 'datepicker', placeholder: 'Activity Start Period', showDefaultSearch: false },
    { labeltext: "Activity End Period", datafield: "activityendperiod", type: 'datepicker', placeholder: 'Activity End Period', showDefaultSearch: false }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage First Activity Bonus | Loyalty Management System";
    }

    deleteData(tierfirstactivitybonusid) {
        let url = api.url.firstactivitybonus.delete;
        let data = { tierfirstactivitybonusid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.firstactivitybonus.list,
            columns: [
                { type: 'field', title: 'Membership Name', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Tier Name', dataIndex: 'tiername', sorter: true },
                { type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true },
                { type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true },
                { type: 'field', title: 'Channel', dataIndex: 'enrollchannel', sorter: true },
                {
                    type: 'html', title: 'Default', dataIndex: 'default', sorter: false,
                    render: (value, row, index) => { return ((row.branchcode !== undefined && row.branchcode) || (row.partnercode !== undefined && row.partnercode) ? 'INACTIVE' : 'ACTIVE') }
                },
                {
                    type: 'html', title: 'Activity Start Period', dataIndex: 'activitystartperiod', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Activity End Period', dataIndex: 'activityendperiod', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/first-activity-bonus/form/' + row.tierfirstactivitybonusid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tierfirstactivitybonusid)} />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage First Activity Bonus</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/first-activity-bonus/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);