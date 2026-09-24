/**
 * @author Andro Sultan
 * @email androsultan64@gmail.com
 * @create date 2020-09-22 14:50:00
 * @modify date 2020-09-22 14:50:00
 * @desc Member Buy Product Transaction List
 */

import React from 'react';
import { api } from '../../../config/Services';
import { Button, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Spin } from 'antd';
import { jsUcfirst, formatNumber, debounce } from '../../../utilities/Helpers';
import { ProductType, PaymentType, StatusBuyProduct } from '../../../data'

import moment from 'moment';

const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseMessage: '',
            showconfirmation: false,
            memberbuymileageid: null,
            buymileagedetail: {},
            showmemberbuylimit: false,
        }
    }

    componentDidMount() {
        document.title = 'Manage Tracking Order | Loyalty Management System';
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleModal = async (value) => {
        await this.setState({ showconfirmation: value });
        if (!value) await this.componentTable.getList();
    };

    handleOpenConfirmationModal = (ordercode, buyproductdetail) => {
        this.setState({
            ordercode,
            showconfirmation: true,
            buyproductdetail: {
                ...buyproductdetail,
                secondarymail: buyproductdetail.membersecondaryemail,
                mailingproduct: buyproductdetail.mailingproduct
            }
        });
    };

    render() {
        const { showconfirmation, ordercode, isLoading, buyproductdetail } = this.state;
        const primaryemail = (this.props.profile && this.props.profile.email) ? this.props.profile.email : null;

        const configurationSearchForm = [
            { labeltext: 'Product Type', datafield: 'producttype', type: 'select', placeholder: 'Product Type', options: ProductType, showDefaultSearch: true },
            { labeltext: 'Product Name', datafield: 'productname', type: 'text', placeholder: 'Product Name', showDefaultSearch: false },
            { labeltext: 'Variant', datafield: 'variant', type: 'text', placeholder: 'Variant', showDefaultSearch: false },
            { labeltext: 'Order Date', datafield: 'orderdate', type: 'datepicker', placeholder: 'Order Date', showDefaultSearch: true, specialSearchLike: true },
            { labeltext: 'Payment Type', datafield: 'paymenttype', type: 'select', placeholder: 'Payment Type', options: PaymentType, showDefaultSearch: true },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', options: StatusBuyProduct, showDefaultSearch: true },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Order Code', datafield: 'ordercode', type: 'text', placeholder: 'Order Code', showDefaultSearch: true },
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: false },
        ];
        const configurationTable = {
            url: api.url.memberbuyproduct.retrieve,
            sort: { orderdate: 'desc' },
            columns: [
                {
                    type: 'field', title: 'Order Code', dataIndex: 'ordercode', sorter: true,
                    render: (value, row, index) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'field', title: 'Order Date', dataIndex: 'orderdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Card Number', dataIndex: 'cardnumber', sorter: true,
                    render: (value, row, index) => { return (value) ? (value) : '-'
                    }
                },
                {
                    type: 'field', title: 'Member Name', dataIndex: 'membername', sorter: true,
                    render: (value, row, index) => { return (value) ? (value) : '-'
                    }
                },
                {
                    type: 'field', title: 'Product Type', dataIndex: 'mailingproduct.producttype', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, '_') : '-' }
                },
                {
                    type: 'field', title: 'Product Name', dataIndex: 'mailingproduct.mailingproductname', sorter: true,
                    render: (value, row, index) => {
                        const productName = `${row.mailingproduct.mailingproductname}`;
                        return (value) ? productName : '-'
                    }
                },
                {
                    type: 'field', title: 'Variant', dataIndex: 'inventoryvariant.inventoryvariantname', sorter: true,
                    render: (value, row, index) => { return (value) ? (value) : '-'
                    }
                },
                {
                    type: 'field', title: 'Qty', dataIndex: 'qty', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Payment Type', dataIndex: 'paymenttype', sorter: true,
                    render: (value, row, index) => {
                        const payment = (value) ? (row.paymenttype === 'MILEAGE') ? jsUcfirst(row.paymenttype) :
                            `${jsUcfirst(row.paymenttype)} ${(row.paymentmethod) ? `- ${jsUcfirst(row.paymentmethod)}` : ''}` : '-';

                        return payment;
                    }
                },
                {
                    type: 'field', title: 'Total Price', dataIndex: 'price', sorter: true,
                    render: (value, row, index) => {
                        const price = (row.currencycode) ? `${row.currencycode} ${formatNumber(row.totalprice)}` : `${formatNumber(row.totalprice)} Miles`;

                        return price;
                    }
                },
                {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: (value, row, index) => {
                        return (value) ? (value === 'DELIVERING') ? 'On Delivery' : (value === 'FAILED') ? 'Failed - Expired' : (value === 'SUCCESS') ? 'Delivered'  : (value === 'READYTOPACK') ? 'Ready to Pack' :
                            (value === 'READYTOPRINT') ? 'Ready to Print' : (value === 'READYTODELIVER') ? 'Ready to Pickup' : jsUcfirst(value, '_') : '-'
                    }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                <Button size='small' label='View Track' url={`${this.props.match.url}/details/${row.ordercode}`} />
                            </span>
                        )
                    }
                },
            ]
        };


        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={20}>
                        <Title level={4}>Manage Track Order List</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={isLoading}>
                    <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                    <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);