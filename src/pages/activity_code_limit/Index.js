import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Non Air Activity Limit | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: "Non-Air Activity Type", datafield: "nonairactivitytype", type: 'text', placeholder: 'Non-Air Activity Type', showDefaultSearch: true },
            { labeltext: "Limit Code", datafield: "limitcode", type: 'text', placeholder: 'Limit Code', showDefaultSearch: true },
            { labeltext: "Limit", datafield: "limit", type: 'text', placeholder: 'Limit', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.activitycode.limit.list,
            criteria: { active: true },
            columns: [
                { type: 'field', title: 'Non-Air Activity Type', dataIndex: 'nonairactivitytype', sorter: true },
                { type: 'field', title: 'Limit Code', dataIndex: 'limitcode', sorter: true },
                { type: 'field', title: 'Limit', dataIndex: 'limit', sorter: true },
                {
                    type: 'html', title: 'Description', dataIndex: 'description', sorter: true,
                    render: (value, row, index) => { return (value) ? value.length > 60 ? value.substring(0, 60) + '...' : value : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/activity-code-limit/form/' + row.limitcode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
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
                        <Title level={3}>Manage Non Air Activity Limit</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/activity-code-limit/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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