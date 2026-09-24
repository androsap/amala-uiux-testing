import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import { Row, DatePicker, Select, Button, Icon, Spin, Empty } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { Alert } from '../../../components/Base/BaseComponent';
import '../../../assets/css/react-select.css'

const { Option } = Select;
const { RangePicker } = DatePicker;
const memberOptions = [
    { value: 'ALL', label: 'All Member' },
    { value: 'MEMBERGA', label: 'Member GA' },
    { value: 'MEMBERNONGA', label: 'Member Non-GA' },
    { value: 'NONMEMBER', label: 'Non-Member' }
]

function disabledDate(current) {
    return current && current > moment().endOf('day');
}

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: {
                member: "ALL",
                ffpcarriercode: [],
                startdate: moment().subtract(30, 'days'),
                enddate: moment().format("YYYY-MM-DD")
            },
            fielddisabled: {
                ffpcarriercodefielddisabled: true
            },
            dataApi: [],
            dataOptions: [],
            options:[],
            selectedffpcarriercode: [],
            selectedmember: 'ALL',
            selecteddate: [moment().subtract(30, 'days'), moment()],
        }
    }

    async retrieveData() {
        let data = this.state.data;
        let url = api.url.dashboard.flight;
        await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const dataList = response.result.map(obj => {
                    return obj.data.map(data => {
                        var result2 = {};
                        result2['type'] = obj.type;
                        result2['date'] = data.date;
                        result2['value'] = data.totalmember;
                        return result2;
                    })
                })
                this.setState({ dataApi: Object.assign([], [].concat(...dataList)), isLoading: false });
            }
            else {
                this.setState({ dataApi: 1 });
                Alert.error(response.status.responsemessage);
            }
        });
    }

    async retrieveOptions() {
        let data = this.state.data;
        let url = api.url.dashboard.flight;
        await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                var dataOption = response.result.map(obj => {
                    var result2 = {};
                    result2['type'] = obj.type;
                    result2['typelabel'] = obj.type;
                    return result2;
                });
                //remove duplicate value
                var options = dataOption.reduce((unique, o) => {
                    if(!unique.some(obj => obj.typelabel === o.typelabel)) {
                        unique.push(o);
                    }
                    return unique;
                },[]);

                var dataOptions = response.result.map(obj => {
                    var result2 = {};
                    result2['carrier'] = obj.ffpcarriercode;
                    result2['carrierlabel'] = obj.ffpcarriercode;
                    return result2;
                });
                this.setState({ options, dataOptions });
                console.log({dataOptions});
            }
            else {
                
            }
        });
    }

    componentDidMount() {
        this.retrieveData();
        this.retrieveOptions();
    }

    handleDate = (value, dateString) => {
        const newState = Object.assign({}, this.state);
        newState.data.startdate = dateString[0];
        newState.data.enddate = dateString[1];
        this.setState(newState);
        this.setState({ selecteddate: [value[0], value[1]] });
        console.log(this.state.data);
        this.retrieveData();
        this.retrieveOptions();
    }

    handleMember = (value, dateString) => {
        const newState = Object.assign({}, this.state);
        const ffpcarriercodefielddisabled = (value === 'MEMBERNONGA') ? false : true;
        const fielddisabled = { ...this.state.fielddisabled, ffpcarriercodefielddisabled };
        newState.data.member = value;
        this.setState({ newState, fielddisabled });
        this.setState({ selectedmember: value });
        if (value === 'ALL' || value === 'NONMEMBER'){
            newState.data.ffpcarriercode = [""];
            this.setState({newState, selectedffpcarriercode: [""]})
        }else if (value === 'MEMBERGA') {
            newState.data.ffpcarriercode = ["GA"];
            this.setState({newState, selectedffpcarriercode: ["GA"]})
        }else{
            newState.data.ffpcarriercode = [""];
            this.setState({newState, selectedffpcarriercode: [""]});
            const dataOptions = this.state.dataOptions.splice(0,2);
            this.setState(dataOptions);
        };
        console.log(this.state.data);
        this.retrieveData();
    }

    handleFfpcariercode = (value, dateString) => {
        const newState = Object.assign({}, this.state);
        if (value !== "GA") {
            newState.data.ffpcarriercode = value;
            this.setState({ newState, selectedffpcarriercode: value });
        } else {
            newState.data.ffpcarriercode = [value];
            this.setState({ newState, selectedffpcarriercode: [value] });
        }
        this.setState({ isRetrieved: false })
        console.log(this.state.data);
        this.retrieveData();
    }

    handleReset = () => {
        const newState = Object.assign({}, this.state);
        newState.data.ffpcarriercode = [];
        newState.data.startdate = moment().subtract(30, 'days');
        newState.data.enddate = moment();
        newState.data.member = "ALL";
        this.setState({ newState, selecteddate: [moment().subtract(30, 'days'), moment()]});
        this.setState({ selectedmember: ["ALL"]})
        this.setState({ selectedffpcarriercode: [""]})
        const ffpcarriercodefielddisabled = (this.state.data.member === 'MEMBERNONGA') ? false : true;
        const fielddisabled = { ...this.state.fielddisabled, ffpcarriercodefielddisabled };
        this.setState({ fielddisabled });
        console.log(this.state.data);
        this.retrieveData();
        this.retrieveOptions();
    }

    render() {
        const { ffpcarriercodefielddisabled } = this.state.fielddisabled;
        return (
            <React.Fragment>
                <Row type="flex" justify="center">
                    <RangePicker value={this.state.selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginBottom: 16 }} />
                    <br></br>
                    <Select value={this.state.selectedmember} onChange={this.handleMember} style={{ width: 120, marginLeft: 16 }}>
                        {memberOptions.map((item, index) => <Option value={item.value} key={index}>{item.label}</Option>)}
                    </Select>
                    <Select className='Select-Dasboard--multiple' mode={this.state.selectedmember !== "MEMBERGA" ? 'multiple' : "default"} value={this.state.selectedffpcarriercode} onChange={this.handleFfpcariercode} style={{ width: 120, marginLeft: 16 }} disabled={ffpcarriercodefielddisabled} >
                        {this.state.dataOptions.map((item, index) => <Option value={item.carrier} key={index}>{item.carrierlabel}</Option>)}
                    </Select>
                    <Button onClick={this.handleReset} disabled={false} opacity="0.5" style={{ marginLeft: 12 }}><Icon type="reload" /></Button>
                </Row>
                <Spin spinning={this.state.isLoading}>
                    {this.state.dataApi.length > 0 ?
                        <Line {...{
                            padding: 'auto',
                            forceFit: true,
                            data: this.state.dataApi,
                            xField: 'date',
                            yField: 'value',
                            xAxis: {
                              tickCount: 4
                            },
                            yAxis: { label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) } },
                            meta:{},
                            legend: {
                                position: 'bottom',
                                justify: 'center',
                            },
                            seriesField: 'type',
                            color: ['#1979C9', '#D62A0D', '#FAA219', '#295939', '#822659', '#000000', '#00af91'],
                            responsive: true,
                        }} /> : <Row style={{ paddingTop: 133 }}><Row style={{ paddingBottom: 133 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
                </Spin>

            </React.Fragment>
        )
    }
}
export default Layout;