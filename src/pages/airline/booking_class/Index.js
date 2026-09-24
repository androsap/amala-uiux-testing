import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import CompartmentForm from './Form';
import moment from 'moment';

const prefixmenuname = 'SUBCLASS';
const menucode = 'SUBCLASS';

class App extends React.Component {
    state = {
        showAddModal: false,
        titlepage: 'Create'
    }

    componentDidMount() {
        this.componentTable.getList();
    }

    deleteData(airlinecode, compartmentcode, subclasscode) {
        let url = api.url.subclass.delete;
        let data = { airlinecode, compartmentcode, subclasscode };
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

    handleOpenModal = (subclasscode, compartmentcode, ) => {
        this.setState({ showAddModal: true, subclasscode, compartmentcode });
    }

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ showAddModal: false, titlepage: 'Create' });
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    }

    render() {
        const { showAddModal, titlepage } = this.state;
        const configurationTable = {
            url: api.url.subclass.list,
            criteria: { airlinecode: this.props.airlinecode },
            columns: [
                { type: 'field', title: 'Compartment Code', dataIndex: 'compartmentcode', sorter: true },
                { type: 'field', title: 'Subclass Code', dataIndex: 'subclasscode', sorter: true },
                { type: 'field', title: 'Rank', dataIndex: 'subclassrank', sorter: true },
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
                                <Button htmlType="button" size="small" label={(this.props.active) ? 'Edit' : 'View'} type="default" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" onClick={() => this.handleOpenModal(row.subclasscode, row.compartmentcode, row.airlinecode)} />
                                {
                                    (this.props.active) ? <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.airlinecode, row.compartmentcode, row.subclasscode)} /> : ''
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Compartment Code", datafield: "compartmentcode", type: 'text', placeholder: 'Compartment Code', showDefaultSearch: true },
            { labeltext: "Subclass Code", datafield: "subclasscode", type: 'text', placeholder: 'Subclass Code', showDefaultSearch: true },
            { labeltext: "Rank", datafield: "subclassrank", type: 'text', placeholder: 'Rank', showDefaultSearch: true },
            { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
            { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Modal visible={showAddModal} title={titlepage + " Compartment"} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    <CompartmentForm airlinecode={this.props.airlinecode} compartmentcode={this.state.compartmentcode} subclasscode={this.state.subclasscode} active={this.props.active} setTitlePage={this.setTitlePage} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col xs={24} xl={24} align="right" style={{ marginBottom: 15 }}>
                        {
                            (this.props.active) ? <Button type="primary" size="default" label="Add New" htmlType="button" onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> : ''
                        }
                    </Col>
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);