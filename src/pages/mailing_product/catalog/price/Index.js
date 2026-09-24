import React from 'react';
import { Modal } from 'antd';
import { DeleteRequest } from '../../../../utilities/RequestService';
import { Alert, Button, SearchForm, TableBase, CurrencySelect } from '../../../../components/Base/BaseComponent';
import { api } from '../../../../config/Services';
import { formatNumber, jsUcfirst } from '../../../../utilities/Helpers';
import { PaymentType } from '../../../../data';
import moment from 'moment';

import PriceForm from './Form';
class Price extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sorted: false,
            prices: [],
            isLoading: false,
            visible: {
                showpriceform: false
            }
        }
    };

    componentDidMount() {
        document.title = `Price Mailing Product | Loyalty Management System`;
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    handleEdit = (e, mailingproductpriceid, prices) => {
        e.preventDefault();
        this.setState({ mailingproductpriceid, prices });
        this.handleVisible(true, 'showpriceform');
    };

    handleDelete = (e, mailingproductpriceid) => {
        e.preventDefault();
        let url = api.url.mailingproduct.price.delete;
        var callback = (response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                Alert.success(status.responsemessage);
                this.handleRefreshTable();
            } else Alert.error(status.responsemessage);

        };

        DeleteRequest(url, { mailingproductpriceid }, callback);
    };

    handleRefreshTable = () => {
        setTimeout(() => { this.componentTable.getList(); }, 100);
    };

    handleVisible = (value, type) => {
        this.setState({ visible: { [type]: value } });
    };

    render() {
        const { menucode, prefixmenuname, variants, period } = this.props;
        const { visible, mailingproductpriceid, actionspage, prices } = this.state;
        const { showpriceform } = visible;
        const mailingproductcode = this.props.match.params.ID;

        const configurationSearchForm = [
            { labeltext: 'Variant Name', datafield: 'inventoryvariantname', type: 'text', placeholder: 'Variant Name', showDefaultSearch: true },
            { labeltext: 'Payment Type', datafield: 'paymenttype', type: 'select', placeholder: 'Payment Type', showDefaultSearch: true, options: PaymentType },
            { labeltext: 'Currency Type', datafield: 'currencycode', type: 'component', placeholder: 'Currency Type', showDefaultSearch: true, component: CurrencySelect },
            { labeltext: 'Date', datafield: 'date', type: 'datepicker', placeholder: 'Date', showDefaultSearch: true, specialSearch: true, specialSearch: true },
        ];

        const configurationTable = {
            url: api.url.mailingproduct.price.retrieve,
            criteria: { mailingproductcode },
            sort: { createdDate: 'desc' },
            columnClassName: 'nowrap',
            columns: [
                {
                    type: 'field', title: 'Variant Name', dataIndex: 'inventoryvariantname', sorter: true,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'field', title: 'Payment Type', dataIndex: 'paymenttype', sorter: true,
                    render: (value) => { return (value) ? jsUcfirst(value) : '-' }
                },
                {
                    type: 'field', title: 'Currency Type', dataIndex: 'currencycode', sorter: true,
                    render: (value, row) => { return (value) ? value : '-' }
                },
                {
                    type: 'field', title: 'Price', dataIndex: 'price', sorter: true,
                    render: (value, row) => { return (value) ? formatNumber(value) : '-' }
                },
                {
                    type: 'field', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'field', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        const { mailingproductpriceid, active } = row;
                        const { menucode, prefixmenuname } = this.props;

                        return (
                            <span>
                                <Button htmlType='button' size='small' icon='edit' title='Edit' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={(e) => this.handleEdit(e, mailingproductpriceid, row)} />
                                <Button htmlType='button' size='small' icon='delete' type='danger' title='Delete' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' onClick={(e) => this.handleDelete(e, mailingproductpriceid)} />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>

                <Modal visible={showpriceform} title={'Edit Price'} onCancel={(e) => this.handleVisible(false, 'showpriceform')} footer={null} destroyOnClose={true} width={680}>
                    <PriceForm menucode={menucode} prefixmenuname={prefixmenuname} mailingproductpriceid={mailingproductpriceid} actionspage={actionspage} handleClose={(e) => this.handleVisible(false, 'showpriceform')} variants={variants}
                        mailingproductcode={this.props.match.params.ID} handleSavePrice={(e) => this.handleVisible(false, 'showpriceform')} handleRefreshTable={this.handleRefreshTable} period={period} prices={prices} /> :
                </Modal>

                <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Price;
