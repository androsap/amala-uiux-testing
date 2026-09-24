import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest } from '../../../utilities/RequestService';
import { Form, Table } from 'antd';
import moment from 'moment';

const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: []
        }
    }
    componentDidMount() {
        const memberid = this.props.match.params.ID;
        this.getList(memberid);
        document.title = "Subscription History | Loyalty Management System";
    }

    handleSearchForm = (criteria) => {
        criteria.enrollmentdate = (criteria.enrollmentdate) ? "%" + moment(criteria.enrollmentdate).format("YYYY-MM-DD") + "%" : null;
        criteria.subscription = (criteria.subscription) ? criteria.subscription.split(" ").join("_").toUpperCase() : null;
        this.componentTable.handleSearchForm(criteria);
    }

    getList(memberid, cardnumber, email) {
        let url = api.url.member.profile;
        let data = { memberid, cardnumber, email, type: 'ALL' };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let dataList = result.subscriptionHistories;
                this.setState({ dataList, isLoading: false });
            } else {
                this.setState({
                    formrender: false,
                    isLoading: false
                });
            }
        });
    }

    render() {
        const { dataList, isLoading } = this.state;
        
        return (
            <React.Fragment>
                <div style={{ background: '#ffffff', overflow: 'auto', height: '380px', width: '1140px', paddingRight: '5px' }} >
                    <Table rowKey={record => record.number} dataSource={dataList} size="middle" pagination={true} loading={isLoading} >
                        <Column title="No" dataIndex="number" key="number" render={(val, row, i) => i + 1} width="3%" />
                        <Column title="Subscription" dataIndex="subscription" key="Subscription" width="20%"
                            render={(value, record) => (
                                <span>{value ? 'Subscribe' : 'Unsubscribe'}</span>
                            )}
                        />
                        <Column title="Notes" dataIndex="notes" key="Notes" width="20%" />
                        <Column title="Update By" dataIndex="updatedby" key="Updated By" width="20%" />
                        <Column title="Date" dataIndex="date" key="Date" width="10%"
                            render={(value, record) => (
                                <span>{moment(value).format("DD/MM/YYYY")}</span>
                            )}
                        />
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);