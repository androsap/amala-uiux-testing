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
        partnercode: "all",
        awardcode: "all",
        startdate: moment().subtract(30, 'days'),
        enddate: moment().format("YYYY-MM-DD")
      },
      dataApi: [],
      options: [],
      dataOption: [],
      selectedpartner: ['all'],
      selectedaward: ['all'],
      selecteddate:[moment().subtract(30, 'days'),moment()],
    }
  }
  async retrieveData() {
    let data = this.state.data;
    let url = api.url.dashboard.redemption;
    await RetrieveRequest(url, {}, {}, [], {}, data).then((response) => {
      if (response.status.responsecode.substring(0, 1) === '0') {
        var dataList = response.result.map(obj => {
          var result2 = {};
          result2['type'] = obj.awardcode;
          result2['value'] = obj.totalredemption;
          return result2;
        });
        //mapping options data from services
        var dataOptions = response.result.map(obj => {
          var result2 = {};
          result2['label'] = obj.partnercode;
          result2['value'] = obj.partnercode;
          return result2;
        });
        var dataOption = response.result.map(obj => {
          var result2 = {};
          result2['awardcode'] = obj.awardcode;
          result2['awardcodelabel'] = obj.awardcode;
          return result2;
        });
        //remove duplicate value
          var options = dataOptions.reduce((unique, o) => {
            if(!unique.some(obj => obj.label === o.label)) {
              unique.push(o);
            }
            return unique;
            },[]);

        this.setState({ options, dataOption , dataApi: dataList.slice(0,10), isLoading: false });
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
  handleAwardCode = (value, dateString) => {
    const newState = Object.assign({}, this.state);
    newState.data.awardcode = value;
    this.setState({ selectedpartner: value });
    this.setState(newState);
    this.retrieveData();
  }
  handlePartnerCode = (value, dateString) => {
    const newState = Object.assign({}, this.state);
    newState.data.partnercode = value;
    this.setState({ selectedaward: value });
    this.setState(newState);
    this.retrieveData();
  }
  handleReset = () => {
    const newState = Object.assign({}, this.state);
    newState.data.partnercode = "all";
    newState.data.awardcode = "all";
    newState.data.startdate = moment().subtract(30,'days');
    newState.data.enddate = moment();
    this.setState(newState);
    this.setState({ selectedpartner: ['all']});
    this.setState({ selectedaward: ['all']});
    this.setState({ selecteddate:[moment().subtract(30, 'days'),moment()] });
    this.retrieveData();
  }
  render() {
    const config = {
      forceFit: 'true',
      data: this.state.dataApi,
      yField: 'value',
      xField: 'type',
      label: {
        visible: true,
        type: 'inner'
      },
      meta: {
        type: { alias: this.state.dataApi.length > 4 ? ' ' : 'Award Code' },
        value: { alias: 'Total Redemption' }
      }
    }
    const { selecteddate } = this.state;
    return (
      <React.Fragment>
        <Row type="flex" justify="center">
          <RangePicker  value={selecteddate} onChange={this.handleDate} disabledDate={disabledDate} size={24} style={{ marginBottom: 16 }} />
          <br></br>
          <Select value={this.state.selectedpartner} placeholder="Partner Code" defaultValue="all" onChange={this.handlePartnerCode} style={{ width: 120, marginLeft: 16 }}>
            <Option value="all">All Partner</Option>
            {this.state.options.map((item, index) => <Option value={item.value} key={index}>{item.label}</Option>)}
          </Select>
          <Select value={this.state.selectedaward} placeholder="Award Code" defaultValue="all" onChange={this.handleAwardCode} style={{ width: 120, marginLeft: 16 }}>
            <Option value="all">All Award</Option>
            {this.state.dataOption.map((item, index) => <Option value={item.awardcode} key={index}>{item.awardcodelabel}</Option>)}
          </Select>
          <Button onClick={this.handleReset} disabled={false} opacity="0.5" style={{ marginLeft: 16 }}><Icon type="reload" /></Button>
        </Row>
        <Spin spinning={this.state.isLoading}>
          {this.state.dataApi.length > 0 ?
            <Column {...config} /> :
            <Row style={{ paddingTop: 133 }}><Row style={{ paddingBottom: 133 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
        </Spin>
      </React.Fragment>
    )
  };
}
export default Layout;