import React from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Alert, Pagination } from '../../../components/Base/BaseComponent';
import { Form, Table, Row } from 'antd';
const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            loading: false
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        let url = api.url.brancharea.list;
        let column = [];
        let paging = { page: this.state.current, limit: this.state.pageSize };
        let criteria = { type: this.props.areatype }
        let sort = (criteria.type === 'COUNTRY') ? { countryname: 'asc' } : { cityname: 'asc' };
        this.setState({ loading: true });
        RetrieveRequest(url, criteria, paging, column, sort).then((response) => {
            const { paging } = response;
            if (response.status.responsecode.substring(0, 1) === '0') {
                let number = (paging.page - 1) * paging.limit;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                let totalrecord = response.paging.totalrecord;

                this.setState({ dataList, totalrecord, loading: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    onPaginationChange = page => {
        this.setState({ current: page }, () => this.getList());
    };

    render() {
        const { dataList, loading, totalrecord, pageSize } = this.state;
        return (
            <React.Fragment>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.type} dataSource={dataList} size="small" pagination={false} loading={loading} >
                        <Column title="No" dataIndex="number" key="number" />
                        <Column title={(this.props.areatype === 'COUNTRY') ? "Country Name" : "City Name"} dataIndex={(this.props.areatype === 'COUNTRY') ? "countryname" : "cityname"} key={(this.props.areatype === 'COUNTRY') ? "countryname" : "cityname"} />
                        <Column title="Branch Code" dataIndex="branchcode" key="branchcode" />
                        <Column title="Branch Name" dataIndex="branchname" key="branchname" />
                    </Table>
                </Row>
                <Row type="flex" justify="end">
                    <Pagination
                        total={totalrecord}
                        pageSize={pageSize}
                        onChange={this.onPaginationChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);