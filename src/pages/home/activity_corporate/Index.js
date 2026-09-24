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

const optionActivity = [
    { label: 'All Channel', value: 'ALL' },
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
            responsemessage: '',
        }
    }

    componentDidMount() {
        this.retrieveData();
    };

    async retrieveData() {
        const { dashboardReport } = store.getState();
        let {
            activitytype,
            memberactivitycorporatedate,
        } = dashboardReport.memberactivityCorporate;

        this.setState({ isLoading: true });

        await RetrieveRequest(api.url.dashboard.corporateactivity, {}, {}, [], {}, {
            activitytype,
            enddate: memberactivitycorporatedate[1].format("YYYY-MM-DD"),
            startdate: memberactivitycorporatedate[0].format("YYYY-MM-DD")
        }).then(({ status, result }) => {
            const { responsecode, responsemessage } = status || {};

            if (responsecode  === '0000') {
                let dataApi = [];
                result.forEach(({ corporatename, jumlahactivity }) => dataApi.push({ type: corporatename, value: jumlahactivity }))
                this.setState({ isLoading: false });
                store.dispatch({
                    type: "memberactivityCorporate",
                    data: {
                        resultSearch: dataApi.slice(0, 10)
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
            type: "memberactivityCorporate",
            data: {
                [field]: value
            }
        })
        this.retrieveData()
    };

    handleReset = () => {
        store.dispatch({
            type: "reset",
            data: "memberactivityCorporate"
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
            memberactivitycorporatedate,
            resultSearch
        } = dashboardReport.memberactivityCorporate;

        return (
            <React.Fragment>
                {(responsemessage === '') ? '' : <div>
                    <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
                </div>}
                <Form layout='horizontal'>
                    <Row type="flex" justify='center'>
                        <DateRangeBase form={this.props.form} datafield="memberactivitycorporatedate" placeholder={['Enrollment Date', 'End Date']} defaultValue={memberactivitycorporatedate} dateformat="YYYY-MM-DD" maxDate={moment()} onChange={value => this.handleChangeData("memberactivitycorporatedate", value)} />
                        <SelectBase style={{ width: 120, marginRight: 10, marginLeft: 10 }} form={form} datafield="activitytype" placeholder="Activity Type" options={optionActivity} defaultValue={activitytype} onChange={value => this.handleChangeData("activitytype", value)} allowClear={false} />
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
                                type: { alias: resultSearch.length > 4 ? ' ' : 'Corporate Name' },
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
            memberactivitycorporatedate,
        } = dashboardReport.memberactivityCorporate

        return {
            activitytype,
            memberactivitycorporatedate,
        };
    },
})(Layout));