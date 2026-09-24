import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage City | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.city.list,
            columns: [
                { type: 'field', title: 'City Code', dataIndex: 'citycode', sorter: true },
                { type: 'field', title: 'City Name', dataIndex: 'cityname', sorter: true },
                { type: 'field', title: 'State Name', dataIndex: 'statename', sorter: true },
                { type: 'field', title: 'Country Name', dataIndex: 'countryname', sorter: true },
                {
                    type: 'html', title: 'Status', dataIndex: 'active',
                    render: (value, row, index) => {
                        return (value) ? 'Active' : 'Inactive'
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/city/form/' + row.citycode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "City Code", datafield: "citycode", type: 'text', placeholder: 'City Code', showDefaultSearch: true },
            { labeltext: "City Name", datafield: "cityname", type: 'text', placeholder: 'City Name', showDefaultSearch: true },
            { labeltext: "State Name", datafield: "statename", type: 'text', placeholder: 'State Name', showDefaultSearch: true },
            { labeltext: "Country Name", datafield: "countryname", type: 'text', placeholder: 'Country Name', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage City</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/city/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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