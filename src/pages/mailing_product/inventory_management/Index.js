import React from 'react';
import { DeleteRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Button, SearchForm } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../../components/Table/TableBase';
import { InventoryCategory } from '../../../data';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Inventory | Loyalty Management System";
    }

    deleteData(inventorycode) {
        let url = api.url.inventorysys.delete;
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, { inventorycode }, callback);
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { datafield: "inventorycode", type: 'Inventory Code', placeholder: 'Inventory Code', showDefaultSearch: true },
            { datafield: "inventoryname", type: 'text', placeholder: 'Inventory Name', showDefaultSearch: true },
            { datafield: "categorycode", type: 'select', placeholder: 'Category', showDefaultSearch: true, options: InventoryCategory }
        ];
        const configurationTable = {
            url: api.url.inventorysys.list,
            sort: { createdDate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Inventory Code', dataIndex: 'inventorycode', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Inventory Name', dataIndex: 'inventoryname', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Category', dataIndex: 'categorycode', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'field', title: 'Total Product Stock', dataIndex: 'totalquantity', sorter: true,
                    render: (val) => { return val ? val : '0' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (val, row) => {
                        return (
                            <span>
                                <Button url={`${this.props.location.pathname}/form/${row.inventorycode}`} size="small" label="view" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" type="danger" label="delete" actioncode="DELETE" onClick={() => this.deleteData(row.inventorycode)} />
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
                        <Title level={3}>Manage Inventory</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={`${this.props.location.pathname}/form`} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
