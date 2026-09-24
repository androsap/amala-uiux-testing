import React from 'react';
import { api } from '../../../../config/Services';
import { Form, Modal, Button as AntButton, Dropdown, Menu, Icon, Col } from 'antd';
import moment from 'moment';
import { TableBase, Alert, Button } from '../../../../components/Base/BaseComponent';
import { formatNumber } from '../../../../utilities/Helpers';
import { RetrieveRequest } from '../../../../utilities/RequestService';

const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            partnercode: this.props.partnercode ? this.props.partnercode : null,
            billingid: this.props.billingid ? this.props.billingid : null
        };
    }

    componentDidMount() {
        document.title = "Detail Partner Bulk | Loyalty Management System";
    }

    handleDownloadModal = (type) => {
        const callback = () => {
            let url = type === "PDF" ? api.url.partnertransaction.pdf : api.url.partnertransaction.csv;
            let criteria = { billingid: this.state.billingid, partnercode: this.state.partnercode };
            let message = 'Downloading...';
            RetrieveRequest(url, criteria, {}, {}, []).then((response) => {
                const { responsecode, responsemessage } = response.status;
                const { result } = response;
                if (responsecode && responsecode === '0000') {
                    window.location.href = result.url;
                    if (responsemessage) Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }

        confirm({
            title: 'Are you sure to download this file?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    render() {
        const { partnercode, billingid } = this.state;
        const configurationTable = {
            url: api.url.partnertransaction.retrieve,
            criteria: { partnercode, billing: billingid },
            sort: {},
            columns: [
                {
                    type: 'html', title: 'Transaction Date', dataIndex: 'trxdate', align: 'center',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', align: 'center',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Partner Trx Type', dataIndex: 'partnertrxtype',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Award Bulk Miles', dataIndex: 'bulkmiles', align: 'center',
                    render: (value) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'html', title: 'Regular Miles', dataIndex: 'regularmiles', align: 'center',
                    render: (value) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'html', title: 'Act Code', dataIndex: 'activitycode',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Ref Code', dataIndex: 'refcode',
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', align: 'center',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', align: 'center',
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