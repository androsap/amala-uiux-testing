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
        promocode : "ALL",
        startdate : moment().subtract(30,'days'),
        enddate : moment().format("YYYY-MM-DD")
      },
      dataApi: [],
      options:[],
      selectedpromo: ['ALL'],
      selecteddate:[moment().subtract(30, 'days'),moment()],
    }
  }
  async retrieveData() {
    let data = this.state.data;
    let url = api.url.dashboard.promocode;
      
    await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
      if (response.status.responsecode.substring(0, 1) === '0') {
        var dataList = response.result.map(obj => {
          var result2 = {};
          result2['type'] = obj.promocode;
          result2['value'] = obj.jumlah;
          return result2;
        });
        //mapping options data from services
        var dataOptions = response.result.map(obj => {
          var result2 = {};
          result2['promocode'] = obj.promocode;
          result2['promocodelabel'] = obj.promocode;
          return result2;
        });
        //remove duplicate value
        var options = dataOptions.reduce((unique, o) => {
          if(!unique.some(obj => obj.promocodelabel === o.promocodelabel && obj.promocode === o.promocode)) {
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
  handlePartnerCode = (value, dateString) => {
    const newState = Object.assign({}, this.state);
    newState.data.promocode = value;
    this.setState(newState);
    this.setState({ selectedpromo: value });
    this.retrieveData();
  }
  handleReset = () => {
    const newState = Object.assign({}, this.state);
    newState.data.promocode = "ALL";
    newState.data.startdate = moment().subtract(30,'days');
    newState.data.enddate = moment();
    this.setState(newState);
    this.setState({ selectedpromo: ['ALL']});
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
        type:{alias: this.state.dataApi.length > 4 ? ' ': 'Award Code'},
        value:{ alias:'Total Redemption'}
      },  
    };
    const { selecteddate } = this.state;
    return (
      <React.Fragment>
        <Row type="flex" justify="center">
          <RangePicker value={selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginBottom: 16 }}/>
          <br></br>
          <Select value={this.state.selectedpromo} onChange={this.handlePartnerCode} style={{ width: 150, marginLeft: 16 }}>
            <Option value="ALL">All Promo</Option> 
            {this.state.options.map((item, index) => <Option value={item.promocode} key={index}>{item.promocodelabel}</Option>)}
          </Select>
          <Button onClick={this.handleReset} opacity="0.5" style={{ marginLeft: 16 }} disabled={false} ><Icon type="reload"/></Button>
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