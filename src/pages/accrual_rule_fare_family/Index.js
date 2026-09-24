import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import TableBase from '../../components/Table/TableBase';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Accrual Fare Family | Loyalty Management System";
    }

    deleteData(fareid) {
        let url = api.url.accrualrulefare.delete;
        let data = { fareid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.componentTable.getList();
        };

        DeleteRequest(url, data, callback);
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const optionsStatus = [
            { label: "Active", value: true },
            { label: "Inactive", value: false }
        ]
        const configurationSearchForm = [
            { labeltext: "Fare Code", datafield: "farecode", type: 'text', placeholder: 'Fare Code', showDefaultSearch: true },
            { labeltext: "Fare Name", datafield: "farename", type: 'text', placeholder: 'Fare Name', showDefaultSearch: true },
            { labeltext: "Fare Factor", datafield: "farefactor", type: 'text', placeholder: 'Fare Factor', showDefaultSearch: false },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false },
            { labeltext: "Status", datafield: "active", type: 'select', options: optionsStatus, placeholder: 'Status', showDefaultSearch: true },
        ];
        const configurationTable = {
            url: api.url.accrualrulefare.list,
            criteria: { },
            sort: { startdate: 'desc' },
            columns: [
                { type: 'field', title: 'Fare Code', dataIndex: 'farecode', sorter: true },
                { type: 'field', title: 'Fare Name', dataIndex: 'farename', sorter: true },
                {
                    type: 'html', title: 'Fare Factor', dataIndex: 'farefactor', sorter: true, align: "center",
                    render: (value) => { return (value) ? value + "%" : '0%' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Status', dataIndex: 'active', sorter: true,
                    render: (value) => { return (value) ? 'Active' : 'Inactive' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/accrual-rule-fare-family/form/' + row.fareid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.fareid)} />
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
                        <Title level={3}>Manage Accrual Fare Family</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/accrual-rule-fare-family/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);