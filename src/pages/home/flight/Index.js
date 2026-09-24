
import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
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
            dataffpcarriercode: [],
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
            member,
            ffpcarriercode,
            flightdate
        } = dashboardReport.flight;
        this.setState({ isLoading: true });

        await RetrieveRequest(api.url.dashboard.flight, {}, {}, [], {}, {
            member,
            ffpcarriercode,
            startdate: flightdate[0].format("YYYY-MM-DD"),
            enddate: flightdate[1].format("YYYY-MM-DD")
        }).then(({ status, result }) => {
            const { responsecode, responsemessage } = status || {};

            if (responsecode  === '0000') {
                let dataApi = [];
                let ffpcarriercodeOptions = [];
                let memberOptions = [];
                result.forEach(({ data, type }) => data.forEach(({ date, totalmember }) => dataApi.push({ type: type, date: date, value: totalmember })));
                result.forEach(({ type }) => memberOptions.push({ label: type, value: type }));
                result.forEach(({ ffpcarriercode }) => ffpcarriercodeOptions.push({ label: ffpcarriercode, value: ffpcarriercode }));
                this.setState({ isLoading: false });
                (member === 'MEMBERGA') ? ffpcarriercodeOptions.push({ label: 'GA', value: ['GA'] }) : ffpcarriercodeOptions.splice(ffpcarriercodeOptions.findIndex(e => e.value === "GA"), 1);
                if (member !== 'NONMEMBER') ffpcarriercodeOptions.splice(ffpcarriercodeOptions.findIndex(e => e.value === null), 1);
                if (member === 'ALL') this.setState({ dataffpcarriercode: ffpcarriercodeOptions });
                store.dispatch({
                    type: "flight",
                    data: {
                        resultSearch: dataApi,
                        memberOptions: memberOptions.filter((v, i, a) => a.findIndex(t => (t.label === v.label && t.value === v.value)) === i), //remove duplicate object,
                        ffpcarriercodeOptions: member === 'MEMBERNONGA' ? this.state.dataffpcarriercode : ffpcarriercodeOptions
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
            type: "flight",
            data: {
                [field]: (value === 'GA') ? [value] : value
            }
        });
        if (value !== 'MEMBERNONGA') this.retrieveData();
    }

    handleReset = () => {
        store.dispatch({
            type: "reset",
            data: "flight"
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
            member,
            ffpcarriercode,
            flightdate,
            resultSearch,
            memberOptions,
            ffpcarriercodeOptions
        } = dashboardReport.flight;

        return (
            <React.Fragment>
                {(responsemessage === '') ? '' : <div>
                    <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
                </div>}
                <Form layout='horizontal'>
                    <Row type="flex" justify='center'>
                        <DateRangeBase form={this.props.form} datafield="flightdate" placeholder={['Start Date', 'End Date']} defaultValue={flightdate} dateformat="YYYY-MM-DD" maxDate={moment()} onChange={value => this.handleChangeData("flightdate", value)} />
                        <SelectBase style={{ width: 120, marginLeft: 10 }} form={form} datafield="member" placeholder="Member" options={memberOptions} defaultValue={member} onChange={value => this.handleChangeData("member", value)} allowClear={false} />
                        <div style={{ background: '#ffffff', overflow: 'auto', height: '32px', marginLeft: 10, whiteSpace: 'nowrap', paddingRight: '4px' }} >
                            <SelectBase style={{ width: 120 }} form={form} datafield="ffpcarriercode" mode={member === 'MEMBERNONGA' ? 'multiple' : 'default'} placeholder="Ffpcarriercode" options={ffpcarriercodeOptions}
                                onChange={value => this.handleChangeData("ffpcarriercode", value)} allowClear={false} disabled={member === 'ALL' || member === 'NONMEMBER' ? true : false} defaultValue={ffpcarriercode} />
                        </div>
                        <Button style={{ marginTop: 3, marginLeft: 10 }} htmlType="button" icon="reload" onClick={this.handleReset} />
                    </Row>
                </Form>
                <Spin spinning={isLoading}>
                    {resultSearch.length ?
                        <Line {...{
                            padding: 'auto',
                            forceFit: true,
                            data: resultSearch,
                            xField: 'date',
                            yField: 'value',
                            xAxis: {
                                tickCount: 4
                            },
                            yAxis: { label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) } },
                            meta: {},
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
            member,
            ffpcarriercode,
            flightdate,
            memberOptions,
            ffpcarriercodeOptions
        } = dashboardReport.flight

        return {
            member,
            ffpcarriercode,
            flightdate,
            memberOptions,
            ffpcarriercodeOptions
        };
    },
})(Layout));