import React from 'react';
import { api } from '../../config/Services';
import { SaveRequest, DetailRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Drawer, Table, Icon } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            visible: false,
            expanded: false,
            selectedTable: [],
            selectedRows: [],
            selectedRowKeys: [],
            placement: 'bottom',
        }
    }

    componentDidMount() {
        document.title = "Manage Member Locked | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    unlockData = (memberid, type) => {
        const callback = () => {
            let memberids = this.state.selectedRows.map(val => val.memberid);
            let url = api.url.memberlocked.unlock
            let data = { memberids: type === "individual" ? [memberid] : memberids };
            
            DetailRequest(url, data).then((response) => {
                const { status = {} } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    this.componentTable.getList();
                    this.onClose()
                } else {
                    Alert.error(responsemessage);
                    this.onClose()
                }
            });
        }
        confirm({
            title: 'Are you sure to unlock this member?',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    showDrawer = (value, selectedRows, selectedRowsKeys) => {
        this.setState({
            visible: value,
            selectedRows, selectedRowsKeys
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
        this.componentTable.resetSelectedRowKeys();
    };

    onbigger = () => {
        this.setState({
            expanded: true,
        });
    };

    onsmaller = () => {
        this.setState({
            expanded: false,
        });
    };

    onChange = e => {
        this.setState({
            placement: e.target.value,
        });
    };

    removeRowAction(key) {
        const { selectedRows, selectedRowsKeys } = this.state;
        selectedRows.splice(key, 1);
        selectedRowsKeys.splice(key, 1);
        this.setState({ selectedRows, selectedRowsKeys, visible: selectedRowsKeys.length === 0 ? false : true });
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { selectedRows, selectedRowKeys, expanded } = this.state
        const heightexpand = expanded === true ? 450 : 50;


        const configurationTable = {
            url: api.url.memberlocked.retrieve,
            criteria: { islocked: true },
            columns: [
                { type: 'field', title: 'Member Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'field', title: 'Last Login Attempt', dataIndex: 'lastloginattempt', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                // { type: 'field', title: 'Reason', dataIndex: 'reason', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'islocked',
                    render: (value) => {
                        return (value) ? 'Locked' : 'Unlocked'
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button htmlType="button" type="primary" icon="unlock" title="Unlock" size="small" menucode={menucode} prefixmenuname={prefixmenuname} onClick={() => this.unlockData(row.memberid, 'individual')} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configSelectTable = {
            url: api.url.memberlocked.retrieve,
            columns: [
                { type: 'field', title: 'Member Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'field', title: 'Last Login Attempt', dataIndex: 'lastloginattempt', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                // { type: 'field', title: 'Reason', dataIndex: 'reason', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'islocked',
                    render: (value) => {
                        return (value) ? 'Locked' : 'Unlocked'
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label='Remove' type='danger' onClick={() => this.removeRowAction(index)} />
                            </span>
                        )
                    }
                },
            ]
        };


        const configurationSearchForm = [
            { labeltext: "Member Name", datafield: "name", type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: "Card Number", datafield: "cardnumber", type: 'text', placeholder: 'Card Number', showDefaultSearch: true },
            { labeltext: "Last Login Attempt", datafield: "lastloginattempt", type: 'datepicker', placeholder: 'Last Login Attempt', showDefaultSearch: true },
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Member Locked</Title>
                    </Col>
                    <Divider />
                </Row>
                <div>
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
                                        <Button htmlType='button' size='small' label='UNLOCK' type='success' onClick={() => this.unlockData()} />
                                    </Row>
                                </Col>
                            </Row>}
                        height={heightexpand}
                        placement={this.state.placement}
                        mask={false}
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible} >
                        {selectedRows.length === 0 ? '' : <Table columns={configSelectTable.columns} dataSource={selectedRows} pagination={false} scroll={{ y: 240 }} rowKey="memberid" />}
                    </Drawer>
                </div>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase rowSelection={true} ref={(e) => { this.componentTable = e }} configuration={configurationTable} defaultRowSelectedKey={selectedRowKeys} useCustomOnChange={true} customOnChange={this.showDrawer} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);