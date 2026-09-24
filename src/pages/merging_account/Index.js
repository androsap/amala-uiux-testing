import React from 'react';
import { api } from '../../config/Services';
import { CancelRequest, RetrieveRequest, SaveRequest } from '../../utilities/RequestService';
import { jsUcfirst } from '../../utilities/Helpers';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Tag } from 'antd';
import moment from 'moment';
import PreviewMember from './FormView';

const { Title } = Typography;
const { confirm } = Modal;

const optionsStatus = [
    { value: 'CANCELED', label: 'Canceled' },
    { value: 'FINISHED', label: 'Finished' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REQUESTED', label: 'Requested' },
    { value: 'WAITING_APPROVAL', label: 'Waiting Approval' }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            mergeid: null,
            mastermember: null,
            mergewith: null,
            requestnotes: null,
            fielddisabled: {
                requestdatetodisabled: false,
                processdatetodisabled: true
            },
        }
    }

    componentDidMount() {
        document.title = "Manage Merge Account | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    handleDownloadModal = (type) => {
        const callback = () => {
            let url = type === 'csv' ? api.url.profileintegration.download : api.url.profileintegration.downloadpdf;
            let criteria = {};
            let message = 'Downloading file...';
            RetrieveRequest(url, criteria).then((response) => {
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

    handleOpenModal = (mergeid, mastermember, mergewith, requestnotes, detailofrequest, isupdatable, cardnumbermastermember, cardnumbermergewith) => {
        this.setState({ visible: true, mergeid, mastermember, mergewith, requestnotes, detailofrequest, isupdatable, cardnumbermastermember, cardnumbermergewith });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleRequestDate = () => {
        this.props.form.resetFields(['enddate', []]);
    }

    handleProcessDate = () => {
        this.props.form.resetFields(['enddateprocess', []]);
    }

    cancelMerge(mergeid, mastermember, mergewith) {
        let url = api.url.profileintegration.update;
        let data = { mergeid, mastermember, mergewith, status: 'CANCELLED' };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Requested Merge has been cancelled';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };
        CancelRequest(url, data, callback, 'Are you sure to cancel this request?');
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, isLoading, mergeid, mastermember, mergewith, requestnotes, detailofrequest, isupdatable, cardnumbermastermember, cardnumbermergewith } = this.state;
        const startdate = this.props.form.getFieldValue('startdate');
        const startdateprocess = this.props.form.getFieldValue('startdateprocess');

        const configurationTable = {
            url: api.url.profileintegration.retrieve,
            sort: { createdDate: 'desc' },
            columns: [
                { type: 'field', title: 'Card Number Origin', dataIndex: 'cardnumbermastermember', sorter: true },
                { type: 'field', title: 'Member Name Origin', dataIndex: 'mastername', sorter: true },
                { type: 'field', title: 'Card Number Destination', dataIndex: 'cardnumbermergewith', sorter: true },
                { type: 'field', title: 'Member Name Destination', dataIndex: 'mergewithname', sorter: true },
                {
                    type: 'html', title: 'Requested Date', dataIndex: 'createdDate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Processed Date', dataIndex: 'processeddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Finished Date', dataIndex: 'finishdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Merge Type', dataIndex: 'mergetype', sorter: true,
                    render: (value) => { return (value) ? value : "-" }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row) => {
                        const color = (value === 'FINISHED') ? 'green' : (value === 'CANCELLED') ? 'volcano' :
                            (value === 'REJECTED') ? 'red' : 'yellow';
                        return (value) ?
                            <Tag color={color}>{jsUcfirst(value, "_")}</Tag> : '-'
                    }
                },
                { type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '8%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/merging-account/detail/' + row.mergeid} size="small" title="Detail" icon="eye" actioncode="ACCESS" />
                                <Button htmlType="button" size="small" title="Cancel" icon="close" type="danger" onClick={() => this.cancelMerge(row.mergeid, row.mastermember, row.mergewith)} className={row.status === 'WAITING_APPROVAL' ? '' : 'hidden'}/>
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "cardnumbermastermember", type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: "Member Name", datafield: "mastername", type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: "Requested Date", datafield: "createdDate", type: 'datepicker', placeholder: 'Requested Date', showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true },
            // { labeltext: "Requested By", datafield: "createdBy", type: 'text', placeholder: 'Requested By', showDefaultSearch: false },
            // { labeltext: "Processed Date From", datafield: "startdateprocess", type: 'datepicker', placeholder: 'Processed Date From', showDefaultSearch: true, specialSearch: true,  onChange: (e) => this.handleProcessDate(e) },
            // { 
            //     labeltext: "Processed Date To", datafield: "enddateprocess", type: 'datepicker', placeholder: 'Processed Date To', showDefaultSearch: true, specialSearch: true, minDate: moment(startdateprocess).add(0, 'days'),
            //     disabled: startdateprocess ? '' : true, validationrules: startdateprocess ? ['required'] : []
            // },
            // { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: false, className: 'hidden' },
            // { labeltext: "Processed By", datafield: "processedby", type: 'text', placeholder: 'Processed By', showDefaultSearch: false },
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Merge Account</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/merging-account/request'} size="default" menucode={menucode} prefixmenuname={prefixmenuname} label="Add New" actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <Modal visible={visible} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} style={{ top: 10, bottom: 20 }} width={1200}>
                    <PreviewMember {...this.props} onClose={this.handleCancel} mergeid={mergeid} cardnumbermergewith={cardnumbermergewith} cardnumbermastermember={cardnumbermastermember} mastermember={mastermember} mergewith={mergewith} requestnotes={requestnotes} detailofrequest={detailofrequest} isupdatable={isupdatable} refreshList={this.handleOk} />
                </Modal>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                {/* <Row type="flex" justify="end" style={{ marginBottom: 10 }}>
                    <Button htmlType="button" style={{ background: "#43A047", color: "white" }} size="small" icon="download" label="Download CSV" onClick={() => this.handleDownloadModal('csv')} />
                    <Button htmlType="button" style={{ background: "#FF5252", color: "white" }} size="small" icon="download" label="Download PDF" onClick={() => this.handleDownloadModal('pdf')} />
                </Row> */}
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);