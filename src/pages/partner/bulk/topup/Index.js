import React from 'react';
import ErrorGeneral from '../../../error/ErrorGeneral';
import { DetailRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Button, InputText, DatePickerBase, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Table, Divider, Row, Col, Typography, Modal, Button as AntButton, Dropdown, Menu, Icon } from 'antd';
import moment from 'moment';
import BulkForm from './Form';
import BulkDetail from './Detail';
import { formatNumber } from '../../../../utilities/Helpers';

const { Column } = Table;
const { Title } = Typography;
const { confirm } = Modal;

const prefixmenuname = 'PARTBULK';
const menucode = 'PARTBULK';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            data: { partnercode: this.props.location.state ? this.props.location.state.partnercode : null },
            dataList: [],
            loading: false,
            visibleTopup: false,
            visibleDetail: false,
            partnercode: this.props.location.state ? this.props.location.state.partnercode : null,
            partnername: this.props.location.state ? this.props.location.state.partnername : null,
            activepartner: this.props.location.state ? this.props.location.state.activepartner : null,
            havebulk: this.props.location.state ? this.props.location.state.havebulk : null,
            partnerbulkid: this.props.partnerbulkid ? this.props.partnerbulkid : null,
            pagination: {
                current: 1,
                pageSize: 10,
            },
        };
    }

    componentDidMount() {
        document.title = "Manage Bulk Miles Partner | Loyalty Management System";
        this.getList();
    }

    getList() {
        let url = api.url.partnerbulk.detail;
        let data = this.state.data;
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let dataList = result;

                this.setState({ dataList, loading: false });
            } else {
                Alert.error(status.responseMessage)
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false,
                    loading: false
                });
            }
        });
    }

    handleOpenModal = (type, code1, code2) => {
        if (type === 'topup') {
            this.setState({ visibleTopup: true });
        } else if (type === 'detail') {
            this.setState({ visibleDetail: true, partnerbulkid: code1, partnercode: code2 });
        }
    };

    handleOk = () => {
        this.setState({ visibleTopup: false, visibleDetail: false }, () => this.getList(this.state.partnercode));
    };

    handleCancel = () => {
        this.setState({ visibleTopup: false, visibleDetail: false });
    };

    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let criteria = {};
            Object.keys(values).forEach(key => {
                if (key === 'createdBy') {
                    criteria[key] = values[key] ? `%${values[key]}%` : null;
                } else {
                    criteria[key] = values[key] !== undefined ? values[key] : null;
                }
            });
            let partnercode = this.state.partnercode;
            let createdBy = criteria.createdBy;
            let transactiondate = criteria.transactiondate ? moment(criteria.transactiondate).format("YYYY-MM-DD") : null;
            this.setState({ data: { partnercode, createdBy, transactiondate } }, () => this.getList());
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleTableChange = (pagination) => {
        this.setState({ pagination });
    }

    handleDownloadModal = (type) => {
        const callback = () => {
            let url = type === "PDF" ? api.url.partnerbulk.pdf : api.url.partnerbulk.csv;
            let createdBy = this.props.form.getFieldValue('createdBy');
            let transactiondate = this.props.form.getFieldValue('transactiondate')?.format("YYYY-MM-DD");
            let data = { transactiondate, createdBy, partnercode: this.state.partnercode };
            let partnercode = this.state.partnercode;
            let message = 'Downloading...';
            DetailRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = response.status;
                const { result } = response;
                if (responsecode && responsecode === '0000') {
                    window.location.href = result.url;
                    if (responsemessage) Alert.success(message);
                    this.setState({ data: { partnercode, createdBy: null, transactiondate: null } }, () => this.getList());
                    this.handleReset();
                } else {
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
    }

    render() {
        const { dataList, loading, visibleTopup, visibleDetail, partnercode, partnerbulkid } = this.state;

        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 10
            }
        }

        return (
            <React.Fragment>
                <Modal visible={visibleTopup} title="Topup Bulk Miles Partner" loading={loading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={600}>
                    <BulkForm partnercode={partnercode} onClose={this.handleCancel} refreshList={this.handleOk} />
                </Modal>
                <Modal visible={visibleDetail} title="Detail Partner Bulk Miles" loading={loading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={1200}>
                    <BulkDetail partnercode={partnercode} partnerbulkid={partnerbulkid} onClose={this.handleCancel} />
                </Modal>
                <Row>
                    <Col xs={24} xl={18}>
                        <Title level={4}>Top up Bulk Miles</Title>
                    </Col>
                    <Col xs={24} xl={6} align="right">
                        {
                            (this.state.activepartner && this.state.havebulk) ? <Button htmlType="button" type="primary" size="default" label="Topup" onClick={() => this.handleOpenModal('topup')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                        }
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="1">
                                    <Button htmlType="button" type="default" icon="download" label="PDF" onClick={() => this.handleDownloadModal('PDF')} />
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Button htmlType="button" type="default" icon="download" label="CSV" onClick={() => this.handleDownloadModal('CSV')} />
                                </Menu.Item>
                            </Menu>
                        }>
                            <AntButton type="default" size="default" > Download <Icon type="down" /></AntButton>
                        </Dropdown>
                    </Col>
                    <Divider />
                </Row>
                <Row style={{ marginBottom: 30 }}>
                    <Form layout="inline" className="searching-form" onSubmit={this.handleSearch}>
                        <DatePickerBase form={this.props.form} placeholder="Transaction Date" datafield="transactiondate" />
                        <InputText form={this.props.form} placeholder="Created By" datafield="createdBy" />
                        <span style={{ lineHeight: '40px' }}>
                            <Button label="Search" size="default" type="primary" htmlType="submit" />
                            <Button label="Clear" size="default" style={{ marginLeft: 8 }} onClick={this.handleReset} htmlType="button" />
                        </span>
                    </Form>
                    <Form {...formItemStyle} loading={loading}>
                        <Row>
                            <Col xs={24} xl={12}>
                                <span className="ant-form-text" style={{ fontWeight: '600' }}>Summary Remaining Award Miles: </span>
                                <span className="ant-form-text" style={{ marginLeft: 2 }}>{formatNumber((dataList.totalremainingawardmiles ?? 0).toString())}</span>
                            </Col>
                            <Col xs={24} xl={12}>
                                <span className="ant-form-text" style={{ fontWeight: '600' }}>Usage Balance: </span>
                                <span className="ant-form-text" style={{ marginLeft: 2 }}>{formatNumber((dataList.usagebalance ?? 0).toString())}</span>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        rowKey={record => record.partnerbulk}
                        dataSource={dataList.partnerbulk
                            ? [...dataList.partnerbulk].sort((a, b) => {
                                const t1 = new Date(b.transactiondate) - new Date(a.transactiondate);
                                if (t1 !== 0) return t1;
                                return new Date(b.createdDate) - new Date(a.createdDate);
                            })
                            : []}
                        size="middle"
                        pagination={this.state.pagination}
                        loading={loading}
                        scroll={{ y: 490 }}
                        onChange={this.handleTableChange}
                    >
                        <Column
                            title="No"
                            dataIndex="number"
                            key="number"
                            render={(val, row, i) =>
                                (this.state.pagination.current - 1) * this.state.pagination.pageSize + i + 1
                            }
                            width="10%"
                        />
                        <Column
                            title="Transaction Date"
                            dataIndex="transactiondate"
                            key="transactiondate"
                            render={(val) => val ? moment(val).format('DD/MM/YYYY') : '-'}
                            sorter={(a, b) => {
                                const t1 = new Date(a.transactiondate) - new Date(b.transactiondate);
                                if (t1 !== 0) return t1;
                                return new Date(a.createdDate) - new Date(b.createdDate);
                            }}
                            sortDirections={['descend', 'ascend']}
                            defaultSortOrder="descend"
                        />
                        <Column title="Award Miles" dataIndex="awardmiles" key="awardmiles" align='right' render={(value) => value ? formatNumber(value) : '-'} />
                        <Column title="Remaining Award Miles" dataIndex="remainingawardmiles" key="remainingawardmiles" align='right' render={(value) => value ? formatNumber(value) : '-'} />
                        <Column title="Notes" dataIndex="notes" key="notes" render={(value) => value ? value.length > 20 ? value.substring(0, 20) + '...' : value : '-'} />
                        <Column title="Created By" dataIndex="createdBy" key="createdBy" render={(value) => value ? value : '-'} />
                        <Column
                            title="Action"
                            key="action"
                            width="10%"
                            render={(text, row) => (
                                <span>
                                    <Button htmlType="button" size="small" label="Detail" className="btn-custom-info" onClick={() => this.handleOpenModal('detail', row.partnerbulkid, row.partnercode)} />
                                </span>
                            )}
                        />
                    </Table>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);