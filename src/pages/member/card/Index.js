import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

import OrderForm from './Form/Order';

const { Title } = Typography;
const optionsStatus = [
    { label: "Active", value: 'ACTIVE' },
    { label: "Inactive", value: 'INACTIVE' }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            membercardid: null
        }
    }
    componentDidMount() {
        document.title = "Manage Card | Loyalty Management System";
    }

    deleteData(membershiptypeid) {
        let url = api.url.membershiptype.delete;
        let data = { membershiptypeid };
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

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (membercardid) => {
        this.setState({ visible: true, membercardid });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };


    handleOk = () => {
        this.setState({ visible: false });
        this.componentTable.getList();
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { isLoading, visible, membercardid } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.membercard.list,
            criteria: { memberid },
            sort: { effectivedate: 'desc' },
            columns: [
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'html', title: 'Bussiness Case', dataIndex: 'businesscase',
                    render: (value, row, index) => {
                        return (value) ? jsUcfirst(value, "_") : '-'
                    }
                },
                { type: 'field', title: 'Name on Card', dataIndex: 'nameoncard', sorter: true },
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Expired Date', dataIndex: 'expireddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return value }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {(!row.orderstatus) ? <Button htmlType="button" size="small" label="Order" onClick={() => this.handleOpenModal(row.membercardid, 'order')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="ORDER" /> : null}
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true, maxLength: 20, validationrules: ['pattern.number'] },
            { labeltext: "Name on Card", datafield: "nameoncard", type: 'text', placeholder: 'Name on Card', showDefaultSearch: false },
            { labeltext: "Membership", datafield: "membershipname", type: 'text', placeholder: 'Membership', showDefaultSearch: true },
            { labeltext: "Tier", datafield: "tiername", type: 'text', placeholder: 'Tier', showDefaultSearch: true },
            { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
            { labeltext: "Expired Date", datafield: "expireddate", type: 'datepicker', placeholder: 'Expired Date', showDefaultSearch: false },
            { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: false }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>Manage Card</Title>
                    </Col>
                    <Divider />
                </Row>
                <Modal visible={visible} title="Order" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <OrderForm membercardid={membercardid} refreshHeader={this.props.refreshHeader} onClose={this.handleOk} />
                </Modal>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);