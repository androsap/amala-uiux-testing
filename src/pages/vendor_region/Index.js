import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Vendor Region| Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(regioncode) {
        let url = api.url.vendorregion.delete;
        let data = { regioncode };
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
        const configurationTable = {
            url: api.url.vendorregion.retrieve,
            columns: [
                { type: 'field', title: 'Region Code', dataIndex: 'regioncode', sorter: true },
                { type: 'field', title: 'Region Name', dataIndex: 'regionname', sorter: true },
                { type: 'field', title: 'Description', dataIndex: 'description', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/vendor-region/form/' + row.regioncode} size="small" label="Edit" actioncode="UPDATE" className={row.regioncode !== 'ALL' ? '' : 'hidden'} />
                                <Button htmlType="button" size="small" label="Delete" type="danger" actioncode="DELETE" onClick={() => this.deleteData(row.regioncode)} className={row.regioncode !== 'ALL' ? '' : 'hidden'} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Region Code", datafield: "regioncode", type: 'text', placeholder: 'Region Code', showDefaultSearch: true },
            { labeltext: "Region Name", datafield: "regionname", type: 'text', placeholder: 'Region Name', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Vendor Region</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/vendor-region/form/'} size="default" label="Add New" actioncode="CREATE" />
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