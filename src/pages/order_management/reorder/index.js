import React from 'react';
import { api } from '../../../config/Services';
import { connect } from 'react-redux';
import { Button, SearchForm, TableBase, ProductNameSelect } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography } from 'antd';
import { ProductType } from '../../../data';
import moment from 'moment';
import { jsUcfirst } from '../../../utilities/Helpers';

const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            visible: false,
            visible2: false,
            expanded: false,
            active: true,
            reorderid: [],
            selectedRows: [],
            selectedRowKeys: [],
            placement: 'bottom',
        }
    }
    componentDidMount() {
        document.title = 'Manage Reorder | Loyalty Management System';
    }

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    }

    handleResetDate = () => {
        this.props.form.resetFields(['orderdateend', []]);
        this.props.form.resetFields(['reorderdateend', []]);
    }

    /* handle Product Type change */
    handleProduct = async (mailingproducttype) => {
        if (mailingproducttype) {
            await this.componentSearchForm.component.mailingproductcode.retrieveData2({ producttype: mailingproducttype });
        }
        this.props.form.resetFields(['mailingproductcode', []]);
    }

    render() {
        const orderdatestart = this.props.form.getFieldValue('orderdatestart');
        const reorderdatestart = this.props.form.getFieldValue('reorderdatestart');
        const mailingproducttype = this.props.form.getFieldValue('mailingproducttype');

        const configurationSearchForm = [
            { labeltext: 'Start Order Date', datafield: 'orderdatestart', type: 'datepicker', placeholder: 'Start Order Date', showDefaultSearch: true, onChange: (e) => this.handleResetDate(e) },
            {
                labeltext: 'End Order Date', datafield: 'orderdateend', type: 'datepicker', placeholder: 'End Order Date', showDefaultSearch: true,
                minDate: moment(orderdatestart).add(0, 'days'), disabled: (orderdatestart) ? false : true
            },
            { labeltext: 'Start Reorder Date', datafield: 'reorderdatestart', type: 'datepicker', placeholder: 'Start Reorder Date', showDefaultSearch: true, onChange: (e) => this.handleResetDate(e) },
            {
                labeltext: 'End Reorder Date', datafield: 'reorderdateend', type: 'datepicker', placeholder: 'End Reorder Date', showDefaultSearch: true,
                minDate: moment(reorderdatestart).add(0, 'days'), disabled: (reorderdatestart) ? false : true
            },
            { labeltext: 'Member Name', datafield: 'membername', type: 'text', placeholder: 'Member Name', showDefaultSearch: true },
            { labeltext: 'Order Code', datafield: 'ordercode', type: 'text', placeholder: 'Order Code', showDefaultSearch: true },
            { labeltext: 'Card Number', datafield: 'cardnumber', type: 'text', placeholder: 'Card Number', showDefaultSearch: false },
            { labeltext: 'Product Type', datafield: 'mailingproducttype', type: 'select', placeholder: 'Product Type', options: ProductType, onChange: (e) => this.handleProduct(e), showDefaultSearch: false },
            { labeltext: 'Product Name', datafield: 'mailingproductcode', type: 'component', placeholder: 'Product Name', component: ProductNameSelect, showDefaultSearch: false, disabled: mailingproducttype ? false : true },
            { labeltext: 'Reorder Number', datafield: 'reordernumber', type: 'text', placeholder: 'Reorder Number', showDefaultSearch: false },
        ];

        const configurationTable = {
            url: api.url.reorder.list,
            sort: { reorderdate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Order Code', dataIndex: 'ordercode', sorter: true, 
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Order Date', dataIndex: 'orderdate', sorter: true, 
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Reorder Date', dataIndex: 'reorderdate', sorter: true, 
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Card Number', dataIndex: 'cardnumber', sorter: true, 
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Member Name', dataIndex: 'membername', sorter: true, 
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Type', dataIndex: 'mailingproducttype', sorter: true, 
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Product Name', dataIndex: 'mailingproductname', sorter: true, 
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'field', title: 'Reorder To', dataIndex: 'reorderto', sorter: true, 
                    render: (value) => { return (value) ? (value === 'DELIVERING') ? 'READY TO PICK-UP' : (value === 'PACKING') ? 'READY TO PACK' : 'READY TO PRINT' : '-' }
                },
                {
                    type: 'html', title: 'Reorder Number', dataIndex: 'reordernumber', sorter: true, align: 'center', 
                    render: (value) => { return (value) ? (value) : '0' }
                },
                {
                    type: 'html', title: 'Created By', dataIndex: 'createdBy', sorter: false,
                    render: (value) => { return (value) ? (value) : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row) => {
                        return (
                            <span>
                                <Button url={'/order-management/reorder/Details/' + encodeURIComponent(row.reorderid)} size="small" title="Details" icon="eye" actioncode="UPDATE" />
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
                        <Title level={3}>Manage Reorder List</Title>
                    </Col>
                    <Col xs={24} xl={2}>
                    </Col>
                    <Divider />
                </Row>
                <SearchForm ref={(e) => { this.componentSearchForm = e }} form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
