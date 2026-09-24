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
import { Form, Divider, Row, Col, Typography, Modal, Spin } from 'antd';
import { jsUcfirst, formatNumber } from '../../../utilities/Helpers';
import { ProductType, PaymentType, StatusBuyProduct, PaymentMethodOrder } from '../../../data'

import moment from 'moment';
import ConfirmationForm from './Confirmation';

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
        document.title = 'Member Buy Product | Loyalty Management System';
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
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
        const { menucode, prefixmenuname } = this.props;
        const { showconfirmation, ordercode, isLoading, buyproductdetail } = this.state;
        const memberid = this.props.match.params.ID;
        const primaryemail = (this.props.profile && this.props.profile.email) ? this.props.profile.email : null;

        const startorderdate = this.props.form.getFieldValue('startorderdate');
        const startcanceldate = this.props.form.getFieldValue('startcanceldate');

        const configurationSearchForm = [
            { labeltext: 'Product Type', datafield: 'producttype', type: 'select', placeholder: 'Product Type', options: ProductType, showDefaultSearch: true },
            { labeltext: 'Product', datafield: 'product', type: 'text', placeholder: 'Product', showDefaultSearch: true },
            { labeltext: 'Variant Name', datafield: 'variant', type: 'text', placeholder: 'Variant Name', showDefaultSearch: false },
            { labeltext: 'Payment Type', datafield: 'paymenttype', type: 'select', placeholder: 'Payment Type', options: PaymentType, showDefaultSearch: true },
            { labeltext: 'Payment Method', datafield: 'paymentmethod', type: 'select', placeholder: 'Payment Method', options: PaymentMethodOrder, showDefaultSearch: false },
            { labeltext: 'Status', datafield: 'status', type: 'select', placeholder: 'Status', options: StatusBuyProduct, showDefaultSearch: true },
            { labeltext: 'Start Order Date', datafield: 'startorderdate', type: 'datepicker', placeholder: 'Start Order Date', showDefaultSearch: false, specialSearch: true, },
            {
                labeltext: 'End Order Date', datafield: 'endorderdate', type: 'datepicker', placeholder: 'End Order Date', showDefaultSearch: false,
                specialSearch: true, minDate: moment(startorderdate), disabled: (startorderdate) ? false : true, validationrules: (startorderdate) ? ['required'] : [],
            },
            { labeltext: 'Start Cancel Date', datafield: 'startcanceldate', type: 'datepicker', placeholder: 'Start Cancel Date', showDefaultSearch: false, specialSearch: true },
            {
                labeltext: 'End Cancel Date', datafield: 'endcanceldate', type: 'datepicker', placeholder: 'End Cancel Date', showDefaultSearch: false,
                specialSearch: true, minDate: moment(startcanceldate), disabled: (startcanceldate) ? false : true, validationrules: (startcanceldate) ? ['required'] : [],
            },
        ];
        const configurationTable = {
            url: api.url.memberbuyproduct.retrieve,
            criteria: { memberid },
            sort: { orderdate: 'desc' },
            columnClassName: 'nowrap',
            columns: [
                {
                    type: 'field', title: 'Order Code', dataIndex: 'ordercode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Order Date', dataIndex: 'orderdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'Product Type', dataIndex: 'mailingproduct.producttype', sorter: true,
                    render: (value, row, index) => { return (value) ? jsUcfirst(value, '_') : '-' }
                },
                {
                    type: 'field', title: 'Product', dataIndex: 'mailingproduct', sorter: true,
                    render: (value, row, index) => { return (value && row.mailingproduct.mailingproductname) ? row.mailingproduct.mailingproductname : '-' }
                },
                {
                    type: 'field', title: 'Varian', dataIndex: 'mailingproduct', sorter: true,
                    render: (value, row, index) => { return (value && row.inventoryvariant.inventoryvariantname) ? row.inventoryvariant.inventoryvariantname : '-' }
                },
                {
                    type: 'field', title: 'Qty', dataIndex: 'qty', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Payment Type', dataIndex: 'paymenttype', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Payment Method', dataIndex: 'paymentmethod', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
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
                        return (value) ? (value === 'FAILED') ? 'Failed - Expired' : (value === 'DELIVERING') ? 'On Delivery' : (value === 'SUCCESS') ? 'Delivered' : (value === 'READYTOPACK') ? 'Ready to Pack' :
                            (value === 'READYTOPRINT') ? 'Ready to Print' : (value === 'READYTODELIVER') ? 'Ready to Pickup' : jsUcfirst(value, '_') : '-'
                    }
                },
                {
                    type: 'field', title: 'Created By', dataIndex: 'createdBy', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cancelled By', dataIndex: 'cancelledby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Cancelled Date', dataIndex: 'cancelleddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        return (
                            <span>
                                {
                                    (row.status === 'WAITING_FOR_PAYMENT') ?
                                        <Button size='small' type='primary' title='Confirm' htmlType='button' icon='check' onClick={() => this.handleOpenConfirmationModal(row.ordercode, row)} /> : null
                                }
                                <Button size='small' title='View' icon='eye' url={`${this.props.match.url}/form/${row.ordercode}`} />
                                <Button size='small' title='Cancel' type='danger' icon='close-circle' url={`${this.props.match.url}/form/${row.ordercode}/cancel`} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CANCEL' />
                            </span>
                        )
                    }
                },
            ]
        };


        return (
            <React.Fragment>
                <Modal visible={showconfirmation} title='Confirmation' loading={isLoading} onCancel={() => this.handleModal(false)} footer={null} destroyOnClose={true} width={700}>
                    <ConfirmationForm {...this.props} memberid={memberid} ordercode={ordercode} primaryemail={primaryemail} buyproductdetail={buyproductdetail} actionsconfirmationpage='confirmation' onClose={() => this.handleModal(false)} />
                </Modal>
                <Row>
                    <Col xs={24} sm={20} md={22}>
                        <Title level={4}>Member Buy Product</Title>
                    </Col>
                    <Col xs={24} sm={4} md={2}>
                        <Button type='primary' url={this.props.match.url + '/form'} size='default' label='Buy' />
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