import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import LocationForm from './Form';

const prefixmenuname = 'PARTNLOC';
const menucode = 'PARTNLOC';

class App extends React.Component {
    state = {
        showAddModal: false,
        titlepage: 'Create'
    }

    componentDidMount() {
        this.componentTable.getList();
    }

    deleteData(partnerlocationcode) {
        let url = api.url.partnerlocation.delete;
        let data = { partnerlocationcode };
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

    handleOpenModal = (partnerlocationcode) => {
        this.setState({ showAddModal: true, partnerlocationcode });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ showAddModal: false, titlepage: 'Create' });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    render() {
        const { showAddModal, titlepage } = this.state;
        const configurationTable = {
            url: api.url.partnerlocation.list,
            criteria: { partnercode: this.props.partnercode },
            columns: [
                { type: 'field', title: 'Partner Location Code', dataIndex: 'partnerlocationcode', sorter: true },
                { type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: true },
                { type: 'field', title: 'Country', dataIndex: 'countryname', sorter: false },
                { type: 'field', title: 'State', dataIndex: 'statename', sorter: false },
                { type: 'field', title: 'City', dataIndex: 'cityname', sorter: false },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button htmlType="button" size="small" label={(this.props.active) ? 'Edit' : 'View'} type="default" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.partnerlocationcode)} />
                                {
                                    (this.props.active) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.partnerlocationcode)} /> : ''
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={showAddModal} title={titlepage + " Partner Location"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    <LocationForm partnercode={this.props.partnercode} partnerlocationcode={this.state.partnerlocationcode} active={this.props.active} setTitlePage={this.setTitlePage} closemodalrefresh={this.handleOk} />
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