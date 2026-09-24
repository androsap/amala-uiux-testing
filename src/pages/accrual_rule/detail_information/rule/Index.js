import React from 'react';
import { Form, Table } from 'antd';
import { DeleteRequest } from '../../../../utilities/RequestService';
import { Alert, Button } from '../../../../components/Base/BaseComponent';
import { api } from '../../../../config/Services';
import { connect } from 'react-redux';
import moment from 'moment';

const { Column } = Table;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    onEdit = (e, prruledetailid) => {
        this.props.handleEditPrice(true, prruledetailid);
    }

    onDelete = (e, prruledetailid) => {
        e.preventDefault();
        let actionsmasterpage = this.props.actionspage;
        if (actionsmasterpage === 'create') {
            this.props.handleDelete(prruledetailid);
        } else if (actionsmasterpage === 'update' || actionsmasterpage === 'view') {
            let url = api.url.revenuebased.deleterule;
            let data = { prruledetailid };
            var callback = (response) => {
                const { status = {} } = response || {};
                if (status.responsecode === '0000') {
                    Alert.success(status.responsemessage);
                } else {
                    Alert.error(status.responsemessage);
                }
                this.props.handleRefresh(this.props.datasource[0].prruleid);
            };

            DeleteRequest(url, data, callback);
        }
    }

    render() {
        let { datasource, menucode, prefixmenuname, active } = this.props;
        const { isLoading } = this.state;
        const actionsmasterpage = this.props.actionspage;

        let number = 0;
        if (actionsmasterpage === 'create') { datasource = datasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) }
        else { datasource = datasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) }

        return (
            <React.Fragment>
                <Table rowKey={record => record.number} dataSource={datasource} pagination={false} loading={isLoading} scroll={{ y: 280 }}>
                    <Column title='No' dataIndex='number' key='number' width='5%' />
                    <Column title='TPM/Revenue' dataIndex='accrualbased' key='accrualbased' render={(value) => (value) ? value : '-'} width='10%' />
                    <Column title='Start Period' dataIndex='startdate' key='startdate' render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} width='10%' />
                    <Column title='End Period' dataIndex='enddate' key='enddate' render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} width='10%' />
                    <Column title='Status' dataIndex='active' key='active' render={(value) => (value) ? 'ACTIVE' : 'NOT ACTIVE'} width='10%' />
                    <Column
                        title='Action'
                        key='action'
                        render={(value, row) => (
                            <span>
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType='button' size='small' type='primary' icon='edit' onClick={(e) => this.onEdit(e, row.prruledetailid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='CREATE' /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType='button' size='small' type='primary' icon='edit' onClick={(e) => this.onEdit(e, row.prruledetailid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='UPDATE'
                                                disabled={actionsmasterpage === 'view' || !active ? true : false} /> : null
                                }
                                {
                                    (actionsmasterpage === 'create') ?
                                        <Button htmlType='button' size='small' type='danger' icon='delete' onClick={(e) => this.onDelete(e, row.prruledetailid)} /> :
                                        (actionsmasterpage === 'update' || actionsmasterpage === 'view') ?
                                            <Button htmlType='button' size='small' type='danger' icon='delete' onClick={(e) => this.onDelete(e, row.prruledetailid)} menucode={menucode} prefixmenuname={prefixmenuname} actioncode='DELETE'
                                                disabled={actionsmasterpage === 'view' || !active  ? true : false} /> : null
                                }
                            </span>
                        )}
                        width='10%'
                    />
                </Table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
