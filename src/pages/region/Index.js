import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
const { Title } = Typography;

const optionsStatus = [
    { label: "ACTIVE", value: true },
    { label: "INACTIVE", value: false }
]

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Region | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.region.list,
            columns: [
                { type: 'field', title: 'Region Code', dataIndex: 'regioncode', sorter: true },
                { type: 'field', title: 'Region Name', dataIndex: 'regionname', sorter: true },
                {
                    type: 'field', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/region/form/' + row.regioncode} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Region Code", datafield: "regioncode", type: 'text', placeholder: 'Region Code', showDefaultSearch: true },
            { labeltext: "Region Name", datafield: "regionname", type: 'text', placeholder: 'Region Name', showDefaultSearch: true },
            { labeltext: "Status", datafield: "active", type: 'select', placeholder: 'Status', showDefaultSearch: true, options: optionsStatus }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Region</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/region/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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