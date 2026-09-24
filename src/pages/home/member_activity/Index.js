import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import { Row, Spin, Empty, Form, Alert } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { SelectBase, MembershipSelect, DateRangeBase, Button } from '../../../components/Base/BaseComponent';
import store from "../../../utilities/store/Store";
import { connect } from "react-redux";
import { setData } from "../../../utilities/actions/RedemptionActions";

const activityOptions = [
    { label: 'All Activity', value: 'ALL' },
    { label: 'Air', value: 'AIR' },
    { label: 'Non Air', value: 'NON_AIR' }
]

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataApi: [],
            visible: false,
            responsemessage: ''
        }
    }

    componentDidMount() {
        this.retrieveData();
        this.componentMemberSelect.retrieveData();
    };

    async retrieveData() {
        const { dashboardReport } = store.getState();
        let {
            activitytype,
            membershipid,
            memberactivitydate,
        } = dashboardReport.memberActivity;

        this.setState({ isLoading: true });

        await RetrieveRequest(api.url.dashboard.memberactivity, {}, {}, [], {}, {
            activitytype,
            membershipid,
            startdate: memberactivitydate[0].format("YYYY-MM-DD"),
            enddate: memberactivitydate[1].format("YYYY-MM-DD"),
        }).then(({ status, result }) => {
            const { responsecode, responsemessage } = status || {};

            if (responsecode  === '0000') {
                let dataApi = [];
                if (Array.isArray(result)) result.forEach(({ data, tiername }) => data.forEach(({ date, totalmember }) => dataApi.push({ type: tiername, date: date, value: totalmember })))
                this.setState({ isLoading: false });
                store.dispatch({
                    type: "memberActivity",
                    data: {
                        resultSearch: dataApi
                    }
                })
            }
            else {
                this.setState({ responsemessage: responsemessage });
            }
        });
    };

    handleChangeData = (field, value) => {
        store.dispatch({
            type: "memberActivity",
            data: {
                [field]: value
            }
        })
        this.retrieveData()
    };

    handleReset = () => {
        store.dispatch({
            type: "reset",
            data: "memberActivity"
        })
        this.retrieveData()
    };

    handleOpenModal = (certificateid) => {
        this.setState({ certificateid, visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false, titlepage: 'Verify New' });
    };

    render() {
        const { form } = this.props;
        const { isLoading, responsemessage } = this.state;

        const { dashboardReport } = store.getState();
        const {
            activitytype,
            membershipid,
            memberactivitydate,
            resultSearch,
        } = dashboardReport.memberActivity;

        return (
            <React.Fragment>
                {(responsemessage === '') ? '' : <div>
                    <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
                </div>}
                <Form layout='horizontal'>
                    <Row type="flex" justify='center'>
                        <DateRangeBase form={form} datafield="memberactivitydate" placeholder={['Enrollment Date', 'End Date']} defaultValue={memberactivitydate} dateformat="YYYY-MM-DD" maxDate={moment()} onChange={value => this.handleChangeData("memberactivitydate", value)} />
                        <SelectBase style={{ width: 120, marginRight: 10, marginLeft: 10 }} form={form} datafield="activityype" placeholder="Activity Type" options={activityOptions} defaultValue={activitytype} onChange={value => this.handleChangeData("activitytype", value)} allowClear={false} />
                        <MembershipSelect style={{ width: 120, marginRight: 10, marginLeft: 10 }} ref={(e) => { this.componentMemberSelect = e }} form={form} placeholder="Membership ID" defaultValue={membershipid} datafield="membershipid" onChange={value => this.handleChangeData("membershipid", value)} />
                        <Button style={{ marginTop: 3 }} htmlType="button" icon="reload" onClick={this.handleReset} />
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
            membershipid,
            memberactivitydate,
            resultSearch,
        } = dashboardReport.memberActivity

        return {
            activitytype,
            membershipid,
            memberactivitydate,
            resultSearch,
        };
    },
})(Layout));