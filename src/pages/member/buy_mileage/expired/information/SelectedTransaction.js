import React from 'react';
import { Form, Spin, Table, Row, Tabs, Card, Col } from 'antd';
import { formatNumber, formatMonthAcronym } from '../../../../../utilities/Helpers';
import moment from 'moment';

const { Column } = Table;
const { TabPane } = Tabs;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            key: 0
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        setTimeout(() => this.setState({ isLoading: false }), 500);
    };

    handleSeeTransaction = async (trxid) => {
        await this.props.history.push('/member/');
        await this.props.history.push(`/member/form/${this.props.match.params.ID}/transaction/detail/${trxid}`);
    };

    handleTabs = (key) => {
        this.setState({ key })
    };

    render() {
        let { dataList, status, selectedTrx, actionspage } = this.props;
        let success = (status === 'SUCCESS') ? true : false;
        let number = 0;

        if (actionspage === 'create') {
            dataList = (dataList.length !== 0) ? dataList.sort((a, b) => a.index - b.index).map((obj, key) => { return ({ number: number + (key + 1), ...obj }) }) : [];
        }

        const { isLoading, key } = this.state;
        const selectedEligibleConvert = (actionspage === 'create') ? dataList.map(a => a.data) : dataList.map(a => a.accountdetails);
        const selectedTransactionPrevious = (selectedEligibleConvert) ? selectedEligibleConvert.map(a => Object.values(a)).flat(1) : [];

        let transactionMonthSelected = [];
        let transactionSelectedMonth = [];
        let selectedTransactionPreviousMonth = [];

        if (actionspage === 'create') {
            transactionMonthSelected = (selectedEligibleConvert) ? selectedEligibleConvert[`${key}`] : [];
            transactionSelectedMonth = (selectedEligibleConvert) ? Object.keys(transactionMonthSelected).map(key => ({
                ...transactionMonthSelected[key]
            })) : [];
            selectedTransactionPreviousMonth = (selectedEligibleConvert) ? transactionSelectedMonth.map(a => Object.values(a.selectedRows)).flat(1) : [];
        }
        const selectedTransactionMonth = (selectedTransactionPrevious) ? ((actionspage === 'create')) ? selectedTransactionPreviousMonth.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) :
            selectedEligibleConvert[key].map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];

        const selectedTransaction = (selectedTransactionPrevious && (actionspage === 'create')) ? selectedTransactionPrevious.map(a => Object.values(a.selectedRows)).flat(1) : [];
        const selectedTransactionSum = (selectedTransaction) ? (actionspage === 'create') ? selectedTransaction.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) :
            selectedTransactionPrevious.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];

        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row>
                            {(dataList.length !== 0) ?
                                <Tabs defaultActiveKey='0' tabPosition='left' style={{ height: 560 }} onChange={(key, val) => this.handleTabs(key, val)}>
                                    {dataList.map((value, index) => {
                                        let dataSource = (actionspage === 'create') ? Object.values(dataList.find(obj => obj.number === number + (index + 1)).data).map(a => a.selectedRows).flat(1).filter(function (obj) { return obj.awardmiles !== 0; }) :
                                            value.accountdetails.sort((a, b) => { return moment(a.expireddateafter) - moment(b.expireddateafter) }).map((obj, key) => {
                                                return ({
                                                    number: number + (key + 1),
                                                    trxid: selectedTrx.find(a => a.accdetailid === obj.accdetailid).trxid,
                                                    comment: selectedTrx.find(a => a.accdetailid === obj.accdetailid).comment,
                                                    trxdate: selectedTrx.find(a => a.accdetailid === obj.accdetailid).trxdate, ...obj
                                                })
                                            });


                                        return <TabPane tab={`${formatMonthAcronym(value.month)} ${value.year}`} key={index} >
                                            <Row>
                                                <Table dataSource={dataSource} size='middle' pagination={true}>
                                                    <Column title='No' dataIndex='number' key='number' render={(val, row, i) => i + 1} width={(success) ? '7%' : '5%'} />
                                                    {(success) ? <Column title='Trx Date' dataIndex='trxdate' key='trxdate'
                                                        render={(val, row) => (<span> {(val) ? moment(val).format('DD/MM/YYYY') : '-'} </span>)} /> : ''}
                                                    <Column title={(success) ? 'Expired Date Before' : 'Expired Date'} dataIndex={(actionspage !== 'create') ? 'expireddatebefore' : 'expireddate'} key={(actionspage !== 'create') ? 'expireddatebefore' : 'expireddate'}
                                                        width={(success) ? '20%' : '28%'} render={(val, row) => (<span> {(val) ? moment(val).format('DD/MM/YYYY') : '-'} </span>)} />
                                                    {(success) ? <Column title='Expired Date After' dataIndex='expireddateafter' key='expireddateafter'
                                                        render={(val, row) => (<span> {(val) ? moment(val).format('DD/MM/YYYY') : '-'} </span>)} /> : ''}
                                                    <Column title='Transaction Name' dataIndex='comment' key='comment' width={(success) ? '' : '50%'}
                                                        render={(val, row) => (<span> {(val) ? val : '-'} </span>)} />
                                                    <Column title='Miles' dataIndex='awardmiles' key='awardmiles' align='center' width={(success) ? '10%' : ''}
                                                        render={(val, row) => (<span style={(success) ? {} : { float: 'right', marginRight: '40px' }}> {(val !== null) ? formatNumber(val) : '-'} </span>)} />
                                                    {(success) ? <Column title='Action' dataIndex='action' key='action'
                                                        render={(val, row) => ((row.trxid) ? <a href={`/member/form/${this.props.match.params.ID}/transaction/detail/${row.trxid}`} onClick={() => this.handleSeeTransaction(row.trxid)}>See Transaction</a> : 'Extend Expired Date Only')} /> : ''}
                                                </Table>
                                            </Row>
                                        </TabPane>
                                    })}
                                </Tabs> : null
                            }
                            <Card bordered={true} style={{ borderRadius: '10px', marginLeft: 110 }}>
                                <Row>
                                    <Col className='gutter-row' xs={23} lg={11} ><h4>Sub Total Miles (This Month)</h4></Col>
                                    <Col className='gutter-row' xs={24} lg={12} style={{ textAlign: 'right', marginLeft: '15px' }}>
                                        {(selectedTransactionMonth) ? <h4>{selectedTransactionMonth.toLocaleString('en-US')}</h4> : <h4>0</h4>}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='gutter-row' xs={23} lg={11} ><h4>Total Miles</h4></Col>
                                    <Col className='gutter-row' xs={24} lg={12} style={{ textAlign: 'right', marginLeft: '15px' }}>
                                        {(selectedTransactionSum) ? <h4>{selectedTransactionSum.toLocaleString('en-US')}</h4> : <h4>0</h4>}
                                    </Col>
                                </Row>
                            </Card>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);