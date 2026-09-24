import React from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../config/Services';
import { DetailRequest, DeleteRequest } from '../../../utilities/RequestService';
import { Button, ErrorGeneral, TableBase, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Modal, Spin } from 'antd';
// import AdminForm from './Form';

const { confirm } = Modal;
const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visible2: false,
            isLoading: false,
            loadRedirect: false,
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
        this.getDetail();
    }

    getDetail = () => {
        let memberid = this.props.match.params.ID;
        let type = 'ALL';
        let url = api.url.member.profile;
        let data = { memberid, type };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            let { status = {}, result } = response;
            if (status.responsecode === '0000') {
                let cardnumber = (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : '-';
                this.setState({ cardnumber });
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleOpenModal = (travelcoordinatorid) => {
        this.setState({ visible: true, travelcoordinatorid });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
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
        };
        DeleteRequest(url, { travelcoordinatorid }, callback, status);
    };

    redirectMember = (memberid) => {
        let url = api.url.member.profile;
        let data = { memberid };
        this.setState({ loadRedirect: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let changedParentUrl = 'member-corporate';
                    let changedMemberId = memberid;
                    window.open('/' + changedParentUrl + '/form/' + changedMemberId);
                    this.setState({ loadRedirect: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { cardnumber, visible, isLoading, travelcoordinatorid, } = this.state;
        const memberid = this.props.match.params.ID;
        const parentUrl = this.props.match.url.split('/')[1];

        if (cardnumber) {
            const configurationTable = {
                url: api.url.travelcoordinator.list,
                criteria: { cardnumber },
                columns: [
                    { type: 'field', title: 'Corporate Name', dataIndex: 'corporatename', sorter: true },
                    {
                        type: 'html', title: 'Card Number', dataIndex: 'corporatecardnumber', sorter: true,
                        render: (value, row, index) => { return <Link to="#" onClick={() => this.redirectMember(row.memberid)}>{row.corporatecardnumber}</Link> }
                    },
                    { type: 'field', title: 'Role Code', dataIndex: 'rolecode', sorter: true },
                    {
                        type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                        render: (value) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                    },
                    // {
                    //     type: 'html', title: 'Action', dataIndex: 'action', width: '18%',
                    //     render: (value, row) => {
                    //         return (
                    //             <span>
                    //                 <Button htmlType='button' size='small' label='Details' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={() => this.handleOpenModal(row.travelcoordinatorid)} />
                    //                 {
                    //                     (row.active) ? <Button htmlType='button' size='small' label='Deactive' type='danger' onClick={() => this.handleActivateDeactive(row.travelcoordinatorid, 'activate')} /> :
                    //                         <Button htmlType='button' size='small' label='Active' className='btn-custom-green' onClick={() => this.handleActivateDeactive(row.travelcoordinatorid, 'deactivate')} />
                    //                 }
                    //             </span>
                    //         )
                    //     }
                    // },
                ]
            };

            return (
                <React.Fragment>
                    {/* <Modal visible={visible} title={'Details Travel Coordinator'} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={680} style={{ marginTop: '-40px' }}>
                        <AdminForm memberid={memberid} travelcoordinatorid={travelcoordinatorid} onClose={this.handleCancel} refreshHeader={this.props.refreshHeader} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                    </Modal> */}
                    <Row>
                        <Col xs={24} sm={18}>
                            <Title level={4}>{'List Travel Coordinator'}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </React.Fragment>
            );
        } else {
            return (<Spin spinning={this.state.loadRedirect} tip="Please wait while checking the member data" />
            );
        }
    }
}

export default Form.create()(App);