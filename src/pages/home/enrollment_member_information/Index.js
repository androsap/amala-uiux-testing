import React, { Component } from 'react';
import { Line } from '@ant-design/charts';
import moment from 'moment';
import { Row, Spin, Empty, Form, Alert } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { DateRangeBase, Button, ChannelSelect, MembershipSelect } from '../../../components/Base/BaseComponent';
import store from "../../../utilities/store/Store";
import { connect } from "react-redux";
import { setData } from "../../../utilities/actions/RedemptionActions";

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
        this.componentChannelSelect.retrieveData();
    };

    async retrieveData() {
        const { dashboardReport } = store.getState();
        let {
            enrollchannel,
            membershipid,
            enrollmentdate
        } = dashboardReport.enrolmentMember;

        this.setState({ isLoading: true });

        await RetrieveRequest(api.url.dashboard.enrollmentmember, {}, {}, [], {}, {
            enrollchannel,
            membershipid,
            enddate: enrollmentdate[1].format("YYYY-MM-DD"),
            enrollmentdate: enrollmentdate[0].format("YYYY-MM-DD")
        }).then(({ status, result }) => {
            const { responsecode, responsemessage } = status || {};

            if (responsecode === '0000') {
                let dataApi = [];
                result.forEach(({ data, tiername }) => data.forEach(({ enrollmentdate, totalmember }) => dataApi.push({ type: tiername, date: enrollmentdate, value: totalmember })))
                this.setState({ isLoading: false });
                store.dispatch({
                    type: "enrolmentMember",
                    data: {
                        resultSearch: dataApi,
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
            type: "enrolmentMember",
            data: {
                [field]: value
            }
        })
        this.retrieveData()
    };

    handleReset = () => {
        store.dispatch({
            type: "reset",
            data: "enrolmentMember"
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
            membershipid,
            enrollmentdate,
            enrollchannel,
            resultSearch
        } = dashboardReport.enrolmentMember;

        return (
            <React.Fragment>
                {(responsemessage === '') ? '' : <div>
                    <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
                </div>}
                <Form layout='horizontal'>
                    <Row type="flex" justify='center'>
                        <DateRangeBase form={this.props.form} datafield="enrollmentdate" placeholder={['Enrollment Date', 'End Date']} defaultValue={enrollmentdate} dateformat="YYYY-MM-DD" maxDate={moment()} onChange={value => this.handleChangeData("enrollmentdate", value)} />
                        <MembershipSelect style={{ width: 120, marginLeft: 10 }} ref={(e) => { this.componentMemberSelect = e }} form={form} placeholder="Member" datafield="membershipid" defaultValue={membershipid} onChange={value => this.handleChangeData("membershipid", value)} />
                        <ChannelSelect style={{ width: 120, marginLeft: 10 }} ref={(e) => { this.componentChannelSelect = e }} form={form} placeholder="Channel" datafield="enrollchannel" defaultValue={enrollchannel} onChange={value => this.handleChangeData("enrollchannel", value)} />
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
                                tickCount: 3
                            },
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
            membershipid,
            enrollmentdate,
            enrollchannel,
        } = dashboardReport.enrolmentMember

        return {
            membershipid,
            enrollmentdate,
            enrollchannel,
        };
    },
})(Layout));