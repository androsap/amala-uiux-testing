import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, TableBase, SearchForm } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

const optionsRouteType = [
    { label: "Specific Route", value: "SPECIFICROUTE" },
    { label: "All Route", value: "ALLROUTE" }
];
const optionsCodeshareType = [
    { label: "Freeflow", value: "FREEFLOW" },
    { label: "Blockspace", value: "BLOCKSPACE" }
];
const optionsAccrualPricipal = [
    { label: "Marketing", value: "MARKETING" },
    { label: "Operating", value: "OPERATING" }
];
const configurationSearchForm = [
    { labeltext: "Codeshare ID", datafield: "codeshareid", type: 'text', placeholder: 'Codeshare ID', showDefaultSearch: true },
    { labeltext: "Marketing Airline", datafield: "marketingairline", type: 'text', placeholder: 'Marketing Airline', showDefaultSearch: true },
    { labeltext: "Marketing Flight Number", datafield: "marketingfltnum", type: 'text', placeholder: 'Marketing Flight Number', showDefaultSearch: false },
    { labeltext: "Operating Airline", datafield: "operatingairline", type: 'text', placeholder: 'Operating Airline', showDefaultSearch: true },
    { labeltext: "Operating Flight Number", datafield: "operatingfltnum", type: 'text', placeholder: 'Operating Flight Number', showDefaultSearch: false },
    { labeltext: "Type", datafield: "routetype", type: 'select', placeholder: 'Type', showDefaultSearch: true, options: optionsRouteType },
    { labeltext: "Origin", datafield: "origin", type: 'text', placeholder: 'Origin', showDefaultSearch: true },
    { labeltext: "Destination", datafield: "destination", type: 'text', placeholder: 'Destination', showDefaultSearch: true },
    { labeltext: "Codeshare Type", datafield: "codesharetype", type: 'select', placeholder: 'Codeshare Type', showDefaultSearch: false, options: optionsCodeshareType },
    { labeltext: "Accrual Principle", datafield: "accrualprinciple", type: 'select', placeholder: 'Accrual Principle', showDefaultSearch: false, options: optionsAccrualPricipal },
    { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: false },
    { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: false },
];

class App extends React.Component {
    componentDidMount() {
        document.title = "Manage Codeshare List | Loyalty Management System";
    }

    deleteData(codeshareid) {
        let url = api.url.codeshare.delete;
        let data = { codeshareid };
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

        const configurationTable = {
            url: api.url.codeshare.list,
            criteria: { active: true },
            columnClassName: 'nowrap',
            columns: [
                {
                    type: 'html', title: 'Codeshare ID', dataIndex: 'codeshareid', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Marketing Airline', dataIndex: 'marketingairline', sorter: true },
                {
                    type: 'html', title: 'Marketing Flight Number', dataIndex: 'marketingfltnum', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Operating Airline', dataIndex: 'operatingairline', sorter: true },
                {
                    type: 'html', title: 'Operating Flight Number', dataIndex: 'operatingfltnum', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Type', dataIndex: 'routetype', sorter: true },
                {
                    type: 'html', title: 'Origin', dataIndex: 'origin', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Destination', dataIndex: 'destination', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                { type: 'field', title: 'Codeshare Type', dataIndex: 'codesharetype', sorter: true },
                { type: 'field', title: 'Accrual Principal', dataIndex: 'accrualprinciple', sorter: true },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format("DD/MM/YYYY") : "-" }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/codeshare-list/form/' + row.codeshareid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.codeshareid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Codeshare List</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/codeshare-list/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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