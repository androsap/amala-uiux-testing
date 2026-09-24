import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, TableBase, SearchForm, TierSelect, MembershipSelect } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Modal } from 'antd';
import LocationForm from './Form';
import moment from 'moment';

import { Status } from '../../../data';

const prefixmenuname = 'ENRLRULE';
const menucode = 'ENRLRULE';

class App extends React.Component {
    state = {
        showAddModal: false,
        titlepage: 'Create'
    }

    componentDidMount() {
        this.componentTable.getList();
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    deleteData(enrollmentrulecode, partnercode, tierid) {
        let url = api.url.enrollmentrule.delete;
        let data = { enrollmentrulecode, partnercode, tierid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);

            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    };

    handleOpenModal = (enrollmentrulecode) => {
        this.setState({ showAddModal: true, enrollmentrulecode, titlepage: enrollmentrulecode ? 'Edit' : 'Create' });
    };

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
    };

    handleCancel = () => {
        this.setState({ showAddModal: false });
    };

    setTitlePage = (titlepage) => {
        this.setState({ titlepage });
    };

    render() {
        const { showAddModal, titlepage } = this.state;
        const configurationSearchForm = [
            { labeltext: 'Membership', datafield: 'membershipid', type: 'component', placeholder: 'Membership', component: MembershipSelect, showDefaultSearch: true },
            { labeltext: 'Tier', datafield: 'tiername', type: 'component', placeholder: 'Tier', component: TierSelect, showDefaultSearch: true },
            { labeltext: 'Start Date', datafield: 'startdate', type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: true, specialSearch: true },
            { labeltext: 'End Date', datafield: 'enddate', type: 'datepicker', placeholder: 'End Date', showDefaultSearch: true, specialSearch: true },
            { labeltext: 'Status', datafield: 'active', type: 'select', placeholder: 'Status', options: Status, showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.enrollmentrule.list,
            criteria: { partnercode: this.props.partnercode },
            columns: [
                { type: 'field', title: 'Partner Code', dataIndex: 'partnercode', sorter: false },
                { type: 'field', title: 'Membership', dataIndex: 'membershipname', sorter: false },
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: false },
                {
                    type: 'field', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, { enrollmentrulecode, partnercode, tierid }, index) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' label={(this.props.active) ? 'Edit' : 'View'} type='default' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={() => this.handleOpenModal(enrollmentrulecode)} />
                                {
                                    (this.props.active) ? <Button htmlType='button' size='small' label='Delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(enrollmentrulecode, partnercode, tierid)} /> : ''
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal visible={showAddModal} title={titlepage + ' Enrollment Rule'} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={700}>
                    <LocationForm partnercode={this.props.partnercode} enrollmentrulecode={this.state.enrollmentrulecode} active={this.props.active} setTitlePage={this.setTitlePage} closemodalrefresh={this.handleOk} />
                </Modal>
                <Row>
                    <Col align='right' style={{ margin: '0 5px 5px 0' }} >
                        {(this.props.active) ?
                            <Button type='primary' size='default' label='Add New' htmlType='button' onClick={() => this.handleOpenModal()} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' /> :
                            ''}
                    </Col>
                    <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);