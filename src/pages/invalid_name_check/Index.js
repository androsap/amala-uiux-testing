import React from 'react';
import { api } from '../../config/Services';
import { Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import Approval from './Approval';
import moment from 'moment';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Activity Date", datafield: "activitydate", type: 'datepicker', placeholder: 'Activity Date', showDefaultSearch: true },
    { labeltext: "Card Number ", datafield: "cardnumber", type: 'exact', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
    { labeltext: "Created Date", datafield: "createddate", type: 'datepicker', placeholder: 'Created Date', showDefaultSearch: true },
    { labeltext: "Booking Person Alias ", datafield: "bookingpersonalias", type: 'text', placeholder: 'Booking Person Alias', showDefaultSearch: true },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalApprove: false,
            modalReject: false
        }
    }

    componentDidMount() {
        document.title = "Member Activity - Invalid Name Check Verification | Loyalty Management System";
    }

    handleApprovalModal = (activityid, type) => {
        if (type === 'approve') { this.setState({ activityid, modalApprove: true }) }
        if (type === 'reject') { this.setState({ activityid, modalReject: true }) }
    }

    handleCancel = () => {
        this.setState({ modalApprove: false, modalReject: false });
    };

    handleOk = () => {
        this.setState({ modalApprove: false, modalReject: false }, () => this.componentTable.getList());
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { modalApprove, modalReject, activityid } = this.state;

        const configurationTable = {
            url: api.url.memberactivity.list,
            criteria: { activitytype: 'AIR', activityinfo: 'INVALID_NAME_CHECK', status: 'ACTIVE' },
            sort: { createddate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Activity Date', dataIndex: 'activitydate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'html', title: 'Activity Name', dataIndex: 'activityname',
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername', sorter: false,
                    render: (value, row, index) => {
                        let firstname = (row.firstname) ? row.firstname : null;
                        let lastname = (row.lastname) ? row.lastname : null;

                        if (firstname && lastname) {
                            return firstname + "/" + lastname;
                        } else if (firstname && lastname !== null) {
                            return firstname;
                        } else {
                            return "-"
                        }
                    }
                },
                {
                    type: 'html', title: 'Booking Person Alias', dataIndex: 'bookingpersonalias', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                { type: 'field', title: 'Created by', dataIndex: 'createdby', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" type="primary" size="small" icon="check" title="Approve" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={() => this.handleApprovalModal(row.activityid, 'approve')} />
                                <Button htmlType="button" type="danger" size="small" icon="close" title="Reject" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={() => this.handleApprovalModal(row.activityid, 'reject')} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal
                    title={modalApprove ? "Approve" : "Reject"}
                    visible={modalApprove ? modalApprove : modalReject ? modalReject : null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    footer={null}
                    width={700}>
                    <Approval actionType={modalApprove ? "approve" : "reject"} activityid={activityid} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} />
                </Modal>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Member Activity - Invalid Name Check Verification</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);