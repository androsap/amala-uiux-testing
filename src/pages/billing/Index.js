import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import Detail from './Detail';
import { jsUcfirst } from '../../utilities/Helpers';

const { Title } = Typography;

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

    render() {
        const { visible, fileid, filetype } = this.state;
        const configurationSearchForm = [
            { labeltext: "File ID", datafield: "fileid", type: 'text', placeholder: 'File ID', showDefaultSearch: false },
            { labeltext: "File Type", datafield: "filetype", type: 'text', placeholder: 'File Type', showDefaultSearch: true },
            { labeltext: "File Name", datafield: "filename", type: 'text', placeholder: 'File Name', showDefaultSearch: false },
            { labeltext: "Status Info", datafield: "statusinfo", type: 'text', placeholder: 'Status Info', showDefaultSearch: true },
            { labeltext: "File From", datafield: "filefrom", type: 'text', placeholder: 'File From', showDefaultSearch: true },
            { labeltext: "File To", datafield: "fileto", type: 'text', placeholder: 'File To', showDefaultSearch: true },
            { labeltext: "Total Record", datafield: "totalrecord", type: 'text', placeholder: 'Total Record', showDefaultSearch: false },
            { labeltext: "Success Record", datafield: "successrecord", type: 'text', placeholder: 'Success Record', showDefaultSearch: false },
            { labeltext: "Failed Record", datafield: "failedrecord", type: 'text', placeholder: 'Failed Record', showDefaultSearch: false }
        ];
        const configurationTable = {
            url: api.url.file.list,
            columns: [
                { type: 'field', title: 'File ID', dataIndex: 'fileid', sorter: true },
                {
                    type: 'field', title: 'File Type', dataIndex: 'filetype', sorter: true,
                    render: (value, row, index) => { return jsUcfirst(value, '_') }
                },
                { type: 'field', title: 'File Name', dataIndex: 'filename', sorter: true },
                {
                    type: 'field', title: 'Status Info', dataIndex: 'statusinfo', sorter: true,
                    render: (value, row, index) => { return jsUcfirst(value, '_') }
                },
                {
                    type: 'group', title: 'Partner', childcolumns: [
                        { type: 'field', title: 'From', dataIndex: 'filefrom', sorter: true },
                        { type: 'field', title: 'To', dataIndex: 'fileto', sorter: true }
                    ]
                },
                {
                    type: 'group', title: 'Record', childcolumns: [
                        { type: 'field', title: 'Total', dataIndex: 'totalrecord', sorter: true },
                        { type: 'field', title: 'Success', dataIndex: 'successrecord', sorter: true },
                        { type: 'field', title: 'Failed', dataIndex: 'failedrecord', sorter: true }
                    ]
                },
                {
                    type: 'html', title: 'Sending/Receive Date', dataIndex: 'sendingdate', sorter: false,
                    render: (value, row, index) => {
                        return (value && row.filetype === ('BILLING_OUT' || 'ACCRUAL_OUT' || 'HANDBACK_OUT') ?
                            moment(value).format('DD/MM/YYYY') :
                            value && row.filetype === ('BILLING_IN' || 'ACCRUAL_IN' || 'HANDBACK_IN') ?
                                moment(row.receivedate).format('DD/MM/YYYY') : '-')
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" icon="eye" title="View" className="btn-custom-info" onClick={() => this.handleOpenModal(row.fileid, row.filetype)} />
                                <Button url="" size="small" icon="download" title="Download" type="primary" disabled />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title="Detail File" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
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