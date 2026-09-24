import React from 'react';
import { api } from '../../../config/Services';
import { SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { jsUcfirst } from '../../../utilities/Helpers';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Member Mailing | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        criteria.sentdate = (criteria.sentdate) ? "%" + moment(criteria.sentdate).format("YYYY-MM-DD") + "%" : null;
        criteria.mailingtype = (criteria.mailingtype) ? criteria.mailingtype.split(" ").join("_").toUpperCase() : null;
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const memberid = this.props.match.params.ID;
        const configurationTable = {
            url: api.url.membermailing.list,
            criteria: { memberid },
            sort: { sentdate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Mailing Type', dataIndex: 'mailingtype', sorter: true,
                    render: (value, row, index) => { return value ? jsUcfirst(value, "_") : '-' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return value ? value : '-' }
                },
                {
                    type: 'html', title: 'Sent Date', dataIndex: 'sentdate', sorter: true,
                    render: (value, row, index) => { return value ? moment(value).format("DD/MM/YYYY") : '-' }
                }
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Mailing Type", datafield: "mailingtype", type: 'text', placeholder: 'Mailing Type', showDefaultSearch: true },
            { labeltext: "Status", datafield: "status", type: 'text', placeholder: 'Status', showDefaultSearch: true },
            { labeltext: "Sent Date", datafield: "sentdate", type: 'datepicker', placeholder: 'Sent Date', showDefaultSearch: true },
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Mailing</Title>
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