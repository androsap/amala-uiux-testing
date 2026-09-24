import React from 'react';
import { DeleteRequest, DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Button, SearchForm, TableBase, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Row, Typography, Modal, Spin } from 'antd';
import { TypeNotes, Level } from '../../../../data';
import { getProfile } from '../../../../utilities/AuthService';
import moment from 'moment';

import NotesForm from '../Form';

const { Text } = Typography;

class ComplainInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            isLoading: false,
            membernotesid: null,
            titlepage: 'Create',
            showmoredatabefore: false,
            showmoredataafter: false
        }
    }

    componentDidMount() {
        document.title = 'Member Notes | Loyalty Management System';
    };

    handleSearchForm = (criteria, criteriadataprevious) => {
        this.props.form.validateFieldsAndScroll((err, input) => {
            const { types, level, createddatestart, createddateend, createdBy } = input || {}
            let criteriadata = criteriadataprevious;
            let validationMessage = '';

            if (types === undefined) { criteriadata.types = ['COMPLAINT', 'INFORMATION'] }
            if (!err && ((createddatestart && createddateend) || level || types || createdBy)) {
                this.componentTable.handleSearchForm(criteria, criteriadata);
                this.setState({ criteria });
            } else validationMessage = 'Insert one of this filter to search';

            this.setState({ validationMessage });
        })
    };

    handleOk = () => {
        this.setState({ showAddModal: false }, () => this.componentTable.getList());
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

    deleteData(membernotesid) {
        let url = api.url.membernotes.delete;
        let data = { membernotesid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    };

    handleDownload = () => {
        this.setState({ isLoading: true });

        const createddatestart = this.props.form.getFieldValue('createddatestart') ? moment(this.props.form.getFieldValue('createddatestart')).format('YYYY-MM-DD') : undefined;
        const createddateend = this.props.form.getFieldValue('createddateend') ? moment(this.props.form.getFieldValue('createddateend')).format('YYYY-MM-DD') : undefined;
        const types = this.props.form.getFieldValue('types') ? [this.props.form.getFieldValue('types')] : ['COMPLAINT', 'INFORMATION'];
        const level = this.props.form.getFieldValue('level') ? this.props.form.getFieldValue('level') : undefined;
        const createdBy = this.props.form.getFieldValue('createdBy') ? `%${this.props.form.getFieldValue('createdBy')}%` : undefined;
        const helperLableData = ['createddatestart', 'createddateend', 'types', 'level', 'createdBy'];
        const helperValueData = [createddatestart, createddateend, types, level, createdBy];

        var data = {};
        var keys = 0
        data.memberid = this.props.match.params.ID;

        for (const field of helperValueData) {
            if (field !== null) data = { ...data, [helperLableData[keys]]: helperValueData[keys] }
            keys++;
        }

        DetailRequest(api.url.membernotes.download, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                this.setState({ isLoading: false });
                Alert.success(status.responsemessage);
                window.open(result.url);
            } else if (status.responsecode === '8001') {
                Alert.information(status.responsemessage);
                this.setState({ isLoading: false });
            } else {
                Alert.error(status.responsemessage);
                this.setState({ isLoading: false });
            }
        })
    };

    handleInsertDateFrom = () => {
        this.props.form.resetFields(['createddateend']);
    };

    render() {
        const { menucode, prefixmenuname, refreshTableList } = this.props;
        const { visible, isLoading, membernotesid, titlepage, validationMessage } = this.state;
        const memberid = this.props.match.params.ID;
        const createddatestart = this.props.form.getFieldValue('createddatestart') ? this.props.form.getFieldValue('createddatestart') : undefined;
        const createddateend = this.props.form.getFieldValue('createddateend') ? this.props.form.getFieldValue('createddateend') : undefined;

        const downloadInSearch = {
            useDownload: true,
            handleDownload: this.handleDownload,
            titleDownload: 'Download Notes'
        };

        const configurationSearchForm = [
            { labeltext: 'Type', datafield: 'types', type: 'select', placeholder: 'Type', options: TypeNotes.slice(0, 2), showDefaultSearch: true, specialSearchArray: true },
            { labeltext: 'Level', datafield: 'level', type: 'select', placeholder: 'Level', options: Level, showDefaultSearch: true },
            {
                labeltext: 'Start Created Date', datafield: 'createddatestart', type: 'datepicker', placeholder: 'Start Created Date', showDefaultSearch: true, specialSearch: true,
                maxDate: createddateend, onChange: this.handleInsertDateFrom
            },
            {
                labeltext: 'End Created Date', datafield: 'createddateend', type: 'datepicker', placeholder: 'End Created Date', showDefaultSearch: true, specialSearch: true,
                minDate: createddatestart, maxDate: (moment(createddatestart).add(3, 'M')), disabled: (!createddatestart) ? true : false, validationrules: (createddatestart) ? ['required'] : []
            },
            { labeltext: 'Created By', datafield: 'createdBy', type: 'text', placeholder: 'Created By', showDefaultSearch: false },

        ];

        const configurationTable = {
            url: api.url.membernotes.list,
            criteria: { memberid },
            criteriadata: { types: ['COMPLAINT', 'INFORMATION'] },
            sort: { createdDate: 'desc' },
            columns: [
                { type: 'field', title: 'Type', dataIndex: 'type', sorter: true },
                {
                    type: 'html', title: 'Level', dataIndex: 'level', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Notes', dataIndex: 'notes', sorter: true,
                    render: (value, row, index) => { return value ? value.length > 60 ? value.substring(0, 60) + '...' : value : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', sorter: true,
                    render: (value, row, index) => { return value ? moment(value).format('DD/MM/YYYY  HH:mm:ss') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {
                                    (row.type !== 'LOG' && row.createdBy === getProfile().username) ?
                                        <Button htmlType='button' size='small' title='Edit' icon='edit' type='primary' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={() => this.handleOpenModal(row.membernotesid)} />
                                        : <Button htmlType='button' size='small' title='View' icon='eye' onClick={() => this.handleOpenModal(row.membernotesid)} />
                                }
                                {
                                    (row.type !== 'LOG' && row.createdBy === getProfile().username) ?
                                        <Button htmlType='button' size='small' title='Delete' icon='delete' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.deleteData(row.membernotesid)} /> : null
                                }
                            </span>
                        )
                    }
                }
            ]
        };

        if (refreshTableList) {
            this.handleOk();
            this.props.resetRefreshTableList();
        }

        return (
            <React.Fragment>
                <Modal visible={visible} title={`${titlepage} Notes`} loading={isLoading} onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={960}>
                    <NotesForm memberid={memberid} membernotesid={membernotesid} onClose={this.handleCancel} refreshHeader={this.props.refreshHeader} setTitlePage={this.setTitlePage} refreshList={this.handleOk} />
                </Modal>
                <Row>
                    <Spin spinning={isLoading}>
                        <SearchForm {...downloadInSearch} ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                        <Text form={this.props.form} type='danger' >{validationMessage}</Text>
                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} style={{ marginTop: '7px' }} />
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(ComplainInformation);