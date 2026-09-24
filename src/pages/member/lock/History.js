import React from 'react';
import { api } from '../../../config/Services';
import { TableBase } from '../../../components/Base/BaseComponent';
import { Form, Icon } from 'antd';
import moment from 'moment';

class App extends React.Component {
    componentDidMount() {
        document.title = "Member Lock History | Loyalty Management System";
    }

    render() {
        const configurationTable = {
            url: api.url.memberlock.list,
            criteria: { memberid: this.props.memberid },
            columns: [
                { type: 'field', title: 'Reason', dataIndex: 'reason', sorter: true },
                { type: 'field', title: 'Accrual', dataIndex: 'blockaccrual', sorter: true, render: (value) => { return (value) ? <Icon type="check" /> : '-' } },
                { type: 'field', title: 'Redemption', dataIndex: 'blockredeem', sorter: true, render: (value) => { return (value) ? <Icon type="check" /> : '-' } },
                { type: 'field', title: 'Transfer', dataIndex: 'blocktransfer', sorter: true, render: (value) => { return (value) ? <Icon type="check" /> : '-' } },
                { type: 'field', title: 'Receive', dataIndex: 'blockreceive', sorter: true, render: (value) => { return (value) ? <Icon type="check" /> : '-' } },
                { type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '-' } },
                { type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '-' } }
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