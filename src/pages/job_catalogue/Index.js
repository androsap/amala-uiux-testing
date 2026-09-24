import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Alert, Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Job List | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    deleteData(jobcode) {
        let url = api.url.jobcatalogue.delete;
        let data = { jobcode };
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
        const configurationSearchForm = [
            { labeltext: "Job Code", datafield: "jobcode", type: 'text', placeholder: 'Job Code', showDefaultSearch: true },
            { labeltext: "Job Name", datafield: "jobtitle", type: 'text', placeholder: 'Job Name', showDefaultSearch: true },
            { labeltext: "Language", datafield: "langname", type: 'text', placeholder: 'Language', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.jobcatalogue.list,
            columns: [
                { type: 'field', title: 'Job Code', dataIndex: 'jobcode', sorter: true },
                { type: 'field', title: 'Job Title', dataIndex: 'jobtitle', sorter: true },
                { type: 'field', title: 'Language', dataIndex: 'langname', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                },

                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/job-catalogue/form/' + (row.jobcode)} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.jobcode)} />
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
                        <Title level={3}>Manage Job List</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/job-catalogue/form/'} size="middle" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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