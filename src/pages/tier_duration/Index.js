import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm, MembershipSelect, TierSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
import { DurationType, DurationPeriod, Status } from '../../data';

const { Title } = Typography;

const configurationSearchForm = [
    { labeltext: "Membership Name", datafield: "membershipid", type: 'component', placeholder: 'Membership Name', showDefaultSearch: true, component: MembershipSelect },
    { labeltext: "Tier Name", datafield: "tierid", type: 'component', placeholder: 'Tier Name', showDefaultSearch: true, component: TierSelect },
    { labeltext: "Period Date", datafield: "date", type: 'datepicker', placeholder: 'Period Date', showDefaultSearch: true, specialSearch: true },
    { labeltext: "Duration Type", datafield: "durationtype", type: 'select', placeholder: 'Duration Type', showDefaultSearch: true, options: DurationType },
    { labeltext: "Duration Period", datafield: "durationperiod", type: 'select', placeholder: 'durationperiod', showDefaultSearch: false, options: DurationPeriod },
    { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: false, options: Status },
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Tier Duration | Loyalty Management System";
    }

    deleteData(tierdurationid) {
        let url = api.url.tierduration.delete;
        let data = { tierdurationid };
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

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.tierduration.list,
            columns: [
                { type: 'field', title: 'Membership Name', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Tier Name', dataIndex: 'tiername', sorter: true },
                { type: 'field', title: 'Duration Type', dataIndex: 'durationtype', sorter: true },
                { type: 'field', title: 'Duration Period', dataIndex: 'durationperiod', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? "ACTIVE" : "INACTIVE" }
                },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/tier-duration/form/' + row.tierdurationid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tierdurationid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Tier Duration</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/tier-duration/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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