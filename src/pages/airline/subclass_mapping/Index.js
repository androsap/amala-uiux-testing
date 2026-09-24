import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import SubclassForm from './Form';
import moment from 'moment';

const prefixmenuname = 'SUCLSMAP';
const menucode = 'SUCLSMAP';

class App extends React.Component {
    state = {
        showAddModal: false
    }

    componentDidMount() {
        this.componentTable.getList();
    }

    deleteData(subclassmappingcode) {
        let url = api.url.compartment.delete;
        let data = { subclassmappingcode };
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

    handleOpenModal = (subclassmappingcode) => {
        this.setState({ showAddModal: true, subclassmappingcode });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ showAddModal: false });
    };

    render() {
        const { showAddModal } = this.state;
        const configurationTable = {
            url: api.url.subclassmapping.list,
            criteria: { marketingairline: this.props.airlinecode },
            columns: [
                { type: 'field', title: 'Marketing Airline Name', dataIndex: 'marketingairliname', sorter: true },
                { type: 'field', title: 'Marketing Subclass', dataIndex: 'marketingsubclass', sorter: true },
                { type: 'field', title: 'Operating Airline Name', dataIndex: 'operatingairlinename', sorter: true },
                { type: 'field', title: 'Operating Subclass', dataIndex: 'operatingsubclass', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Edit" type="default" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.subclassmappingcode)} />
                                {
                                    (this.props.active) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.subclassmappingcode)} /> : ''
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={showAddModal} title="Add Subclass Mapping" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={800}>
                    <SubclassForm airlinecode={this.props.airlinecode} subclassmappingcode={this.props.subclassmappingcode} active={this.props.active} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24} align="right" style={{ marginBottom: 15 }}>
                        {
                            (this.props.active) ? <Button type="primary" size="default" label="Add New" htmlType="button" onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                        }
                    </Col>
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);