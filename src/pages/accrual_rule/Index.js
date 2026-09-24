import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, AirlineSelect, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { RouteType, Status } from '../../data';

const { Title } = Typography;
class App extends React.Component {
    componentDidMount() {
        document.title = 'Revenue Based | Loyalty Management System';
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationSearchForm = [
            { labeltext: 'Rule Name', datafield: 'prrulename', type: 'text', placeholder: 'Rule Name', showDefaultSearch: true },
            { labeltext: 'Partner', datafield: 'airlinecode', type: 'component', component: AirlineSelect, placeholder: 'Partner', showDefaultSearch: true },
            { labeltext: 'Route Type', datafield: 'routetype', type: 'select', options: RouteType, placeholder: 'Route Type', showDefaultSearch: true },
            { labeltext: 'Status', datafield: 'status', type: 'select', options: Status, placeholder: 'Status', showDefaultSearch: true }
        ];
        const configurationTable = {
            url: api.url.revenuebased.retrieveheader,
            columns: [
                {
                    type: 'field', title: 'Rule Name', dataIndex: 'prrulename', sorter: true,
                    render: (value) => { return (value !== null) ? value : '-' }
                },
                {
                    type: 'field', title: 'Partner Code', dataIndex: 'airlinecode', sorter: true,
                    render: (value) => { return (value !== null) ? value : '-' }
                },
                {
                    type: 'field', title: 'Partner Name', dataIndex: 'airlinename', sorter: true,
                    render: (value) => { return (value !== null) ? value : '-' }
                },
                {
                    type: 'field', title: 'Route Type', dataIndex: 'routetype', sorter: true,
                    render: (value) => { return (value !== null) ? value : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value) => { return (value) ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/accrual-rule/form/' + row.prruleid} size='small' label={row.status ? 'Edit' : 'View'} menucode={menucode} prefixmenuname={prefixmenuname}
                                    actioncode='UPDATE' type={row.status ? 'primary' : 'default'} />
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
                        <Title level={3}>Manage Accrual Rule</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type='primary' url={'/accrual-rule/form/'} size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);