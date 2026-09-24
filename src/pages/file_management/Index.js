import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import Detail from './Detail';
import { jsUcfirst } from '../../utilities/Helpers';

const { Title } = Typography;
const { confirm } = Modal;

const optionsType = [
    { value: 'ACCRUAL_IN', label: 'Accrual In' },
    { value: 'ACCRUAL_OUT', label: 'Accrual Out' },
    { value: 'APPROVAL_COBRAND', label: 'Approval Cobrand' },
    { value: 'APPROVAL_COBRAND_OUT', label: 'Approval Cobrand Out' },
    { value: 'BILLING_IN', label: 'Billing In' },
    { value: 'BILLING_OUT', label: 'Billing Out' },
    { value: 'COBRAND_FASTTRACK', label: 'Cobrand Fasttrack' },
    { value: 'COBRAND_FASTTRACK_OUT', label: 'Cobrand Fasttrack Out' },
    { value: 'ENROLLMENT_FILE', label: 'Enrollment File' },
    { value: 'ENROLLMENT_FILE_OUT', label: 'Enrollment File Out' },
    { value: 'HANDBACK_IN', label: 'Hand Back In' },
    { value: 'HANDBACK_OUT', label: 'Hand Back Out' },
    { value: 'RETRO_IN', label: 'Retro In' },
    { value: 'RETRO_OUT', label: 'Retro Out' },
    { value: 'RETRO_HANDBACK', label: 'Retro Handback' },
    { value: 'TERMINATE', label: 'Terminate' },
    { value: 'TERMINATE_OUT', label: 'Terminate Out' },
    { value: 'TRANSFER_POINT', label: 'Transfer Point' },
    { value: 'TRANSFER_POINT_OUT', label: 'Transfer Point Out' },
];

const optionsStatusInfo = [
    { value: 'BEING_PROCESSED', label: 'BEING PROCESSED' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'FAILED', label: 'REJECTED' }
];


class App extends React.Component {
    state = {
        visible: false
    }

    componentDidMount() {
        document.title = "Manage File Management | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (fileid, filetype) => {
        this.setState({ visible: true, fileid, filetype });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleDownloadModal = (fileid) => {
        const callback = () => {
            let url = api.url.file.downloadfile;
            let data = { fileid };
            let message = 'Downloading file...';
            DetailRequest(url, data).then((response) => {
                const { status = {}, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    window.location.href = result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }
        confirm({
            title: 'Are you sure to download this file?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    render() {
        const { visible, fileid, filetype } = this.state;
        const configurationSearchForm = [
            { labeltext: "File Name", datafield: "filename", type: 'text', placeholder: 'File Name', showDefaultSearch: true },
            { labeltext: "File Type", datafield: "filetype", type: 'select', options: optionsType, placeholder: 'File Type', showDefaultSearch: true },
            { labeltext: "Status Info", datafield: "statusinfo", type: 'select', placeholder: 'Status Info', options: optionsStatusInfo, showDefaultSearch: true },
            { labeltext: "File From", datafield: "filefrom", type: 'text', placeholder: 'File From', showDefaultSearch: true },
            { labeltext: "File To", datafield: "fileto", type: 'text', placeholder: 'File To', showDefaultSearch: true },
            { labeltext: "Total Record", datafield: "totalrecord", type: 'text', placeholder: 'Total Record', showDefaultSearch: false },
            { labeltext: "Success Record", datafield: "successrecord", type: 'text', placeholder: 'Success Record', showDefaultSearch: false },
            { labeltext: "Rejected Record", datafield: "failedrecord", type: 'text', placeholder: 'Rejected Record', showDefaultSearch: false }
        ];
        const configurationTable = {
            url: api.url.file.list,
            columnClassName: 'nowrap',
            columns: [
                { type: 'field', title: 'File Name', dataIndex: 'filename', sorter: true },
                {
                    type: 'field', title: 'File Type', dataIndex: 'filetype', sorter: true,
                    render: (value) => { return jsUcfirst(value, '_') }
                },
                {
                    type: 'field', title: 'Status Info', dataIndex: 'statusinfo', sorter: true,
                    render: (value) => { return (value === 'FAILED') ? 'REJECTED' : jsUcfirst(value, '_').toUpperCase(); }
                },
                {
                    type: 'group', title: 'Partner', childcolumns: [
                        { type: 'field', title: 'From', dataIndex: 'filefrom', sorter: true },
                        { type: 'field', title: 'To', dataIndex: 'fileto', sorter: true }
                    ]
                },
                {
                    type: 'group', title: 'Record', childcolumns: [
                        { type: 'html', title: 'Total', dataIndex: 'totalrecord', sorter: true, render: (value) => { return value ? value : '-' } },
                        { type: 'html', title: 'Success', dataIndex: 'successrecord', sorter: true, render: (value) => { return value ? value : '-' } },
                        { type: 'html', title: 'Rejected', dataIndex: 'failedrecord', sorter: true, render: (value) => { return value ? value : '-' } }
                    ]
                },
                { type: 'html', title: 'Remarks', dataIndex: 'remarks', sorter: true, render: (value) => { return (value) ? value : "-" } },
                {
                    type: 'html', title: 'Sending/Receive Date', dataIndex: 'sendingdate', sorter: false,
                    render: (value, row) => {
                        return value && (row.filetype === 'BILLING_OUT' || row.filetype === 'ACCRUAL_OUT' || row.filetype === 'HANDBACK_OUT' || row.filetype === 'RETRO_OUT' || row.filetype === 'RETRO_HANDBACK') ?
                            moment(value).format('DD/MM/YYYY') :
                            row.receivedate && (row.filetype === 'BILLING_IN' || row.filetype === 'ACCRUAL_IN' || row.filetype === 'HANDBACK_IN' || row.filetype === 'RETRO_IN' || row.filetype === 'RETRO_HANDBACK') ?
                                moment(row.receivedate).format('DD/MM/YYYY') : '-'
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (_value, row) => {
                        return (
                            <span>
                                {
                                    (row.filetype === 'ENROLLMENT_FILE_OUT' || row.filetype === 'TRANSFER_POINT_OUT' || row.filetype === 'TERMINATE_OUT' || row.filetype === 'APPROVAL_COBRAND_OUT' || row.filetype === 'COBRAND_FASTTRACK_OUT') ?
                                        '' : <Button htmlType="button" size="small" icon="eye" title="View" className="btn-custom-info" onClick={() => this.handleOpenModal(row.fileid, row.filetype)} />
                                }
                                <Button htmlType="button" type="primary" size="small" icon="download" title="Download" onClick={() => this.handleDownloadModal(row.fileid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title="Detail File" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1300}>
                    <Detail fileid={fileid} filetype={filetype} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24}>
                        <Title level={3}>File Management</Title>
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