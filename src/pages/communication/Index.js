import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import Info from './Info';

const { Title } = Typography;

const optionsAllGroup = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 }
];
const optionsStatus = [
    { label: "Active", value: true },
    { label: "Inactive", value: false }
];
const configurationSearchForm = [
    { labeltext: "Reference Number", datafield: "referencenum", type: 'text', placeholder: 'Reference Number', showDefaultSearch: true },
    { labeltext: "All Group", datafield: "isallgroup", type: 'select', placeholder: 'All Group', showDefaultSearch: true, options: optionsAllGroup },
    { labeltext: "Title", datafield: "title", type: 'text', placeholder: 'Title', showDefaultSearch: false },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true },
    { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus },
];

class App extends React.Component {
    state = {
        visible: false
    }

    componentDidMount() {
        document.title = "Manage News | Loyalty Management System";
    }

    deleteData(id) {
        let url = api.url.communication.delete;
        let data = { id };
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

    handleOpenModal = (id) => {
        this.setState({ visible: true, id });
    };

    handleOk = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, id } = this.state

        const configurationTable = {
            url: api.url.communication.list,
            columns: [
                { type: 'field', title: 'Reference Number', dataIndex: 'referencenum', sorter: true },
                {
                    type: 'html', title: 'All Group', dataIndex: 'isallgroup', sorter: true,
                    render: (value, row, index) => { return (value) ? "Yes" : "No" }
                },
                { type: 'field', title: 'Title', dataIndex: 'title', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? "Active" : "Inactive" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Info" className="btn-custom-info" onClick={() => this.handleOpenModal(row.id)} />
                                <Button url={'/communication/form/' + row.id} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.id)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={visible} title="Info" onCancel={this.handleCancel} footer={null} destroyOnClose={true} className="modal-wide" >
                    <Info id={id} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage News</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/communication/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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