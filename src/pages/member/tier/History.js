import React from 'react';
import { api } from '../../../config/Services';
import { TableBase } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';
import moment from 'moment';

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Tier History | Loyalty Management System";
    }

    render() {
        const configurationTable = {
            url: api.url.membertier.history,
            criteria: { member_id: this.props.memberid },
            sort: { op_date: 'desc' },
            columns: [
                { type: 'field', title: 'Membership', dataIndex: 'current_membership_name', sorter: false },
                { type: 'field', title: 'Tier', dataIndex: 'current_tier_name', sorter: false },
                { type: 'html', title: 'Start Date', dataIndex: 'op_date', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' } },
                { type: 'field', title: 'Reason', dataIndex: 'reason', sorter: true },
                { type: 'field', title: 'Inserted by', dataIndex: 'inserted_by', sorter: true }
            ]
        };
        return (
            <React.Fragment>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} pagination />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);