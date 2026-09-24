import React from 'react';
import { Form, Table } from 'antd';
import { DeleteRequest } from '../../../../../utilities/RequestService';
import { Alert, Button } from '../../../../../components/Base/BaseComponent';
import { api } from '../../../../../config/Services';
import { connect } from 'react-redux';

const { Column } = Table;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            sorted: false,
            newDatasource: []
        }
    };

    onEdit = (e, buymileageid) => {
        e.preventDefault();
        this.props.handleEditPrice(buymileageid);
    };

    onDelete = (e, inventoryvariantid) => {
        e.preventDefault();
        let actionsmasterpage = this.props.actionspage;
        if (actionsmasterpage === 'create') {
            this.props.handleDelete(inventoryvariantid);
        } else if (actionsmasterpage === 'update' || actionsmasterpage === 'view') {
            let url = api.url.buymileagecatalogprice.delete;
            let data = { inventoryvariantid };
            var callback = (response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode === '0000') {
                    Alert.success((responsemessage) ? responsemessage : 'Selected data has been deleted');
                } else Alert.error(responsemessage);
                this.props.handleRefresh();
            };

            DeleteRequest(url, data, callback);
        }
    };

    handleChangeTable = (pagination, filters, sorter, extra) => {
        if (Object.keys(sorter).length !== 0) {
            this.setState({
                newDatasource: extra.currentDataSource.map(function (item) {
                    delete item.number;
                    return item;
                }), sorted: true
            });
        } else this.setState({ sorted: false });
    };

    render() {
        const { isLoading, sorted, newDatasource } = this.state;
        const actionsmasterpage = this.props.actionspage;
        let { datasource, menucode, prefixmenuname, categorycode } = this.props;
        let number = 0;

        datasource = (sorted) ? newDatasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) : datasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) })

        return (
            <React.Fragment>
                <Table rowKey={record => record.number} dataSource={datasource} pagination={false} loading={isLoading} scroll={{ y: 280 }} onChange={this.handleChangeTable}>
                    <Column title='No' dataIndex='number' key='number' width='10%' />
                    <Column title='Variant Name' dataIndex='inventoryvariantname' key='inventoryvariantname' render={(value) => (value) ? value : '-'} width='30%' sorter={(a, b) => ('' + a.inventoryvariantname).localeCompare(b.inventoryvariantname)} />
                    {(categorycode === 'CARD') ? <Column title='Tier' dataIndex='tierid' key='tierid' render={(value) => (value) ? value : '-'} width='20%' sorter={(a, b) => ('' + a.tierid).localeCompare(b.tierid)} /> : ''}
                    <Column title='Quantity' dataIndex='quantity' key='quantity' render={(value) => (value) ? Number(value) : 0} width='20%' sorter={(a, b) => a.quantity - b.quantity} />
                    <Column
                        title='Action'
                        key='action'
                        render={(value, row) => (
                            <span>
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType='button' size='small' type='primary' icon='edit' onClick={(e) => this.onEdit(e, row.inventoryvariantid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType='button' size='small' type='primary' icon='edit' onClick={(e) => this.onEdit(e, row.inventoryvariantid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE' /> : null
                                }
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType='button' size='small' type='danger' icon='delete' onClick={(e) => this.onDelete(e, row.inventoryvariantid)} /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType='button' size='small' type='danger' icon='delete' onClick={(e) => this.onDelete(e, row.inventoryvariantid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE' /> : null
                                }
                            </span>
                        )}
                        width='10%'
                    />
                </Table>
            </React.Fragment>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
