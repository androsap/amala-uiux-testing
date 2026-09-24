import React from 'react';
import { api } from '../../../config/Services';
import { DeleteRequest } from '../../../utilities/RequestService';
import { Button, SearchForm, TableBase, InventorySelect, LetterSelect, Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { ProductType, Status } from '../../../data';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = 'Manage Mailing Product | Loyalty Management System';
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    deleteData(mailingproductcode, isActive) {
        let url = isActive ? api.url.mailingproduct.deactivate : api.url.mailingproduct.activate;

        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else Alert.error(responsemessage);
            this.componentTable.getList();
        };

        DeleteRequest(url, { mailingproductcode }, callback, isActive);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: 'Name', datafield: 'mailingproductname', type: 'text', placeholder: 'Name', showDefaultSearch: true },
            { labeltext: 'Start Date From', datafield: 'startdatefrom', type: 'datepicker', placeholder: 'Start Date From', showDefaultSearch: true, specialSearch: true },
            { labeltext: 'Start Date To', datafield: 'startdateto', type: 'datepicker', placeholder: 'Start Date To', showDefaultSearch: true, specialSearch: true },
            { labeltext: 'Product Type', datafield: 'producttype', type: 'select', placeholder: 'Product Type', showDefaultSearch: true, options: ProductType },
            { labeltext: 'Status', datafield: 'active', type: 'select', placeholder: 'Status', showDefaultSearch: false, options: Status },
            { labeltext: 'Letter', datafield: 'lettercode', type: 'component', placeholder: 'Letter', showDefaultSearch: false, component: LetterSelect },
            { labeltext: 'Inventory', datafield: 'inventorycode', type: 'component', placeholder: 'Inventory', showDefaultSearch: false, component: InventorySelect },
        ];
        const configurationTable = {
            url: api.url.mailingproduct.list,
            sort: { createdDate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Name', dataIndex: 'mailingproductname', sorter: true,
                    render: (value) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Product Type', dataIndex: 'producttype', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'field', title: 'Letter', dataIndex: 'lettername', sorter: true,
                    render: (value, row) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Inventory', dataIndex: 'inventoryname', sorter: true,
                    render: (value, row) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'field', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, { mailingproductcode, active }, index) => {
                        const props = { menucode, prefixmenuname };

                        return (
                            <span>
                                <Button url={`/mailing-product/form/${mailingproductcode}/basic-info`} size='small' label='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                <Button htmlType='button' size='small' type={active ? 'danger' : 'default'} label={active ? 'Deactivate' : 'Activate'} {...props}
                                    actioncode='DELETE' className={active ? '' : 'btn-custom-green'} onClick={() => this.deleteData(mailingproductcode, active)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Mailing Product</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/mailing-product/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);