import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage State | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.state.list,
            columns: [
                { type: 'field', title: 'State Code', dataIndex: 'statecode', sorter: true },
                { type: 'field', title: 'State Name', dataIndex: 'statename', sorter: true },
                { type: 'field', title: 'Country Name', dataIndex: 'countryname', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value, row, index) => {
                        return (value) ? 'Active' : 'Inactive'
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/state/form/' + row.statecode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "State Code", datafield: "statecode", type: 'text', placeholder: 'State Code', showDefaultSearch: true },
            { labeltext: "State Name", datafield: "statename", type: 'text', placeholder: 'State Name', showDefaultSearch: true },
            { labeltext: "Country Name", datafield: "countryname", type: 'text', placeholder: 'Country Name', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage State</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/state/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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