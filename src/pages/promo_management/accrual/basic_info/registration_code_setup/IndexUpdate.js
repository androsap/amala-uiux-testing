import React from 'react';
import { DeleteRequest } from '../../../../../utilities/RequestService';
import { api } from '../../../../../config/Services';
import { Alert, Button, SearchForm, TableBase } from '../../../../../components/Base/BaseComponent';
import { Row, Col, Modal } from 'antd';
import { StatusString } from '../../../../../data';
import moment from 'moment';

import RegisForm from './Form';
import MemberRegis from './MemberRegis';

class RegistrationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleModal: null,
            actioncode: 'create',
            isLoading: false,
            regcode: null,
            regdata: [],
            visible: {
                registration: false,
                member: false
            }
        }
    };

    componentDidMount() { };

    hanldeActiveDeactive(regcode, active) {
        let url = (active) ? api.url.promomanage.regcode.deactivate : api.url.promomanage.regcode.activate;
        let data = { regcode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been proccess');
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback, active);
    };

    handleSearchForm = (criteria, criteriadata) => {
        const { dateregis } = criteriadata || {};
        criteriadata = { date: dateregis };

        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    handleModal = (value, type, regcode, regdata) => {
        let { titleModal } = this.state;
        if (type === 'registration') {
            titleModal = `${(regcode) ? 'Edit' : 'Add'} Registration Code`;
        }

        this.setState({ titleModal, regcode, regdata, visible: { ...this.state.visible, [type]: value } });
        if (!value) this.componentTable.getList();
    };

    render() {
        const { titleModal, visible, regcode, regdata } = this.state;
        const { registration, member } = visible;
        const { menucode, prefixmenuname, datapromo } = this.props;
        const { promocode } = (datapromo) ? datapromo[0] : {};

        const customClear = ['registrationcode', 'dateregis', 'status', []];
        const configurationSearchForm = [
            { labeltext: 'Registration Code', datafield: 'registrationcode', type: 'text', placeholder: 'Registration Code', showDefaultSearch: true },
            { labeltext: 'Date', datafield: 'dateregis', type: 'datepicker', placeholder: 'Date', showDefaultSearch: true, specialSearch: true },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', showDefaultSearch: true, options: StatusString },
        ];
        const configurationTable = {
            url: api.url.promomanage.regcode.retrieve,
            criteria: { promocode },
            columns: [
                {
                    type: 'field', title: 'Registration Code', dataIndex: 'registrationcode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%',
                    render: (value, row, index) => {
                        const { status, regcode } = row || {}
                        return (
                            <span>
                                <Button htmlType='button' size='small' title='Edit' icon='edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={() => this.handleModal(true, 'registration', regcode, row)} />
                                {(regcode) ?
                                    <Button htmlType='button' size='small' title='See Member' type='primary' icon='eye' menucode={menucode} prefixmenuname={prefixmenuname} onClick={() => this.handleModal(true, 'member', regcode)} /> : null
                                }
                                {(status === 'ACTIVE') ?
                                    <Button htmlType='button' size='small' title='Deactivate' type='danger' icon='pause' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.hanldeActiveDeactive(regcode, true)} /> :
                                    <Button htmlType='button' size='small' title='Activate' type='default' icon='check' className='btn-custom-green' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.hanldeActiveDeactive(regcode, false)} />
                                }
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Modal centered visible={registration || member} title={`${(member) ? 'Member' : titleModal}`} onCancel={() => this.handleModal(false, (member) ? 'member' : 'registration')} footer={null} destroyOnClose={true} width={700}>
                    {
                        (member) ? <MemberRegis {...this.props} datapromo={datapromo} onClose={() => this.handleModal(false, 'member')} /> :
                            <RegisForm {...this.props} datapromo={datapromo} onClose={() => this.handleModal(false, 'registration')} regcode={regcode} regdata={regdata} />
                    }
                </Modal>
                <Row>
                    <Col xs={24}>
                        <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} allowCustomClear={true} customClear={customClear} />
                    </Col>
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment >
        );
    };
}

export default RegistrationCode;
