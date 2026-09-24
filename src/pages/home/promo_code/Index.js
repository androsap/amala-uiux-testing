import React, { Component } from 'react';
import { Column } from '@ant-design/charts';
import moment from 'moment';
import { Row, Spin, Empty, Form, Alert } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { SelectBase, DateRangeBase, Button } from '../../../components/Base/BaseComponent';
import store from "../../../utilities/store/Store";
import { connect } from "react-redux";
import { setData } from "../../../utilities/actions/RedemptionActions";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataApi: [],
      promocodeOptions: [],
      visible: false,
      responsemessage: ''
    }
  }

  componentDidMount() {
    this.retrieveData();
  }

  async retrieveData() {
    const { dashboardReport } = store.getState();
    let {
      promocode,
      promocodedate,
    } = dashboardReport.promoCode;

    this.setState({ isLoading: true });

    await RetrieveRequest(api.url.dashboard.promocode, {}, {}, [], {}, {
      promocode,
      startdate: promocodedate[0].format("YYYY-MM-DD"),
      enddate: promocodedate[1].format("YYYY-MM-DD"),
    }).then(({ status, result }) => {
      const { responsecode, responsemessage } = status || {};

      if (responsecode  === '0000') {
        let dataApi = [];
        let promocodeOptions = [];
        result.forEach(({ promocode, jumlah }) => dataApi.push({ type: promocode, value: jumlah }));
        result.forEach(({ promocode }) => promocodeOptions.push({ label: promocode, value: promocode }));
        this.setState({ isLoading: false });
        store.dispatch({
          type: "promoCode",
          data: {
            resultSearch: dataApi.slice(0, 10), //limit data by 10 
            promocodeOptions: promocodeOptions.filter((v, i, a) => a.findIndex(t => (t.label === v.label && t.value === v.value)) === i), //remove duplicate object
          }
        })
      }
      else {
        this.setState({ responsemessage: responsemessage });
      }
    });
  }

  handleChangeData = (field, value) => {
    store.dispatch({
      type: "promoCode",
      data: {
        [field]: value
      }
    })
    this.retrieveData()
  }

  handleReset = () => {
    store.dispatch({
      type: "reset",
      data: "promoCode"
    })
    this.retrieveData()
  }

  handleOpenModal = (certificateid) => {
    this.setState({ certificateid, visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false, titlepage: 'Verify New' });
  };

  render() {
    const { form } = this.props;
    const { isLoading, responsemessage } = this.state;

    const { dashboardReport } = store.getState();
    const {
      promocode,
      promocodedate,
      resultSearch,
      promocodeOptions,
    } = dashboardReport.promoCode;

    return (
      <React.Fragment>
        {(responsemessage === '') ? '' : <div>
          <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
        </div>}
        <Form layout='horizontal'>
          <Row type="flex" justify='center'>
            <DateRangeBase form={this.props.form} datafield="promocodedate" placeholder={['Start Date', 'End Date']} defaultValue={promocodedate} dateformat="YYYY-MM-DD" maxDate={moment()} onChange={value => this.handleChangeData("promocodedate", value)} />
            <SelectBase style={{ width: 120, marginRight: 10, marginLeft: 10 }} form={form} datafield="promocode" placeholder="Promo" options={promocodeOptions} defaultValue={promocode} onChange={value => this.handleChangeData("promocode", value)} allowClear={false} />
            <Button style={{ marginTop: 3 }} htmlType="button" icon="reload" onClick={this.handleReset} />
          </Row>
        </Form>
        <Spin spinning={isLoading}>
          {resultSearch.length ?
            <Column {...{
              padding: 'auto',
              forceFit: true,
              data: resultSearch,
              xField: 'type',
              yField: 'value',
              label: {
                visible: true,
                type: 'inner'
              },
              meta: {
                type: { alias: resultSearch.length > 4 ? ' ' : 'Award Name' },
                value: { alias: 'Amount' }
              }
            }} /> :
            <Row style={{ paddingTop: 133 }}><Row style={{ paddingBottom: 133 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
        </Spin>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = dispatch => ({
  setData: (type, data) => dispatch(setData(type, data))
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create({
  mapPropsToFields(props) {

    const { dashboardReport } = store.getState();
    const {
      activitytype,
      promocodedate,
      promocodeOptions,
    } = dashboardReport.promoCode

    return {
      activitytype,
      promocodedate,
      promocodeOptions,
    };
  },
})(Layout));