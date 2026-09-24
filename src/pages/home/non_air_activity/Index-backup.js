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
        partnercode: "ALL",
        startdate: moment().subtract(30,'days'),
        enddate: moment().format("YYYY-MM-DD")
      },
      dataApi: [],
      options: [],
      selectedactivity: ['ALL'],
      selecteddate:[moment().subtract(30, 'days'),moment()],
    }
  }
  async retrieveData() {
    let data = this.state.data;
    let url = api.url.dashboard.nonairactivity;
    await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
      if (response.status.responsecode.substring(0, 1) === '0') {
        var dataList = response.result.map(obj => {
          var result2 = {};
          result2['type'] = obj.partnercode;
          result2['value'] = obj.jumlah;
          return result2;
        });
        //mapping options data from services
        var dataOptions = response.result.map(obj => {
          var result2 = {};
          result2['partnercode'] = obj.partnercode;
          result2['partnercodelabel'] = obj.partnercode;
          return result2;
        });
        //remove duplicate value
        var options = dataOptions.reduce((unique, o) => {
          if(!unique.some(obj => obj.partnercode === o.partnercode && obj.value === o.partnercode)) {
            unique.push(o);
          }
          return unique;
        },[]);

        this.setState({ options, dataApi: dataList.slice(0,10), isLoading: false });
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
    this.retrieveData();
  }

  handleActivity = (value, dateString) => {
    const newState = Object.assign({}, this.state);
    newState.data.partnercode = value;
    this.setState(newState);
    this.setState({ selectedactivity: value });
    this.retrieveData();
  }
  handleReset = () => {
    const newState = Object.assign({}, this.state);
    newState.data.partnercode = "ALL";
    newState.data.startdate= moment().subtract(30,'days');
    newState.data.enddate = moment();
    this.setState(newState);
    this.setState({ selectedactivity: ['ALL']});
    this.setState({ selecteddate:[moment().subtract(30, 'days'),moment()] });
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
        type:{alias: this.state.dataApi.length > 4 ? ' ': 'Partner Code'},
        value:{ alias:'Amount'}
      }
    }
    const { selecteddate } = this.state;
    return (
      <React.Fragment>
        <Row type="flex" justify="center">
          <RangePicker value={selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginRight: 10 }}/>
          <Select value={this.state.selectedactivity} onChange={this.handleActivity} style={{width: 120, marginRight: 10 }}>
            <Option value="ALL">All Partner</Option> 
            {this.state.options.map((item, index) => <Option value={item.partnercode} key={index}>{item.partnercodelabel}</Option>)}
          </Select>
          <Button onClick={this.handleReset} disabled={false} opacity="0.5" ><Icon type="reload"/></Button>
          </Row>
            <Spin spinning={this.state.isLoading}>
              {this.state.dataApi.length > 0 ? <Column {...config} /> :
                <Row  style={{paddingTop: 133}}><Row style={{paddingBottom: 133}}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
            </Spin>
      </React.Fragment>
    )
  };
}
export default Layout;