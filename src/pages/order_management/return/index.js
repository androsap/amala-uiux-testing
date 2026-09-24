import React from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button, SearchForm, TableBase, ProductNameSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Drawer, Table, Icon, Typography, Divider, Modal } from 'antd';
import { ProductType } from '../../../data';
import moment from 'moment';
import Bulk from './Bulk';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            visible: false,
            visible2: false,
            expanded: false,
            active: true,
            orderreturnid: [],
            selectedRows: [],
            selectedRowKeys: [],
            placement: 'bottom',
        }
    };

    componentDidMount() {
        document.title = 'Manage Return Order | Loyalty Management System';
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    handleResetDate = (e, type) => {
        if (type === 'order') {
            this.props.form.resetFields(['orderdateend', []]);
        } else
        this.props.form.resetFields(['returndateend', []]);
    }

    showModal = (orderreturnid) => {
        this.setState({ visible2: true, orderreturnid })
    };

    showDrawer = (value, selectedRows, selectedRowsKeys) => {
        this.setState({ visible: value, selectedRows, selectedRowsKeys });
    };

    onClose = () => {
        this.setState({ visible: false });
    };

    onbigger = () => {
        this.setState({ expanded: true });
    };

    onsmaller = () => {
        this.setState({ expanded: false });
    };

    onChange = e => {
        this.setState({ placement: e.target.value });
    };

    removeRowAction(key) {
        const { selectedRows, selectedRowsKeys } = this.state;
        selectedRows.splice(key, 1);
        selectedRowsKeys.splice(key, 1);
        this.setState({ selectedRows, selectedRowsKeys, visible: selectedRowsKeys.length === 0 ? false : true });
    }

    selectedRow = () => {
        this.setState({ selectedRowKeys: [] })
    };

    handleOk = e => {
        this.setState({ visible: false, visible2: false, selectedRows: [], selectedRowKeys: [] });
        this.componentTable.resetSelectedRowKeys();
        this.componentTable.getList()
    };

    handleCancel = (val, type) => {
        this.setState({ visible2: false });
        this.componentTable.getList();
    };

    /* handle Product Type change */
    handleProduct = async (mailingproducttype) => {
        if (mailingproducttype) {
            await this.componentSearchForm.component.mailingproductcode.retrieveData2({ producttype: mailingproducttype });
        }
        this.props.form.resetFields(['mailingproductcode', []]);
    }

    render() {
        const { selectedRows, active, selectedRowKeys, expanded, visible2, orderreturnid, isLoading } = this.state;
        const heightexpand = expanded === true ? 450 : 50;
        const orderdatestart = this.props.form.getFieldValue('orderdatestart');
        const returndatestart = this.props.form.getFieldValue('returndatestart');
        const mailingproducttype = this.props.form.getFieldValue('mailingproducttype');

        const configurationSearchForm = [
            { labeltext: 'Start Order Date', datafield: 'orderdatestart', type: 'datepicker', placeholder: 'Start Order Date', showDefaultSearch: true, onChange: (e) => this.handleResetDate(e, 'order') },
            {
                labeltext: 'End Order Date', datafield: 'orderdateend', type: 'datepicker', placeholder: 'End Order Date', showDefaultSearch: true,
                minDate: moment(orderdatestart).add(0, 'days'), disabled: (orderdatestart) ? false : true
            },
            { labeltext: 'Start Return Date', datafield: 'returndatestart', type: 'datepicker', placeholder: 'Start Return Date', showDefaultSearch: true, onChange: (e) => this.handleResetDate(e, 'return') },
            {
                labeltext: 'End Return Date', datafield: 'returndateend', type: 'datepicker', placeholder: 'End Return Date', showDefaultSearch: true,
                minDate: moment(returndatestart).add(0, 'days'), disabled: (returndatestart) ? false : true
            },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Order Code', datafield: 'ordercode', type: 'text', placeholder: 'Order Code', showDefaultSearch: true },
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: false },
            { labeltext: 'Product Type', datafield: 'mailingproducttype', type: 'select', placeholder: 'Product Type', options: ProductType, onChange: (e) => this.handleProduct(e), showDefaultSearch: false },
            { labeltext: 'Product Name', datafield: 'mailingproductcode', type: 'component', placeholder: 'Product Name', component: ProductNameSelect, showDefaultSearch: false, disabled: mailingproducttype ? false : true },
            { labeltext: 'Reorder Number', datafield: 'reordernumber', type: 'text', placeholder: 'Reorder Number', showDefaultSearch: false },
        ];

        const configurationTable = {
            url: api.url.return.list,
            criteria: { status: 'RETURN' },
            sort: { returndate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Order Code', dataIndex: 'ordercode', sorter: true, width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Order Date', dataIndex: 'orderdate', sorter: true, width: 110,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Return Date', dataIndex: 'returndate', sorter: true, width: 110,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true, width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername', sorter: true, width: 150,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Type', dataIndex: 'mailingproducttype', sorter: true, width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Name', dataIndex: 'mailingproductname', sorter: true, width: 180,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Return To', dataIndex: 'returnto', sorter: true, width: 100,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Reorder Number', dataIndex: 'reordernumber', sorter: true, align: 'center', width: 140,
                    render: (value) => { return (value) ? (value) : '0' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: false, width: 120,
                    render: (value, row) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', sorter: false, width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button url={'/order-management/return/details/' + encodeURIComponent(row.orderreturnid)} size='small' title='Details' icon='eye' actioncode='UPDATE' />
                            </span>
                        )
                    }
                },
            ]
        };

        const configSelectTable = {
            url: api.url.return.list,
            criteria: { status: 'RETURN' },
            sort: { returndate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Order Code', dataIndex: 'ordercode', width: 140,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Order Date', dataIndex: 'orderdate', width: 120,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Return Date', dataIndex: 'returndate', width: 120,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername', width: 150,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Type', dataIndex: 'mailingproducttype', width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Name', dataIndex: 'mailingproductname', width: 130,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Return To', dataIndex: 'returnto', width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Reorder Number', dataIndex: 'reordernumber', align: 'center', width: 140,
                    render: (value) => { return (value) ? (value) : '0' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status',
                    render: (value, row) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', width: 120,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label='Remove' type='danger' onClick={() => this.removeRowAction(index)} disabled={active ? false : true} />
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
                        <Title level={3}>Manage Return Order List</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                    </Col>
                    <Divider />
                    <Drawer style={{ backgroundColor: "#9DDAF2" }}
                        title={
                            <Row gutter={24} >
                                <Col lg={8}><span style={{ marginLeft: 8 }}>
                                    {selectedRows.length > 0 ? `Selected ${selectedRows.length} items` : ''}
                                </span>
                                </Col>
                                <Col lg={8}>
                                    <Row type='flex' justify='center'>
                                        {expanded === true ? <Icon type="down" onClick={() => this.onsmaller()} /> : <Icon type="up" onClick={() => this.onbigger()} />}
                                    </Row>
                                </Col>
                                <Col lg={8}>
                                    <Row type='flex' justify='end'>
                                        <Button htmlType='button' size='small' label='REORDER' type='primary' title='Still in Analyze' onClick={() => this.showModal()} />
                                    </Row>
                                </Col>
                            </Row>}
                        orderreturnid={orderreturnid}
                        height={heightexpand}
                        placement={this.state.placement}
                        mask={false}
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible} >
                        {selectedRows.length === 0 ? '' : <Table columns={configSelectTable.columns} dataSource={selectedRows} pagination={false} />}
                    </Drawer>
                    <Modal title={'Are you sure to update this selected data?'} visible={visible2} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={850} style={{ marginTop: '-60px' }}>
                        <Bulk data={selectedRows} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} selectedRow={this.selectedRow} />
                    </Modal>
                </Row>
                <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase rowSelection={true} defaultRowSelectedKey={selectedRowKeys} useCustomOnChange={true} customOnChange={this.showDrawer} ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));