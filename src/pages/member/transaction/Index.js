import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest } from '../../../utilities/RequestService';
import { Button, Alert, SearchForm, TableBase } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Menu, Button as AntButton, Dropdown, Icon, Modal } from 'antd';
import { jsUcfirst } from '../../../utilities/Helpers';
import { MemberTrxType } from '../../../data';
import { MemberLockAlert } from '../../../components/Partials';
import moment from 'moment';

const { Title, Text } = Typography;
const { confirm } = Modal;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advancesearch: false,
            fielddisabled: {
                createddatedisabled: false,
                trxdatedisabled: false,
                downloaddisabled: true,
            }
        }
    };

    componentDidMount() {
        document.title = "Member Transaction | Loyalty Management System";
        this.getCount();
    };

    handleSelectCheckbox = (advancesearch) => {
        let trxtypes = this.props.form.getFieldValue('trxtypes');
        let trxtypes2 = this.props.form.getFieldValue('trxtypes2');

        if (advancesearch) {
            this.props.form.setFieldsValue({ trxtypes: trxtypes2 });
        } else this.props.form.setFieldsValue({ trxtypes2: trxtypes });

        this.setState({ advancesearch })
    };

    getCount = () => {
        let trxtype = this.props.form.getFieldValue('trxtypes2');
        let trxdatestart = this.props.form.getFieldValue('trxdatestart');
        let createddatestart = this.props.form.getFieldValue('createddatestart');
        let trxdateend = this.props.form.getFieldValue('trxdateend');
        let createddateend = this.props.form.getFieldValue('createddateend');
        let memberid = this.props.match.params.ID;
        let createddatestart2 = createddatestart ? moment(createddatestart).format("YYYY-MM-DD") : '';
        let createddateend2 = createddateend ? moment(createddateend).format("YYYY-MM-DD") : '';
        let trxdatestart2 = trxdatestart ? moment(trxdatestart).format("YYYY-MM-DD") : '';
        let trxdateend2 = trxdateend ? moment(trxdateend).format("YYYY-MM-DD") : '';

        DetailRequest(api.url.membertransaction.count, {
            memberid, trxtype: trxtype ? trxtype : [], trxdatestart: trxdatestart2,
            trxdateend: trxdateend2, createddatestart: createddatestart2, createddateend: createddateend2
        }).then((response) => {
            let { status = {}, result } = response;
            if (result && status.responsecode === '0000') {
                if (result.length !== 0) {
                    let totalawardmiles = (result.totalawardmiles) ? result.totalawardmiles : 0;
                    let totalfrequency = (result.totalfrequency) ? result.totalfrequency : 0;
                    let totaltiermiles = (result.totaltiermiles) ? result.totaltiermiles : 0;

                    this.setState({ totalawardmiles, totalfrequency, totaltiermiles });
                } else this.setState({ responseMessage: 'Data not found', formrender: false });
                this.setState({ result: result[0] });
            } else Alert.error('Total not found');
        })
    };

    getDownload = () => {
        let trxtype = this.props.form.getFieldValue('trxtypes2');
        let trxdatestart = this.props.form.getFieldValue('trxdatestart');
        let createddatestart = this.props.form.getFieldValue('createddatestart');
        let trxdateend = this.props.form.getFieldValue('trxdateend');
        let createddateend = this.props.form.getFieldValue('createddateend');
        let memberid = this.props.match.params.ID;
        let createddatestart2 = createddatestart ? moment(createddatestart).format("YYYY-MM-DD") : '';
        let createddateend2 = createddateend ? moment(createddateend).format("YYYY-MM-DD") : '';
        let trxdatestart2 = trxdatestart ? moment(trxdatestart).format("YYYY-MM-DD") : '';
        let trxdateend2 = trxdateend ? moment(trxdateend).format("YYYY-MM-DD") : '';

        if ((trxdatestart2 && trxdateend2) || (createddatestart2 && createddateend2)) {

            let data = { memberid, trxdatestart: trxdatestart2, trxdateend: trxdateend2, createddatestart: createddatestart2, createddateend: createddateend2 };
            if (trxtype && trxtype.length !== 0) {
                data.trxtypes = trxtype;
            } else data.trxtype = [];

            DetailRequest(api.url.membertransaction.generatepdf, data).then((response) => {
                let { status = {}, result } = response;
                const { responsemessage } = response.status;
                if (result && status.responsecode === '0000') {
                    if (result.length !== 0) {
                        let downloaddisabled = false;
                        this.setState({ fielddisabled: { ...this.state.fielddisabled, downloaddisabled } });
                        let url = (result.url) ? result.url : '';
                        let data = { memberid, trxdatestart: trxdatestart2, trxdateend: trxdateend2, createddatestart: createddatestart2, createddateend: createddateend2, };

                        if (trxtype && trxtype.length !== 0) {
                            data.trxtypes = trxtype;
                        } else data.trxtype = [];

                        this.setState({ url });
                        DetailRequest(api.url.membertransaction.generatecsv, data).then((response) => {
                            let { status = {}, result } = response;
                            if (result && status.responsecode === '0000') {
                                if (result.length !== 0) {
                                    let url2 = (result.url) ? result.url : '';
                                    this.setState({ url2 });
                                };
                            };
                        });
                    }
                } else {
                    Alert.error(responsemessage);
                    let downloaddisabled = true;
                    this.setState({ fielddisabled: { ...this.state.fielddisabled, downloaddisabled } });
                };
            })
        };
    };

    handleDownload = (type) => {
        const callback = () => {
            window.location.href = (type === 'PDF') ? this.state.url : this.state.url2;
            Alert.success('Downloading...');
        }

        confirm({
            title: 'Are you sure want to download this file?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    handleSearchForm = async (criteria, criteriadataprevious) => {
        await this.setState({ isLoading: true });
        let trxtypes = [];

        if (!this.state.advancesearch) {
            trxtypes = this.props.form.getFieldValue('trxtypes2');
        } else trxtypes = this.props.form.getFieldValue('trxtypes');

        let criteriadata = (trxtypes && trxtypes.length !== 0) ? { ...criteriadataprevious, trxtypes } : { ...criteriadataprevious };

        await this.componentTable.handleSearchForm(criteria, criteriadata);
        await this.getCount();
        await this.getDownload();
        await this.setState({ isLoading: false });
    };

    handleCreatedDate = (date, type) => {
        const trxdatestart = this.props.form.getFieldValue('trxdatestart');
        const trxdateend = this.props.form.getFieldValue('trxdateend');
        const createddatedisabled = (date) ? true : false;
        // const downloaddisabled = (((type === 'start') && date && trxdateend) || ((type === 'end') && date && trxdatestart)) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, createddatedisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ createddatestart: undefined, createddateend: undefined });
        this.props.form.resetFields(['trxdateend', []]);
    };

    handleTrxDate = (date, type) => {
        const createddatestart = this.props.form.getFieldValue('createddatestart');
        const createddateend = this.props.form.getFieldValue('createddateend');
        const trxdatedisabled = (date) ? true : false;
        // const downloaddisabled = (((type === 'start') && date && createddateend) || ((type === 'end') && date && createddatestart)) ? false : true;

        let fielddisabled = { ...this.state.fielddisabled, trxdatedisabled };
        this.setState({ fielddisabled });
        this.props.form.setFieldsValue({ trxdatestart: undefined, trxdateend: undefined });
        this.props.form.resetFields(['createddateend', []]);
    };

    render() {
        const { menucode, prefixmenuname, memberlock } = this.props;
        const { totaltiermiles, totalawardmiles, totalfrequency, fielddisabled } = this.state;
        const { blockaccrual, blockredeem } = memberlock || {};
        const { createddatedisabled, trxdatedisabled, downloaddisabled } = fielddisabled;
        const trxdatestart = this.props.form.getFieldValue('trxdatestart');
        const createddatestart = this.props.form.getFieldValue('createddatestart');
        const trxdateend = this.props.form.getFieldValue('trxdateend');
        const createddateend = this.props.form.getFieldValue('createddateend');
        const disableddownload = (trxdatestart || createddatestart || trxdateend || createddateend) ? downloaddisabled : true;

        const configurationSearchForm = [
            {
                labeltext: "Transaction Start Date", datafield: "trxdatestart", type: 'datepicker', placeholder: 'Transaction Start Date', specialSearch: true, showDefaultSearch: true,
                disabled: createddatestart || createddateend ? trxdatedisabled : false, maxDate: moment().subtract(0, 'days'), onChange: (e) => this.handleCreatedDate(e, 'start')
            },
            {
                labeltext: "Transaction End Date", datafield: "trxdateend", type: 'datepicker', placeholder: 'Transaction End Date', specialSearch: true, showDefaultSearch: true,
                disabled: createddatestart || createddateend ? trxdatedisabled : (!trxdatestart) ? true : false, maxDate: moment(trxdatestart).add(13, 'months'), minDate: moment(trxdatestart), onChange: (e) => this.handleCreatedDate(e, 'end')
            },
            { labeltext: 'Transaction Type', datafield: 'trxtypes', type: 'selectcheckbox', placeholder: 'Transaction Type', options: MemberTrxType, showDefaultSearch: (window.innerWidth > 767), specialSearch: true },
            {
                labeltext: 'Start Created Date', datafield: 'createddatestart', type: 'datepicker', placeholder: 'Start Created Date', showDefaultSearch: (window.innerWidth > 767), specialSearch: true,
                disabled: trxdatestart || trxdateend ? createddatedisabled : false, maxDate: moment().subtract(0, 'days'), onChange: (e) => this.handleTrxDate(e, 'start')
            },
            {
                labeltext: 'End Created Date', datafield: 'createddateend', type: 'datepicker', placeholder: 'End Created Date', showDefaultSearch: (window.innerWidth > 767), specialSearch: true,
                disabled: trxdatestart || trxdateend ? createddatedisabled : (!createddatestart) ? true : false, maxDate: moment(createddatestart).add(13, 'months'), minDate: moment(createddatestart), onChange: (e) => this.handleTrxDate(e, 'end')
            },
        ];

        const configurationTable = {
            url: api.url.membertransaction.list,
            criteriadata: { memberid: this.props.match.params.ID, channel: 'BO' },
            sort: { createddate: 'desc' },
            columns: [
                {
                    type: 'html', title: 'Trx Date', dataIndex: 'trxdate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'Trx Type', dataIndex: 'trxtype', sorter: true,
                    render: (value) => (value) ? jsUcfirst(value, '_') : ''
                },
                {
                    type: 'html', title: 'Comment', dataIndex: 'comment', sorter: true,
                    render: (value, record) => {
                        if (value) {
                            let notes = (record.notes) ? record.notes : null;
                            if (record.trxtype === 'EXPIRATION' || record.trxtype === 'EXTENSION' || record.trxtype === 'EARNING' || record.trxtype === 'SPENDING' || record.trxtype === 'SPENDING_CORRECTION' || record.trxtype === 'CANCELLATION') {
                                value = <span>
                                    <span>{value}</span>
                                    {(notes) ? <div style={{ fontSize: '10px', fontStyle: 'italic' }}> <Text type='danger'>Notes : {notes}</Text></div> : null}
                                </span>;
                            }
                            return value;
                        } else return '-';
                    }
                },
                {
                    type: 'field', title: 'Award Miles', dataIndex: 'awardmiles', sorter: true,
                    render: (value, record) => <p align='right' style={{ marginRight: '7%', marginTop: '15%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>
                },
                {
                    type: 'field', title: 'Tier Miles', dataIndex: 'tiermiles', sorter: true,
                    render: (value, record) => <p align='right' style={{ marginRight: '7%', marginTop: '15%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>
                },
                {
                    type: 'field', title: 'Frequency', dataIndex: 'frequency', sorter: true,
                    render: (value, record) => <p align='right' style={{ marginRight: '7%', marginTop: '15%' }}>{(value) ? value.toLocaleString('en-US') : 0}</p>
                },
                { type: 'field', title: 'Tier Renewal', dataIndex: 'tierrenewal', sorter: true },
                { type: 'field', title: 'Frequency Renewal', dataIndex: 'frequencyrenewal', sorter: true },
                {
                    type: 'html', title: 'Created Date', dataIndex: 'createddate', sorter: true,
                    render: (value) => { return (value) ? moment(value).format('DD/MM/YYYY') : '' }
                },
                {
                    type: 'field', title: 'Created by', dataIndex: 'createdby', sorter: true,
                    render: (value, record) => (value) ? value : '-'
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (_value, row) => {
                        return (
                            <span>
                                <Button url={`${this.props.location.pathname}/detail/${row.trxid}`} size='small' label='View Detail' />
                            </span>
                        )
                    }
                },
            ]
        };

        return (
            <React.Fragment>
                <Row>
                    <Col xs={16} sm={18}>
                        <Title level={4}>Manage Transaction</Title>
                    </Col>
                    <Col xs={8} sm={6} align="right">
                        <Button visible={!(blockaccrual && blockredeem)} type="primary" url={this.props.match.url + '/form'} size="default" label="Add New" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE" />
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="1">
                                    <Button htmlType="button" type="default" icon="download" label="PDF" onClick={() => this.handleDownload('PDF')} />
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Button htmlType="button" type="default" icon="download" label="CSV" onClick={() => this.handleDownload('CSV')} />
                                </Menu.Item>
                            </Menu>
                        } disabled={disableddownload}>
                            <AntButton type="default" size="default"
                                title={(trxdatestart && trxdateend || createddatestart && createddateend) ? '' : 'Criteria Must be Filled'}>
                                Download <Icon type="down" />
                            </AntButton >
                        </Dropdown>
                    </Col>
                    <Divider />
                    {(blockaccrual || blockredeem) ? <MemberLockAlert memberlock={memberlock} /> : ''}
                </Row>
                <SearchForm form={this.props.form} showAdvanceSearch={(window.innerWidth < 768)} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} searchWithSelectCheckbox={true} />
                <Row style={{ marginTop: 10 }}>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}><label> Total Award Miles </label></Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>: {totalawardmiles ? totalawardmiles.toLocaleString('en-US') : '0'} </Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}><label> Total Tier Miles </label></Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>: {totaltiermiles ? totaltiermiles.toLocaleString('en-US') : '0'}</Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}><label> Total Frequency </label></Col>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>: {totalfrequency ? totalfrequency.toLocaleString('en-US') : '0'}</Col>
                </Row>
                <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} />
            </React.Fragment>
        );
    }
}

export default Form.create()(App);