import React from 'react';
import { api } from '../../../../../config/Services';
import { Button, Alert } from '../../../../../components/Base/BaseComponent';
import { Form, Spin, Table, Col, Row, Pagination, Tabs, Card, Skeleton, Checkbox } from 'antd';
import { formatNumber, formatMonthAcronym, removeNull, isEmptyObject } from '../../../../../utilities/Helpers';
import moment from 'moment';

import { DetailRequest } from '../../../../../utilities/RequestService';

const { Column } = Table;
const { TabPane } = Tabs;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLayout: false,
            isLoading: false,
            isLoadingTable: false,
            activeTab: 0,
            tabSelectAll: {},
            dataList: [],
            accountdetails: [],
            totalrecord: 0,
            current: 1,
            selectedRowKey: this.props.selectedRowKey,
            selectedRows: [],
            selectedRowKeys: [],
            requestEligible: this.props.requestEligible,
            result: [],
            activitycode: this.props.activitycode, 
            cardnumber: this.props.cardnumber
        }
    }

    componentDidMount() {
        const { selectedRowKey } = this.state;

        if (selectedRowKey) {
            let selectedRowKeys = (selectedRowKey.find(obj => obj.index === 0) && selectedRowKey.find(obj => obj.index === 0).data['1'] && selectedRowKey.find(obj => obj.index === 0).data['1'].selectedRowKeys) ?
                selectedRowKey.find(obj => obj.index === 0).data['1'].selectedRowKeys : [];

            this.setState({ selectedRowKeys });
        }
        this.handleEligibleMileage();
    };

    handleEligibleMileage = () => {
        let data = {
            cardnumber: this.props.cardnumber,
            activitycode: this.props.activitycode,
            source: "BO"
        }

        this.setState({ showLayout: true })
        DetailRequest(api.url.membernonairactivity.geteligible, data).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000' && result) {
                const { accountdetails } = result || {};

                let totalawardmiles = result.totalawardmiles ? result.totalawardmiles : '';
                let totalawardmiles2 = result.totalawardmiles ? formatNumber(result.totalawardmiles) : '';
        
                let dataList = accountdetails.filter((val, index) => val.awardmiles > 0 );
        
                this.setState({ dataList, totalawardmiles, totalawardmiles2 });
            } else {
                Alert.information(status.responsemessage);
            }
            this.setState({ showLayout: false });
        });        
    };

    handleNextForm = () => {
        let { selectedRowKey, totalawardmiles } = this.state;
        // const selectedTransactionSum = (selectedRowKey) ? selectedRowKey.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];
        this.props.onCancel(totalawardmiles);
    };

    onSelectChange = (selectedRowKeys, selectedRowKey) => {
        this.setState({ selectedRowKeys, selectedRowKey });
    };

    checkBoxProps = (record) => {
        let { selectedRowKey } = this.state;
        if (selectedRowKey && selectedRowKey.length !== 0)
        selectedRowKey = [];
        
    };

    render() {
        const { showLayout, isLoading, isLoadingTable, dataList, selectedRowKeys, totalawardmiles2 } = this.state;

        const rowSelection = {
            columnTitle: <span></span>,
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: () => ({
                disabled: true,
                checked: true
            }),
        };
        
        // const selectedTransactionSum = (selectedRowKey) ? selectedRowKey.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];
        // const nextbuttonfielddisabled = (selectedRowKey.length === 0 || selectedTransactionSum === 0) ? true : false;
        
        return (
            <React.Fragment>
                {(showLayout) ? <Skeleton active /> :
                    <Spin spinning={isLoading}>
                        <Row>
                            <Row>
                                <Spin spinning={isLoadingTable}>
                                    <Table rowKey={record => record.number} rowSelection={rowSelection} dataSource={dataList} size='middle' pagination={true}>
                                        <Column title='Expired Date' dataIndex='expireddate' key='expireddate'
                                            render={(value, record) => (<span> {(value) ? moment(value).format('DD/MM/YYYY') : '-'} </span>)} />
                                        <Column title='Activity Name' dataIndex='activityname' key='activityname'
                                            render={(value, record) => (<span> {(value) ? value : '-'} </span>)} />
                                        <Column title='Miles' dataIndex='awardmiles' key='awardmiles' align='center'
                                            render={(value, record) => (<span> {(value !== null) ? formatNumber(value) : '-'} </span>)} />
                                    </Table>
                                </Spin>
                            </Row>

                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Card bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', borderRadius: '10px', marginTop: 20 }}>
                                    <Row>
                                        <Col className='gutter-row' xs={23} lg={11} ><h4>Total Miles</h4></Col>
                                        <Col className='gutter-row' xs={24} lg={12} style={{ textAlign: 'right', marginLeft: '4px' }}>
                                            {<h4>{totalawardmiles2}</h4>}
                                        </Col>
                                    </Row>
                                </Card>
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }} >
                                    <Button htmlType='button' type='primary' label='Next' onClick={this.handleNextForm} />
                                </Row>
                            </Col>
                        </Row>
                    </Spin>
                }
            </React.Fragment>
        );
    }
}

export default Form.create()(App);