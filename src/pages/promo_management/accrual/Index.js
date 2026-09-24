import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { PromoType, StatusString, ValueType } from '../../../data';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = 'Accrual Promo Management | Loyalty Management System';
    };

    hanldeActiveDeactive(promocode, active) {
        let url = (active) ? api.url.promomanage.deactivate : api.url.promomanage.activate;
        let data = { promocode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };
        DeleteRequest(url, data, callback, active);
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: 'Promo Code', datafield: 'promocode', type: 'text', placeholder: 'Promo Code', showDefaultSearch: true },
            { labeltext: 'Promo Name', datafield: 'name', type: 'text', placeholder: 'Promo Name', showDefaultSearch: true },
            { labeltext: 'Promo Type', datafield: 'promotype', type: 'select', placeholder: 'Promo Type', showDefaultSearch: true, options: PromoType },
            { labeltext: 'Bonus Award Type', datafield: 'bonusawardtype', type: 'select', placeholder: 'Bonus Award Type', showDefaultSearch: false, options: ValueType },
            { labeltext: 'Bonus Tier Type', datafield: 'bonustiertype', type: 'select', placeholder: 'Bonus Tier Type', showDefaultSearch: false, options: ValueType },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', showDefaultSearch: false, options: StatusString },
            { labeltext: 'Date', datafield: 'date', type: 'datepicker', placeholder: 'Date', showDefaultSearch: true, specialSearch: true, specialSearch: true },
        ];
        const configurationTable = {
            url: api.url.promomanage.retrieve,
            sort: { createdDate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Promo Code', dataIndex: 'promocode', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Promo Name', dataIndex: 'name', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Promo Type', dataIndex: 'promotype', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Bonus Award', dataIndex: 'bonusaward', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Bonus Award Type', dataIndex: 'bonusawardtype', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Bonus Tier', dataIndex: 'bonustier', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Bonus Tier Type', dataIndex: 'bonustiertype', sorter: true,
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
                { type: 'field', title: 'Status Promo', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={`/promo-manage-catalog/form/${row.promocode}/basic-info`} size='small' title='Edit' icon='edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                {(row.status === 'ACTIVE') ?
                                    <Button htmlType='button' size='small' label='Deactivate' type='danger' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.hanldeActiveDeactive(row.promocode, true)} /> :
                                    <Button htmlType='button' size='small' label='Activate' type='default' className='btn-custom-green' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={() => this.hanldeActiveDeactive(row.promocode, false)} />
                                }
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Accrual Promo Management</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/promo-manage-catalog/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
}

export default Form.create()(App);
