import React, { Component } from 'react';
import { Pie } from '@ant-design/charts';
import { Alert } from '../../../components/Base/BaseComponent';
import moment from 'moment';
import { DatePicker, Select, Row, Button, Icon, Spin, Empty } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

function disabledDate(current){
  return  current < moment().subtract(1,'days');
}

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {
        gender: "all",
        startdate: moment().format("YYYY-MM-DD")
      },
      dataApi: [],
      selectedgender: ['all'],
      selecteddate:moment(moment(),"YYYY-MM-DD"),
    }
  }
  async retrieveData() {
    let data = this.state.data;
    let url = api.url.dashboard.membertier;
    await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
      if (response.status.responsecode.substring(0, 1) === '0') {
        var dataList = response.result.map(obj => {
          var result2 = {};
          result2['type'] = obj.tiername;
          result2['value'] = obj.percentage;
          result2['gender'] = obj.gender;
          result2['jumlah'] = obj.jumlah;
          return result2;
        });
        this.setState({ dataApi: dataList });
        this.setState({isLoading: false})
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
    newState.data.startdate = dateString;
    this.setState(newState);
    this.setState({ selecteddate: value});
    console.log(this.state.data);
    this.retrieveData();
  }
  handleGender = (value, dateString) => {
    const newState = Object.assign({}, this.state);
    newState.data.gender = value;
    this.setState(newState);
    this.setState({ selectedgender: value });
    console.log(this.state.data);
    this.retrieveData();
  }
  handleReset = () => {
    const newState = Object.assign({}, this.state);
    newState.data.gender = "all";
    newState.data.startdate= moment();
    this.setState(newState);
    this.setState({ selectedgender: ['all']});
    this.setState({ selecteddate: moment(moment(),"YYYY-MM-DD") });
    console.log(this.state.data);
    this.retrieveData();
  }
  render() {
    return (
      <React.Fragment>
        <Row type="flex" justify="center" style={{ marginBottom: 48 }}>
          <DatePicker  value={this.state.selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginRight: 5 }} />
          <Select value={this.state.selectedgender} style={{ width: 100, marginRight: 5 }} onChange={this.handleGender} >
            <Option value="all">All Gender</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          <Button onClick={this.handleReset} disabled={false} opacity="0.5"><Icon type="reload" /></Button>
        </Row>
        <Spin spinning={this.state.isLoading}>
          {this.state.dataApi.length > 0 ? 
          <Pie forceFit='true' radius='0.8' data={this.state.dataApi} angleField='value' colorField='type' label={{ formatter: (value) => value + '%',  visible: true, type: 'inner' }} tooltip={{ visible:true, offset: 20, fields: ['jumlah','gender']}} /> : 
               <Row  style={{paddingTop: 133}}><Row style={{paddingBottom: 133}}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
        </Spin>
      </React.Fragment>
    )
  }
}
export default Layout;