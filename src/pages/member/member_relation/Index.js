import React from 'react';
import { Link } from 'react-router-dom';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Modal } from 'antd';
import ActivationConfirmation from './confirmation_dialog/Activation';
import moment from 'moment';
import Upload from './Upload';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadRedirect: false,
            visible: false,
            visible2: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        document.title = "Member Relation | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    redirectMember = (memberidparent, memberidchild) => {
        let url = api.url.member.profile;
        let data = { memberid: memberidchild };
        this.setState({ loadRedirect: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let parentUrl = this.props.match.url.split('/')[1];
                    let changedParentUrl = (parentUrl === 'member') ? 'member-corporate' : 'member';
                    let changedMemberId = (parentUrl === 'member') ? memberidparent : memberidchild;
                    window.open('/' + changedParentUrl + '/form/' + changedMemberId);
                    this.setState({ loadRedirect: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    handleActivationModal = (memberrelationid, activeData) => {
        this.setState({ visible: true, memberrelationid, activeData })
    }

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleOk = () => {
        this.setState({ visible: false }, this.props.refreshHeader(), this.componentTable.getList());
    };

    handleOpenModal = () => {
        this.setState({ visible2: true });
    };

    handleCancel2 = () => {
        this.setState({ visible2: false, titlepage: 'Create' });
    };

    handleOk2 = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { memberrelationid, visible, activeData, visible2, isLoading } = this.state;
        const memberid = this.props.match.params.ID;
        const parentUrl = this.props.match.url.split('/')[1];

        let configurationTable = {
            url: api.url.memberrelation.list,
            criteria: (parentUrl === 'member') ? { memberidchild: memberid, active: true } : { memberidparent: memberid },
            columns: [
                { type: 'field', title: 'Relation Type', dataIndex: 'relationtype', sorter: false },
                {
                    type: 'html', title: 'Member Card', dataIndex: 'cardnumber', sorter: false,
                    render: (value, row, index) => { return <Link to="#" onClick={() => this.redirectMember(row.memberidparent, row.memberidchild)}>{(parentUrl === 'member') ? row.cardnumberparent : row.cardnumber}</Link> }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return moment(value).format('DD/MM/YYYY') }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return moment(value).format('DD/MM/YYYY') }
                },
                (parentUrl === 'member-corporate') ?
                    {
                        type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                        render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                    } : '',
                (parentUrl === 'member-corporate') ?
                    {
                        type: 'html', title: 'Action', dataIndex: 'action',
                        render: (value, row, index) => {
                            return (
                                <span>
                                    {/* <Button url={this.props.match.url + '/form/' + row.memberrelationid} size="small" icon="edit" title="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> */}
                                    {
                                        (row.active) ?
                                            <Button htmlType="button" type="danger" size="small" icon="close" title="Deactivate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.handleActivationModal(row.memberrelationid, row.active)} /> :
                                            <Button htmlType="button" type="primary" size="small" icon="check" title="Activate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.handleActivationModal(row.memberrelationid, row.active)} />
                                    }
                                </span>
                            )
                        }
                    } : ''
            ]
        }

        return (
            <React.Fragment>
                <Modal title={(activeData ? 'Deactivate' : 'Activate') + ' Confirmation'} visible={visible} onCancel={this.handleCancel} destroyOnClose={true} footer={null}>
                    <ActivationConfirmation memberrelationid={memberrelationid} activeData={activeData} closemodalrefresh={this.handleOk} cancelModal={this.handleCancel} />
                </Modal>
                <Modal visible={visible2} loading={isLoading} onCancel={this.handleCancel2} footer={null} destroyOnClose={true} width={800} >
                    <Upload {...this.props} onClose={this.handleCancel2} refreshList={this.handleOk2} />
                </Modal>
                <Row>
                    <Col xs={24} sm={18}>
                        <Title level={4}>{(this.props.match.url.split('/')[1] === 'member' ? 'List Member Parent' : 'Manage Member Relation')}</Title>
                    </Col>
                    <Col xs={24} sm={6} align="right" style={{ display: (parentUrl === 'member' ? 'none' : 'block') }}>
                        <Button htmlType="button" size="default" type="default" label="Upload" icon="upload" onClick={() => this.handleOpenModal()} />
                        <Button type="primary" url={this.props.match.url + '/form'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={this.state.loadRedirect} tip="Please wait while checking the member data">
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);