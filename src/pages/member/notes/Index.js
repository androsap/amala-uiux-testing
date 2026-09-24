import React from 'react';
import { DeleteRequest, DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin, Tabs, Modal } from 'antd';
import moment from 'moment';

import ComplaintInformation from './complaint_information/Index';
import Log from './log/Index';
import NotesForm from './Form';

const { Title } = Typography;
const { TabPane } = Tabs;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 'LOG',
            searching: false,
            visible: false,
            isLoading: false,
            membernotesid: null,
            titlepage: 'Create',
            refreshTableList: false,
            showmoredatabefore: false,
            showmoredataafter: false
        }
    }

    componentDidMount() {
        document.title = 'Member Notes | Loyalty Management System';
    };

    handleOk = () => {
        this.setState({ showAddModal: false, refreshTableList: true });
    };

    handleOpenModal = (membernotesid) => {
        this.setState({ visible: true, membernotesid });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    };

    handleChangeTab = (key) => {
        this.setState({ key })
        this.props.form.resetFields()
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { visible, isLoading, membernotesid, titlepage, key, refreshTableList } = this.state;
        const memberid = this.props.match.params.ID;

        return (
            <React.Fragment>
                <Modal visible={visible} title={`${titlepage} Notes`} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={960}>
                    <NotesForm {...this.props} memberid={memberid} membernotesid={membernotesid} onClose={this.handleCancel} refreshHeader={this.props.refreshHeader} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                </Modal>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row>
                            <Col xs={24} xl={20}>
                                <Title level={4}>Manage Notes</Title>
                            </Col>
                            {
                                (key === 'LOG') ? null : <Col xs={24} xl={4} align='right'>
                                    <Button htmlType='button' type='primary' size='default' label='Create' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' onClick={() => this.handleOpenModal()} />
                                </Col>
                            }
                            <Divider />
                        </Row>
                        <Tabs defaultActiveKey='LOG' style={{ marginTop: '-20px' }} onTabClick={this.handleChangeTab}>
                            <TabPane tab='Log' key='LOG'>
                                <Log {...this.props} />
                            </TabPane>
                            <TabPane tab='Complaint & Information' key='COMPLAIT_INFO'>
                                <ComplaintInformation {...this.props} refreshTableList={refreshTableList} resetRefreshTableList={() => this.setState({ refreshTableList: false })} />
                            </TabPane>
                        </Tabs>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);