import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import Detail from './Detail';

const { Title } = Typography;

const optionsStatus = [
    { label: "Active", value: true },
    { label: "Incative", value: false }
]

class App extends React.Component {
    state = {
        visible: false
    }

    componentDidMount() {
        document.title = "Manage Branch | Loyalty Management System";
    }

    deleteData(branchcode) {
        let url = api.url.branch.delete;
        let data = { branchcode };
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

    handleOpenModal = (branchcode) => {
        this.setState({ visible: true, branchcode });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, branchcode } = this.state;
        const configurationSearchForm = [
            { labeltext: "Branch Code", datafield: "branchcode", type: 'text', placeholder: 'Branch Code', showDefaultSearch: true },
            { labeltext: "Branch Name", datafield: "branchname", type: 'text', placeholder: 'Branch Name', showDefaultSearch: true },
            { labeltext: "Description", datafield: "description", type: 'text', placeholder: 'Description', showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.branch.list,
            columns: [
                { type: 'field', title: 'Branch Code', dataIndex: 'branchcode', sorter: true },
                { type: 'field', title: 'Branch Name', dataIndex: 'branchname', sorter: true },
                {
                    type: 'html', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value, row, index) => { return (value) ? value.length > 60 ? value.substring(0, 60) + '...' : value : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active',
                    render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="View Detail" className="btn-custom-info" onClick={() => this.handleOpenModal(row.branchcode)} />
                                <Button url={'/branch/form/' + row.branchcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.branchcode)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title="View Detail" onCancel={this.handleCancel} footer={null} destroyOnClose={true} >
                    <Detail branchcode={branchcode} />
                </Modal>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Branch</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/branch/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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