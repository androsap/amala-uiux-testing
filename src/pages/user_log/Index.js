import React from 'react';
import { api } from '../../config/Services';
import { Button, TableBase, SearchForm, ModuleSelect } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import moment from 'moment';
import PreviewMember from './Details';
import Legends from './Legends';

const { Title } = Typography;

const ActionType = [
    { label: "Activate", value: "activate" },
    { label: "Create", value: "create" },
    { label: "Deactivate", value: "deactivate" },
    { label: "Delete", value: "delete" },
    { label: "Update", value: "update" },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visible2: false,
            isLoading: false,
            logid: null,
        }
    }

    componentDidMount() {
        document.title = "Manage User Log Monitoring | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    handleOpenModal = (logid) => {
        this.setState({ visible: true, logid });
    };

    handleOpenModal2 = () => {
        this.setState({ visible2: true });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    handleCancel2 = () => {
        this.setState({ visible2: false, titlepage: 'Create' });
    };

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleOk2 = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleStartDate = () => {
        this.props.form.resetFields(['enddate', []]);
    }

    render() {
        const { visible, visible2, isLoading, logid } = this.state;
        const startdate = this.props.form.getFieldValue('startdate');

        const configurationSearchForm = [
            { labeltext: "Username", datafield: "username", type: 'text', placeholder: 'Username', showDefaultSearch: true },
            { 
                labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true, specialSearch: true,
                maxDate: moment().subtract(0, 'days'), onChange: (e) => this.handleStartDate(e)
            },
            { 
                labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true, specialSearch: true,
                disabled: startdate ? false : true, minDate: moment(startdate).add(0, 'days'),
            },
            { labeltext: "Action", datafield: "operation", type: 'select', placeholder: 'Action', options: ActionType, showDefaultSearch: true },
            { labeltext: "Module", datafield: "module", type: 'component', placeholder: 'Module', component: ModuleSelect, showDefaultSearch: true }
        ];

        const configurationTable = {
            url: api.url.userlog.log,
            sort: { logtime: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Log Time', dataIndex: 'logtime', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY HH:mm:ss') : '' }
                },
                { type: 'field', title: 'Username', dataIndex: 'username', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'operation', sorter: true,
                    render: (value) => { return (value) ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '-' }
                },
                {
                    type: 'html', title: 'Module', dataIndex: 'module', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Sub Module', dataIndex: 'submodule', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Data Name Before', dataIndex: 'datanamebefore', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Data Name After', dataIndex: 'datanameafter', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Details', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button url={this.props.match.url + '/Details/' + row.logid} size="small" title="View" icon="eye" actioncode="ACCESS" />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={23}>
                        <Title level={3}>Manage User Log Monitoring</Title>
                    </Col>
                    <Col xs={24} xl={1}>
                        <Button htmlType="button" type="default" title="Legends" icon="info" onClick={() => this.handleOpenModal2()} />
                    </Col>
                    <Divider />
                </Row>
                <Modal visible={visible} title="Details User Log Monitoring" loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1400} style={{ top: 30}}>
                    <PreviewMember {...this.props} onClose={this.handleCancel} logid={logid} refreshList={this.handleOk} />
                </Modal>
                <Modal visible={visible2} loading={isLoading} onCancel={this.handleCancel2} footer={null} destroyOnClose={true} width={1200} style={{ top: 30}}>
                    <Legends {...this.props} onClose={this.handleCancel2} refreshList={this.handleOk2} />
                </Modal>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);