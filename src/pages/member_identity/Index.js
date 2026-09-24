import React from 'react';
import { SaveRequest, DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from 'react-redux';
import { Button, SearchForm, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Drawer, Table, Icon, Modal, } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';
import FormReject from './Form';
//import { getProfile } from '../../utilities/AuthService';
import uuid from 'uuid/v4';

const { confirm } = Modal;

const { Title } = Typography;

const optionsStatus = [
    { label: "UNVERIFIED", value: "Unverified" },
    { label: "REJECTED", value: "Rejected" }
];

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
            visible3: false,
            expanded: false,
            active: true,
            selectedTable: [],
            selectedRows: [],
            selectedRowKeys: [],
            placement: 'bottom',
            keyTable: 1,
            memberidentityid: null,
            identitynumber: null,
            reason: null,
            identityimage: null,
            identityuserimage: null,
            membername: null,
            dateofbirth: null,
            checkedby: null,
            criteria: {
                status: "Unverified"
            },
            dimensions: {
                identityimage: {
                    heightimg: null,
                    widthimg: null
                },
                identityuserimage: {
                    heightuimg: null,
                    widthuimg: null
                }
            }
        }
    }
    componentDidMount() {
        document.title = 'Manage Member Identity | Loyalty Management System';
        const { form } = this.props;
        form.setFieldsValue({ status: 'Unverified' });
    }

    handleSearchForm = (criteria) => {
        criteria.createddate = (criteria.createddate) ? `%${criteria.createddate}%` : null;
        criteria.status = (criteria.status) ? criteria.status : 'Unverified';
        this.componentTable.handleSearchForm(criteria);
    }

    confirmation = (memberidentityid, status, selected) => {
        const verData = () => { selected === 'single' ? this.verifyData(memberidentityid, status) : this.selectedVerifyData(); }
        confirm({
            title: 'Are you sure to verify this data?',
            onOk() { verData(); },
            onCancel() { },
        });
    };

    verifyData(memberidentityidlist) {
        let url = api.url.memberidentity.verify;
        let data = { memberidentityidlist: [memberidentityidlist] };

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been verified';
                Alert.success(message);
                this.componentTable.resetSelectedRowKeys();
                this.setState({ visible: false, selectedRows: [], selectedRowKeys: [] })
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        });
    }

    selectedVerifyData() {
        const { selectedRows } = this.state
        let url = api.url.memberidentity.verify;
        let data = { memberidentityidlist: selectedRows.map((val, i) => val.memberidentityid) };

        SaveRequest(url, data).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been verified';
                Alert.success(message);
                this.componentTable.resetSelectedRowKeys();
                this.setState({ visible: false, selectedRows: [], selectedRowKeys: [] })
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        })
    }

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

    showModal = (memberidentityid) => {
        this.setState({
            visible2: true,
            memberidentityid
        })
    }

    showModal2 = (identitynumber, identityimage, membername, identityuserimage, dateofbirth, reason, checkedby) => {
        this.setState({
            visible3: true, identitynumber, identityimage, membername, identityuserimage, dateofbirth, reason, checkedby
        });
    };

    onImgLoad = ({ target: img }, type) => {
        if (type === 'identityimage') {
            this.setState({
                dimensions: {
                    identityimage: {
                        heightimg: img.offsetHeight,
                        widthimg: img.offsetWidth
                    }, identityuserimage: this.state.dimensions.identityuserimage
                }
            });
        } else {
            this.setState({
                dimensions: {
                    identityuserimage: {
                        heightuimg: img.offsetHeight,
                        widthuimg: img.offsetWidth
                    }, identityimage: this.state.dimensions.identityimage
                }
            });
        }
    }

    handleOk = e => {
        this.setState({ visible2: false });
    };

    handleCancel = e => {
        this.setState({ visible2: false });
        this.componentTable.getList()
    };

    imgOk = e => {
        this.setState({
            visible3: false,
        });
    };

    imgCancel = e => {
        this.setState({
            visible3: false,
        });
    };

    deleteData(memberidentityid) {
        let url = api.url.memberidentity.delete;
        let data = { memberidentityid };
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
        const { selectedRows, active, selectedRowKeys, expanded, visible2, memberidentityid, identitynumber, identityimage, membername, identityuserimage, dateofbirth, reason, checkedby } = this.state;
        const heightexpand = expanded === true ? 450 : 50;

        const customClear = ['cardnumber', 'membername', 'createddate', []];

        const configurationSearchForm = [
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number ', showDefaultSearch: true },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Created Date', datafield: 'createddate', type: 'datepicker', placeholder: 'Created Date', showDefaultSearch: true },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true, allowClear: false }
        ];

        const configurationTable = {
            url: api.url.memberidentity.retrieve,
            criteria: { status: 'UNVERIFIED' },
            columns: [
                { type: 'field', title: 'Name', dataIndex: 'membername', sorter: true },
                { type: 'field', title: 'Identity Type', dataIndex: 'identitytype', sorter: true },
                { type: 'field', title: 'Identity Number', dataIndex: 'identitynumber', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                {
                    type: 'field', title: 'Identity Image', dataIndex: 'identityimage',
                    render: (value, row, index) => {
                        return (
                            <img src={`${value}?v=${uuid()}`} alt='' width='130' onClick={() => this.showModal2(row.identitynumber, row.identityimage, row.membername, row.identityuserimage, row.dateofbirth, row.reason, row.checkedby)} />
                        )
                    }
                },
                { type: 'field', title: 'Created By', dataIndex: 'createdby', sorter: true },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '10%',
                    render: (value, row, index) => {
                        return (
                            < span >
                                <Button htmlType='button' type='primary' size='small' title='Verify' icon='check' actioncode='DELETE' onClick={() => this.confirmation(row.memberidentityid, row.status, 'single')} disabled={row.status === 'VERIFIED' ? true : false} />
                                {
                                    (row.status === 'UNVERIFIED') ?
                                        <Button htmlType='button' type='danger' size='small' title='Reject' icon='close-circle' actioncode='DELETE' onClick={() => this.showModal(row.memberidentityid, row.status, 'single')} disabled={row.status === 'VERIFIED' ? true : false} /> : null
                                }
                                {
                                    (row.status === 'REJECTED') ?
                                        <Button htmlType="button" type="danger" size="small" title="Delete" icon='delete' actioncode="DELETE" onClick={() => this.deleteData(row.memberidentityid)} /> : null
                                }
                            </span >
                        )
                    }
                },
            ],

        };

        const configSelectTable = {
            url: api.url.memberidentity.retrieve,
            columns: [
                { type: 'field', title: 'Name', dataIndex: 'membername', width: '12%' },
                { type: 'field', title: 'Identity Type', dataIndex: 'identitytype', width: '10%' },
                { type: 'field', title: 'Identity Number', dataIndex: 'identitynumber', width: '12%' },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', width: '10%' },
                {
                    type: 'field', title: 'Identity Image', dataIndex: 'identityimage', width: '15%',
                    render: (value, row, index) => {
                        return (
                            <img src={value} alt='' width='80' />
                        )
                    }
                },
                { type: 'field', title: 'Created By', dataIndex: 'createdby', sorter: true },
                { type: 'field', title: 'Status', dataIndex: 'status', width: '8%' },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', width: '10%',
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
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
            ],
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Member Identity</Title>
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
                                        <Button htmlType='button' size='small' label='VERIFY' type='success' onClick={() => this.confirmation(null, null, 'multiple')} />
                                    </Row>
                                </Col>
                            </Row>}
                        height={heightexpand}
                        placement={this.state.placement}
                        mask={false}
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible} >
                        {selectedRows.length === 0 ? '' : <Table columns={configSelectTable.columns} dataSource={selectedRows} pagination={false} scroll={{ y: 240 }} />}
                    </Drawer>
                </div>
                <Modal title={'Are you sure to reject this data?'} visible={visible2} onCancel={this.handleCancel} destroyOnClose={true} footer={null} width={600}>
                    <FormReject memberidentityid={memberidentityid} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} />
                </Modal>
                <Modal
                    title="Preview Identity Image"
                    width="950px"
                    height="950px"
                    style={{ marginTop: -20 }}
                    visible={this.state.visible3}
                    onOk={this.imgOk}
                    onCancel={this.imgCancel}
                    footer={false}
                >
                    <br></br>
                    <Col lg={12}>
                        <Row><b>Identity Number :</b> &emsp;{identitynumber}</Row>
                    </Col>
                    <Col lg={4}>
                        <Row><b>Reason Rejected&emsp;:</b></Row>
                    </Col>
                    <Col lg={8}>
                        <Row>{reason}</Row>
                    </Col>
                    <Col lg={12}>
                        <Row><b>Name&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;:</b> &emsp;{membername} </Row>
                    </Col>
                    <Col lg={12}>
                        <Row><b>Rejected By&emsp;&emsp;&emsp;&nbsp;:</b> &emsp;&nbsp;&nbsp;{checkedby} </Row>
                    </Col>
                    <Col lg={12}>
                        <Row><p><b>Date of Birth&emsp;&emsp;:</b> &emsp;{dateofbirth ? moment(dateofbirth).format('DD/MM/YYYY') : ''}</p></Row>
                    </Col>
                    <Col lg={10}><Row>&emsp;</Row></Col>
                    <Col lg={10}><Row>&emsp;</Row></Col>

                    <Col lg={12}>
                        <Row><b>Identity Image</b>
                            <div style={{ width: '40%', display: 'flex', position: 'relative' }}>
                                <img style={{ height: 270, width: 450 }} onLoad={(e) => this.onImgLoad(e, 'identityimage')} src={`${identityimage}?v=${uuid()}`} alt='' />
                            </div>
                        </Row>
                    </Col>
                    <Col lg={10}>
                        <Row><b>Identity User Image</b>
                            <div style={{ width: '40%', display: 'flex', position: 'relative' }}>
                                <img style={{ height: 270, width: 450 }} onLoad={(e) => this.onImgLoad(e, 'identityuserimage')} src={`${identityuserimage}?v=${uuid()}`} alt='' />
                            </div>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                        </Row>
                    </Col>
                </Modal>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} allowCustomClear={true} customClear={customClear} />
                <TableBase rowSelection={true} getCheckboxProps={record => ({
                    disabled: record.status === 'VERIFIED',
                    name: record.status,
                })} defaultRowSelectedKey={selectedRowKeys} useCustomOnChange={true} customOnChange={this.showDrawer} ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));

// <div style={{ width: '100%', display: 'flex', position: 'relative' }}>
//                                <canvas id="imageCanvas" />
//                                {
//                                    Object.keys(tagActive).map((key) => {
//                                       return tagActive[key]
//                                   })
//                                }
//                            </div>
//( (heightimg > widthimg) && heightimg !== null) ? render canvas : render <row>  