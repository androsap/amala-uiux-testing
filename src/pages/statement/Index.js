import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Statement | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Statement Name", datafield: "statementname", type: 'text', placeholder: 'Statement Name', showDefaultSearch: true },
            { labeltext: "Statement Type", datafield: "statementtype", type: 'text', placeholder: 'Statement Type', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.statement.list,
            columns: [
                { type: 'field', title: 'Statement Name', dataIndex: 'statementname', sorter: true },
                { type: 'field', title: 'Statement Type', dataIndex: 'statementtype', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={{ pathname: '/statement/template-text', state: { statementcode: row.statementcode, statementname: row.statementname, statementtype: row.statementtype } }} size="small" label="Statement Text" menucode="STATTEXT" prefixmenuname="STATTEXT" actioncode="ACCESS" />
                                <Button url={'/statement/form/' + row.statementcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
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
                        <Title level={3}>Manage Statement</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/statement/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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