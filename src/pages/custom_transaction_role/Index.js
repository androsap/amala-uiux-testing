import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';

const optionsStatus = [
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'INACTIVE', value: 'INACTIVE' }
]

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = 'Manage Custom Transaction by Role | Loyalty Management System';
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    statusData(customtrxrole_id, status) {
        let url = (status === 'INACTIVE') ? api.url.customtransactionrole.activate : api.url.customtransactionrole.deactivate;
        let data = { customtrxrole_id };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback, status === 'ACTIVE');
    }

    deleteData(customtrxrole_id) {
        let url = api.url.customtransactionrole.delete;
        let data = { customtrxrole_id };
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
        const configurationSearchForm = [
            { labeltext: "Custom Transaction", datafield: "customtrxcode", type: 'text', placeholder: 'Custom Transaction', showDefaultSearch: true },
            { labeltext: "Role Name", datafield: "rolename", type: 'text', placeholder: 'Role Name', showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.customtransactionrole.list,
            columns: [
                { type: 'field', title: 'Custom Transaction', dataIndex: 'customtrxcode', sorter: true },
                { type: 'field', title: 'Role Name', dataIndex: 'rolename', sorter: true },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '20%',
                    render: (value, { customtrxrole_id, status }, index, row) => {
                        const props = { menucode, prefixmenuname };
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(customtrxrole_id)} />
                                <Button htmlType='button' size='small' type={status === "ACTIVE" ? 'default' : 'primary'} label={status === "ACTIVE" ? 'Deactivate' : 'Activate'} {...props}
                                    actioncode='DELETE' className={status === "ACTIVE" ? '' : 'btn-custom-green'} onClick={() => this.statusData(customtrxrole_id, status)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Custom Transaction by Role</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/custom-transaction-role/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
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