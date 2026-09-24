import React from 'react';
import { api } from '../../../../config/Services';
import { Form } from 'antd';
import moment from 'moment';
import { TableBase } from '../../../../components/Base/BaseComponent';
import { formatNumber } from '../../../../utilities/Helpers';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            partnerbulkid: this.props.partnerbulkid ? this.props.partnerbulkid : null,
            partnercode: this.props.partnercode ? this.props.partnercode : null
        };
    }

    componentDidMount() {
        document.title = "Detail Partner Bulk | Loyalty Management System";
    }

    render() {
        const { partnercode, partnerbulkid } = this.state;
        const configurationTable = {
            url: api.url.partnertransaction.retrieve,
            criteria: { partnercode, partnerbulkid },
            sort: {},
            columns: [
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Transaction Date', dataIndex: 'trxdate',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Ref Code', dataIndex: 'refcode',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Award Bulk Miles', dataIndex: 'bulkmiles', align: 'right',
                    render: (value) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'html', title: 'Regular Miles', dataIndex: 'regularmiles', align: 'right',
                    render: (value) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'html', title: 'Act Code', dataIndex: 'activitycode',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Description', dataIndex: 'description',
                    render: (value) => { return (value) ? value : '-' }
                },
            ]
        }

        return (
            <React.Fragment>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);