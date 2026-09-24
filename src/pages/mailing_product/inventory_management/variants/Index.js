import React from 'react';
import { Form, Row, Col, Typography, Divider, Modal, Spin } from 'antd';
import { DeleteRequest } from '../../../../utilities/RequestService';
import { Alert, Button, SearchForm, TierSelect, TableBase } from '../../../../components/Base/BaseComponent';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import { jsUcfirst } from '../../../../utilities/Helpers';

import VariantForm from '../basic_info/variant/Form';

const { Title } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            inventoryvariantid: null,
            newDatasource: [],
            sorted: false,
            fieldvalue: {
                titleformpage: 'Create',
                visible: false,
                changetypeqty: null
            }
        }
    };

    onEdit = (e, inventoryvariantid, changetypeqty) => {
        e.preventDefault();
        this.setState({ inventoryvariantid, fieldvalue: { ...this.state.fieldvalue, visible: true, changetypeqty } })
    };

    onDelete = (e, inventoryvariantid) => {
        e.preventDefault();

        let url = api.url.buymileagecatalogprice.delete;
        let data = { inventoryvariantid };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else Alert.error(responsemessage);

            this.props.handleRefresh();
        };

        DeleteRequest(url, data, callback);
    };

    handleSearchForm = (criteria, criteriadata) => {
        this.componentTable.handleSearchForm(criteria, criteriadata);
    };

    handleChange = (value, type) => {
        if (value && type === 'visible') {
            this.setState({ inventoryvariantid: null, fieldvalue: { ...this.state.fieldvalue, [type]: value } })
        } else this.setState({ fieldvalue: { ...this.state.fieldvalue, [type]: value, changetypeqty: null } })
    };

    handleRefresh = async () => {
        this.setState({ isLoading: true })
        await this.componentTable.getList();
        await this.props.handleRefresh(this.props.state.fieldvalue.data.inventorycode);
        setTimeout(() => { this.setState({ isLoading: false }), 1000 });
    };

    render() {
        const { state, menucode, prefixmenuname } = this.props;
        const { actionspage, fieldvalue } = state || {};
        const { variants, categorycode, inventorycode, inventoryname } = (fieldvalue) ? fieldvalue.data : {};
        const { isLoading, inventoryvariantid } = this.state;
        const titlename = (inventoryname) ? `Manage Variant ${jsUcfirst(inventoryname, ' ')}` : `Manage Variant`;

        let configurationSearchForm = [
            { labeltext: 'Variant Name', datafield: 'inventoryvariantname', type: 'text', placeholder: 'Variant Name', showDefaultSearch: true },
            { labeltext: 'Tier', datafield: 'tierid', type: 'component', placeholder: 'Tier', showDefaultSearch: true, component: TierSelect },
        ];

        const configurationTable = {
            url: api.url.inventorysys.listvariant,
            sort: { createdDate: 'desc' },
            criteria: { inventorycode },
            columns: [
                {
                    type: 'html', title: 'Variant Name', dataIndex: 'inventoryvariantname', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Tier', dataIndex: 'tierid', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Quantity', dataIndex: 'quantity', sorter: true,
                    render: (val) => { return val ? val : '-' }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (val, row) => {
                        return (
                            <span>
                                <Button htmlType='button' size='small' type='primary' label='+ Add' title='Add Quantity' ghost={true} onClick={(e) => this.onEdit(e, row.inventoryvariantid, 'ADD_QTY')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                <Button htmlType='button' size='small' type='danger' label='- Subtract' title='Subtract Quantity' ghost={true} onClick={(e) => this.onEdit(e, row.inventoryvariantid, 'SUB_QTY')} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                                <Button htmlType='button' size='small' type='primary' label='Edit' onClick={(e) => this.onEdit(e, row.inventoryvariantid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' />
                            </span>
                        )
                    }
                },
            ]
        }

        return (
            <React.Fragment>
                <Spin spinning={isLoading}>
                    <Row>
                        <Row>
                            <Col xs={24} xl={22}>
                                <Title level={3}>{titlename}</Title>
                            </Col>
                            <Col xs={24} xl={2}>
                                <Button htmlType='button' type='primary' size='default' label='Add New' menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' onClick={(val) => this.handleChange(true, 'visible')} />
                            </Col>
                            <Divider />
                        </Row>

                        <Modal title={this.state.fieldvalue.titleformpage + ' Variant'} visible={this.state.fieldvalue.visible} onCancel={(val) => this.handleChange(false, 'visible')} footer={null} destroyOnClose={true} width={680}>
                            <VariantForm menucode={menucode} prefixmenuname={prefixmenuname} inventorycode={inventorycode} inventoryvariantid={inventoryvariantid} datasource={variants} actionspage={actionspage} categorycode={categorycode}
                                handleClose={(val) => this.handleChange(false, 'visible')} setTitlePage={this.handleChange} handleRefresh={this.handleRefresh} changetypeqty={this.state.fieldvalue.changetypeqty} />
                        </Modal>

                        <SearchForm form={this.props.form} showAdvanceSearch={false} optionsConfiguration={(categorycode === 'CARD') ? configurationSearchForm : configurationSearchForm.slice(0, 1)} onSubmit={this.handleSearchForm} />
                        <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
                    </Row>
                </Spin>
            </React.Fragment>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
