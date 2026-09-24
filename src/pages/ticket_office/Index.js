import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Ticket Office | Loyalty Management System";
    }

    deleteData(tickoffid) {
        let url = api.url.ticketoffice.delete;
        let data = { tickoffid };
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
        const configurationSearchForm = [
            { labeltext: "Ticket Office ID", datafield: "tickoffid", type: 'text', placeholder: 'Ticket Office ID', showDefaultSearch: true },
            { labeltext: "Ticket Office Name", datafield: "tickoffname", type: 'text', placeholder: 'Ticket Office Name', showDefaultSearch: true },
            { labeltext: "Branch Code", datafield: "branchcode", type: 'text', placeholder: 'Branch Code', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.ticketoffice.list,
            columns: [
                { type: 'field', title: 'Ticket Office ID', dataIndex: 'tickoffid', sorter: true },
                { type: 'field', title: 'Ticket Office Name', dataIndex: 'tickoffname', sorter: true },
                { type: 'field', title: 'Branch Code', dataIndex: 'branchcode', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/ticket-office/form/' + row.tickoffid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.tickoffid)} />
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
                        <Title level={3}>Manage Ticket Office</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/ticket-office/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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