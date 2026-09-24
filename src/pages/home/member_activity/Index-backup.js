import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import { Row, DatePicker, Select, Button, Icon, Spin, Empty } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { Alert } from '../../../components/Base/BaseComponent';

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function disabledDate(current){
    return current && current > moment().endOf('day');
}

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {
                activitytype: "all",
                membershipid: "all",
                startdate: moment().subtract(30, 'days'),
                enddate: moment().format("YYYY-MM-DD")
            },
            dataApi: [],
            options: [],
            selectedactivity: ['all'],
            selectedmember: ['all'],
            selecteddate:[moment().subtract(30, 'days'),moment()],
            
        }
    }
    async retrieveData() {
        let data = this.state.data;
        let url = api.url.dashboard.memberactivity;
        await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const dataList = response.result.map(obj => {
                    return obj.data.map(data => {
                        var result2 = {};
                        result2['type'] = obj.tiername;
                        result2['date'] = data.date;
                        result2['value'] = data.totalmember
                        return result2;
                    })
                })
                //mapping options data from services
                var dataOptions = response.result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.membershipname;
                    result2['value'] = obj.membershipname;
                    return result2;
                });
                //remove duplicate value
                var options = dataOptions.reduce((unique, o) => {
                    if(!unique.some(obj => obj.label === o.label && obj.value === o.value)) {
                        unique.push(o);
                    }
                    return unique;
                },[]);
                this.setState({ options, dataApi:  Object.assign([], [].concat(...dataList)), isLoading: false });               
            }
            else {
                this.setState ({dataApi: 1});
                Alert.error(response.status.responsemessage);
            }
        });
    }
    componentDidMount() {
        this.retrieveData();
    }
    handleDate = (value, dateString) => {
        const newState = Object.assign({}, this.state);
        newState.data.startdate = dateString[0];
        newState.data.enddate = dateString[1];
        this.setState(newState);
        this.setState({ selecteddate:[value[0],value[1]]});
        console.log(this.state.data);
        this.retrieveData();
    }
    handleActivity = (value, dateString) => {
        const newState = Object.assign({}, this.state);
        newState.data.activitytype = value;
        this.setState(newState);
        this.setState({ selectedactivity: value });
        console.log(this.state.data);
        this.retrieveData();
    }
    handleMembership = (value, dateString) => {
        const newState = Object.assign({}, this.state);
        newState.data.membershipid = value;
        this.setState(newState);
        this.setState({ selectedmember: value });
        console.log(this.state.data);
        this.retrieveData();
    }
    handleReset = () => {
        const newState = Object.assign({}, this.state);
        newState.data.activitytype = "all";
        newState.data.membershipid = "all";
        newState.data.startdate = moment().subtract(30,'days');
        newState.data.enddate = moment();
        this.setState(newState);
        this.setState({ selectedactivity: ['all']});
        this.setState({ selectedmember: ['all']});
        this.setState({ selecteddate:[moment().subtract(30, 'days'),moment()] });
        console.log(this.state.data);
        this.retrieveData();
    }
    render() {
        const { selecteddate } = this.state;
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <RangePicker value={selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginBottom: 16 }} />
                    <br></br>
                    <Select value={this.state.selectedactivity} onChange={this.handleActivity} style={{ width: 110,marginLeft: 12 }}>
                        <Option value="all">All Activity</Option>
                        <Option value="air">Air</Option>
                        <Option value="non_air">Non Air</Option>
                    </Select>
                    <Select value={this.state.selectedmember} onChange={this.handleMembership} style={{ width: 135,marginLeft: 12 }} >
                        <Option value="all">All Membership</Option>
                        {this.state.options.map((item, index) => <Option value={item.value} key={index}>{item.label}</Option>)}
                    </Select>
                    <Button onClick={this.handleReset} disabled={false} opacity="0.5" style={{ marginLeft: 16 }}><Icon type="reload" /></Button>
                </Row>
                <Spin spinning={this.state.isLoading}>
                {this.state.dataApi.length > 0 ? 
                    <Line {...{
                        padding: 'auto',
                        forceFit: true,
                        data:this.state.dataApi,
                        xField: 'date',
                        yField: 'value',
                        yAxis: { label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) } },
                        xAxis: { tickCount: 10 },
                        legend: {
                            position: 'bottom',
                            justify: 'center',
                        },
                        seriesField: 'type',
                        color: ['#1979C9', '#D62A0D', '#FAA219','#295939','#822659','#000000','#00af91'],
                        responsive: true,
                    }} /> : <Row  style={{paddingTop: 133}}><Row style={{paddingBottom: 133}}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
                </Spin>
            </React.Fragment>
        )
    }
}
export default Layout;
