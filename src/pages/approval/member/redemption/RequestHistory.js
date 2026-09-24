import React from 'react';
import { api } from '../../../../config/Services';
import { TableBase } from '../../../../components/Base/BaseComponent';
import { Form } from 'antd';
import moment from 'moment';

class App extends React.Component {
    render() {
        const { requestid } = this.props;
        const configurationTable = {
            url: api.url.requestapproval.history,
            criteria: { requestid },
            sort: { approvaldate: 'desc' },
            columns: [
                { type: 'field', title: 'Request History ID', dataIndex: 'reqhistoryid', sorter: true },
                {
                    type: 'html', title: 'Approval Date', dataIndex: 'approvaldate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Approval Status', dataIndex: 'requeststatus', sorter: true },
                {
                    type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
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