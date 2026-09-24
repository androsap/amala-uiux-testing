/**
 * @author Muhamad Humam
 * @email muhamadhumamm17@gmail.com
 * @create date 2020-07-26 03:38:40
 * @modify date 2020-07-29 14:55:48
 * @desc Buy Mileage Promo Price Master
 */

import React from 'react';
import { Form, Table, Button as AntButton } from 'antd';
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
            isLoading: false
        }

        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    onEdit = (e, promopriceid) => {
        e.preventDefault();

        this.props.handleEditPrice(promopriceid);
    }

    onDelete = (e, promopriceid) => {
        e.preventDefault();
        const actionsmasterpage = this.props.actionspage;
        if (actionsmasterpage === 'create') {
            this.props.handleDeletePrice(promopriceid);
        } else if (actionsmasterpage === 'update' || actionsmasterpage === 'view') {
            let url = api.url.buymileagepromoprice.delete;
            let data = { promopriceid };
            var callback = (response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
                this.props.handleRefreshData();
            };

            DeleteRequest(url, data, callback);
        }
    }

    render() {
        let { datasource, promotype } = this.props;
        const { menucode, prefixmenuname } = this.props;
        const { isLoading } = this.state;
        const actionsmasterpage = this.props.actionspage;

        /* counter number table (No column) */
        let number = 0;
        datasource = datasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

        return (
            <React.Fragment>
                <Table rowKey={record => record.number} dataSource={(promotype === 'FIXED') ? datasource : []} pagination={false} loading={isLoading} scroll={{ y: 280 }}>
                    <Column title="No" dataIndex="number" key="number" width="5%" />
                    <Column title="Currency" dataIndex="currencycode" key="currencycode" render={(value, row) => (value) ? value : '-'} width="10%" />
                    <Column title="Amount" dataIndex="price" key="price" render={(value, row) => (value !== undefined && value !== null) ? value : '-'} width="10%" />
                    <Column title="Start Date" dataIndex="startdate" key="startdate" render={(value, row) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} width="10%" />
                    <Column title="End Date" dataIndex="enddate" key="enddate" render={(value, row) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} width="10%" />
                    <Column
                        title="Action"
                        key="action"
                        render={(value, row) => (
                            <span>
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType="button" size="small" type="primary" icon="edit" onClick={(e) => this.onEdit(e, row.promopriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType="button" size="small" type="primary" icon="edit" onClick={(e) => this.onEdit(e, row.promopriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> : null
                                }
                                {
                                    (actionsmasterpage === 'create') ?
                                        <AntButton type="danger" size="small" icon="delete" onClick={(e) => this.onDelete(e, row.promopriceid)} /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType="button" size="small" type="danger" icon="delete" onClick={(e) => this.onDelete(e, row.promopriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" /> : null
                                }
                                {/* <AntButton type="primary" size="small" icon="edit" onClick={(e) => this.onEdit(e, row.promopriceid)} /> */}
                                {/* <Button htmlType="button" size="small" type="primary" icon="edit" onClick={(e) => this.onEdit(e, row.promopriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE" /> */}
                                {/* <Button htmlType="button" size="small" type="primary" icon="delete" onClick={(e) => this.onDelete(e, row.promopriceid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" /> */}
                                {/* <AntButton type="danger" size="small" icon="delete" onClick={(e) => this.onDelete(e, row.promopriceid)} /> */}
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