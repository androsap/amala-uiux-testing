import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest } from '../../utilities/RequestService';
import { Alert, Button } from '../../components/Base/BaseComponent';
import { Spin, Divider, Row, Col, Card, Modal, Table } from 'antd';
import moment from 'moment';

import Confirmation from './Confirmation';

class DetailSuspectDup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataList: [],
            selectedRows: [],
            selectedRowKeys: [],
            visible: false,
            resultexisting: null,
            choosen: null,
            phonenumber: '-',
            sort: {},
            type: null
        }
    }

    componentDidMount() {
        this.getPhone();
    };

    getPhone = async () => {
        const { result } = this.props;
        let dateofbirth = result.dateofbirth;
        let firstname = result.name.trim().split(' ').slice(0, -1).join(' ');
        let lastname = result.name.trim().split(' ').slice(-1).join(' ');

        await DetailRequest(api.url.membercontact.list, { memberid: result.memberid, preferrednumber: true }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                let phonenumber = (result.find(val => val.preferrednumber === true) === undefined) ? undefined :
                    ((result.find(val => val.preferrednumber === true).phonenumber) ? result.find(val => val.preferrednumber === true).phonenumber : undefined);

                if (phonenumber) {
                    this.getList(dateofbirth, firstname, lastname, phonenumber);
                    this.setState({ phonenumber });
                } else Alert.information(`Preferred phone number not found, Can't request list of matching with existing member`);
            } else Alert.error(status.responsemessage);
        });

    };

    getList = async (dateofbirth, firstname, lastname, phonenumber) => {
        let url = api.url.suspectdup.check;
        let data = { dateofbirth, firstname, lastname, phonenumber };
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                let number = 0;
                let memberidOri = this.props.result.memberid;
                let dataStatusFiltered = result.listofmember.filter((el) => { return el.memberstatus !== 'DECEASED' }).filter((el) => { return el.memberstatus !== 'TERMINATED' });
                let dataStatusSort = dataStatusFiltered.sort(function (a, b) {
                    if (a.memberstatus < b.memberstatus) return -1;
                    if (a.memberstatus > b.memberstatus) return 1;
                    return 0;
                });
                let dataList = dataStatusSort.filter(function (el) { return el.memberid !== memberidOri }).map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

                this.setState({ dataList, isLoading: false });
            } else {
                this.setState({ formrender: false, isLoading: false });
            }
        });
    };

    handleOpenModal = (type) => {
        this.setState({ visible: true, type });
    };

    handleCancel = (type) => {
        this.setState({ visible: false });
        if (type === 'fromConfirmation') this.props.closemodalrefresh();
    };

    handleChange = (pagination, filters, sorter) => {
        let { sort } = this.state;
        if (sorter) {
            sort = {};
            if (sorter.field && sorter.order) {
                sort[sorter.field] = sorter.order === "ascend" ? "asc" : "desc";
                this.setState({ sort });
            }
        }
        setTimeout(() => this.getList())
    };

    onSelectChange = (selectedRowKeys, selectedRowKey) => {
        this.setState({ selectedRowKeys, selectedRowKey });
    };

    checkBoxProps = (record) => {
        let { selectedRowKey } = this.state;
        if (selectedRowKey && selectedRowKey.length !== 0)
            return {
                disabled: record.memberid !== selectedRowKey[0].memberid
            }
        selectedRowKey = [];
    };

    render() {
        const { dataList, isLoading, visible, selectedRowKey, selectedRowKeys, phonenumber } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const { result } = this.props;
        const rowSelection = {
            columnTitle: <span></span>,
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: this.checkBoxProps
        };

        let columns = [
            { title: 'Card Number', dataIndex: 'cardnumber', sorter: (a, b) => a.cardnumber - b.cardnumber },
            { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.length - b.name.length },
            { title: 'Tier', dataIndex: 'tiername', sorter: (a, b) => a.tiername.length - b.tiername.length },
            {
                title: 'Status', dataIndex: 'memberstatus', sorter: function (a, b) {
                    if (a.memberstatus < b.memberstatus) return -1;
                    if (a.memberstatus > b.memberstatus) return 1;
                    return 0;
                }
            },
            {
                title: 'Date of Birth', dataIndex: 'dateofbirth', sorter: (a, b) => new Date(a.dateofbirth) - new Date(b.dateofbirth),
                render: (value, row, index) => { return value ? moment(value).format('DD/MM/YYYY') : '-' }
            },
            { title: 'Gender', dataIndex: 'gender', sorter: (a, b) => a.gender.length - b.gender.length },
            { title: 'Email', dataIndex: 'email', sorter: (a, b) => a.email.length - b.email.length },
            {
                title: 'Enrollment Date', dataIndex: 'enrollmentdate', sorter: (a, b) => new Date(a.enrollmentdate) - new Date(b.enrollmentdate),
                render: (value, row, index) => { return value ? moment(value).format('DD/MM/YYYY') : '-' }
            },
            {
                title: 'Phone Number', dataIndex: 'phonenumber', sorter: (a, b) => a.phonenumber - b.phonenumber,
                render: (value, row, index) => { return value ? value : '-' }
            },
        ];

        return (
            <React.Fragment>
                <Modal visible={visible} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={500}>
                    <Confirmation {...this.props} onClose={this.handleCancel} result={this.props.result} selectedRowKey={selectedRowKey} />
                </Modal>
                <Row gutter={24} style={{ marginTop: -20 }}>
                    <Spin spinning={isLoading}>
                        <Divider orientation='left' >Suspect Duplicate Member</Divider>
                        <Card bordered={true}>
                            <Row gutter={24} style={{ marginLeft: '2%' }}>
                                <Col xs={24} md={12}>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Name</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {result.name}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Card Number</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {result.cardnumber}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Tier</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {result.membershipname} - {result.tiername}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Date of Birth</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {moment(result.dateofbirth).format('DD-MM-YYYY')}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Awardmiles</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {(result.awardmiles) ? result.awardmiles : 0} </Col>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Gender</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {result.gender}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Email</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {result.email}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Enrollment Date</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {moment(result.enrollmentdate).format('DD-MM-YYYY')}</Col>
                                    <Col xs={24} md={6} style={{ marginBottom: '10px' }}><label>Phone Number</label></Col>
                                    <Col xs={24} md={18} style={{ marginBottom: '10px' }}>:  {phonenumber ? phonenumber : '-'}</Col>
                                </Col>
                            </Row>
                        </Card>

                        {(dataList.length < 1) ? '' : <Row>
                            <Divider orientation='left' style={{ marginTop: '30px' }}>List of Matching with Existing Member</Divider>
                            <Table rowSelection={rowSelection} columns={columns} dataSource={dataList} pagination={true} onChange={this.handleChange} rowKey='memberid' loading={isLoading} />
                        </Row>
                        }

                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }}>
                            <Button htmlType='button' type='default' label='Approve' className={'btn-custom-green'} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='APPROVE'
                                onClick={() => this.handleOpenModal('approve')} disabled={(selectedRowKey && selectedRowKey.length !== 0) ? true : false} />
                            <Button htmlType='button' type='danger' label='Reject' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='APPROVE' onClick={() => this.handleOpenModal('reject')}
                                disabled={(selectedRowKey && selectedRowKey.length !== 0) ? false : true} />
                        </Row>

                    </Spin>
                </Row>
            </React.Fragment>
        )
    }
}

export default DetailSuspectDup;
