import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Icon } from 'antd';
import TableBase from '../../components/Table/TableBase';
import { optionsTemplateFile } from './Form';

const { Title } = Typography;

const configurationSearchForm = [
    { labeltext: "Program Code", datafield: "programcode", type: 'text', placeholder: 'Program Code', showDefaultSearch: true },
    { labeltext: "Program Name", datafield: "programname", type: 'text', placeholder: 'Program Name', showDefaultSearch: true },
    { labeltext: "Partner Name", datafield: "partnername", type: 'text', placeholder: 'Partner Name', showDefaultSearch: true }
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Program Loyalty | Loyalty Management System";
    }

    deleteData(programcode) {
        let url = api.url.program.delete;
        let data = { programcode };
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
            url: api.url.program.list,
            columns: [
                { type: 'field', title: 'Program Code', dataIndex: 'programcode', sorter: true },
                { type: 'field', title: 'Program Name', dataIndex: 'programname', sorter: true },
                { type: 'field', title: 'Partner Name', dataIndex: 'partnername', sorter: true },
                {
                    type: 'html', title: 'Active Program', dataIndex: 'isoperatingprogram', sorter: true,
                    render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                },
                {
                    type: 'html', title: 'File Exchange', dataIndex: 'fileexchange', sorter: true,
                    render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                },
                {
                    type: 'html', title: 'Template', dataIndex: 'templatefile', sorter: true,
                    render: (value, row, index) => {
                        let result = optionsTemplateFile.filter(obj => obj.value === value)[0];
                        return (result && result['label']) ? result['label'] : '-';
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/program/form/' + row.programcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.programcode)} />
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
                        <Title level={3}>Manage Program Loyalty</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/program/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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