import React from 'react';
import { api } from '../../../config/Services';
import { DeleteRequest } from '../../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import IdentityForm from './Form';
import uuid from 'uuid/v4';
import moment from 'moment';

const { Title } = Typography;

const optionsType = [
    { label: "KTP", value: "KTP" },
    { label: "KITAS", value: "KITAS" },
    { label: "SIM", value: "SIM" },
    { label: "PASSPORT", value: "PASSPORT" },
    { label: "VISA", value: "VISA" },
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visible2: false,
            isLoading: false,
            titlepage: 'Create',
            memberidentityid: null,
            key: uuid(),
            identitynumber: null,
            identityimage: null,
            identityuserimage: null,
        }
    }

    componentDidMount() {
        document.title = "Identity Card | Loyalty Management System";
        this.handleOk()
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    handleOk = () => {
        this.setState({ showAddModal: false, isLoading: true });
        setTimeout(() => {
            this.setState(() => {
                return {
                    key: uuid(),
                    isLoading: false
                }
            })
        });
    };

    handleOpenModal = (memberidentityid) => {
        this.setState(({ key }) => ({ visible: true, memberidentityid }));
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
        this.componentTable.getList()
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

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

    showModal = (identitynumber, identityimage, identityuserimage) => {
        this.setState({
            visible2: true, identitynumber, identityimage, identityuserimage
        });
    };

    imgOk = e => {
        this.setState({
            visible2: false,
        });
    };

    imgCancel = e => {
        this.setState({
            visible2: false,
        });
    };

    render() {
        const { visible, memberidentityid, titlepage, key, identitynumber, identityimage, identityuserimage } = this.state;
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.memberidentity.list,
            criteria: { memberid },
            columns: [
                { type: 'field', title: 'Identity Type', dataIndex: 'identitytype', sorter: true },
                { type: 'field', title: 'Identity Number', dataIndex: 'identitynumber', sorter: true },
                {
                    type: 'field', title: 'Identity Image', dataIndex: 'identityimage',
                    render: (value, row, index) => {
                        return (
                            <img src={`${value}?v=${uuid()}`} alt='' width='130' onClick={() => this.showModal(row.identitynumber, row.identityimage, row.identityuserimage)} />
                        )
                    }
                },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'field', title: 'Reason', dataIndex: 'reason', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Checked By', dataIndex: 'checkedby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Checked Date', dataIndex: 'checkeddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" actioncode="UPDATE" onClick={() => this.handleOpenModal(row.memberidentityid)} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" actioncode="DELETE" onClick={() => this.deleteData(row.memberidentityid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Identity Type", datafield: "identitytype", type: 'select', placeholder: 'Identity Type', options: optionsType, showDefaultSearch: true },
            { labeltext: "Identity Number", datafield: "identitynumber", type: 'text', placeholder: 'Identity Number', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + " Identity Card"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={900}>
                    <IdentityForm {...this.props} memberid={memberid} memberidentityid={memberidentityid} refreshHeader={this.props.refreshHeader} onClose={this.handleCancel} setTitlePage={this.setTitlePage} refreshList={this.handleOk} key={key} />
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Identity</Title>
                    </Col>
                    <Col xs={24} xl={4} align="right">
                        <Button htmlType="button" type="primary" size="default" label="Add New" actioncode="CREATE" onClick={() => this.handleOpenModal()} />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                {/* {
                    isLoading ? '' : 
                    
                } */}
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} key={key} />
                <Modal
                    title="Preview Identity Image"
                    width="950px"
                    visible={this.state.visible2}
                    onOk={this.imgOk}
                    onCancel={this.imgCancel}
                    footer={false}
                >
                    <p><b>Identity Number:</b> {identitynumber}</p>
                    <Col lg={12}>
                        <Row><b>Identity Image</b>
                        <div style={{ width: '40%', display: 'flex', position: 'relative' }}>
                            <img style={{height: 270, width: 450}} src={`${identityimage}?v=${uuid()}`} alt='' />
                        </div>
                        </Row>
                    </Col>
                    <Col lg={10}>
                        <Row>&emsp;<b>Identity User Image</b>
                        <div style={{ width: '40%', display: 'flex', position: 'relative' }}>
                        &nbsp;<img style={{height: 270, width: 450}} src={`${identityuserimage}?v=${uuid()}`} alt='' />
                        </div>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                        </Row>
                    </Col>
                </Modal>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);