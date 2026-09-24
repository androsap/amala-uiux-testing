import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { VendorType } from '../../data' 

const { Title } = Typography;
const optionsStatus = [
    { value: true, label: 'ACTIVE'},
    { value: false, label: 'INACTIVE'},
]

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Vendor Catalogue | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(vendorcode) {
        let url = api.url.vendor.delete;
        let data = { vendorcode };
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

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.vendor.retrieve,
            sort: { createdDate: 'desc'},
            columns: [
                { type: 'field', title: 'Vendor Code', dataIndex: 'vendorcode', sorter: true },
                { type: 'field', title: 'Vendor Name', dataIndex: 'vendorname', sorter: true },
                { type: 'field', title: 'Vendor Type', dataIndex: 'vendortype', sorter: true },
                {
                    type: 'html', title: 'Contact Person', dataIndex: 'contactperson', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Phone Country', dataIndex: 'country.countryphonecode', sorter: true, align: 'center',
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Phone Region', dataIndex: 'phoneregioncode', sorter: true, align: 'center',
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Phone Number', dataIndex: 'phonenumber', sorter: true, align: 'center',
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value === true) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/vendor/form/' + row.vendorcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" actioncode="DELETE" onClick={() => this.deleteData(row.vendorcode)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Vendor Code", datafield: "vendorcode", type: 'text', placeholder: 'Vendor Code', showDefaultSearch: true },
            { labeltext: "Vendor Name", datafield: "vendorname", type: 'text', placeholder: 'Vendor Name', showDefaultSearch: true },
            { labeltext: "Vendor Type", datafield: "vendortype", type: 'select', placeholder: 'Vendor Type', options: VendorType, showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', options: optionsStatus, showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Vendor</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/vendor/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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