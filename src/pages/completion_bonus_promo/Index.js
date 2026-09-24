import React from 'react';
import { api } from '../../config/Services';
import { Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';
//import { jsUcfirst } from '../../utilities/Helpers';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Promo Completion | Loyalty Management System";
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.promocompletionbonus.list,
            sort: { createdDate: 'desc' },
            columns: [
                { type: 'field', title: 'Program Name', dataIndex: 'promocompletionname', sorter: true },
                {
                    type: 'field', title: 'Max Quota', dataIndex: 'maxquota', sorter: true,
                    render: (value, row, index) => { return (value === null) ? 'Unlimited' : value }
                },
                {
                    type: 'html', title: 'Start Period', dataIndex: 'startperiod', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Period', dataIndex: 'endperiod', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createdDate', sorter: true,
                    render: (val) => { return (val) ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => { return (value === 'active') ? 'ACTIVE' : 'INACTIVE' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/promo-completion-bonus/form/' + row.promocompletionid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Program Name", datafield: "promocompletionname", type: 'text', placeholder: 'Program Name', showDefaultSearch: true },
            { labeltext: "Period", datafield: "period", type: 'datepicker', placeholder: 'Period', showDefaultSearch: true, specialSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Promo Completion</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/promo-completion-bonus/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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