import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, SearchForm, Button, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Tier Reason | Loyalty Management System";
    }

    deleteData(reasonid) {
        let url = api.url.tierreason.delete;
        let data = { reasonid };
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
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.tierreason.list,
            columns: [
                { type: 'field', title: 'Name', dataIndex: 'reasonname', sorter: true },
                {
                    type: 'html', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value, row, index) => {
                        return (value ? value.length > 60 ? value.substring(0, 60) + '...' : value : '-')
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/tier-reason/form/' + row.reasonid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.reasonid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Name", datafield: "reasonname", type: 'text', placeholder: 'Name', showDefaultSearch: true },
            { labeltext: "Description", datafield: "description", type: 'text', placeholder: 'Description', showDefaultSearch: true }
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Tier Reason</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/tier-reason/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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