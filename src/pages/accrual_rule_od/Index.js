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
        document.title = "Manage Accrual Origin Destination | Loyalty Management System";
    }

    deleteData(odruleid) {
        let url = api.url.accrualruleod.delete;
        let data = { odruleid };
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
        const configurationSearchForm = [
            { labeltext: "Rule Name", datafield: "odrulename", type: 'text', placeholder: 'Rule Name', showDefaultSearch: true },
            { labeltext: "Airline", datafield: "airlinecode", type: 'text', placeholder: 'Airline', showDefaultSearch: true },
            { labeltext: "Origin", datafield: "originairport", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
            { labeltext: "Destination", datafield: "destinationairport", type: 'text', placeholder: 'Destination', showDefaultSearch: true },
            { labeltext: "TPM", datafield: "tpm", type: 'text', placeholder: 'TPM', showDefaultSearch: false },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false }
        ];
        const configurationTable = {
            url: api.url.accrualruleod.list,
            criteria: { active: true },
            columns: [
                { type: 'field', title: 'Rule Name', dataIndex: 'odrulename', sorter: true },
                { type: 'field', title: 'Airline', dataIndex: 'airlinecode', sorter: true },
                { type: 'field', title: 'Origin', dataIndex: 'originairport', sorter: true },
                { type: 'field', title: 'Destination', dataIndex: 'destinationairport', sorter: true },
                { type: 'field', title: 'TPM', dataIndex: 'tpm', sorter: true },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action', width: '12%',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/accrual-rule-od/form/' + row.odruleid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.odruleid)} />
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
                        <Title level={3}>Manage Accrual Origin Destination</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/accrual-rule-od/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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