import React from 'react';
import { DeleteRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button } from '../../../components/Base/BaseComponent';
import PartnerListForm from './Form';
import { Form, Table, Row, Col, notification, Modal } from 'antd';
import moment from 'moment';

const { Column } = Table;

const prefixmenuname = 'PARTLIST';
const menucode = 'PARTLIST';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            criteria: {
                partnergroupcode: this.props.partnergroupcode
            },
            paging: {},
            sort: {},
            loading: false,
            showAddModal: false
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        const { criteria, paging, sort } = this.state;
        let url = api.url.partnergroup.list;
        let column = [];

        this.setState({ loading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let dataList = (result[0].listofpartner) ? result[0].listofpartner : [];
                this.setState({ dataList, loading: false });
            } else {
                notification['error']({ message: 'Error Service', description: response.status.responsemessage, duration: null });
            }
        });
    }

    deleteData(partnergroupcode, partnercode) {
        let url = api.url.partnergroup.removepartner;
        let data = { partnergroupcode, partnercode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.getList();
        };
        DeleteRequest(url, data, callback);
    }

    handleOpenModal = (patnercode) => {
        this.setState({ showAddModal: true, patnercode });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.getList());
    };

    handleCancel = () => {
        this.setState({ showAddModal: false });
    };

    render() {
        const { loading, dataList, showAddModal } = this.state;

        return (
            <React.Fragment>
                <Modal visible={showAddModal} title="Add Partner" loading={loading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    <PartnerListForm partnergroupcode={this.props.partnergroupcode} partnercode={this.state.partnercode} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24} align="right" style={{ marginBottom: 15 }}>
                        <Button type="primary" size="default" label="Add New" htmlType="button" onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.partnercode} dataSource={dataList} loading={loading} size="middle" pagination={false} onChange={this.handleTableChange} span={6}>
                        <Column title="No" dataIndex="number" key="number" render={(t, r, i) => ++i} />
                        <Column title="Partner Code" dataIndex="partnercode" key="partnercode" />
                        <Column title="Partner Name" dataIndex="partnername" key="partnername" />
                        <Column title="Effective Date" dataIndex="effectivedate" key="effectivedate" render={(value) => moment(value).format('DD/MM/YYYY')} />
                        <Column title="Discontinue Date" dataIndex="discontinuedate" key="discontinuedate" render={(value) => moment(value).format('DD/MM/YYYY')} />
                        <Column
                            title="Action"
                            key="action"
                            render={(text, record) => (
                                <span>
                                    <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(this.props.partnergroupcode, record.partnercode)} />
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