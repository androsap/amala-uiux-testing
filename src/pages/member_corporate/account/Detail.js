import React from 'react';
import { api } from '../../../config/Services';
import { GeneralRequest } from '../../../utilities/RequestService';
import { Button, Alert, Pagination, SelectBase, DatePickerBase } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Table, Icon, Typography } from 'antd';
import moment from 'moment';

const { Column } = Table;
const { Text } = Typography;
const optionsStatus = [
    { label: 'All', value: null },
    { label: 'Valid', value: false },
    { label: 'Expired', value: true }
];
const optionsExtandable = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
];

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
            isLoaded: false,
            startperiod: (this.props.type === 'expiredthismonth') ? moment().startOf('month').format('YYYY-MM-DD') : null,
            endperiod: (this.props.type === 'expiredthismonth') ? moment().endOf('month').format('YYYY-MM-DD') : null,
            totalawardmiles: null,
            totaltiermiles: null,
            totalfrequency: null,
            showAdvanceSearch: false,
            advancesearch: false,
            fielddisabled: {
                startperioddisabled: false,
                endperioddisabled: false
            }
        }
    }

    componentDidMount() {
        this.getList();
    }

    getList = () => {
        const { startperiod, endperiod } = this.state;
        const { memberaccountid } = this.props;
        let paging = { page: this.state.current, limit: this.state.pageSize };
        let criteria = this.state.criteria;

        if (this.props.type === 'allexpiredaccount') { criteria.isexpired = true; }

        let data = { memberaccountid, startperiod, endperiod };
        let url = api.url.memberaccountdetail.retrieve;
        let column = [];
        this.setState({ isLoaded: true });
        const { sort } = this.state;
        var result = GeneralRequest(url, paging, column, criteria, sort, data);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                let number = (paging.page - 1) * paging.limit;
                let dataList = response.result['accountdetails'].map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

                let totalawardmiles = response.result['totalawardmiles'];
                let totaltiermiles = response.result['totaltiermiles'];
                let totalfrequency = response.result['totalfrequency'];

                let totalrecord = response.paging.totalrecord;

                this.setState({ dataList, totalawardmiles, totaltiermiles, totalfrequency, totalrecord, isLoaded: false });

                if (this.props.type === 'expiredthismonth') {
                    let setValue = { startperiod: moment(startperiod), endperiod: moment(endperiod) };
                    this.props.form.setFieldsValue(setValue);

                    let fielddisabled = { ...this.state.fielddisabled, startperioddisabled: true, endperioddisabled: true };
                    this.setState({ fielddisabled });
                }
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

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let startperiod = (values.startperiod) ? moment(values.startperiod).format("YYYY-MM-DD") : null;
            let endperiod = (values.endperiod) ? moment(values.endperiod).format("YYYY-MM-DD") : null;
            let expireddate = (values.expireddate) ? moment(values.expireddate).format("YYYY/MM/DD") : null;
            let isexpired = (values.status !== undefined) ? values.status : null;
            let extendable = (values.extendable !== undefined) ? values.extendable : null;

            this.setState({
                current: 1,
                pageSize: 10,
                criteria: {
                    ...this.state.criteria,
                    expireddate, isexpired, extendable
                },
                startperiod, endperiod
            }, () => this.getList());
        });
    }

    handleAdvanceSearch = () => {
        const { advancesearch } = this.state;
        this.setState({ advancesearch: !advancesearch });
    };

    render() {
        // const { isLoaded, dataList, current, totalrecord, pageSize, totalawardmiles, totalfrequency, totaltiermiles } = this.state;
        const { isLoaded, dataList, current, totalrecord, pageSize } = this.state;
        const { advancesearch } = this.state;
        const { startperioddisabled, endperioddisabled } = this.state.fielddisabled;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <React.Fragment>
                <Row>
                    <Form layout="inline" className={(!advancesearch) ? "searching-form" : "searching-form hidden"} onSubmit={this.handleSearch} >
                        <DatePickerBase form={this.props.form} datafield="startperiod" placeholder="Start Period" disabled={startperioddisabled} />
                        <DatePickerBase form={this.props.form} datafield="endperiod" placeholder="End Period" disabled={endperioddisabled} />
                        <DatePickerBase form={this.props.form} datafield="expireddate" placeholder="Expired Date" />
                        {/* <SelectBase form={this.props.form} datafield="status" placeholder="Status" options={optionsStatus} />
                        <SelectBase form={this.props.form} datafield="extendable" placeholder="Extandable" options={optionsExtandable} /> */}
                        <span style={{ lineHeight: '40px' }}>
                            <Button label="Search" size="default" type="primary" htmlType="submit" />
                            <Button label="Clear" size="default" style={{ marginLeft: 8 }} onClick={this.handleReset} htmlType="button" />
                        </span>
                        <Row>
                            <a className="btn-advance-search" style={{ fontSize: 12 }} onClick={this.handleAdvanceSearch}>
                                Advance Search<Icon type={advancesearch ? 'up' : 'down'} />
                            </a>
                        </Row>
                    </Form>
                    <Form {...formItemLayout} className="searching-form" style={{ display: ((advancesearch)) ? 'block' : 'none' }} onSubmit={this.handleSearch}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                <a className="btn-advance-search" style={{ fontSize: 12 }} onClick={this.handleAdvanceSearch}>
                                    Advance Search<Icon type={advancesearch ? 'up' : 'down'} />
                                </a>
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={12} xl={12}>
                                <DatePickerBase labeltext="Start Period" form={this.props.form} datafield="startperiod" placeholder="Start Period" disabled={startperioddisabled} />
                                <DatePickerBase labeltext="End Period" form={this.props.form} datafield="endperiod" placeholder="End Period" disabled={endperioddisabled} />
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={12} xl={12}>
                                <DatePickerBase labeltext="Expired Date" form={this.props.form} datafield="expireddate" placeholder="Expired Date" />
                                <SelectBase labeltext="Status" form={this.props.form} datafield="status" placeholder="Status" options={optionsStatus} />
                                <SelectBase labeltext="Extandable" form={this.props.form} datafield="extendable" placeholder="Extandable" options={optionsExtandable} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button label="Search" size="default" type="primary" htmlType="submit"> Search </Button>
                                <Button label="Clear" size="default" style={{ marginLeft: 8 }} onClick={this.handleReset} htmlType="button" > Clear </Button>
                            </Col>
                        </Row>
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
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.trxid} dataSource={dataList} size="middle" pagination={false} loading={isLoaded} onChange={this.handleTableChange}>
                        <Column title="No" dataIndex="number" key="number" />
                        <Column title="Comment" dataIndex="comment" key="comment"
                            render={(value, record) => {
                                if (value) {
                                    let notes = (record.notes) ? record.notes : null;
                                    value = <span>
                                        <span>{value}</span>
                                        {(notes) ? <div style={{ fontSize: '10px', fontStyle: 'italic' }}> <Text type="danger">Notes : {notes}</Text></div> : null}
                                    </span>;
                                    return value;
                                } else {
                                    return '-';
                                }
                            }} />
                        <Column title="Trx Date" dataIndex="trxdate" key="trxdate" sorter={false} render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : ''} />
                        <Column title="Award Miles" dataIndex="awardmiles" key="awardmiles" sorter={false} render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                        <Column title="Tiers Miles" dataIndex="tiermiles" key="tiermiles" sorter={false} render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                        <Column title="Frequency" dataIndex="frequency" key="frequency" sorter={false} render={(value, record) => (value !== undefined && value !== null) ? value : '-'} />
                        <Column title="Expired Date" dataIndex="expireddate" key="expireddate" sorter={false} render={(value, record) => (value) ? moment(value).format('DD/MM/YYYY') : ''} />
                        <Column title="Status" dataIndex="status" key="status" sorter={false} render={(value, record) => {
                            if (record.isexpired === true) {
                                return "Expired";
                            } else if (record.isexpired === false) {
                                return "Valid";
                            } else if (record.isexpired === null) {
                                return "All";
                            } else {
                                return "-";
                            }
                        }} />
                        <Column title="Extendable" dataIndex="extendable" key="extendable" sorter={false} render={(value, record) => (value) ? "Yes" : "No"} />
                    </Table>
                </Row>
                <Row type="flex" justify="end">
                    <Pagination
                        current={current}
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