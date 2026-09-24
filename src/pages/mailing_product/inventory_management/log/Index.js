import React from 'react';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Alert, SearchForm, TableBase } from '../../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { TrxType } from '../../../../data';
import { jsUcfirst } from '../../../../utilities/Helpers';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            totalqty: 0,
            totalin: 0,
            totalout: 0
        }
    };

    componentDidMount() {
        document.title = 'Inventory Log | Loyalty Management System';
        this.getCount();
    };

    getCount = (criteriadata) => {
        this.setState({ isLoading: true });
        const { inventoryvariantname, trxtype, date, ordercode } = criteriadata || {};

        let url = api.url.inventorysys.countstock;
        let inventorycode = this.props.state.fieldvalue.data.inventorycode;
        let data = {
            date, inventorycode, inventoryvariantname,
            ordercode: (ordercode) ? ordercode.split('%')[1] : null,
            trxtype: (trxtype) ? [trxtype] : ['IN', 'OUT']
        };

        DetailRequest(url, data).then((response) => {
            const { status = {}, result } = response || {};
            const { totalqty, totalin, totalout } = result || {};
            if (status.responsecode === '0000') {
                this.setState({ totalqty, totalin, totalout });
            } else Alert.error(status.responsemessage);
            this.setState({ isLoading: false });
        });
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
        this.getCount(criteria);
    };

    render() {
        const { state } = this.props;
        const { fieldvalue } = state || {};
        const { inventoryname } = (fieldvalue) ? fieldvalue.data : {};
        const titlename = (inventoryname) ? `Stock Log ${jsUcfirst(inventoryname, ' ')}` : `Stock Log`;

        const configurationSearchForm = [
            { labeltext: 'Variant', datafield: 'inventoryvariantname', type: 'text', placeholder: 'Variant', showDefaultSearch: true },
            { labeltext: 'Transaction Type', datafield: 'trxtype', type: 'select', placeholder: 'Transaction Type', showDefaultSearch: true, options: TrxType },
            { labeltext: 'Order Code', datafield: 'ordercode', type: 'text', placeholder: 'Order Code', showDefaultSearch: false },
            { labeltext: 'Date From', datafield: 'datefrom', type: 'datepicker', placeholder: 'Date From', showDefaultSearch: true, specialSearch: true },
            { labeltext: 'Date To', datafield: 'dateto', type: 'datepicker', placeholder: 'Date To', showDefaultSearch: true, specialSearch: true },
        ];
        const configurationTable = {
            url: api.url.inventorysys.log,
            sort: { date: 'desc', createdDate: 'desc' },
            criteria: { inventorycode: state.fieldvalue.data.inventorycode },
            columns: [
                {
                    type: 'html', title: 'Variant', dataIndex: 'inventoryvariantname', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Transaction Type', dataIndex: 'trxtype', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Quantity', dataIndex: 'quantity',
                    render: (val, row) => {
                        return val ? (row.trxtype === 'IN') ? val : `-${val}` : '-'
                    }
                },
                {
                    type: 'html', title: 'Order Code', dataIndex: 'ordercode',
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'field', title: 'Date', dataIndex: 'date', sorter: true,
                    render: (val) => { return val ? moment(val).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Notes', dataIndex: 'notes',
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy',
                    render: (val) => { return val ? val : '-' }
                },
            ]
        }

        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>{titlename}</Title>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <Row type='flex' justify='center' style={{ marginBottom: 20 }}>
                    <Col xs={24} md={8}><strong>Stock Quantity </strong> : {this.state.totalqty}</Col>
                    <Col xs={24} md={8}><strong>Total IN </strong> : {this.state.totalin}</Col>
                    <Col xs={24} md={8}><strong>Total OUT </strong> : {(this.state.totalout) ? `-${this.state.totalout}` : '0'}</Col>
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    };
}

export default Form.create()(App);
