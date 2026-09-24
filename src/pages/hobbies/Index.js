import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';

const { Title } = Typography;
const configurationSearchForm = [
    { labeltext: "Hobby Name", datafield: "hobbiesname", type: 'text', placeholder: 'Hobby Name', showDefaultSearch: true },
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Hobbies | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.hobbies.list,
            columns: [
                { type: 'field', title: 'Hobby Name', dataIndex: 'hobbiesname', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: false,
                    render: (value, row, index) => { return ((value) ? 'Active' : 'Inactive') }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/hobbies/form/' + row.hobbiesid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
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
                        <Title level={3}>Manage Hobbies</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/hobbies/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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