import React from 'react';
import { api } from '../../../config/Services';
import { TableBase } from '../../../components/Base/BaseComponent';
import { Form } from 'antd';
import moment from 'moment';

class App extends React.Component {
    componentDidMount() {
        document.title = "Nominee History | Loyalty Management System";
    }

    render() {
        const configurationTable = {
            url: api.url.memberredemptionnominee.list,
            sort: { updateddate: "desc" },
            criteria: { memberid: this.props.memberid },
            criteriadata: {
                multiplestatus: [
                    {
                        active: false,
                        approvalstatus: 'APPROVED'
                    },
                    {
                        active: false,
                        approvalstatus: 'REJECTED'
                    }
                ]
            },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'html', title: 'Salutation', dataIndex: 'salutationcode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true },
                { type: 'field', title: 'Last Name', dataIndex: 'lastname', sorter: true },
                {
                    type: 'html', title: 'Date of Birth', dataIndex: 'dateofbirth', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Deleted by', dataIndex: 'updatedby', sorter: true },
                {
                    type: 'html', title: 'Deleted Date', dataIndex: 'updateddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status',
                    render: (value) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'field', title: 'Approval Status', dataIndex: 'approvalstatus',
                },
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