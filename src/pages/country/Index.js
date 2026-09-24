import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Country | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.country.list,
            columns: [
                { type: 'field', title: 'Country Code', dataIndex: 'countrycode', sorter: true },
                { type: 'field', title: 'Country Name', dataIndex: 'countryname', sorter: true },
                { type: 'field', title: 'Phone Code', dataIndex: 'countryphonecode', sorter: true },
                { type: 'field', title: 'Nationality', dataIndex: 'nationality', sorter: true },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/country/form/' + row.countrycode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Country Code", datafield: "countrycode", type: 'text', placeholder: 'Country Code', showDefaultSearch: true },
            { labeltext: "Country Name", datafield: "countryname", type: 'text', placeholder: 'Country Name', showDefaultSearch: true },
            { labeltext: "Phone Code", datafield: "countryphonecode", type: 'text', placeholder: 'Phone Code', showDefaultSearch: true },
            { labeltext: "Nationality", datafield: "nationality", type: 'text', placeholder: 'Nationality', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Country</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/country/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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