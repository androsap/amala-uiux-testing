import React from 'react';
import { Form, Table } from 'antd';
import { DeleteRequest } from '../../../utilities/RequestService';
import { Alert, Button } from '../../../components/Base/BaseComponent';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import moment from 'moment';

const { Column } = Table;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            sorted: false,
            newDatasource: []
        }
    }

    onEdit = (e, buymileageid) => {
        e.preventDefault();
        this.props.handleEditPrice(buymileageid);
    }

    onDelete = (e, buymileagepriceid) => {
        e.preventDefault();
        let actionsmasterpage = this.props.actionspage;
        if (actionsmasterpage === 'create') {
            this.props.handleDelete(buymileagepriceid);
        } else if (actionsmasterpage === 'update' || actionsmasterpage === 'view') {
            let url = api.url.buymileagecatalogprice.delete;
            let data = { buymileagepriceid };
            var callback = (response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
                this.props.handleRefresh();
            };

            DeleteRequest(url, data, callback);
        }
    }

    handleChangeTable = (pagination, filters, sorter, extra) => {
        if (Object.keys(sorter).length !== 0) {
            this.setState({
                newDatasource: extra.currentDataSource.map(function (item) {
                    delete item.number;
                    return item;
                }), sorted: true
            });
        } else this.setState({ sorted: false });
    }

    render() {
        let { datasource } = this.props;
        let { isLoading, newDatasource, sorted } = this.state;
        const { menucode, prefixmenuname, unittype } = this.props;
        const actionsmasterpage = this.props.actionspage;

        /* counter number table (No column) */
        let number = 0;
        if (actionsmasterpage === 'create') {
            if (sorted) {
                newDatasource = newDatasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
            } else datasource = datasource.sort((a, b) => new Date(b.startdate) - new Date(a.startdate)).map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
        } else {
            if (sorted) {
                newDatasource = newDatasource.filter(obj => obj.active === true).map((obj, key) => { return ({ number: number + (key + 1), ...obj }) })
            } else datasource = datasource.filter(obj => obj.active === true).sort((a, b) => new Date(b.startdate) - new Date(a.startdate)).map((obj, key) => { return ({ number: number + (key + 1), ...obj }) })
        }

        return (
            <React.Fragment>
                <Table rowKey={record => record.number} dataSource={sorted ? newDatasource : datasource} pagination={false} loading={isLoading} scroll={{ y: 280 }} onChange={this.handleChangeTable}>
                    <Column title="No" dataIndex="number" key="number" width="5%" />
                    <Column title="Payment Type" dataIndex="paymenttype" key="paymenttype" render={(value) => (value) ? value : '-'} width="12%" sorter={(a, b) => a.paymenttype.length - b.paymenttype.length} />
                    <Column title="Currency" dataIndex="currencycode" key="currencycode" render={(value) => (value) ? value : '-'} width="10%"
                        sorter={(a, b) => {
                            if (a && a.currencycode && a.currencycode.length && b && b.currencycode && b.currencycode.length) {
                                return a.currencycode.length - b.currencycode.length;
                            } else if (a && a.currencycode && a.currencycode.length) {
                                return -1;
                            } else if (b && b.currencycode && b.currencycode.length) {
                                return 1;
                            }
                            return 0;
                        }} />
                    {unittype === 'MANUAL' ? <Column title="Miles" dataIndex="miles" key="miles" render={(value) => (value) ? value : '-'} width="10%" sorter={(a, b) => a.miles - b.miles} /> : ''}
                    <Column title="Price" dataIndex="price" key="price" render={(value) => (value) ? value : '-'} width="10%" sorter={(a, b) => a.price - b.price} />
                    <Column title="Start Date" dataIndex="startdate" key="startdate" render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} width="10%" sorter={(a, b) => new Date(a.startdate) - new Date(b.startdate)} />
                    <Column title="End Date" dataIndex="enddate" key="enddate" render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} width="10%" sorter={(a, b) => new Date(a.enddate) - new Date(b.enddate)} />
                    <Column
                        title="Action"
                        key="action"
                        render={(value, row) => (
                            <span>
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType="button" size="small" type="primary" icon="edit" onClick={(e) => this.onEdit(e, row.buymileagepriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType="button" size="small" type="primary" icon="edit" onClick={(e) => this.onEdit(e, row.buymileagepriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> : null
                                }
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType="button" size="small" type="danger" icon="delete" onClick={(e) => this.onDelete(e, row.buymileagepriceid)} /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType="button" size="small" type="danger" icon="delete" onClick={(e) => this.onDelete(e, row.buymileagepriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" /> : null
                                }
                            </span>
                        )}
                        width="10%"
                    />
                </Table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));