import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;

const configurationSearchForm = [
    { labeltext: "Template Name", datafield: "templatename", type: 'text', placeholder: 'Template Name', showDefaultSearch: true },
    { labeltext: "Tier", datafield: "tiername", type: 'text', placeholder: 'Tier', showDefaultSearch: true }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Mileage Statement Template | Loyalty Management System";
    } s

    deleteData(templateid) {
        let url = api.url.mileagestatementtemplate.delete;
        let data = { templateid };
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

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.mileagestatementtemplate.list,
            criteria: { status: '%ACTIVE' },
            columns: [
                { type: 'field', title: 'Template Name', dataIndex: 'templatename', sorter: true },
                { type: 'field', title: 'Tier', dataIndex: 'tiername', sorter: true },
                { type: 'field', title: 'Status', dataIndex: 'status', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/mileage-statement-template/form/' + row.templateid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.templateid)} />
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
                        <Title level={3}>Mileage Statement Template</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/mileage-statement-template/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);