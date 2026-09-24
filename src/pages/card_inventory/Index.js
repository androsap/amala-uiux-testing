import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import ViewUsage from './ViewUsage';
import { Form, Divider, Row, Col, Typography, Icon, Modal } from 'antd';
import moment from 'moment';
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            criteria: {},
            sort: {},
            loading: false,
            visible: false
        };
    }

    componentDidMount() {
        document.title = "Manage Card Inventory | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOpenModal = (cardnumberissuedid) => {
        this.setState({ visible: true, cardnumberissuedid });
    };

    handleCloseDownloaded = () => {
        this.setState({ visible: false }, () => this.componentTable.getList());
    };

    handleOk = () => {
        this.setState({ showListModal: false, showAddModal: false });
        this.checkPermission();
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    render() {
        const { loading, visible, cardnumberissuedid } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const optionsRequestType = [
            { value: 'ENROLLMENT_FORM', label: 'ENROLLMENT FORM' },
            { value: 'UNIQUE_NUMBER', label: 'UNIQUE NUMBER' }
        ];
        const configurationSearchForm = [
            { labeltext: "Request Type", datafield: "cardnumrequest", type: 'select', placeholder: 'Request Type', options: optionsRequestType, showDefaultSearch: true },
            { labeltext: "Description", datafield: "description", type: 'text', placeholder: 'Description', showDefaultSearch: true },
            { labeltext: "Amount", datafield: "cardissuedsize", type: 'text', placeholder: 'Amount', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.cardnumberissued.list,
            sort: { requestdate: 'desc' },
            columns: [
                { type: 'field', title: 'Request Type', dataIndex: 'cardnumrequest', sorter: true },
                {
                    type: 'html', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Enroll Acquisition', dataIndex: 'isenrollacquisition', sorter: true, align: 'center',
                    render: (value) => { return (value) ? <Icon type="check" /> : '-' }
                },
                { type: 'field', title: 'Amount', dataIndex: 'cardissuedsize', sorter: true },
                {
                    type: 'html', title: 'Request Date', dataIndex: 'requestdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Expired Date', dataIndex: 'issuedexpirydate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="View Usage" onClick={() => this.handleOpenModal(row.cardnumberissuedid)} />
                            </span>
                        )
                    }
                },
            ]
        }
        return (
            <React.Fragment>
                <Modal
                    title="View Usage"
                    loading={loading}
                    visible={visible}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    footer={null}
                >
                    <ViewUsage cardnumberissuedid={cardnumberissuedid} closemodalrefresh={this.handleCloseDownloaded} />
                </Modal>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Card Inventory</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/card-inventory/form/'} size="middle" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment >
        )
    }
}

export default Form.create()(App);