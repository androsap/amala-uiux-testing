import React, { Component } from 'react';
import { Column } from '@ant-design/charts';
import moment from 'moment';
import { Alert } from '../../../components/Base/BaseComponent';
import { DatePicker, Select, Row, Button, Icon, Spin, Empty } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';

const { Option } = Select;
const { RangePicker } = DatePicker;

function disabledDate(current){
  return current && current > moment().endOf('day');
}

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isNew: false,
      data: {
        activitytype: "all",
        startdate: moment().subtract(30,'days'),
        enddate: moment()
      },
      dataApi: [],
      selectedactivity: ['all'],
      selecteddate:[moment().subtract(30, 'days'),moment()],
    }
  }
  async retrieveData() {
    let data = this.state.data;
    let url = api.url.dashboard.corporateactivity;
    await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
      if (response.status.responsecode.substring(0, 1) === '0') {
        var dataList = response.result.map(obj => {
          var result2 = {};
          result2['type'] = obj.corporatename;
          result2['value'] = obj.jumlahactivity;
          return result2;
        });
       
        this.setState({ dataApi: dataList.slice(0,10), isLoading: false });
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
  handleReset = () => {
    const newState = Object.assign({}, this.state);
    newState.data.activitytype = "all";
    newState.data.startdate = moment().subtract(30,'days');
    newState.data.enddate = moment();
    this.setState(newState);
    this.setState({ selectedactivity: ['all']});
    this.setState({ selecteddate:[moment().subtract(30, 'days'),moment()] });
    console.log(this.state.data);
    this.retrieveData();
  }
  render() {
    const config = {
      forceFit:'true',
      data:this.state.dataApi,
      yField:'value',
      xField:'type',
      label:{
        visible: true, 
        type: 'inner'
      },
      meta:{
        type:{alias: this.state.dataApi.length > 4 ? ' ': 'Corporate Name'},
        value:{ alias:'Amount'}
      }
    }
    const { selecteddate } = this.state;
    return (
      <React.Fragment>
        <Row type="flex" justify="center">
          <RangePicker value={selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginRight: 10 }}/>
          <Select value={this.state.selectedactivity} onChange={this.handleActivity} style={{ width: 120, marginRight: 10 }}>
            <Option value="all">All Activity</Option>
            <Option value="air">Air</Option>
            <Option value="non_air">Non Air</Option>
          </Select>
          <Button onClick={this.handleReset} disabled={false} opacity="0.5" ><Icon type="reload"/></Button>
        </Row>
        <Spin spinning={this.state.isLoading}>
          {this.state.dataApi.length > 0 ? 
            <Column {...config} /> :
            <Row  style={{paddingTop: 133}}><Row style={{paddingBottom: 133}}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
        </Spin>
      </React.Fragment>
    )
  };
}
export default Layout;