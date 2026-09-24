import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest } from '../../../utilities/RequestService';
import { connect } from 'react-redux';
import { Button, SearchForm, TableBase, ProductNameSelect, InventoryVariantSelect, LetterSelect, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Drawer, Table, Icon, Modal } from 'antd';
import { Tabs } from 'antd';
import { ProductType, TrueFalseOptions, OverSla } from '../../../data';
import moment from 'moment';

import Notes from './Notes';
import Upload from './Upload';

const { confirm } = Modal;

const { TabPane } = Tabs;
const { Title } = Typography;

const optionsHandling = [
    { label: "REGULER", value: "REGULER" },
    { label: "URGENT", value: "URGENT" },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            visibleNew: false,
            visibleProgress: false,
            visibleFinish: false,
            visible: false,
            visible2: false,
            expanded: false,
            active: true,
            orderpackedid: [],
            selectedRows: [],
            selectedRowKeys: [],
            selectedRowsProgress: [],
            placement: 'bottom',
            visibleUpload: false,
            visibleDrawerProgress: false,
            tab2clicked: false,
            tab3clicked: false,
            activeKey: (this.props.location && this.props.location.state && this.props.location.state.activeKey) ? this.props.location.state.activeKey : '1'
        }
    };

    componentDidMount() {
        document.title = 'Manage Package Order | Loyalty Management System';
        this.props.history.push({ state: { activeKey: '1' } });
    };

    handleSearchForm = (criteria, type) => {
        if (type === 'tab1') this.componentTable1.handleSearchForm(criteria);
        if (type === 'tab2') this.componentTable2.handleSearchForm(criteria);
        if (type === 'tab3') this.componentTable3.handleSearchForm(criteria);
    };

    showModal = (orderpackedid, type) => {
        if (type !== 'progress') this.setState({ orderpackedid, type, visible: true });
        if (type === 'progress') this.setState({ orderpackedid, type, visible2: true });
    };

    showDrawer = (value, selectedRows, selectedRowsKeys, type) => {
        if (type === 'new') this.setState({ selectedRows, selectedRowsKeys, visibleNew: value });
        if (type === 'progress') this.setState({ selectedRows, selectedRowsKeys, visibleProgress: value });
        if (type === 'finish') this.setState({ selectedRows, selectedRowsKeys, visibleFinish: value });
    };

    onCloseDrawwer = () => {
        this.setState({ visibleNew: false, visibleProgress: false, visibleFinish: false });
    };

    onbigger = () => {
        this.setState({ expanded: true });
    };

    onsmaller = () => {
        this.setState({ expanded: false });
    };

    onChange = (e) => {
        this.setState({ placement: e.target.value });
    };

    removeRowAction(key) {
        const { selectedRows, selectedRowsKeys } = this.state;
        selectedRows.splice(key, 1);
        selectedRowsKeys.splice(key, 1);
        this.setState({ selectedRows, selectedRowsKeys, visibleNew: !(selectedRowsKeys.length === 0), visibleProgress: !(selectedRowsKeys.length === 0), visibleFinish: !(selectedRowsKeys.length === 0) });
    };

    selectedRow = () => {
        this.setState({ selectedRowKeys: [] })
    };

    handleOk = (e) => {
        let activeKey = (this.state.activeKey === '1') ? '2' : (this.state.activeKey === '2') ? '3' : '3'
        let criteria = { orderdatestart: null, orderdateend: null, deadline: null, cardnumber: null, membername: null, ordercode: null, usevendor: null, mailingproducttype: null, mailingproductcode: null, inventoryvariantid: null, lettercode: null, priorityhandling: null, reordernumber: null };
        this.setState({ visible: false, visible2: false, visibleNew: false, visibleProgress: false, visibleFinish: false, visibleUpload: false, activeKey });
        if (activeKey === '1') this.componentTable1.resetSelectedRowKeys();
        if (activeKey === '1') this.componentTable1.handleSearchForm(criteria);
        if (activeKey === '2') setTimeout(() => { this.componentTable2.resetSelectedRowKeys() }, 500);
        if (activeKey === '2') setTimeout(() => { this.componentTable2.handleSearchForm(criteria) }, 500);
        if (activeKey === '3') setTimeout(() => { this.componentTable3.resetSelectedRowKeys() }, 500);
        if (activeKey === '3') setTimeout(() => { this.componentTable3.handleSearchForm(criteria) }, 500);
    };

    handleNotOk = (e) => {
        let activeKey = this.state.activeKey;
        let criteria = { orderdatestart: null, orderdateend: null, deadline: null, cardnumber: null, membername: null, ordercode: null, usevendor: null, mailingproducttype: null, mailingproductcode: null, inventoryvariantid: null, lettercode: null, priorityhandling: null, reordernumber: null };
        this.setState({ visible: false, visible2: false, visibleNew: false, visibleProgress: false, visibleFinish: false, visibleUpload: false, activeKey });
        if (activeKey === '1') this.componentTable1.resetSelectedRowKeys();
        if (activeKey === '1') this.componentTable1.handleSearchForm(criteria);
        if (activeKey === '2') setTimeout(() => { this.componentTable2.resetSelectedRowKeys() }, 500);
        if (activeKey === '2') setTimeout(() => { this.componentTable2.handleSearchForm(criteria) }, 500);
        if (activeKey === '3') setTimeout(() => { this.componentTable3.resetSelectedRowKeys() }, 500);
        if (activeKey === '3') setTimeout(() => { this.componentTable3.handleSearchForm(criteria) }, 500);
    };

    handleCancel = (e) => {
        let activeKey = this.state.activeKey;
        this.setState({ visible: false, visible2: false, visibleUpload: false });
        if (activeKey === '1') this.componentTable1.getList();
        if (activeKey === '2') setTimeout(() => { this.componentTable2.getList() }, 500)
        if (activeKey === '3') setTimeout(() => { this.componentTable3.getList() }, 500)
    };

    handleUploadModal = (visibleUpload) => {
        this.setState({ visibleUpload })
    };

    handleTabsChange = (val) => {
        const { selectedRows, selectedRowsProgress } = this.state;
        this.setState({
            tabActive: val,
            visibleNew: (val === '1' && selectedRows.length !== 0),
            visibleDrawerProgress: (val === '2' && selectedRowsProgress.length !== 0)
        });
    };

    handleResetDate = () => {
        this.props.form.resetFields(['orderdateend', []]);
    }

    /* handle Product Type change */
    handleProduct = async (mailingproducttype) => {
        if (mailingproducttype) {
            await this.componentSearchForm.component.mailingproductcode.retrieveData2({ producttype: mailingproducttype });
        }
        this.props.form.resetFields(['mailingproductcode', 'inventoryvariantid', 'lettercode', 'priorityhandling', []]);
    }

    /* handle Product Name change */
    handleProductName = async (mailingproductcode) => {
        if (mailingproductcode) {
            const inventorycode = this.componentSearchForm.component.mailingproductcode.getValue(mailingproductcode, 'inventorycode');
            await this.componentSearchForm.component.inventoryvariantid.retrieveData({ inventorycode });
        }
        this.props.form.resetFields(['inventoryvariantid', 'lettercode', 'priorityhandling', []]);
    };

    /* handle Variant Name change */
    handleVariantName = async (inventoryvariantid) => {
        if (inventoryvariantid) {
            const lettercode = this.componentSearchForm.component.inventoryvariantid.getValue(inventoryvariantid, 'inventorycode');
            await this.componentSearchForm.component.lettercode.retrieveData({ lettercode });
        }
        this.props.form.resetFields(['lettercode', 'priorityhandling', []]);
    };

    handleTabCliked = (key) => {
        this.props.form.resetFields();
        let criteria = { orderdatestart: null, orderdateend: null, deadline: null, cardnumber: null, membername: null, ordercode: null, usevendor: null, mailingproducttype: null, mailingproductcode: null, inventoryvariantid: null, lettercode: null, priorityhandling: null, reordernumber: null };
        if (key === '1') {
            criteria.status = 'READYTOPACK';
            this.setState({ tab2clicked: false, visibleNew: false, activeKey: '1' });
            setTimeout(() => { this.componentTable1.resetSelectedRowKeys() }, 1000);
            setTimeout(() => { this.componentTable1.handleSearchForm(criteria) }, 1000)
        }
        if (key === '2') {
            criteria.status = 'PACKING';
            this.setState({ tab3clicked: false, tab2clicked: true, visibleNew: false, activeKey: '2' });
            setTimeout(() => { this.componentTable2.resetSelectedRowKeys() }, 1000);
            setTimeout(() => { this.componentTable2.handleSearchForm(criteria) }, 1000)
        }
        if (key === '3') {
            criteria.status = 'PACKED';
            this.setState({ tab2clicked: false, tab3clicked: true, visibleNew: false, activeKey: '3' });
            setTimeout(() => { this.componentTable3.resetSelectedRowKeys() }, 1000);
            setTimeout(() => { this.componentTable3.handleSearchForm(criteria) }, 1000)
        }
    };

    downloadData = () => {
        const callback = () => {
            let orderpackedids = this.state.selectedRows.map(val => val.orderpackedid);
            let url = api.url.packaging.download
            let data = { orderpackedids: orderpackedids };
            let message = 'Downloading file...';
            DetailRequest(url, data).then((response) => {
                const { status = {}, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    window.location.href = result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    this.handleOk();
                } else {
                    this.handleNotOk();
                    Alert.error(responsemessage);
                }
            });
        }
        confirm({
            title: 'Are you sure to download this file?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    render() {
        const { selectedRows, active, selectedRowKeys, expanded, visible, visible2, orderpackedid, type, visibleUpload, activeKey, placement, visibleNew, tab2clicked, tab3clicked, isLoading, visibleProgress, visibleFinish } = this.state;
        const heightexpand = (expanded === true) ? 440 : 50;
        const orderdatestart = this.props.form.getFieldValue('orderdatestart');
        const mailingproducttype = this.props.form.getFieldValue('mailingproducttype');
        const mailingproductcode = this.props.form.getFieldValue('mailingproductcode');

        const configurationSearchForm = [
            { labeltext: 'Start Order Date', datafield: 'orderdatestart', type: 'datepicker', placeholder: 'Start Order Date', showDefaultSearch: true, onChange: (e) => this.handleResetDate(e) },
            {
                labeltext: 'End Order Date', datafield: 'orderdateend', type: 'datepicker', placeholder: 'End Order Date', showDefaultSearch: true,
                minDate: moment(orderdatestart).add(0, 'days'), disabled: (orderdatestart) ? false : true
            },
            { labeltext: 'Deadline', datafield: 'deadline', type: 'datepicker', placeholder: 'Deadline', showDefaultSearch: false },
            { labeltext: 'Is Over Sla', datafield: 'isoversla', type: 'select', placeholder: 'Is Over Sla', options: OverSla, showDefaultSearch: false },
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Order Code', datafield: 'ordercode', type: 'text', placeholder: 'Order Code', showDefaultSearch: true },
            { labeltext: 'Use Vendor', datafield: 'usevendor', type: 'select', placeholder: 'Use Vendor', options: TrueFalseOptions, showDefaultSearch: true },
            { labeltext: 'Product Type', datafield: 'mailingproducttype', type: 'select', placeholder: 'Product Type', options: ProductType, onChange: (e) => this.handleProduct(e), showDefaultSearch: false },
            { labeltext: 'Product Name', datafield: 'mailingproductcode', type: 'component', placeholder: 'Product Name', component: ProductNameSelect, onChange: (e) => this.handleProductName(e), showDefaultSearch: false, disabled: mailingproducttype ? false : true },
            { labeltext: 'Variant', datafield: 'inventoryvariantid', type: 'component', placeholder: 'Variant', component: InventoryVariantSelect, onChange: (e) => this.handleVariantName(e), showDefaultSearch: false, disabled: mailingproductcode ? false : true },
            { labeltext: 'Letter', datafield: 'lettercode', type: 'component', placeholder: 'Letter', component: LetterSelect, showDefaultSearch: false },
            { labeltext: 'Priority Handling', datafield: 'priorityhandling', type: 'select', placeholder: 'Priority Handling', options: optionsHandling, showDefaultSearch: false },
            { labeltext: 'Reorder Number', datafield: 'reordernumber', type: 'text', placeholder: 'Reorder Number', showDefaultSearch: false },
        ];
        const configurationTable = {
            url: api.url.packaging.list,
            criteria: { status: activeKey === '2' ? 'PACKING' : activeKey === '3' ? 'PACKED' : 'READYTOPACK' },
            columnClassName: 'nowrap',
            sort: { orderdate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Order Code', dataIndex: 'ordercode', sorter: true,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Order Date', dataIndex: 'orderdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername', sorter: true, width: 180,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Type', dataIndex: 'mailingproducttype', sorter: true,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Name', dataIndex: 'mailingproductname', sorter: true, width: 150,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Variant', dataIndex: 'inventoryvariantname', sorter: true, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Letter', dataIndex: 'lettername', sorter: true, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Use Vendor', dataIndex: 'usevendor', sorter: true,
                    render: (value) => { return (value === null) ? '-' : (value) ? 'True' : 'False' }
                },
                {
                    type: 'html', title: 'Deadline', dataIndex: 'deadline', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Is Over SLA', dataIndex: 'isoversla', sorter: true,
                    render: (value) => { return (value === true) ? <p style={{ color: 'red', marginTop: 12 }}>OVER SLA</p> : (value === false) ? 'ON TIME' : '-' }
                },
                {
                    type: 'html', title: 'Priority Handling', dataIndex: 'priorityhandling', sorter: true,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Reorder Number', dataIndex: 'reordernumber', sorter: true, align: 'center', align: 'center',
                    render: (value) => { return (value) ? (value) : '0' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: false, width: 130,
                    render: (value) => { return (value === 'READYTOPACK') ? 'READY TO PACK' : value }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', sorter: false,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Updated By', dataIndex: 'updatedBy', sorter: false,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                (activeKey !== '1') ?
                    {
                        type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                        render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                    } : '',
                (activeKey === '3') ? {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                } : '',
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button url={{ pathname: `/order-management/package/details/` + encodeURIComponent(row.orderpackedid), state: { activeKey } }} size='small' title='Details' icon='eye' actioncode='UPDATE' />
                            </span>
                        )
                    }
                },
            ]
        };
        const configSelectTable = {
            url: api.url.packaging.list,
            columns: [
                {
                    type: 'html', title: 'Order Code', dataIndex: 'ordercode', sorter: false,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Order Date', dataIndex: 'orderdate', sorter: false,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername', sorter: false, width: 150,
                    render: (value, row) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Type', dataIndex: 'mailingproducttype', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Name', dataIndex: 'mailingproductname', sorter: false, width: 150,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Variant', dataIndex: 'inventoryvariantname', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Letter', dataIndex: 'lettername', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Use Vendor', dataIndex: 'usevendor', sorter: false, width: 130,
                    render: (value) => { return (value === null) ? '-' : (value) ? 'True' : 'False' }
                },
                {
                    type: 'html', title: 'Deadline', dataIndex: 'deadline', sorter: false, width: 130,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Is Over SLA', dataIndex: 'isoversla', sorter: false, width: 130,
                    render: (value) => { return (value === true) ? <p style={{ color: 'red', marginTop: 13 }}>OVER SLA</p> : (value === false) ? 'ON TIME' : '-' }
                },
                {
                    type: 'html', title: 'Priority Handling', dataIndex: 'priorityhandling', sorter: false, width: 140,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Reorder Number', dataIndex: 'reordernumber', sorter: false, align: 'center', width: 140,
                    render: (value) => { return (value || value === 0) ? (value) : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: false, width: 130,
                    render: (value) => { return (value === 'READYTOPACK') ? 'READY TO PACK' : value }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Updated By', dataIndex: 'updatedBy', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                (activeKey !== '1') ?
                    {
                        type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: false, width: 130,
                        render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                    } : {},
                (activeKey === '3') ? {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: false, width: 130,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                } : {},
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: 130,
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label='Remove' type='danger' onClick={() => this.removeRowAction(index)} disabled={active ? false : true} />
                            </span>
                        )
                    }
                },
            ],
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} sm={16} md={18} lg={20} xl={22}>
                        <Title level={3}>Manage Package Order List</Title>
                    </Col>
                    {(activeKey === '2') ? <Col xs={24} sm={8} md={6} lg={4} xl={2}>
                        <Button htmlType='button' size='default' type='primary' label='Upload' icon='upload' onClick={() => this.handleUploadModal(true)} />
                    </Col> : null}
                    <Divider />
                </Row>
                <Tabs defaultActiveKey='1' style={{ marginTop: '-20px' }} onTabClick={this.handleTabCliked} activeKey={activeKey}>
                    <TabPane tab='NEW ORDER' key='1'>
                        <div>
                            <Drawer style={{ backgroundColor: '#9DDAF2' }} orderpackedid={orderpackedid} height={heightexpand} placement={placement} mask={false} closable={false} onClose={this.onCloseDrawwer} visible={visibleNew}
                                title={
                                    <Row gutter={24} >
                                        <Col lg={8}><span style={{ marginLeft: 8 }}>
                                            {(selectedRows.length > 0) ? `Selected ${selectedRows.length} items` : ''}
                                        </span>
                                        </Col>
                                        <Col lg={8}>
                                            <Row type='flex' justify='center'>
                                                {(expanded) ? <Icon type='down' onClick={() => this.onsmaller()} /> : <Icon type='up' onClick={() => this.onbigger()} />}
                                            </Row>
                                        </Col>
                                        <Col lg={8}>
                                            <Row type='flex' justify='end'>
                                                <Button htmlType='button' size='small' label='DOWNLOAD & PROCESS' type='primary' onClick={(e) => this.showModal(e, 'download')} />
                                                <Button htmlType='button' size='small' label='PROCESS' type='primary' onClick={(e) => this.showModal(e, 'process')} />
                                            </Row>
                                        </Col>
                                    </Row>}
                            >
                                {(selectedRows.length === 0) ? '' : <Table columns={configSelectTable.columns} dataSource={selectedRows} pagination={false} />}
                            </Drawer>
                        </div>

                        <Modal title={'Are you sure to update this selected data?'} visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={800}>
                            <Notes {...this.props} data={selectedRows} closemodalrefresh={this.handleOk} closeNotOk={this.handleNotOk} cancelModal={this.handleCancel} selectedRow={this.selectedRow} type={type} />
                        </Modal>

                        <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={value => this.handleSearchForm(value, 'tab1')} />
                        <TableBase getCheckboxProps={record => ({
                            disabled: record.usevendor && (new Date(record.deadline).toISOString().split('T')[0] >= new Date().toISOString().split('T')[0]),
                            children:
                                <span>
                                    {record.usevendor && (new Date(record.deadline).toISOString().split('T')[0] >= new Date().toISOString().split('T')[0]) ?
                                        <span
                                            style={{ border: "4px solid red" }} title={'Use Vendor and Deadline'}
                                        />
                                        : ''}
                                    {record.havemessage ?
                                        <span
                                            style={{ border: "4px solid blue", marginLeft: 5 }} title={'Have Message'}
                                        />
                                        : ''}
                                </span>
                        })} rowSelection={true} defaultRowSelectedKey={selectedRowKeys} useCustomOnChange={true} customOnChange={(e, f, g) => this.showDrawer(e, f, g, 'new')} ref={(e) => { this.componentTable1 = e }} configuration={configurationTable} />
                    </TabPane>
                    <TabPane tab='IN PROGRESS' key='2'>
                        <Col lg={24}></Col>
                        <Drawer style={{ backgroundColor: '#9DDAF2' }} orderpackedid={orderpackedid} height={heightexpand} placement={placement} mask={false} closable={false} onClose={this.onClose} visible={visibleProgress}
                            title={
                                <Row gutter={24} >
                                    <Col lg={8}><span style={{ marginLeft: 8 }}>
                                        {(selectedRows.length > 0) ? `Selected ${selectedRows.length} items` : ''}
                                    </span>
                                    </Col>
                                    <Col lg={8}>
                                        <Row type='flex' justify='center'>
                                            {(expanded) ? <Icon type='down' onClick={() => this.onsmaller()} /> : <Icon type='up' onClick={() => this.onbigger()} />}
                                        </Row>
                                    </Col>
                                    <Col lg={8}>
                                        <Row type='flex' justify='end'>
                                            <Button htmlType='button' size='small' label='FINISH' type='primary' onClick={(e) => this.showModal(e, 'progress')} />
                                        </Row>
                                    </Col>
                                </Row>}
                        >
                            {(selectedRows.length === 0) ? '' : <Table columns={configSelectTable.columns} dataSource={selectedRows} pagination={false} />}
                        </Drawer>
                        <Modal title={'Are you sure to update this selected data?'} visible={visible2} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={800} style={{ marginTop: '-50px' }}>
                            <Notes data={selectedRows} closemodalrefresh={this.handleOk} closeNotOk={this.handleNotOk} cancelModal={this.handleCancel} selectedRow={this.selectedRow} type={type} />
                        </Modal>
                        <Modal visible={visibleUpload} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700} >
                            <Upload {...this.props} closemodalrefresh={this.handleOk} onCancel={this.handleCancel} />
                        </Modal>
                        <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={value => this.handleSearchForm(value, 'tab2')} />
                        <TableBase getCheckboxProps={record => ({
                            disabled: record.awb === null || (record.usevendor && (new Date(record.deadline).toISOString().split('T')[0] >= new Date().toISOString().split('T')[0])),
                            children:
                                <span>
                                    {record.usevendor && (new Date(record.deadline).toISOString().split('T')[0] >= new Date().toISOString().split('T')[0]) ?
                                        <span
                                            style={{ border: "4px solid red" }} title={'Use Vendor and Deadline'}
                                        />
                                        : ''}
                                    {record.havemessage ?
                                        <span
                                            style={{ border: "4px solid blue", marginLeft: 5 }} title={'Have Message'}
                                        />
                                        : ''}
                                </span>
                        })} rowSelection={true} defaultRowSelectedKey={selectedRowKeys} useCustomOnChange={true} customOnChange={(e, f, g) => this.showDrawer(e, f, g, 'progress')} ref={(e) => { this.componentTable2 = e }} configuration={configurationTable} />
                    </TabPane>
                    <TabPane tab='FINISH' key='3'>
                        <Drawer style={{ backgroundColor: '#9DDAF2' }} orderpackedid={orderpackedid} height={heightexpand} placement={placement} mask={false} closable={false} onClose={this.onClose} visible={visibleFinish}
                            title={
                                <Row gutter={24} >
                                    <Col lg={8}><span style={{ marginLeft: 8 }}>
                                        {(selectedRows.length > 0) ? `Selected ${selectedRows.length} items` : ''}
                                    </span>
                                    </Col>
                                    <Col lg={8}>
                                        <Row type='flex' justify='center'>
                                            {(expanded) ? <Icon type='down' onClick={() => this.onsmaller()} /> : <Icon type='up' onClick={() => this.onbigger()} />}
                                        </Row>
                                    </Col>
                                    <Col lg={8}>
                                        <Row type='flex' justify='end'>
                                            <Button htmlType='button' size='small' label='DOWNLOAD' type='primary' onClick={() => this.downloadData()} />
                                        </Row>
                                    </Col>
                                </Row>}
                        >
                            {(selectedRows.length === 0) ? '' : <Table columns={configSelectTable.columns} dataSource={selectedRows} pagination={false} />}
                        </Drawer>
                        <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={value => this.handleSearchForm(value, 'tab3')} />
                        <TableBase rowSelection={true} defaultRowSelectedKey={selectedRowKeys} useCustomOnChange={true} customOnChange={(e, f, g) => this.showDrawer(e, f, g, 'finish')} ref={(e) => { this.componentTable3 = e }} configuration={configurationTable} />
                    </TabPane>
                </Tabs>
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));