import React from 'react';
import { api } from '../../config/Services';
import { DeleteRequest } from '../../utilities/RequestService';
import { Button, SearchForm, TableBase, Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Custom Transaction | Loyalty Management System";
    }

    deleteData(customtrxcode) {
        let url = api.url.customtransaction.delete;
        let data = { customtrxcode };
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
            { labeltext: "Transaction Code", datafield: "customtrxcode", type: 'text', placeholder: 'Transaction Code', showDefaultSearch: true },
            { labeltext: "Transaction Name", datafield: "customtrxname", type: 'text', placeholder: 'Transaction Name', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.customtransaction.list,
            columns: [
                { type: 'field', title: 'Transaction Code', dataIndex: 'customtrxcode', sorter: true },
                { type: 'field', title: 'Transaction Name', dataIndex: 'customtrxname', sorter: true },
                {
                    type: 'html', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value, row, index) => { return (value) ? value.length > 60 ? value.substring(0, 60) + '...' : value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/custom-transaction/form/' + row.customtrxcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.customtrxcode)} />
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
                        <Title level={3}>Manage Custom Transaction</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/custom-transaction/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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