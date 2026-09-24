import React from 'react';
import { api } from '../../../../config/Services';
import { Button, Alert } from '../../../../components/Base/BaseComponent';
import { Form, Spin, Table, Col, Row, Pagination, Tabs, Card, Skeleton, Checkbox } from 'antd';
import { formatNumber, formatMonthAcronym, removeNull, isEmptyObject } from '../../../../utilities/Helpers';
import moment from 'moment';

import { DetailRequest } from '../../../../utilities/RequestService';

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
            selectedEligible: this.props.selectedEligible,
            selectedRows: [],
            selectedRowKeys: [],
            requestEligible: this.props.requestEligible,
            eligiblemileage: []
        }
    }

    componentDidMount() {
        const { selectedEligible } = this.state;

        if (selectedEligible) {
            let selectedRowKeys = (selectedEligible.find(obj => obj.index === 0) && selectedEligible.find(obj => obj.index === 0).data['1'] && selectedEligible.find(obj => obj.index === 0).data['1'].selectedRowKeys) ?
                selectedEligible.find(obj => obj.index === 0).data['1'].selectedRowKeys : [];

            this.setState({ selectedRowKeys });
        }
        this.handleEligibleMileage();
    };

    handleEligibleMileage = () => {
        const { buydate, buymileageid } = this.state.requestEligible || {};
        let data = {
            date: moment(buydate).format('YYYY-MM-DD'),
            memberid: this.props.match.params.ID,
            source: 'BO',
            buymileageid
        }

        this.setState({ showLayout: true })
        DetailRequest(api.url.memberbuymileage.geteligible, data).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000' && result) {
                const { eligiblemileage } = result || {};
                let dataList = eligiblemileage[0].accountdetails.filter((val, index) => index < 10);
                let totalrecord = eligiblemileage[0].accountdetails.length;

                this.setState({ dataList, totalrecord, eligiblemileage });
            } else {
                Alert.information(status.responsemessage)
            }
            this.setState({ showLayout: false });
        })
    };

    handleNextForm = () => {
        let { selectedEligible, requestEligible } = this.state;
        selectedEligible = selectedEligible.filter(item => Object.keys(item.data).length !== 0);
        this.props.history.push({ pathname: `/member/form/${this.props.match.params.ID}/buy-mileage/form-expired-buy/`, state: { selectedEligible, form: JSON.stringify(requestEligible) } });
    };

    onPaginationChange = (current, index, value) => {
        this.setState({ isLoadingTable: true, dataList: [], selectedRowKeys: [], selectedRows: [] });

        const { eligiblemileage, selectedEligible, activeTab, tabSelectAll } = this.state;
        const accountdetails = eligiblemileage.find((obj) => (obj.month === value.month) && (obj.year === value.year)).accountdetails;
        const dataList = accountdetails.filter((val, index) => {
            if (current === 1) {
                return index < 10;
            } else if ((accountdetails.length) > (current * 10)) {
                let numberIndex = ((((current - 1) * 10) - 1) < index) && (index < (current * 10));
                return numberIndex;
            } else {
                let numberIndex = index > (((current - 1) * 10) - 1);
                return numberIndex;
            }
        });

        let selectedRowKeys = [];
        let selectedRows = ((selectedEligible.find((obj) => obj.index === Number(index))) && (selectedEligible.find((obj) => obj.index === Number(index)).data[`${current}`] !== undefined)) ?
            selectedEligible.find((obj) => obj.index === index).data[`${current}`].selectedRows : [];

        if (tabSelectAll[`${activeTab}`]) {
            selectedRowKeys = dataList.map((value, index) => { if (value.awardmiles !== 0) { return index } else return null });
        } else selectedRowKeys = ((selectedEligible.find((obj) => obj.index === Number(index))) && (selectedEligible.find((obj) => obj.index === Number(index)).data[`${current}`] !== undefined)) ?
            selectedEligible.find((obj) => obj.index === index).data[`${current}`].selectedRowKeys : [];

        setTimeout(() => { this.setState({ current, dataList, selectedRowKeys, selectedRows, isLoadingTable: false }) }, 500);
    };

    handleTrx = (value, index, selectedRowKeys, selectedRows) => {
        this.setState({ isLoadingTable: true });
        let { current, selectedEligible, tabSelectAll, activeTab, dataList } = this.state;

        if (selectedEligible.length !== 0) {
            let currentSelectedEligible = selectedEligible.find((obj) => (obj.month === value.month) && (obj.year === value.year));
            if (currentSelectedEligible) {
                selectedEligible = selectedEligible.filter(function (obj) {
                    return obj.index !== index;
                });

                selectedEligible.push({
                    index,
                    month: value.month,
                    year: value.year,
                    data: {
                        ...currentSelectedEligible.data,
                        [current]: (selectedRows.length === 0) ? null : { page: current, selectedRows, selectedRowKeys }
                    }
                });

                if (((selectedRows.length === 0) && (selectedEligible) && (selectedEligible.find(obj => obj.index === Number(index))) &&
                    (selectedEligible.find(obj => obj.index === Number(index)).data[`${current}`] === null))) {

                    let selectedEligiblePrevious = selectedEligible;
                    selectedEligible = Object.values(removeNull(selectedEligible));

                    if (Object.keys(selectedEligible.find(obj => obj.index === Number(index)).data).length === 0) {
                        selectedEligible = selectedEligible.filter(function (obj) { return obj.index !== index; });
                        selectedEligible = selectedEligiblePrevious.filter(function (obj) { return obj.index !== index; });
                    } else {
                        let selectedEligiblePreviousData = selectedEligiblePrevious.find(obj => obj.index === Number(index))
                        delete selectedEligiblePreviousData.data[`${current}`];

                        selectedEligible = selectedEligiblePrevious.filter(function (obj) { return obj.index !== index; });
                        selectedEligible.push(selectedEligiblePreviousData);
                    }
                }
            } else {
                selectedEligible.push({
                    index,
                    month: value.month,
                    year: value.year,
                    data: {
                        [current]: (selectedRows.length === 0) ? null : { page: current, selectedRows, selectedRowKeys }
                    }
                });
            }
        } else {
            selectedEligible = [{
                index,
                month: value.month,
                year: value.year,
                data: {
                    [current]: (selectedRows.length === 0) ? null : { page: current, selectedRows, selectedRowKeys }
                }
            }];
        };

        setTimeout(() => {
            this.setState({
                selectedRowKeys, selectedRows, selectedEligible,
                tabSelectAll: { ...tabSelectAll, [activeTab]: dataList.length === selectedRows.length },
                isLoadingTable: false
            })
        }, 100)
    };

    handleChangeTab = (index) => {
        let { selectedEligible, eligiblemileage, dataList, totalrecord, tabSelectAll } = this.state;
        dataList = eligiblemileage[`${index}`].accountdetails.filter((val, index) => index < 10);
        totalrecord = eligiblemileage[`${index}`].accountdetails.length;

        this.setState({ dataList, totalrecord, selectedRowKeys: [], selectedRows: [], current: 1, isLoading: true, activeTab: index });
        setTimeout(() => {
            if (tabSelectAll[`${index}`]) {
                this.setState({ selectedRowKeys: dataList.map((value, index) => { if (value.awardmiles !== 0) { return index } else return null }) });
            } else {
                if (selectedEligible.find((obj) => (obj.index === Number(index)))) {
                    this.setState({
                        selectedRowKeys: (selectedEligible.find((obj) => (obj.index === Number(index))).data[`1`] !== undefined) ? selectedEligible.find((obj) => (obj.index === Number(index))).data[`1`].selectedRowKeys : [],
                        selectedRows: (selectedEligible.find((obj) => (obj.index === Number(index))).data[`1`] !== undefined) ? selectedEligible.find((obj) => (obj.index === Number(index))).data[`1`].selectedRows : [],
                    });
                }
            }
            this.setState({ isLoading: false });

        }, 100)
    };

    selectAll = (event, value, index) => {
        let { activeTab, tabSelectAll, dataList, selectedRowKeys, selectedEligible, eligiblemileage } = this.state;
        let selected = event.target.checked || event.target.className !== '';
        selectedRowKeys = (selectedRowKeys.length === dataList.length) ? [] : dataList.map((value, index) => { if (value.awardmiles !== 0) { return index } else return null });

        if (selected) {
            let dataSource = eligiblemileage[activeTab].accountdetails.map((value, index) => ({ ...value, index }));
            let data = {};

            for (let i = 0; i < dataSource.length; i += 10) {
                data[(i / 10) + 1] = dataSource.slice(i, i + 10);
            }

            selectedEligible = selectedEligible.filter(function (obj) { return obj.index !== index });
            selectedEligible.push({
                index,
                month: value.month,
                year: value.year,
                data: Object.entries(data).reduce((acc, [key, value]) => {
                    acc[key] = {
                        page: key,
                        selectedRows: value.filter(function (obj) { return obj.awardmiles !== 0; }),
                        selectedRowKeys: value.filter(function (obj) { return obj.awardmiles !== 0; }).map((value, index) => { if (key === 1) { return value.index } else return (value.index - ((key - 1) * 10)) }),
                    };
                    return acc;
                }, {})
            });
        } else selectedEligible = selectedEligible.filter(function (obj) { return obj.index !== index; });

        this.setState({ selectedEligible, selectedRowKeys, tabSelectAll: { ...tabSelectAll, [activeTab]: selected } });
    };

    render() {
        const { showLayout, isLoading, isLoadingTable, dataList, selectedRowKeys, current, totalrecord, selectedEligible, eligiblemileage } = this.state;

        const selectedEligibleConvert = selectedEligible.map(a => a.data);
        const selectedTransactionPrevious = (selectedEligibleConvert) ? selectedEligibleConvert.map(a => Object.values(a)).flat(1) : [];
        const selectedTransaction = (selectedTransactionPrevious) ? selectedTransactionPrevious.map(a => Object.values(a.selectedRows)).flat(1) : [];
        const selectedTransactionSum = (selectedTransaction) ? selectedTransaction.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];
        const nextbuttonfielddisabled = (selectedEligible.length === 0 || selectedTransactionSum === 0) ? true : false;

        return (
            <React.Fragment>
                {(showLayout) ? <Skeleton active /> :
                    <Spin spinning={isLoading}>
                        <Row>
                            {(eligiblemileage.length !== 0) ?
                                <Tabs defaultActiveKey='0' tabPosition='left' style={{ height: 565 }} onTabClick={(index) => this.handleChangeTab(index)}>
                                    {eligiblemileage.map((value, index) => {
                                        const rowSelections = {
                                            selectedRowKeys,
                                            onChange: (selectedRowKeys, selectedRows) => { this.handleTrx(value, index, selectedRowKeys, selectedRows) },
                                            columnTitle:
                                                <Checkbox
                                                    checked={selectedRowKeys.length}
                                                    indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < dataList.length}
                                                    onChange={(event) => this.selectAll(event, value, index)}
                                                />,
                                            getCheckboxProps: (record) => {
                                                return {
                                                    disabled: record.awardmiles === 0
                                                };
                                            }
                                        };

                                        return <TabPane tab={`${formatMonthAcronym(value.month)} ${value.year}`} key={index}>
                                            <Row>
                                                <Spin spinning={isLoadingTable}>
                                                    <Table rowKey={record => record.number} rowSelection={rowSelections} dataSource={dataList} size='middle' pagination={false}>
                                                        <Column title='Expired Date' dataIndex='expireddate' key='expireddate' width='20%'
                                                            render={(value, record) => (<span> {(value) ? moment(value).format('DD/MM/YYYY') : '-'} </span>)} />
                                                        <Column title='Transaction Name' dataIndex='comment' key='comment' width='61%'
                                                            render={(value, record) => (<span> {(value) ? value : '-'} </span>)} />
                                                        <Column title='Miles' dataIndex='awardmiles' key='awardmiles' width='19%' align='center'
                                                            render={(value, record) => (<span style={{ float: 'right', marginRight: '60px' }}> {(value !== null) ? formatNumber(value) : '-'} </span>)} />
                                                    </Table>
                                                </Spin>
                                            </Row>
                                            {(dataList) ? <Row type="flex" justify="end" style={{ marginTop: 8 }}>
                                                <Pagination current={current} total={totalrecord} onChange={(current) => this.onPaginationChange(current, index, value)} hideOnSinglePage={true} />
                                            </Row> : ''}
                                        </TabPane>
                                    })}
                                </Tabs> : null
                            }

                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Card bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', borderRadius: '10px', marginLeft: 100, marginTop: 20 }}>
                                    <Row>
                                        <Col className='gutter-row' xs={23} lg={11} ><h4>Total Miles</h4></Col>
                                        <Col className='gutter-row' xs={24} lg={12} style={{ textAlign: 'right', marginLeft: '4px' }}>
                                            {(selectedTransaction.length !== 0) ? <h4>{selectedTransactionSum.toLocaleString('en-US')}</h4> : <h4>0</h4>}
                                        </Col>
                                    </Row>
                                </Card>
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }} >
                                    <Button htmlType='button' type='primary' label='Next' disabled={nextbuttonfielddisabled} onClick={this.handleNextForm} />
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