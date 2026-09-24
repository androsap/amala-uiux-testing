import React from 'react';
import { api } from '../../../config/Services';
import { SaveRequest, DeleteRequest } from '../../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal } from 'antd';
import { Status } from '../../../data';
import StaffForm from './Form';
import AdminForm from './FormAdmin';

const { confirm } = Modal;
const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visible2: false,
            isLoading: false,
            searchingadmin: false,
            searchingstaff: false,
            memberaddressid: null,
            selectPreffered: null,
            result: [],
            result2: [],
            totalrecord: 0,
            totalrecord2: 0,
            titlepage: 'Create'
        }
    }

    componentDidMount() {
        document.title = 'Travel Coordinator | Loyalty Management System';
    }

    handleSearchForm = (rolecode, criteria, searching) => {
        let name = (criteria.adminname === null || criteria.staffname === null) ? null : (rolecode === 'ADMIN') ? criteria.adminname : criteria.staffname;
        let cardnumber = (criteria.admincardnumber === null || criteria.staffcardnumber === null) ? null : (rolecode === 'ADMIN') ? criteria.admincardnumber : criteria.staffcardnumber;
        let phonenumber = (criteria.adminphonenumber === null || criteria.staffphonenumber === null) ? null : (rolecode === 'ADMIN') ? criteria.adminphonenumber : criteria.staffphonenumber;
        let email = (criteria.adminemail === null || criteria.staffemail === null) ? null : (rolecode === 'ADMIN') ? criteria.adminemail : criteria.staffemail;
        let active = (criteria.adminactive === null || criteria.staffactive === null) ? null : (rolecode === 'ADMIN') ? criteria.adminactive : criteria.staffactive;
        let memberid = this.props.match.params.ID;
        this.setState({
            [searching]: (name === null && cardnumber === null && phonenumber === null && email === null && active === null && searching === 'searchingadmin') ? true : (name === null && cardnumber === null && phonenumber === null && email === null && active === null && searching === 'searchingstaff') ? true : false,
            [rolecode]: true, choosen: false
        })
        rolecode === "ADMIN" ?
            this.componentTable.handleSearchForm({ memberid, rolecode, name, cardnumber, phonenumber, email, active }) :
            this.componentTable2.handleSearchForm({ memberid, rolecode, name, cardnumber, phonenumber, email, active });
    };

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleOkStaff = () => {
        this.setState({ showAddModal: false }, () => this.componentTable2.getList());
    };

    handleOpenModal = (travelcoordinatorid) => {
        this.setState({ visible: true, travelcoordinatorid });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    handleOpenModal2 = (travelcoordinatorid) => {
        this.setState({ visible2: true, travelcoordinatorid });
    };

    handleCancel2 = () => {
        this.setState({ visible2: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    };

    handleActivateDeactive = (travelcoordinatorid, type) => {
        let url = (type === 'activate') ? api.url.travelcoordinator.deactivate : api.url.travelcoordinator.activate;
        let status = (type === 'activate') ? true : false;
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
            this.componentTable2.getList();
        };
        DeleteRequest(url, { travelcoordinatorid }, callback, status);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, visible2, isLoading, travelcoordinatorid, titlepage, totalrecord, totalrecord2, result, result2 } = this.state;
        const memberid = this.props.match.params.ID;

        const configurationTable = {
            url: api.url.travelcoordinator.list,
            criteria: { memberid, rolecode: 'ADMIN' },
            columns: [
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Phone Number', dataIndex: 'phonenumber', sorter: true },
                { type: 'field', title: 'Email', dataIndex: 'email', sorter: true },
                {
                    type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '18%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label='Details' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={() => this.handleOpenModal(row.travelcoordinatorid)} />
                                {
                                    (row.active) ? <Button htmlType='button' size='small' label='Deactive' type='danger' onClick={() => this.handleActivateDeactive(row.travelcoordinatorid, 'activate')} /> :
                                        <Button htmlType='button' size='small' label='Active' className='btn-custom-green' onClick={() => this.handleActivateDeactive(row.travelcoordinatorid, 'deactivate')} />
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationTableStaff = {
            url: api.url.travelcoordinator.list,
            criteria: { memberid, rolecode: 'STAFF' },
            columns: [
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                { type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true },
                { type: 'field', title: 'Phone Number', dataIndex: 'phonenumber', sorter: true },
                { type: 'field', title: 'Email', dataIndex: 'email', sorter: true },
                {
                    type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '18%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label='Details' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={() => this.handleOpenModal2(row.travelcoordinatorid)} />
                                {
                                    (row.active) ? <Button htmlType='button' size='small' label='Deactive' type='danger' onClick={() => this.handleActivateDeactive(row.travelcoordinatorid, 'activate')} /> :
                                        <Button htmlType='button' size='small' label='Active' className='btn-custom-green' onClick={() => this.handleActivateDeactive(row.travelcoordinatorid, 'deactivate')} />
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        // const configurationSearchForm = [
        //     { labeltext: 'Name', datafield: 'adminname', type: 'text', placeholder: 'Name', showDefaultSearch: true },
        //     { labeltext: 'Card Number', datafield: 'admincardnumber', type: 'exact', placeholder: 'Card Number', showDefaultSearch: true },
        //     { labeltext: 'Phone Number', datafield: 'adminphonenumber', type: 'exact', placeholder: 'Phone Number', showDefaultSearch: true },
        //     { labeltext: 'Email', datafield: 'adminemail', type: 'text', placeholder: 'Email', showDefaultSearch: true },
        //     { labeltext: 'Status', datafield: 'adminactive', type: 'select', placeholder: 'Status', options: Status, showDefaultSearch: true },
        // ];

        // const configurationSearchForm2 = [
        //     { labeltext: 'Name', datafield: 'staffname', type: 'text', placeholder: 'Name', showDefaultSearch: true },
        //     { labeltext: 'Card Number', datafield: 'staffcardnumber', type: 'exact', placeholder: 'Card Number', showDefaultSearch: true },
        //     { labeltext: 'Phone Number', datafield: 'staffphonenumber', type: 'exact', placeholder: 'Phone Number', showDefaultSearch: true },
        //     { labeltext: 'Email', datafield: 'staffemail', type: 'text', placeholder: 'Email', showDefaultSearch: true },
        //     { labeltext: 'Status', datafield: 'staffactive', type: 'select', placeholder: 'Status', options: Status, showDefaultSearch: true },
        // ];
        
        return (
            <React.Fragment>
                <Modal visible={visible} title={titlepage + ' Travel Coordinator'} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680} style={{ marginTop: '-40px' }}>
                    <AdminForm memberid={memberid} travelcoordinatorid={travelcoordinatorid} onClose={this.handleCancel} refreshHeader={this.props.refreshHeader} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Travel Coordinator</Title>
                    </Col>
                    <Divider />
                    <Col xs={24} xl={20}>
                        <h3>Admin</h3>
                    </Col>
                    <Col xs={24} xl={4} align='right'>
                        {result.length !== -1 ? (result.length < 4 || ((result.length > 3 ) && result.filter((obj) => obj.active === false).length !== 0 )) ? ( result.filter((obj) => obj.active === true).length < 4 ) ? <Button htmlType='button' type='primary' size='default' label='Create' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' onClick={() => this.handleOpenModal()} />
                            : '' : '' : ''
                        }
                    </Col>
                    <br></br>
                    <Divider />
                </Row>
                {/* <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={value => this.handleSearchForm('ADMIN', value, 'searchingadmin')} /> */}
                <TableBase afterRequest={({ result, paging }) => this.setState({ result, totalrecord: paging ? paging.totalrecord : 0, active: result ? result.filter((obj) => obj.active === false) : null })} ref={(e) => { this.componentTable = e }} configuration={configurationTable} handleCustomCriteria={true} />
                <Divider />
                <Row>
                    <Modal visible={visible2} title={titlepage + ' Travel Coordinator'} loading={isLoading} onCancel={this.handleCancel2} footer={null} destroyOnClose={true} width={680} style={{ marginTop: '-40px' }}>
                        <StaffForm memberid={memberid} travelcoordinatorid={travelcoordinatorid} onClose={this.handleCancel2} refreshHeader={this.props.refreshHeader} setTitlePage={this.setTitlePage} refreshList={this.handleOk} refreshList2={this.handleOkStaff} />
                    </Modal>
                    <Row>
                        <Col xs={24} xl={20}>
                            <h3>Staff</h3>
                        </Col>
                        <Col xs={24} xl={4} align='right'>
                            {result2.length !== -1 ? (result2.length < 3 || ((result2.length > 2) && result2.filter((obj) => obj.active === false).length !== 0)) ? ( result2.filter((obj) => obj.active === true).length < 3 ) ? <Button htmlType='button' type='primary' size='default' label='Create' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' onClick={() => this.handleOpenModal2()} />
                                : '' : '' : ''}
                        </Col>
                        <br></br>
                        <Divider />
                    </Row>
                    {/* <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm2} onSubmit={value => this.handleSearchForm('STAFF', value, 'searchingstaff')} /> */}
                    <TableBase afterRequest={({ result, paging }) => this.setState({ result2: result, totalrecord2: paging ? paging.totalrecord : 0, active2: result ? result.filter((obj) => obj.active === false) : null })} ref={(e) => { this.componentTable2 = e }} configuration={configurationTableStaff} handleCustomCriteria={true} />
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);