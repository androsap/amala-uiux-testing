import React from 'react';
import { Form, Table } from 'antd';
import { Button } from '../../../../../components/Base/BaseComponent';
import { connect } from 'react-redux';
import moment from 'moment';

const { Column } = Table;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    };

    onEdit = (e, regcode) => {
        e.preventDefault();
        this.props.handleEditRegis(regcode);
    };

    onDelete = (e, regcode) => {
        e.preventDefault();
        this.props.handleDeleteRegis(regcode);
    };

    render() {
        const { isLoading } = this.state;

        let number = 0;
        let datasource = (this.props.datasource) ? this.props.datasource.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) : []

        return (
            <React.Fragment>
                <Table rowKey={record => record.number} dataSource={datasource} pagination={false} loading={isLoading} scroll={{ y: 280 }}>
                    <Column title='No' dataIndex='number' key='number' width='5%' />
                    <Column title='Registration Code' dataIndex='registrationcode' key='registrationcode' render={(value) => (value) ? value : '-'} />
                    <Column title='Start Date' dataIndex='startdate' key='startdate' render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} />
                    <Column title='End Date' dataIndex='enddate' key='enddate' render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} />
                    <Column title='Created By' dataIndex='createdBy' key='createdBy' render={(value) => (value) ? value : '-'} />
                    <Column
                        title='Action'
                        key='action'
                        render={(value, row) => (
                            <span>
                                <Button htmlType='button' size='small' type='primary' icon='edit' onClick={(e) => this.onEdit(e, row.registrationcode)} />
                                <Button htmlType='button' size='small' type='danger' icon='delete' onClick={(e) => this.onDelete(e, row.registrationcode)} />
                            </span>
                        )}
                    />
                </Table>
            </React.Fragment>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
