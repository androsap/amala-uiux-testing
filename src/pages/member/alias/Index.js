import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import AliasForm from './Form';

const { Title } = Typography;
const optionsChangeProcess = [
    { label: "Member Name", value: "MEMBER_NAME" },
    { label: "Card Number", value: "CARDNUMBER" },
    { label: "Ticket Name", value: "TICKET_NAME" }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            memberaliasid: null,
            titlepage: 'Create'
        }
    }

    componentDidMount() {
        document.title = "Member Alias | Loyalty Management System";
    }

    handleSearchForm = (input) => {
        let criteria = {};
        criteria.type = (input.type) ? input.type : null;
        criteria.ticketname = (input.type === 'TICKET_NAME') ? input.value : null;
        criteria.cardnumber = (input.type === 'CARDNUMBER') ? input.value : null;
        criteria.membername = (input.type === 'MEMBER_NAME') ? input.value : null;
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (memberaliasid) => {
        this.setState({ visible: true, memberaliasid });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    deleteData(memberaliasid) {
        let url = api.url.memberalias.delete;
        let data = { memberaliasid };
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

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, isLoading, memberaliasid, titlepage } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.memberalias.list,
            criteria: { memberid, type: 'TICKET_NAME' },
            columns: [
                { type: 'field', title: 'Type', dataIndex: 'type', sorter: true },
                {
                    type: 'html', title: 'Value', dataIndex: 'value', sorter: false,
                    render: (value, row, index) => {
                        if (row.type === 'TICKET_NAME') {
                            return (row.ticketname) ? row.ticketname : '-'
                        } else if (row.type === 'CARDNUMBER') {
                            return (row.cardnumber) ? row.cardnumber : '-'
                        } else if (row.type === 'MEMBER_NAME') {
                            return (row.membername) ? row.membername : '-'
                        }
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.memberaliasid)} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.memberaliasid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Alias Type", datafield: "type", type: 'select', placeholder: 'Alias Type', options: optionsChangeProcess, showDefaultSearch: true, defaultValue: 'TICKET_NAME', allowClear: false },
            { labeltext: "Value", datafield: "value", type: 'text', placeholder: 'Value', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + " Alias"} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680}>
                    <AliasForm memberid={memberid} memberaliasid={memberaliasid} refreshHeader={this.props.refreshHeader} onClose={this.handleCancel} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Alias</Title>
                    </Col>
                    <Col xs={24} xl={4} align="right">
                        <Button htmlType="button" type="primary" size="default" label="Create" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" onClick={() => this.handleOpenModal()} />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);