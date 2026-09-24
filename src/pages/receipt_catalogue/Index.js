import React from 'react';
import { DeleteRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button, SearchForm, TableBase } from '../../components/Base/BaseComponent';
import { jsUcfirst } from '../../utilities/Helpers';
import { Form, Divider, Row, Col, Typography, Icon } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const optionsType = [
    { value: 'BUY_CARD', label: 'BUY CARD' },
    { value: 'BUY_MILEAGE', label: 'BUY MILEAGE' },
    { value: 'TIER_MILES', label: 'TIER MILES' },
    { value: 'MILEAGE_EXPIRY', label: 'MILEAGE EXPIRY' }
]

class App extends React.Component {

    deleteData(receipttypeid) {
        let url = api.url.receiptcatalogue.delete;
        let data = { receipttypeid };
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

    componentDidMount() {
        document.title = "Manage Receipt Catalogue | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    }

    render() {
        const { menucode, prefixmenuname } = this.props;
        const configurationTable = {
            url: api.url.receiptcatalogue.list,
            columns: [
                {
                    type: 'html', title: 'Type', dataIndex: 'type', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, '_') : '-' }
                },
                { type: 'field', title: 'Name', dataIndex: 'receipttypename', sorter: true },
                { type: 'field', title: 'Currency', dataIndex: 'currencycode', sorter: true },
                { type: 'field', title: 'Amount', dataIndex: 'amount', sorter: true },
                { type: 'field', title: 'Duration', dataIndex: 'duration', sorter: true },
                {
                    type: 'html', title: 'Include VAT', dataIndex: 'includevat', sorter: true,
                    render: (value, row, index) => { return (value) ? <Icon type="check" /> : '-' }
                },
                {
                    type: 'html', title: 'Effective Date', dataIndex: 'effectivedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Discontinue Date', dataIndex: 'discontinuedate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button url={'/receipt-catalogue/form/' + row.receipttypeid} size="small" label="Edit" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" />
                                <Button htmlType="button" size="small" label="Delete" type="danger" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(row.receipttypeid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        const configurationSearchForm = [
            { labeltext: "Type", datafield: "type", type: 'select', placeholder: 'Type', showDefaultSearch: true, options: optionsType },
            { labeltext: "Name", datafield: "receipttypename", type: 'text', placeholder: 'Name', showDefaultSearch: true },
            { labeltext: "Currency Code", datafield: "currencycode", type: 'text', placeholder: 'Currency Code', showDefaultSearch: true },
            { labeltext: "Amount", datafield: "amount", type: 'text', placeholder: 'Amount', showDefaultSearch: false },
            { labeltext: "Duration", datafield: "duration", type: 'text', placeholder: 'Duration', showDefaultSearch: false },
            { labeltext: "Effective Date", datafield: "effectivedate", type: 'datepicker', placeholder: 'Effective Date', showDefaultSearch: true },
            { labeltext: "Discontinue Date", datafield: "discontinuedate", type: 'datepicker', placeholder: 'Discontinue Date', showDefaultSearch: true }
        ];
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Manage Receipt Catalogue</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                        <Button type="primary" url={'/receipt-catalogue/form/'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
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