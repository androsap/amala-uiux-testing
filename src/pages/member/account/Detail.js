import React from 'react';
import { api } from '../../../config/Services';
import { GeneralRequest, DetailRequest, RetrieveRequest } from '../../../utilities/RequestService';
import { Button, Alert, Pagination, SelectBase, DatePickerBase, InputText } from '../../../components/Base/BaseComponent';
import { Card, Col, Form, Row, Table, Typography, Spin } from 'antd';
import { StatusMemberDetail, YesNoOptions } from '../../../data';
import { getAPIToken, getProfile } from '../../../utilities/AuthService';
import { jsUcfirst } from '../../../utilities/Helpers';
import moment from 'moment';

const { Column, ColumnGroup } = Table;
const { Text } = Typography;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            totalrecord: 0,
            criteria: {},
            sort: {},
            dataList: [],
            dataListMaster: [],
            summaryList: [],
            allDataList: [],
            isLoaded: false,
            totalawardmiles: null,
            totaltiermiles: null,
            totalfrequency: null,
            showAdvanceSearch: false,
            advancesearch: false,
            startperiod: (this.props.type === 'expiredthismonth') ? moment().startOf('month').format('YYYY-MM-DD') :
                (this.props.type === 'allaccountdetailsummary') ? moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD') : null,
            endperiod: (this.props.type === 'expiredthismonth') ? moment().endOf('month').format('YYYY-MM-DD') :
                (this.props.type === 'allaccountdetailsummary') ? moment().add(2, 'months').endOf('month').format('YYYY-MM-DD') : null,
            fielddisabled: {
                startperioddisabled: false,
                endperioddisabled: false
            }
        }
    }

    componentDidMount() {
        if (this.props.type === 'allaccountdetailsummary') {
            this.getSummaryList();
        } else this.getList();
    }

    getList = async () => {
        this.setState({ isLoaded: true });

        const { memberaccountid, type } = this.props;
        let { startperiod, endperiod, sort, current, pageSize } = this.state;
        let paging = { page: current, limit: pageSize };
        let data = { memberaccountid, startperiod, endperiod };
        let criteria = { ...this.state.criteria, memberaccountid };
        sort = (Object.keys(sort).length !== 0) ? sort : { expireddate: 'asc' };

        if (type === 'allexpiredaccount') { criteria.isexpired = true; }

        await RetrieveRequest(api.url.memberaccountdetail.retrieve, criteria, { page: 1, limit: -1 }, [], {}, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode === '0000') {
                this.setState({ allDataList: result.accountdetails });
            } else Alert.error(status.responsemessage);
        });

        var result = GeneralRequest(api.url.memberaccountdetail.retrieve, paging, [], criteria, sort, data);
        await result.then((response) => {
            if (response.status.responsecode === '0000') {
                let number = (paging.page - 1) * paging.limit;
                let dataList = response.result['accountdetails'].map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

                let totalawardmiles = response.result['totalawardmiles'];
                let totaltiermiles = response.result['totaltiermiles'];
                let totalfrequency = response.result['totalfrequency'];

                let totalrecord = response.paging.totalrecord;

                this.setState({ dataList, totalawardmiles, totaltiermiles, totalfrequency, totalrecord, dataListMaster: dataList });

                if (type === 'expiredthismonth') {
                    let setValue = { startperiod: moment(startperiod), endperiod: moment(endperiod) };
                    this.props.form.setFieldsValue(setValue);

                    let fielddisabled = { ...this.state.fielddisabled, startperioddisabled: true, endperioddisabled: true };
                    this.setState({ fielddisabled });
                }
            } else Alert.error(response.status.responsemessage);
        });
        await this.setState({ criteria, isLoaded: false });
    };

    getSummaryList = () => {
        const { startperiod, endperiod } = this.state;

        let url = api.url.memberaccountdetail.getsummary;
        let data = {
            memberid: this.props.memberid,
            summarytypeperiod: 'MONTH',
            startperiod, endperiod
        };

        this.setState({ isLoaded: true });
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode === '0000') {
                const { summarylist } = result || {};
                let number = 0;

                this.setState({
                    summaryList: summarylist,
                    dataList: result.summarylist.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) })
                });
                this.props.form.setFieldsValue({ startperiod: moment(startperiod), endperiod: moment(endperiod) });
            } else Alert.error(status.responsemessage);
            this.setState({ isLoaded: false });
        });
    };

    handleTableChange = (pagination, filters, sorter) => {
        let { dataList, dataListMaster } = this.state;
        let number = 0;

        if (sorter.field) {
            this.setState({ dataList: dataListMaster, isLoaded: true });
            setTimeout(() => {
                this.setState({
                    sort: (sorter.field !== 'status') ? { [sorter.field]: (sorter.order === "ascend") ? 'asc' : 'desc' } : { isexpired: (sorter.order === "ascend") ? 'asc' : 'desc' },
                    dataList: dataList.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) })
                })
            }, 10);

            setTimeout(() => { this.getList() }, 50)
        }
    };

    onPaginationChange = (page) => {
        this.setState({ current: page }, () => this.getList());
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleSearch = (e) => {
        this.setState({ isLoaded: true });

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let startperiod = (values.startperiod) ? moment(values.startperiod).format('YYYY-MM-DD') : null;
                let endperiod = (values.endperiod) ? moment(values.endperiod).format('YYYY-MM-DD') : null;
                let expireddate = (values.expireddate) ? moment(values.expireddate).format('YYYY/MM/DD') : null;
                let isexpired = (values.status !== undefined) ? values.status : null;
                let extendable = (values.extendable !== undefined) ? values.extendable : null;
                let trxid = (values.trxid !== undefined) ? values.trxid : null;

                if (this.props.type === 'allaccountdetailsummary') {
                    this.setState({
                        startperiod, endperiod
                    }, () => this.getSummaryList());
                } else {
                    this.setState({
                        current: 1,
                        pageSize: 10,
                        criteria: {
                            ...this.state.criteria, trxid,
                            expireddate, isexpired, extendable
                        },
                        startperiod, endperiod, trxid
                    }, () => this.getList());
                }
            }
            this.setState({ isLoaded: false });
        });
    };

    handleAdvanceSearch = () => {
        this.setState({ advancesearch: !this.state.advancesearch });
    };

    handleDownload = (downloadas) => {
        this.setState({ isLoaded: true });

        const { startperiod, endperiod, criteria, current, pageSize } = this.state;
        const { cardnumber, type, memberfullname, memberaccountid, memberid } = this.props;

        let url = (type === 'allaccountdetailsummary') ? api.url.memberaccountdetail.download : api.url.memberaccountdetail.donwloaddetail;
        let nameFile = (type === 'allaccountdetail') ? 'All_Account_Detail' : (type === 'allexpiredaccount') ? 'All_Expired_Account' : (type === 'expiredthismonth') ? 'Expired_This_Month' : 'All_Account_Detail_Summary';
        let sort = (Object.keys(this.state.sort).length !== 0) ? this.state.sort : { expireddate: 'asc' };
        let paging = (type === 'allaccountdetailsummary') ? {} : { page: current, limit: pageSize };
        let period = (startperiod && endperiod) ? `${moment(startperiod).format('DD/MM/YYYY')} - ${moment(endperiod).format('DD/MM/YYYY')}` :
            (startperiod) ? moment(startperiod).format('DD/MM/YYYY') : (endperiod) ? moment(endperiod).format('DD/MM/YYYY') : '-';
        let filedata = {
            period,
            title: jsUcfirst(nameFile, '_'),
            membername: memberfullname,
            createdby: getProfile().username,
            createddate: moment().format('DD-MM-YYYY HH:mm:ss')
        };

        let data = (type === 'allaccountdetailsummary') ? {
            startperiod, endperiod, downloadas, memberid, filedata,
            summarytypeperiod: 'MONTH',
            type: 'SUMARRY',
        } : {
            startperiod, endperiod, downloadas, memberaccountid, memberid, filedata,
            summarytypeperiod: 'MONTH',
            type: 'ALL',
        };

        RetrieveRequest(url, criteria, paging, [], sort, data).then(async (response) => {
            let { status, result } = response;
            if (status.responsecode === '0000') {
                const response = await fetch(result.url, {
                    method: 'GET',
                    headers: { Authorization: getAPIToken() },
                });

                const blob = await response.blob();
                const href = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = href;
                link.setAttribute(
                    'download',
                    `${nameFile}_${cardnumber}.${downloadas.toLowerCase()}`,
                );

                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);

                Alert.success((status.responsemessage) ? status.responsemessage : 'Downloading file...');
                this.setState({ isLoaded: false });
            } else {
                Alert.error(status.responsemessage);
                this.setState({ isLoaded: false });
            };
        });
    };

    handleDateChange = (startperiod) => {
        this.setState({ startperiod });
        if (startperiod && (this.props.type !== 'allaccountdetailsummary')) {
            this.props.form.setFieldsValue({ endperiod: moment(startperiod) });
        } else this.props.form.setFieldsValue({ endperiod: undefined });
    };

    render() {
        const { isLoaded, dataList, allDataList, summaryList, current, totalrecord, pageSize, advancesearch, fielddisabled } = this.state;
        const { type, permission } = this.props;

        const donwloadbuttondisabled = (dataList.length === 0) ? true : false;
        const summary = (type === 'allaccountdetailsummary') ? true : false;

        let { startperioddisabled, endperioddisabled } = fielddisabled;
        let startperiod = (this.props.form.getFieldValue('startperiod')) ? moment(this.props.form.getFieldValue('startperiod')) : undefined;
        endperioddisabled = (type === 'expiredthismonth') ? true : ((startperiod) ? false : true);

        return (
            <React.Fragment>
                <Spin spinning={isLoaded}>
                    <Row>
                        <Form layout='inline' className={(!advancesearch) ? 'searching-form' : 'searching-form hidden'} onSubmit={this.handleSearch} >
                            <DatePickerBase form={this.props.form} datafield='startperiod' placeholder='Start Expiry Date' disabled={startperioddisabled} onChange={this.handleDateChange} validationrules={(summary) ? ['required'] : []} />
                            <DatePickerBase form={this.props.form} datafield='endperiod' placeholder='End Expiry Date' disabled={endperioddisabled} minDate={moment(startperiod)}
                                maxDate={moment(startperiod).add(1, 'years')} validationrules={(summary) ? ['required'] : []} />
                            {(this.props.type === 'allaccountdetail') ? <InputText form={this.props.form} datafield="trxid" placeholder="Trx ID" /> : ''}
                            {
                                (summary) ? null : <span>
                                    {(type === 'expiredthismonth') ? null : (type === 'allexpiredaccount') ? null :
                                        <SelectBase form={this.props.form} datafield='status' placeholder='Status' options={StatusMemberDetail} />}
                                    <SelectBase form={this.props.form} datafield={'extendable'} placeholder={'Extandable'} options={YesNoOptions} />
                                </span>
                            }
                            <span style={{ lineHeight: '40px' }}>
                                <Button label='Search' size='default' type='primary' htmlType='submit' />
                                {(type === 'expiredthismonth') ? null : <Button label='Clear' size='default' style={{ marginLeft: 8 }} onClick={this.handleReset} htmlType='button' />}
                            </span>
                        </Form>
                    </Row>
                    {/* <Row style={{ marginBottom: '20px' }}>
                    <Col md={6} offset={3}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Award Miles : {(totalawardmiles !== null) ? formatNumber(totalawardmiles) : '-'} Miles</p>
                    </Col>
                    <Col md={6}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Tier Miles : {(totaltiermiles !== null) ? formatNumber(totaltiermiles) : '-'} Miles</p>
                    </Col>
                    <Col md={6}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>Frequency : {(totalfrequency !== null) ? formatNumber(totalfrequency) : '-'}</p>
                    </Col>
                </Row> */}
                    <Row type='flex' justify='start' style={{ marginBottom: 15, marginTop: -10 }}>
                        <Text strong><i>View at :&nbsp;</i></Text><strong><i>{moment().format('DD-MM-YYYY HH:mm:ss')}</i></strong>
                    </Row>
                    <Row style={{ marginBottom: 30 }}>
                        <Table rowKey={record => record.trxid} dataSource={dataList} size='middle' pagination={false} onChange={this.handleTableChange}>
                            <Column title='No' dataIndex='number' key='number' />
                            {
                                (summary) ? <Column title='Month' dataIndex='month' key='month' sorter={false} render={(value, record) => (value) ? value : '-'} /> :
                                    <Column title='Comment' dataIndex='comment' key='comment'
                                        render={(value, record) => {
                                            if (value) {
                                                let notes = (record.notes) ? record.notes : null;
                                                value = <span>
                                                    <span>{value}</span>
                                                    {(notes) ? <div style={{ fontSize: '10px', fontStyle: 'italic' }}> <Text type='danger'>Notes : {notes}</Text></div> : null}
                                                </span>;
                                                return value;
                                            } else return '-';
                                        }} />
                            }
                            {
                                (summary) ?
                                    <ColumnGroup title='Total Mileage Expired'>
                                        <Column title='Extendable' dataIndex='expiredmiles.extendablemiles' key='expiredmiles.extendablemiles' sorter={false} align='center' render={(value, record) => <p align='right' style={{ marginRight: '35%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>} />
                                        <Column title='Not Extendable' dataIndex='expiredmiles.notextendablemiles' key='expiredmiles.notextendablemiles' sorter={false} align='center' render={(value, record) => <p align='right' style={{ marginRight: '35%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>} />
                                    </ColumnGroup> :
                                    <Column title='Trx Date' dataIndex='trxdate' key='trxdate' sorter={(a, b) => new Date(a.trxdate) - new Date(b.trxdate)} render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : null} />
                            }
                            {
                                (summary) ? <ColumnGroup title='Total Mileage will be Expired'>
                                    <Column title='Extendable' dataIndex='willbeexpiredmiles.extendablemiles' key='willbeexpiredmiles.extendablemiles' sorter={false} align='center' render={(value, record) => <p align='right' style={{ marginRight: '35%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>} />
                                    <Column title='Not Extendable' dataIndex='willbeexpiredmiles.notextendablemiles' key='willbeexpiredmiles.notextendablemiles' sorter={false} align='center' render={(value, record) => <p align='right' style={{ marginRight: '35%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>} />
                                </ColumnGroup> :
                                    <Column title='Award Miles' dataIndex='awardmiles' key='awardmiles' align='center' width='15%' sorter={true} render={(value, record) => <p align='right' style={{ marginRight: '20%', marginTop: '10%' }}>{(value !== undefined && value !== null) ? value.toLocaleString('en-US') : '-'}</p>} />
                            }
                            {
                                (summary) ? null : <Column title='Expired Date' dataIndex='expireddate' key='expireddate' sorter={true}
                                    render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : null} />
                            }
                            {
                                (summary || (type === 'expiredthismonth')) ? null : <Column title='Status' dataIndex='status' key='status' sorter={true} render={(value, record) => {
                                    if (record.isexpired === true) {
                                        return 'Expired';
                                    } else if (record.isexpired === false) {
                                        return 'Mileage will be Expired';
                                    } else if (record.isexpired === null) {
                                        return 'All';
                                    } else return '-';
                                }} />
                            }
                            {
                                (summary) ? null : <Column title='Extendable' dataIndex='extendable' key='extendable' sorter={true} render={(value, record) => (value) ? 'Yes' : 'No'} />
                            }
                            {this.props.type === 'allaccountdetail' ? <Column title="Trx ID" dataIndex="trxid" key="trxid" sorter={false} render={(value, record) => (value !== undefined && value !== null) ? value : '-'} /> : ''}
                            {
                                (summary) ? null : <Column title='Is Boosted' dataIndex='is_boosted' key='isboosted' sorter={true} render={(value, record) => (value) ? 'Yes' : 'No'} />
                            }
                        </Table>
                    </Row>
                    <Card bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', borderRadius: '10px', marginTop: 4, marginBottom: 15 }}>
                        <Row gutter={24}>
                            <Col className='gutter-row' xs={24} lg={(summary) ? 3 : 4} style={{ textAlign: 'center' }}><label>{(summary) ? 'Total' : 'Total Miles'}</label></Col>
                            <Col className='gutter-row' xs={24} lg={(summary) ? 5 : 4} style={{ textAlign: (summary) ? 'right' : 'center', marginLeft: (summary) ? -10 : 0 }}>
                                {
                                    (summary) ? ((summaryList) ? <span>{summaryList.map(a => a.expiredmiles.extendablemiles).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>) :
                                        (allDataList) ? <span>{allDataList.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>
                                }
                            </Col>
                            {(summary) ? null : <Col className='gutter-row' xs={24} lg={4} style={{ textAlign: 'center' }}><label>Extendable Miles</label></Col>}
                            <Col className='gutter-row' xs={24} lg={(summary) ? 5 : 4} style={{ textAlign: (summary) ? 'right' : 'center' }}>
                                {
                                    (summary) ? ((summaryList) ? <span>{summaryList.map(a => a.expiredmiles.notextendablemiles).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>) :
                                        (allDataList) ? <span>{allDataList.map(a => { if (a.extendable) { return a.awardmiles } else { return 0 } }).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>
                                }
                            </Col>
                            {(summary) ? null : <Col className='gutter-row' xs={24} lg={4} style={{ textAlign: 'center' }}><label>Not Extendable Miles</label></Col>}
                            <Col className='gutter-row' xs={24} lg={(summary) ? 5 : 4} style={{ textAlign: (summary) ? 'right' : 'center', marginLeft: (summary) ? -10 : 0 }}>
                                {
                                    (summary) ? ((summaryList) ? <span>{summaryList.map(a => a.willbeexpiredmiles.extendablemiles).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>) :
                                        (allDataList) ? <span>{allDataList.map(a => { if (!a.extendable) { return a.awardmiles } else { return 0 } }).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>
                                }
                            </Col>
                            {(summary) ? <Col className='gutter-row' xs={24} lg={(summary) ? 5 : 4} style={{ textAlign: (summary) ? 'right' : 'center' }}>
                                {(summaryList) ? <span>{summaryList.map(a => a.willbeexpiredmiles.notextendablemiles).reduce(function (a, b) { return a + b; }, 0).toLocaleString('en-US')}</span> : <span>0</span>}
                            </Col> : null}
                        </Row>
                    </Card>
                    <Row type='flex' justify='end'>
                        <Pagination current={current} total={totalrecord} pageSize={pageSize} onChange={this.onPaginationChange} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`} />
                    </Row>
                    <Row type="flex" justify="end" style={{ marginTop: 30 }}>
                        {permission && permission.usermenu["MMBRACCDET"]["ACCDET_DLDCSV"] ? <Button htmlType="button" type="primary" label="Export to CSV" onClick={() => this.handleDownload('CSV')} disabled={donwloadbuttondisabled} /> : null}
                        {permission && permission.usermenu["MMBRACCDET"]["ACCDET_DLDPDF"] ? <Button htmlType="button" type="primary" label="Export to PDF" onClick={() => this.handleDownload('PDF')} disabled={donwloadbuttondisabled} /> : null}
                    </Row>
                </Spin>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);
