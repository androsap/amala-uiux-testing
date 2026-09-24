import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest } from '../../../utilities/RequestService';
import { Button, TableBase } from '../../../components/Base/BaseComponent';
import { Divider, Row, Col, Typography, Table, Icon, Popover, Modal } from 'antd';
import { formatNumber } from '../../../utilities/Helpers';
import ErrorGeneral from '../../error/ErrorGeneral';
import moment from 'moment';
import ColumnGroup from 'antd/lib/table/ColumnGroup';

const { Title } = Typography;
const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            isLoading: false,
            sort: {},
            dataList: [],
            fieldvalue: {},
            visible: false,
        }
    }

    componentDidMount() {
        let { trxid } = this.props.match.params;
        this.getDetail(trxid);
    }

    getDetail = (trxid) => {
        let url = api.url.membertransaction.detail;
        let data = { trxid, channel: 'BO' };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let { trxid, trxtype, trxdate, createddate, comment, certificateid, notes, awardmiles, tiermiles, frequency, basemiles, frequencyrenewalbefore,
                    classofservicebonus, elitetierbonusmiles, promotionalbonusmiles, promotionaltierbonus, promotionalfrequencybonus, tierrenewal,
                    expiredawardmiles, expiredtiermiles, expiredfrequency, awardmilesbefore, tiermilesbefore, frequencybefore, tierrenewalafter, frequencyrenewal,
                    awardmilesafter, tiermilesafter, frequencyafter, sourcetrxid, memberbuymileageid, tierrenewalbefore, frequencyrenewalafter, activityid } = result || {};

                let trxdetail = (result.trxdetail) ? result.trxdetail.sort((a, b) => new Date(a.expireddate) - new Date(b.expireddate)) : [];
                let expireddateafter = (result.trxdetail) && (result.trxdetail.length !== 0) && result.trxdetail[0].expireddateafter ? result.trxdetail[0].expireddateafter : undefined;
                let expireddatebefore = (result.trxdetail) && (result.trxdetail.length !== 0) && result.trxdetail[0].expireddatebefore ? result.trxdetail[0].expireddatebefore : undefined;

                let dataArr = [];
                let dataObj = {
                    trxid, trxtype, trxdate, createddate, awardmilesbefore, tiermilesbefore, frequencybefore, awardmilesafter, tiermilesafter, frequencyafter, frequencyrenewalafter, certificateid,
                    awardmiles, tiermiles, frequency, comment, notes, basemiles, classofservicebonus, elitetierbonusmiles, promotionalbonusmiles, promotionaltierbonus, frequencyrenewalbefore,
                    promotionalfrequencybonus, expiredawardmiles, expiredtiermiles, expiredfrequency, sourcetrxid, memberbuymileageid, tierrenewalbefore, tierrenewalafter, tierrenewal, frequencyrenewal,
                    activityid, expireddateafter, expireddatebefore
                };

                dataArr.push(dataObj);
                let dataList = dataArr.map((obj) => { return ({ ...obj }) });
                if (activityid) setTimeout(() => { this.getActivity() }, 500);

                this.setState({ ...this.state.fieldvalue, fieldvalue: dataObj, dataList, trxdetail, isLoading: false })
            } else {
                this.setState({ isLoading: false, responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
        });
    }

    getActivity = () => {
        let url = api.url.memberactivity.detail;
        let data = { activityid: this.state.fieldvalue.activityid };
        //call loader
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                let activitytype = result.activitytype && result.activitytype === 'NON_AIR' ? 'nonair' : 'air';

                let setValue = { activitytype };
                this.setState({ setValue, activitytype })
            } else {
                this.setState({ isLoading: false });
            }
        });
    }

    handleOpenModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    handleRelatedTrx = async () => {
        const memberid = this.props.match.params.ID;
        const sourcetrxid = this.state.fieldvalue.sourcetrxid;

        await this.props.history.push(`/member/form/${memberid}/transaction/`);
        await this.props.history.push(`/member/form/${memberid}/transaction/detail/${sourcetrxid}`);
    };

    handleSeeActivity = async () => {
        const activityid = this.state.fieldvalue.activityid;
        const { activitytype } = this.state;
        await this.props.history.push(`/member/form/${this.props.match.params.ID}/activity/${activitytype}/form/${activityid}`);
    };

    render() {
        const { responseMessage, formrender, isLoading, dataList, trxdetail, fieldvalue, visible, activitytype } = this.state;
        let { trxid, trxtype, trxdate, createddate, comment, notes, awardmiles, tiermiles, frequency, expiredawardmiles, expiredtiermiles, expiredfrequency, sourcetrxid, frequencyrenewalbefore,
            tiermilesbefore, frequencyrenewal, frequencybefore, elitetierbonusmiles, promotionalbonusmiles, promotionaltierbonus, promotionalfrequencybonus, memberbuymileageid, tierrenewalbefore,
            tierrenewal, activityid, expireddateafter, expireddatebefore } = fieldvalue;
        let memberid = this.props.match.params.ID;

        awardmiles = (awardmiles) ? awardmiles : '0';
        tiermiles = (tiermiles) ? tiermiles : '0';
        tierrenewal = (tierrenewal) ? tierrenewal : '0';
        frequency = (frequency) ? frequency : '0';
        frequencyrenewal = (frequencyrenewal) ? frequencyrenewal : '0';
        tierrenewal = (tierrenewal) ? tierrenewal : '0';
        elitetierbonusmiles = (elitetierbonusmiles) ? elitetierbonusmiles : '0';
        promotionalbonusmiles = (promotionalbonusmiles) ? promotionalbonusmiles : '0';
        promotionaltierbonus = (promotionaltierbonus) ? promotionaltierbonus : '0';
        promotionalfrequencybonus = (promotionalfrequencybonus) ? promotionalfrequencybonus : '0';

        //data popover for Miles Information
        let contentAwardMiles = <div>
            <p>Award Miles Final = Normal Award Miles + Elite Tier Bonus + Promotional Bonus Miles</p>
            <p>Award Miles Final = {formatNumber(awardmiles - elitetierbonusmiles - promotionalbonusmiles)} + {formatNumber(elitetierbonusmiles)} + {formatNumber(promotionalbonusmiles)} </p>
            <p>Award Miles Final = {formatNumber(awardmiles)} Miles</p>
        </div>
        let contentTierMiles = <div>
            <p>Tier Miles Final = Normal Tier Miles + Promotional Tier Bonus</p>
            <p>Tier Miles Final = {formatNumber(tiermiles - promotionaltierbonus)} + {formatNumber(promotionaltierbonus)} </p>
            <p>Tier Miles Final = {formatNumber(tiermiles)} Miles</p>
        </div>
        let contentFrequency = <div>
            <p>Frequency Final = Normal Frequency + Promotional Frequency Bonus</p>
            <p>Frequency Final = {formatNumber(frequency - promotionalfrequencybonus)} + {formatNumber(promotionalfrequencybonus)} </p>
            <p>Frequency Final = {formatNumber(frequency)} </p>
        </div>
        let popAwardMiles = <div>
            <span>Award Miles</span> <Popover content={contentAwardMiles} title="Award Miles Calculation"><Icon type="info-circle" style={{ color: '#1890ff' }} /></Popover>
        </div>
        let popTierMiles = <div>
            <span>Tier Miles</span> <Popover content={contentTierMiles} title="Tier Miles Calculation"><Icon type="info-circle" style={{ color: '#1890ff' }} /></Popover>
        </div>
        let popFrequency = <div>
            <span>Frequency</span> <Popover content={contentFrequency} title="Frequency Calculation"><Icon type="info-circle" style={{ color: '#1890ff' }} /></Popover>
        </div>
        let popTierMilesRenewal = <div>
            <span>Tier Miles Renewal</span>
            {/* <Popover content={contentTierMiles} title="Tier Miles Renewal Calculation"><Icon type="info-circle" style={{ color: '#1890ff' }} /></Popover> */}
        </div>
        let popFrequencyRenewal = <div>
            <span>Frequency Renewal</span>
            {/* <Popover content={contentFrequency} title="Frequency Renewal Calculation"><Icon type="info-circle" style={{ color: '#1890ff' }} /></Popover> */}
        </div>

        if (formrender) {
            return (
                <React.Fragment>
                    <Modal visible={visible} title="Related Transaction" onCancel={this.handleCancel} footer={null} destroyOnClose={true} width={850}>
                        <RelatedTrx sourcetrxid={sourcetrxid} memberid={memberid} trxtype={trxtype} />
                    </Modal>

                    <Col xs={10} sm={18}>
                        <Title level={4}><Button url={this.props.location.pathname.split('/detail')[0]} shape="circle" icon="left" /> Transaction</Title>
                    </Col>
                    <Col xs={14} sm={6} align="right">
                        <Button htmlType="button" type="primary" label="View Related Transaction" onClick={() => this.handleOpenModal()} />
                    </Col>
                    <Divider style={{ marginTop: '0px' }} />

                    <Divider orientation="left">Transaction Information</Divider>
                    <Row gutter={24} style={{ marginBottom: '30px' }}>
                        <Col className="gutter-row" span={12}>
                            <Col xs={24} xl={7}><label>Transaction ID</label></Col>
                            {(activityid) ? <Col xs={24} xl={8}>: {(trxid) ? trxid : '-'}</Col> : <Col xs={24} xl={17}>: {(trxid) ? trxid : '-'}</Col>}
                            {(activityid) ? <Col xs={24} xl={9} style={{ marginTop: '-5px' }}> <Button htmlType='button' label='See Activity' type='primary' onClick={() => this.handleSeeActivity()} /></Col> : null}
                            <Col xs={24} xl={7}><label>Transaction Type</label></Col>
                            <Col xs={24} xl={17}>: {(trxtype) ? trxtype : '-'}</Col>
                            <Col xs={24} xl={7}><label>Comment</label></Col>
                            <Col xs={24} xl={17}>: {(comment) ? comment : '-'}</Col>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <Col xs={24} xl={7}><label>Transaction Date</label></Col>
                            <Col xs={24} xl={17}>: {(trxdate) ? moment(trxdate).format("DD/MM/YYYY") : '-'}</Col>
                            <Col xs={24} xl={7}><label>Created Date</label></Col>
                            <Col xs={24} xl={17}>: {(createddate) ? moment(createddate).format("DD/MM/YYYY") : '-'}</Col>
                            <Col xs={24} xl={7}><label>Notes</label></Col>
                            <Col xs={24} xl={17}>: {(notes) ? notes : '-'}</Col>
                            {(memberbuymileageid) ? <Col xs={24} xl={7}><label>Member Buy Mileage</label></Col> : null}
                            {(memberbuymileageid) ? <Col xs={24} xl={17}>: <Button htmlType='link' type='primary' label='See Buy Mileage' url={`/member/form/${memberid}/buy-mileage/form-expired-buy/${memberbuymileageid}`} /></Col> : null}
                            {(sourcetrxid) ? <Col xs={24} xl={7}><label>Related Transaction</label></Col> : null}
                            {(sourcetrxid) ? <Col xs={24} xl={17}>: <Button htmlType='button' label='See Transaction' type='primary' onClick={() => this.handleRelatedTrx()} /></Col> : null}
                        </Col>
                    </Row>

                    <Divider orientation="left" style={{ marginTop: '30px' }}>Miles Information</Divider>
                    <Table rowKey={record => record.trxid} dataSource={dataList} size="middle" pagination={false} loading={isLoading} bordered>
                        <ColumnGroup title="Miles Earned">
                            <Column title={popAwardMiles} dataIndex="awardmiles" key="awardmiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title={popTierMiles} dataIndex="tiermiles" key="tiermiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title={popFrequency} dataIndex="frequency" key="frequency" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title={popTierMilesRenewal} dataIndex="tierrenewal" key="tierrenewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title={popFrequencyRenewal} dataIndex="frequencyrenewal" key="frequencyrenewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                        </ColumnGroup>
                    </Table>
                    <Table rowKey={record => record.trxid} dataSource={dataList} size="middle" pagination={false} loading={isLoading} style={{ marginTop: '10px' }} bordered>
                        <ColumnGroup title="Miles Details">
                            <Column title="Base Miles" dataIndex="basemiles" key="basemiles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Class of Service Bonus" dataIndex="classofservicebonus" align="center" key="classofservicebonus" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Elite Tier Bonus" dataIndex="elitetierbonusmiles" align="center" key="elitetierbonusmiles" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Promotional Bonus" dataIndex="promotionalbonusmiles" align="center" key="promotionalbonusmiles" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Promotional Tier Bonus" dataIndex="promotionaltierbonus" align="center" key="promotionaltierbonus" render={(value) => (value) ? formatNumber(value) : '0'} />
                            <Column title="Promotional Freq. Bonus" dataIndex="promotionalfrequencybonus" align="center" key="promotionalfrequencybonus" render={(value) => (value) ? formatNumber(value) : '0'} />
                        </ColumnGroup>
                    </Table>
                    <Table rowKey={record => record.trxid} dataSource={dataList} size="middle" pagination={false} loading={isLoading} style={{ marginTop: '10px' }} bordered>
                        <ColumnGroup title="Changes in Member Account">
                            <Column title="Award Miles" dataIndex="awardmilesafter" key="awardmilesafter" align="center"
                                render={(value, row) => (<div>{(row.awardmilesbefore) ? formatNumber(row.awardmilesbefore) : '0'} <span style={{ color: (value === row.awardmilesbefore) ? '#000000' : (value > row.awardmilesbefore) ? '#008000' : '#800000' }}>{(value === row.awardmilesbefore) ? '=' : <Icon type={(value > row.awardmilesbefore) ? 'caret-up' : 'caret-down'} />} {(value) ? formatNumber(value) : '0'}</span></div>)} />
                            <Column title="Tier Miles" dataIndex="tiermilesafter" key="tiermilesafter" align="center"
                                render={(value) => (<div>{(tiermilesbefore) ? formatNumber(tiermilesbefore) : '0'} <span style={{ color: (value === tiermilesbefore) ? '#000000' : (value > tiermilesbefore) ? '#008000' : '#800000' }}>{(value === tiermilesbefore) ? '=' : <Icon type={(value > tiermilesbefore) ? 'caret-up' : 'caret-down'} />} {(value) ? formatNumber(value) : '0'}</span></div>)} />
                            <Column title="Frequency" dataIndex="frequencyafter" key="frequencyafter" align="center"
                                render={(value) => (<div>{(frequencybefore) ? formatNumber(frequencybefore) : '0'} <span style={{ color: (value === frequencybefore) ? '#000000' : (value > frequencybefore) ? '#008000' : '#800000' }}>{(value === frequencybefore) ? '=' : <Icon type={(value > frequencybefore) ? 'caret-up' : 'caret-down'} />} {(value) ? formatNumber(value) : '0'}</span></div>)} />
                            <Column title="Tier Miles Renewal" dataIndex="tierrenewalafter" key="tierrenewalafter" align="center"
                                render={(value) => (<div>{(tierrenewalbefore) ? formatNumber(tierrenewalbefore) : '0'} <span style={{ color: (value === tierrenewalbefore) ? '#000000' : (value > tierrenewalbefore) ? '#008000' : '#800000' }}>{(value === tierrenewalbefore) ? '=' : <Icon type={(value > tierrenewalbefore) ? 'caret-up' : 'caret-down'} />} {(value) ? formatNumber(value) : '0'}</span></div>)} />
                            <Column title="Frequency Renewal" dataIndex="frequencyrenewalafter" key="frequencyrenewalafter" align="center"
                                render={(value) => (<div>{(frequencyrenewalbefore) ? formatNumber(frequencyrenewalbefore) : '0'} <span style={{ color: (value === frequencyrenewalbefore) ? '#000000' : (value > frequencyrenewalbefore) ? '#008000' : '#800000' }}>{(value === frequencyrenewalbefore) ? '=' : <Icon type={(value > frequencyrenewalbefore) ? 'caret-up' : 'caret-down'} />} {(value) ? formatNumber(value) : '0'}</span></div>)} />
                        </ColumnGroup>
                    </Table>

                    <Divider orientation="left" style={{ marginTop: '30px' }}>Account Detail Information</Divider>
                    <Row gutter={24} style={{ marginBottom: '30px' }}>
                        <Col className="gutter-row" span={12}>
                            <Col xs={24} xl={7}><label>Award Miles</label></Col>
                            <Col xs={24} xl={17}>: {(awardmiles) ? `${formatNumber(awardmiles)} Miles` : '0'}</Col>
                            <Col xs={24} xl={7}><label>Tier Miles</label></Col>
                            <Col xs={24} xl={17}>: {(tiermiles) ? `${formatNumber(tiermiles)} Miles` : '0'}</Col>
                            <Col xs={24} xl={7}><label>Frequency</label></Col>
                            <Col xs={24} xl={17}>: {(frequency) ? formatNumber(frequency) : '0'}</Col>
                            <Col xs={24} xl={7}><label>Tier Renewal</label></Col>
                            <Col xs={24} xl={17}>: {(tierrenewal) ? formatNumber(tierrenewal) : '0'}</Col>
                            <Col xs={24} xl={7}><label>Frequency Renewal</label></Col>
                            <Col xs={24} xl={17}>: {(frequencyrenewal) ? formatNumber(frequencyrenewal) : '0'}</Col>
                        </Col>
                        <Col className="gutter-row" span={11}>
                            <Col xs={24} xl={9}><label>Expired Award Miles</label></Col>
                            <Col xs={24} xl={15}>: {(expiredawardmiles) ? `${formatNumber(expiredawardmiles)} Miles` : '0'}</Col>
                            <Col xs={24} xl={9} hidden={true}><label>Expired Tier Miles</label></Col>
                            <Col xs={24} xl={15} hidden={true}>: {(expiredtiermiles) ? `${formatNumber(expiredtiermiles)} Miles` : '0'}</Col>
                            <Col xs={24} xl={9} hidden={true}><label>Expired Frequency</label></Col>
                            <Col xs={24} xl={15} hidden={true}>: {(expiredfrequency) ? formatNumber(expiredfrequency) : '0'}</Col>
                        </Col>
                    </Row>
                    <Table rowKey={record => record.trxid} dataSource={trxdetail} size="middle" pagination={false} loading={isLoading} bordered>
                        <Column title="Comment" dataIndex="comment" key="Comment" align="center" render={(value) => (value) ? value : '-'} />
                        <Column title="Trx Date" dataIndex="trxdate" key="Trx Date" align="center" render={(value) => (value) ? moment(value).format('DD/MM/YYYY') : '-'} />
                        <Column title="Award Miles" dataIndex="awardmiles" key="Award Miles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                        <Column title="Tier Miles" dataIndex="tiermiles" key="Tier Miles" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                        <Column title="Frequency" dataIndex="frequency" key="Frequency" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                        <Column title="Tier Miles Renewal" dataIndex="tierrenewal" key="Tier Miles Renewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                        <Column title="Frequency Renewal" dataIndex="frequencyrenewal" key="Frequency Renewal" align="center" render={(value) => (value) ? formatNumber(value) : '0'} />
                        <Column title="Expired Date" dataIndex="expireddate" key="Expired Date" align="center" render={(value) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} />
                        {expireddatebefore ?
                            <Column title="Expired Date Before" dataIndex="expireddatebefore" key="Expired Date Before" align="center" render={(value) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} />
                            : ''
                        }
                        {expireddateafter ?
                            <Column title="Expired Date After" dataIndex="expireddateafter" key="Expired Date After" align="center" render={(value) => (value) ? moment(value).format("DD/MM/YYYY") : '-'} />
                            : ''
                        }

                    </Table>
                </React.Fragment>
            );
        } else {
            return (<ErrorGeneral {...this.props} message={responseMessage} />);
        }
    }
}

class RelatedTrx extends React.Component {
    componentDidMount() {
        document.title = "Related Transaction | Loyalty Management System";
    }

    render() {
        let { sourcetrxid, memberid, trxtype } = this.props;
        let configurationTable = {
            url: api.url.membertransaction.list,
            criteria: { trxid: sourcetrxid },
            criteriadata: { channel: 'BO', memberid },
            columns: [
                { type: 'field', title: 'Trx ID', dataIndex: 'trxid', sorter: true },
                { type: 'html', title: 'Trx Date', dataIndex: 'trxdate', sorter: true, render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' } },
                { type: 'field', title: 'Trx Type', dataIndex: 'trxtype', sorter: true },
                { type: 'html', title: 'Comment', dataIndex: 'comment', sorter: true, render: (value) => { return (value) ? value : '-' } },
                { type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true },
                { type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true },
                { type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true }
            ]
        };

        if (trxtype !== 'CANCELLATION') configurationTable.columns = configurationTable.columns.slice(1, 7);

        return (
            <React.Fragment>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} pagination didmount={(sourcetrxid) ? true : false} />
            </React.Fragment>
        );
    }
}

export default App;