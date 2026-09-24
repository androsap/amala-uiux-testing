import React from 'react';
import { Form, Table, Modal } from 'antd';
import { Button } from '../../../../../components/Base/BaseComponent';
import { connect } from 'react-redux';
import { formatNumber } from '../../../../../utilities/Helpers';

const { confirm } = Modal;
const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    };

    onEdit = (e, feeid) => {
        e.preventDefault();
        this.props.handleEditFee(feeid);
    };

    onDelete = (e, feeid) => {
        e.preventDefault();

        const callback = () => { this.props.handleDeleteFee(feeid); }
        confirm({
            title: 'Are you sure delete this fee ?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 500);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    render() {
        let { datasource } = this.props;
        let { isLoading } = this.state;

        let number = 0;
        datasource = (datasource && datasource.length !== 0) ? datasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) : []

        return (
            <React.Fragment>
                <Table rowKey={record => record.number} dataSource={datasource} pagination={false} loading={isLoading} scroll={{ y: 280 }}>
                    <Column title='No' dataIndex='number' key='number' width='10%' />
                    <Column title='Payment Type' dataIndex='paymenttype' key='paymenttype' render={(value) => (value) ? value : '-'} />
                    <Column title='Currency Code' dataIndex='currencycode' key='currencycode' render={(value) => (value) ? value : '-'} />
                    <Column title='Cancel Fee' dataIndex='amount' key='amount' render={(value) => (value) ? formatNumber(value) : '-'} />
                    <Column
                        title='Action'
                        key='action'
                        render={(value, row) => (
                            <span>
                                <Button htmlType='button' size='small' type='primary' icon='edit' onClick={(e) => this.onEdit(e, row.feeid)} />
                                <Button htmlType='button' size='small' type='danger' icon='delete' onClick={(e) => this.onDelete(e, row.feeid)} />
                            </span>
                        )}
                    />
                </Table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
