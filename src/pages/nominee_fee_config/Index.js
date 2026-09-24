import React, { Component, Fragment } from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, Alert, MembershipSelect, CustomTransactionSelect, TierSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import TableBase from '../../components/Table/TableBase';

const { Title, Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleHistory: false
        }
    }

    componentDidMount() {
        document.title = "Nominee Fee Config | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleCancel = () => {
        this.setState({ visibleHistory: false });
    };

    handleOk = () => {
        this.setState({ visibleHistory: false }, () => this.componentTable.getList());
    };

    handleActivationModal = (dataRow) => {
        this.setState({ visibleHistory: true, dataRow });
    }

    handleReject = (row) => {
        const { nomineefeeconfigid, active } = row;
        let url = (active) ? api.url.nomineefeeconfig.deactivate : api.url.nomineefeeconfig.activate;
        let data = { nomineefeeconfigid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const { form, history, menucode, prefixmenuname } = this.props;
        const { visibleHistory, dataRow } = this.state;
        const configurationSearchForm = [
            { labeltext: "Membership", datafield: "membershipid", type: 'component', placeholder: 'Membership', showDefaultSearch: true, component: MembershipSelect },
            { labeltext: "Tier", datafield: "tierid", type: 'component', placeholder: 'Tier', showDefaultSearch: true, component: TierSelect },
            { labeltext: "Fee", datafield: "changefee", type: 'text', placeholder: 'Fee', showDefaultSearch: false },
            { labeltext: "Custom Trx", datafield: "customtrxcode", type: 'component', placeholder: 'Custom Trx', showDefaultSearch: true, component: CustomTransactionSelect },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.nomineefeeconfig.list,
            columns: [
                { type: 'field', title: 'Membership', dataIndex: 'membershipid', sorter: true },
                { type: 'field', title: 'Tier ID', dataIndex: 'tierid', sorter: true },
                { type: 'field', title: 'Tier Name', dataIndex: 'tiername', sorter: true },
                {
                    type: 'group', title: 'Fee', childcolumns: [
                        { type: 'field', title: 'Miles', dataIndex: 'feemiles', sorter: true },
                        { type: 'field', title: 'Cash IDR', dataIndex: 'feecashidr', sorter: true },
                        { type: 'field', title: 'Cash USD', dataIndex: 'feecashusd', sorter: true }
                    ]
                },
                { type: 'field', title: 'Custom Trx Code', dataIndex: 'customtrxcode', sorter: true },
                { type: 'field', title: 'Custom Trx Name', dataIndex: 'customtrxname', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" type="default" size="small" icon="eye" title="Activation History" onClick={() => this.handleActivationModal(row)} />
                                {
                                    (row.active) ?
                                        <Button htmlType="button" type="danger" size="small" icon="close" title="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleReject(row)} /> :
                                        <Button htmlType="button" className="btn-custom-green" size="small" icon="check" title="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleReject(row)} />
                                }
                                <Button url={'/nominee-fee-config/form/' + row.nomineefeeconfigid} type="primary" size="small" icon="edit" title="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <Fragment>
                <Modal title="Nominee Fee History" visible={visibleHistory} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={680}>
                    <RetrieveHistory dataRow={dataRow} closeModalRefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={18}>
                        <Title level={3}>Nominee Fee Config</Title>
                    </Col>
                    <Col xs={24} xl={6} align="right">
                        <Button type="primary" url={`${history.location.pathname}/form/`} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={form} optionsConfiguration={configurationSearchForm} showAdvanceSearch={true} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </Fragment>
        );
    }
}

export class RetrieveHistory extends Component {
    render() {
        const { nomineefeeconfigid, membershipname, tiername } = this.props.dataRow;
        const configurationTable = {
            url: api.url.nomineefeeconfig.history,
            criteria: { nomineefeeconfigid },
            sort: { createddate: 'desc' },
            columns: [
                { type: 'field', title: 'Updated by', dataIndex: 'createdby' },
                {
                    type: 'html', title: 'Updated Date', dataIndex: 'createddate',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                { type: 'field', title: 'Status', dataIndex: 'status' }
            ]
        }

        return (
            <Fragment>
                <Row style={{ marginBottom: 25 }}>
                    <Text strong >Tier: {`${membershipname} - ${tiername}`}</Text>
                </Row>
                <Row>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Row>
            </Fragment>
        )
    }
}

export default Form.create()(App);