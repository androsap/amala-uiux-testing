import React from 'react';
import { api } from '../../../../config/Services';
import { SearchForm, TableBase } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Member Activity Limit | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    render() {
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.memberactivity.limit,
            criteria: { memberid },
            columns: [
                {
                    type: 'html', title: 'Activity Code', dataIndex: 'activitycode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Limit Code', dataIndex: 'limitcode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Allowed Mileage', dataIndex: 'allowedmileage', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Total Mileage', dataIndex: 'totalmileage', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Activity Code", datafield: "activitycode", type: 'text', placeholder: 'Activity Code', showDefaultSearch: true },
            { labeltext: "Limit Code", datafield: "limitcode", type: 'text', placeholder: 'Limit Code', showDefaultSearch: true },
            { labeltext: "Date", datafield: "date", type: 'datepicker', placeholder: 'Date', specialSearch: true, showDefaultSearch: true },
        ];

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} sm={20}>
                        <Title level={4}>Manage Activity Limit</Title>
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