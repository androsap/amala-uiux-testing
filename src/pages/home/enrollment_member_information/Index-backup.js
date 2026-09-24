import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import { Row, Spin, Empty, Form, Col, Card } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { SelectBase, Alert, ChannelSelect, DateRangeBase, Button } from '../../../components/Base/BaseComponent';

const optionsMembership = [
    { label: 'Regular', value: 'regular' },
    { label: 'VIP', value: 'vip' }
]

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageType: props.pageType,
            isLoading: false,
            dataChart: {
                enrollchannel: 'ALL',
                membershipid: 'regular',
                enrollmentdate: moment().subtract(30, 'days'),
                enddate: moment().format("YYYY-MM-DD")
            },
            dataApi: [],
            visible: false
        }
    }

    componentDidMount() {
        const { pageType } = this.state;
        if (pageType === 'main') {
            this.retrieveData();
            this.componentChannelSelect.retrieveData();
        }
    }


    retrieveData = () => {
        const { pageType, dataChart } = this.state;
        if (pageType === 'main' && !dataChart.enrollchannel) dataChart['enrollchannel'] = 'ALL';
        let data = (pageType === 'main') ? dataChart : {};
        let url = api.url.dashboard.enrollmentmember;
        this.setState({ isLoading: true });
        RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const dataList = response.result.map(obj => {
                    return obj.data.map(data => {
                        var result2 = {};
                        result2['type'] = obj.tiername;
                        result2['date'] = data.enrollmentdate;
                        result2['value'] = data.totalmember;
                        return result2;
                    })
                })
                let dataApi = Object.assign([], [].concat(...dataList));
                this.setState({ dataApi, isLoading: false });

                // localStorage.setItem("localData", JSON.stringify(dataApi));
                // //...
                // var storedNames = JSON.parse(localStorage.getItem("localData"));
            }
            else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleChangeDate = (value) => {
        const { dataChart } = this.state;
        let enrDate = value[0].format('YYYY-MM-DD');
        let endDate = value[1].format('YYYY-MM-DD');
        this.setState({ dataChart: { ...dataChart, enrollmentdate: enrDate, enddate: endDate } }, () => { this.retrieveData() })
    }

    handleChangeMembership = (value) => {
        const { dataChart } = this.state;
        this.setState({ dataChart: { ...dataChart, membershipid: value } }, () => { this.retrieveData() })
        // localStorage.setItem(PROFILE_KEY, token);
    }

    handleChangeEnrChannel = (value) => {
        const { dataChart } = this.state;
        this.setState({ dataChart: { ...dataChart, enrollchannel: value } }, () => { this.retrieveData() })
    }

    handleReset = () => {
        let enrollchannel = 'ALL';
        let membershipid = 'regular';
        let enrollmentdate = moment().subtract(30, 'days');
        let enddate = moment();
        let date = [enrollmentdate, enddate];
        let setValue = { enrollchannel, membershipid, date };
        this.props.form.setFieldsValue(setValue);
        this.setState({ dataChart: { enrollchannel, membershipid, enrollmentdate, enddate } }, () => this.retrieveData());
    }

    handleOpenModal = (certificateid) => {
        this.setState({ certificateid, visible: true });
    }

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Verify New' });
    };

    render() {
        const { form } = this.props;
        const { isLoading, dataApi, pageType } = this.state;
        console.log('dataApi', dataApi)
        return (
            <React.Fragment>
                {
                    (pageType === 'main') ?
                        <Form>
                            <Row gutter={3}>
                                <Col xs={8} sm={8} md={8}>
                                    <DateRangeBase form={this.props.form} datafield="date" placeholder={['Enrollment Date', 'End Date']} defaultValue={[moment().subtract(30, 'days'), moment()]} minDate={moment().subtract(30, 'days')} maxDate={moment()} onChange={this.handleChangeDate} />
                                </Col>
                                <Col xs={8} sm={8} md={8}>
                                    <SelectBase form={form} datafield="membershipid" placeholder="Membership" options={optionsMembership} defaultValue="regular" onChange={this.handleChangeMembership} />
                                </Col>
                                <Col xs={8} sm={8} md={8}>
                                    <ChannelSelect ref={(e) => { this.componentChannelSelect = e }} form={form} placeholder="Channel" datafield="enrollchannel" onChange={this.handleChangeEnrChannel} />
                                </Col>
                            </Row>
                            {/* <Button htmlType="button" icon="redo" onClick={this.handleReset} /> */}
                        </Form> : ''
                }
                <Spin spinning={isLoading}>
                    {dataApi || dataApi.length > 0 ?
                        <Line {...{
                            padding: 'auto',
                            forceFit: true,
                            data: dataApi,
                            xField: 'date',
                            yField: 'value',
                            yAxis: { label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) } },
                            legend: {
                                position: 'bottom',
                                justify: 'center',
                            },
                            seriesField: 'type',
                            color: ['#1979C9', '#D62A0D', '#FAA219', '#295939', '#822659', '#000000', '#00af91'],
                            responsive: true,
                        }} /> :
                        <Row style={{ paddingTop: 133 }}><Row style={{ paddingBottom: 133 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
                </Spin>
            </React.Fragment>
        )
    }
}

export default Form.create()(Layout);