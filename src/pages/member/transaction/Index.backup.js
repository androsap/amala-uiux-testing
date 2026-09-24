import React from 'react';
import { api } from '../../../config/Services';
import { GeneralRequest } from '../../../utilities/RequestService';
import { Button, Alert, Pagination } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Table } from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            totalrecord: 0,
            sort: {},
            dataList: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        this.getList();
        document.title = "Member Transaction | Loyalty Management System";
    }

    getList = () => {
        let paging = { page: this.state.current, limit: this.state.pageSize };
        let criteria = {};
        let sort = {createddate: 'asc'};
        let data = {
            memberid: this.props.match.params.ID,
            channel: "BO"
        }
        let url = api.url.membertransaction.list;
        let column = [];
        this.setState({ isLoaded: true });
        // const { sort } = this.state;
        var result = GeneralRequest(url, paging, column, criteria, sort, data);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                let number = (paging.page - 1) * paging.limit;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                let totalrecord = response.paging.totalrecord;

                this.setState({ dataList, totalrecord, isLoaded: false });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleTableChange = (pagination, filters, sorter) => {
        let sort = {};
        if (sorter.field) { sort = { [sorter.field]: (sorter.order === 'ascend') ? 'asc' : 'desc' } }
        this.setState({ sort }, () => this.getList());
    }

    onPaginationChange = page => {
        this.setState({ current: page }, () => this.getList());
    };

    render() {
        const { menucode, prefixmenuname } = this.props;
        const { isLoaded, dataList, totalrecord, pageSize } = this.state;
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} sm={20}>
                        <Title level={4}>Manage Transaction</Title>
                    </Col>
                    <Col xs={24} sm={4} align="right">
                        <Button type="primary" url={this.props.match.url + '/form'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                    </Col>
                    <Divider />
                </Row>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.trxid} dataSource={dataList} size="middle" pagination={false} loading={isLoaded} onChange={this.handleTableChange}
                        expandedRowRender={record =>
                            <Row>
                                <Col md={8}>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#ff4d4f' }}>Award Miles Before : {(record.awardmilesbefore) ? record.awardmilesbefore : '-'}</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Award Miles After : {(record.awardmilesafter) ? record.awardmilesafter : '-'}</p>
                                </Col>
                                <Col md={8}>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#ff4d4f' }}>Tier Miles Before : {(record.tiermilesbefore) ? record.tiermilesbefore : '-'}</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Tier Miles After : {(record.tiermilesafter) ? record.tiermilesafter : '-'}</p>
                                </Col>
                                <Col md={8}>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#ff4d4f' }}>Frequency Before : {(record.frequencybefore) ? record.frequencybefore : '-'}</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Frequency After : {(record.frequencyafter) ? record.frequencyafter : '-'}</p>
                                </Col>
                            </Row>
                        }>
                        <Column title="No" dataIndex="number" key="number" />
                        <Column title="Transaction Date" dataIndex="trxdate" key="trxdate" sorter={true} />
                        <Column title="Transaction Type" dataIndex="trxtype" key="trxtype" sorter={true} />
                        <Column title="Comment" dataIndex="comment" key="comment" render={(value, record) => ((value) ? value : '-')} />
                        <Column title="Award Miles" dataIndex="awardmiles" key="awardmiles" sorter={true} />
                        <Column title="Tier Miles" dataIndex="tiermiles" key="tiermiles" sorter={true} />
                        <Column title="Frequency" dataIndex="frequency" key="frequency" sorter={true} />
                        <Column title="Create Date" dataIndex="createddate" key="createddate" sorter={true} render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : ''} />
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