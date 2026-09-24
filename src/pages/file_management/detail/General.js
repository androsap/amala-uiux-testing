import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest } from '../../../utilities/RequestService';
import { SearchForm, TableBase, Alert, Button } from '../../../components/Base/BaseComponent';
import { Form, Spin, Modal, Row } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { jsUcfirst } from '../../../utilities/Helpers';

const { confirm } = Modal;

const optionsStatus = [
    { value: 'SUCCESS', label: 'SUCCESS' },
    { value: 'FAILED', label: 'REJECTED' }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleActivityId = (activityid) => {
        let url = api.url.memberactivity.detail;
        let data = { activityid };
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let memberid = (result.memberid) ? result.memberid : null;
                    let activitytype = (result.activitytype) ? result.activitytype : null;

                    window.open('/member/form/' + memberid + "/activity/" + (activitytype === 'AIR' ? 'air' : 'nonair') + "/form/" + activityid);
                }
            } else {
                Alert.error(status.responsemessage);
                this.setState({ formrender: false });
            }
            this.setState({ loading: false });
        });
    }

    handleDownloadModal = (fileid) => {
        const callback = () => {
            let url = api.url.file.downloadsum;
            let data = { fileid, type: 'CSV' };
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

    handleCorrectionFrom = (fileid) => {
        const { filetype } = this.props;
        const criteria = { filedataid: fileid };
        this.componentTable.handleSearchForm(criteria);
    };

    render() {
        const { fileid, filetype } = this.props;
        const configurationSearchForm = [
            { labeltext: "UIN", datafield: "uin", type: 'text', placeholder: 'UIN', showDefaultSearch: true },
            { labeltext: "FFP Carrier Code", datafield: "ffpcarriercode", type: 'text', placeholder: 'FFP Carrier Code', showDefaultSearch: false },
            { labeltext: "FFP Number", datafield: "ffpnumber", type: 'text', placeholder: 'FFP Number', showDefaultSearch: true },
            { labeltext: "Marketing Carrier", datafield: "marketingcarrier", type: 'text', placeholder: 'Marketing Carrier', showDefaultSearch: false },
            { labeltext: "Marketing Flight Number", datafield: "marketingfltnum", type: 'text', placeholder: 'Marketing Flight Number', showDefaultSearch: false },
            { labeltext: "Operating Carrier", datafield: "operatingcarriercode", type: 'text', placeholder: 'Operating Carrier', showDefaultSearch: false },
            { labeltext: "Operating Flight Number", datafield: "operatingfltnumber", type: 'text', placeholder: 'Operating Flight Number', showDefaultSearch: false },
            { labeltext: "Departure Date", datafield: "departuredate", type: 'datepicker', placeholder: 'Departure Date', showDefaultSearch: false },
            { labeltext: "Cabin Class Code", datafield: "cabinclasscode", type: 'text', placeholder: 'Cabin Class Code', showDefaultSearch: false },
            { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: false },
            { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: false },
            { labeltext: "Activity ID", datafield: "activityid", type: 'text', placeholder: 'Activity ID', showDefaultSearch: false },
            {
                labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true,
                render: (value) => { return (value === 'FAILED') ? 'REJECTED' : value }
            },
            { labeltext: "Remarks", datafield: "remarks", type: 'text', placeholder: 'Remarks', showDefaultSearch: false },
            { labeltext: "Accrual File", datafield: "accrualfilename", type: 'text', placeholder: 'Accrual File', showDefaultSearch: false },
            { labeltext: "Handback File", datafield: "handbackfilename", type: 'text', placeholder: 'Handback File', showDefaultSearch: false },
            { labeltext: "Billing File", datafield: "billingfilename", type: 'text', placeholder: 'Billing File', showDefaultSearch: false },
        ];

        const configurationSearchForm2 = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: "First Name", datafield: "firstname", type: 'text', placeholder: 'First Name', showDefaultSearch: true },
            { labeltext: "Last Name", datafield: "lastname", type: 'text', placeholder: 'Last Name', showDefaultSearch: false },
            { labeltext: "Date of Redeem", datafield: "dateofredeem", type: 'datepicker', placeholder: 'Date of Redeem', showDefaultSearch: false },
            { labeltext: "Miles", datafield: "miles", type: 'text', placeholder: 'Miles', showDefaultSearch: false },
            { labeltext: "Point", datafield: "point", type: 'text', placeholder: 'Point', showDefaultSearch: false },
            { labeltext: "Reward Code", datafield: "rewardcode", type: 'text', placeholder: 'Reward Code', showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'text', placeholder: 'Status', showDefaultSearch: true },
            { labeltext: "Remark", datafield: "remark", type: 'text', placeholder: 'Remark', showDefaultSearch: false },
        ];

        const configurationSearchForm3 = [
            { labeltext: "Activity Ref. Number", datafield: "activityreferencenumber", type: 'text', placeholder: 'Activity Ref. Number', showDefaultSearch: true },
            { labeltext: "Card Number", datafield: "membernumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: "First Name", datafield: "firstname", type: 'text', placeholder: 'First Name', showDefaultSearch: true },
            { labeltext: "Process Date", datafield: "processdate", type: 'datepicker', placeholder: 'Process Date', showDefaultSearch: false },
            { labeltext: "Processing Message", datafield: "processingmessage", type: 'text', placeholder: 'Processing Message', showDefaultSearch: true },
            { labeltext: "Response Code", datafield: "responsecode", type: 'text', placeholder: 'Response Code', showDefaultSearch: false },
            { labeltext: "Remark", datafield: "remark", type: 'text', placeholder: 'Remark', showDefaultSearch: false },
            { labeltext: "File Name", datafield: "filename", type: 'text', placeholder: 'File Name', showDefaultSearch: false }
        ];

        const configurationSearchForm4 = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
            { labeltext: "Cobrand Code", datafield: "cobrandcode", type: 'text', placeholder: 'Cobrand Code', showDefaultSearch: true },
            { labeltext: "Approval Date", datafield: "approvaldate", type: 'datepicker', placeholder: 'Approval Date', showDefaultSearch: true },
            { labeltext: "Approval Code", datafield: "approvalcode", type: 'text', placeholder: 'Approval Code', showDefaultSearch: false },
            { labeltext: "Reference ID", datafield: "referenceid", type: 'text', placeholder: 'Reference ID', showDefaultSearch: false },
            { labeltext: "Process Date", datafield: "processdate", type: 'datepicker', placeholder: 'Process Date', showDefaultSearch: true },
            { labeltext: "Processing Code", datafield: "processingcode", type: 'text', placeholder: 'Processing Code', showDefaultSearch: false },
            { labeltext: "Processing Message", datafield: "processingmessage", type: 'text', placeholder: 'Processing Message', showDefaultSearch: false },
        ];

        const configurationSearchForm5 = [

            { labeltext: "Card Number", datafield: "cardnumber", type: 'exact', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: "Partner Custom ID", datafield: "partnercustomid", type: 'text', placeholder: 'Partner Custom ID', showDefaultSearch: true },
            { labeltext: "Cobrand Code", datafield: "regcobrandcode", type: 'text', placeholder: 'Cobrand Code', showDefaultSearch: true },
            { labeltext: "Target Tier", datafield: "targettier", type: 'text', placeholder: 'Target Tier', showDefaultSearch: false },
            { labeltext: "Target Membership", datafield: "targetmembership", type: 'text', placeholder: 'Target Membership', showDefaultSearch: false },
            { labeltext: "Process Date", datafield: "processdate", type: 'datepicker', placeholder: 'Process Date', showDefaultSearch: true },
            { labeltext: "Processing Code", datafield: "processingmessagecode", type: 'text', placeholder: 'Processing Code', showDefaultSearch: false }
        ];

        const configurationTable = {
            url: api.url.filedata.list,
            criteria: (filetype === 'BILLING_IN' || filetype === 'BILLING_OUT') ? { billingfile: fileid } :
                (filetype === 'ACCRUAL_IN' || filetype === 'ACCRUAL_OUT' || filetype === 'RETRO_IN' || filetype === 'RETRO_OUT') ? { accrualfile: fileid } :
                    (filetype === 'HANDBACK_IN' || filetype === 'HANDBACK_OUT' || filetype === 'RETRO_HANDBACK' || filetype === 'HANDBACK_IN_RETRO') ? { handbackfile: fileid } : {},
            columns: [
                {
                    type: 'html', title: 'UIN', dataIndex: 'uin', sorter: true,
                    render: (value, row) => {
                        let referencenumber = (row.referencenumber) ? row.referencenumber : '-';
                        value = <span>{value}<div style={{ fontSize: '12px', fontWeight: 'bold' }}>Reff Num : {referencenumber}</div></span>;
                        return value;
                    }
                },
                {
                    type: 'html', title: 'FFP Carrier Code', dataIndex: 'ffpcarriercode', sorter: true,
                    render: (value) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'FFP Number', dataIndex: 'ffpnumber', sorter: true,
                    render: (value) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Name', dataIndex: 'firstname', sorter: true,
                    render: (value, row) => { return `${row.firstname ? row.firstname : '-'} ${row.lastname ? row.lastname : ''}` }
                },
                {
                    type: 'html', title: 'Flight Information', dataIndex: 'flightinformation', sorter: false, width: '340px',
                    render: (value, row) => {
                        let marketingcarrier = (row.marketingcarrier) ? row.marketingcarrier : '-';
                        let marketingfltnum = (row.marketingfltnum) ? row.marketingfltnum : '-';
                        let operatingcarriercode = (row.operatingcarriercode) ? row.operatingcarriercode : '-';
                        let operatingfltnumber = (row.operatingfltnumber) ? row.operatingfltnumber : '-';
                        let origin = (row.origin) ? row.origin : '-';
                        let destination = (row.destination) ? row.destination : '-';
                        let operatingbookingsubclass = (row.operatingbookingsubclass) ? row.operatingbookingsubclass : '-';
                        let departuredate = (row.departuredate) ? moment(row.departuredate).format('DD/MM/YYYY') : '-';
                        let recordlocator = (row.recordlocator) ? row.recordlocator : '-';

                        return (
                            `${marketingcarrier}${marketingfltnum}-${operatingcarriercode}${operatingfltnumber},${departuredate}
                            ,${origin}-${destination},${operatingbookingsubclass},${recordlocator}`
                        )
                    }
                },
                {
                    type: 'html', title: 'Activity ID', dataIndex: 'activityid', sorter: true,
                    render: (value) => { return (value) ? <Link to="#" onClick={() => this.handleActivityId(value)}>{value}</Link> : '-' }
                },
                {
                    type: 'html', title: 'Posting Status', dataIndex: 'postingstatus', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Posting Type Indicator', dataIndex: 'postingtypeindicator', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return (value === 'FAILED') ? 'REJECTED' : jsUcfirst(value, '_').toUpperCase(); }
                },
                {
                    type: 'html', title: 'Remarks', dataIndex: 'remarks', sorter: true,
                    render: (value) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Accrual File', dataIndex: 'accrualfilename', sorter: true,
                    render: (value) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Rate Per Mile', dataIndex: 'ratepermile', sorter: true,
                    render: (value) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Total Charge', dataIndex: 'totalcharge', sorter: true,
                    render: (value) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Handback File', dataIndex: 'handbackfilename', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Billing File', dataIndex: 'billingfilename', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                {
                    type: 'field', title: 'Is Correction', dataIndex: 'iscorrection', sorter: true,
                    render: (value) => { return (value === true) ? 'Yes' : (value === false) ? 'No' : '-' }
                },
                {
                    type: 'field', title: 'Correction from', dataIndex: 'correctionid', sorter: true,
                    render: (value, row) => { return (value) ? <a onClick={() => this.handleCorrectionFrom(row.correctionid)} >{value}</a> : '-' }
                },
            ]

        };

        const configurationTable2 = {
            url: api.url.filedata.transferpoint,
            criteria: { fileid: fileid },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'First Name', dataIndex: 'firstname', sorter: true },
                { type: 'field', title: 'Last Name', dataIndex: 'lastname', sorter: true },
                {
                    type: 'html', title: 'Date of Redeem', dataIndex: 'dateofredeem', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Miles', dataIndex: 'miles', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Point', dataIndex: 'point', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Reward Code', dataIndex: 'rewardcode', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return (value ? value : '-') }
                },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value, row, index) => { return (value ? jsUcfirst(value, '_') : '-') }
                },
            ]
        };

        const configurationTable3 = {
            url: api.url.enrollmentfiledata.list,
            criteria: { fileid },
            columns: [
                { type: 'field', title: 'Activity Ref. Number', dataIndex: 'activityreferencenumber', sorter: true },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'membernumber', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'First Name', dataIndex: 'firstname', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Process Date', dataIndex: 'processdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : '-' }
                },
                {
                    type: 'html', title: 'Mileage', dataIndex: 'mileage', sorter: true,
                    render: (value, row, index) => { return (value !== null && value !== "") ? value : '-' }
                },
                {
                    type: 'html', title: 'Processing Message', dataIndex: 'processingmessage', sorter: true,
                    render: (value, row, index) => { return (value !== null && value !== "") ? value : '-' }
                },
                {
                    type: 'html', title: 'Response Code', dataIndex: 'responsecode', sorter: true,
                    render: (value, row, index) => { return (value !== null && value !== "") ? value : '-' }
                },
                {
                    type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-'; }
                },
                {
                    type: 'html', title: 'File Name', dataIndex: 'filename', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-'; }
                }
            ]
        };

        const configurationTable4 = {
            url: api.url.filedata.approvalcobrand,
            criteria: { fileid },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true },
                {
                    type: 'html', title: 'Name', dataIndex: 'firstname', sorter: false,
                    render: (value, row) => { return `${value} ${row.lastname ? row.lastname : '-'}` }
                },
                { type: 'field', title: 'Cobrand Code', dataIndex: 'cobrandcode', sorter: true },
                { type: 'html', title: 'Approval Date', dataIndex: 'approvaldate', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' } },
                { type: 'field', title: 'Approval Code', dataIndex: 'approvalcode', sorter: true },
                {
                    type: 'field', title: 'Reference ID', dataIndex: 'referenceid', sorter: true,
                    render: (value) => { return value ? value : '-' }
                },
                { type: 'html', title: 'Process Date', dataIndex: 'processdate', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' } },
                { type: 'field', title: 'Process Code', dataIndex: 'processingcode', sorter: true },
                { type: 'field', title: 'Processing Message', dataIndex: 'processingmessage', sorter: true }
            ]
        };

        const configurationTable5 = {
            url: api.url.filedata.cobrandfasstrack,
            criteria: { fileid },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Partner Custom ID', dataIndex: 'partnercustomid', sorter: true },
                {
                    type: 'html', title: 'Name', dataIndex: 'firstname', sorter: false,
                    render: (value, row) => { return `${value} ${row.lastname ? row.lastname : ''}` }
                },
                { type: 'field', title: 'Cobrand Code', dataIndex: 'regcobrandcode', sorter: true },
                { type: 'field', title: 'Target Tier', dataIndex: 'targettier', sorter: true },
                { type: 'field', title: 'Target Membership', dataIndex: 'targetmembership', sorter: true },
                { type: 'html', title: 'Process Date', dataIndex: 'processdate', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' } },
                { type: 'field', title: 'Processing Message', dataIndex: 'processingmessagecode', sorter: true },
                { type: 'html', title: 'Remark', dataIndex: 'remark', sorter: true, render: (value) => { return (value ? jsUcfirst(value, '_') : '-') } },
            ]
        };

        return (
            <React.Fragment>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={filetype === 'COBRAND_FASTTRACK' ? configurationSearchForm5 : filetype === 'APPROVAL_COBRAND' ? configurationSearchForm4 : filetype === 'ENROLLMENT_FILE' ? configurationSearchForm3 : filetype === 'TRANSFER_POINT' ? configurationSearchForm2 : configurationSearchForm} onSubmit={this.handleSearchForm} />
                <Row type="flex" justify="end" style={{ marginBottom: 10 }}>
                    <Button htmlType="button" type="primary" size="small" icon="download" label="Download Summary" onClick={() => this.handleDownloadModal(fileid)} />
                </Row>
                <Spin spinning={this.state.loading} tip="Please wait while checking data">
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={filetype === 'COBRAND_FASTTRACK' ? configurationTable5 : filetype === 'APPROVAL_COBRAND' ? configurationTable4 : filetype === 'ENROLLMENT_FILE' ? configurationTable3 : filetype === 'TRANSFER_POINT' ? configurationTable2 : configurationTable} />
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);