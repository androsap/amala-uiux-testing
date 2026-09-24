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
            partnerOptions: [],
            awardOptions: [],
            visible: false,
            responsemessage: ''
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    async retrieveData () {
        const { dashboardReport } = store.getState();
        let {
            partnercode,
            awardcode,
            redemptiondate,
        } = dashboardReport.redemption;

        this.setState({ isLoading: true });

        await RetrieveRequest(api.url.dashboard.redemption, {}, {}, [], {}, {
            partnercode,
            awardcode,
            startdate: redemptiondate[0].format("YYYY-MM-DD"),
            enddate: redemptiondate[1].format("YYYY-MM-DD"),
        }).then(({ status, result }) => {
            const { responsecode, responsemessage } = status || {};

            if (responsecode === '0000') {
                let dataApi = [];
                let partnerOptions = [];
                let awardOptions = [];
                result.forEach(({ awardcode, totalredemption }) => dataApi.push({ type: awardcode, value: totalredemption }));
                result.forEach(({ partnercode }) => partnerOptions.push({ label: partnercode, value: partnercode }));
                result.forEach(({ awardcode }) => awardOptions.push({ label: awardcode, value: awardcode }));
                this.setState({ isLoading: false });
                store.dispatch({
                    type: "redemption",
                    data: {
                        resultSearch: dataApi.slice(0, 10), //limit data by 10 
                        partnerOptions: partnerOptions.filter((v, i, a) => a.findIndex(t => (t.label === v.label && t.value === v.value)) === i), //remove duplicate object
                        awardOptions: awardOptions
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
            type: "redemption",
            data: {
                [field]: value
            }
        })
        this.retrieveData()
    }

    handleReset = () => {
        store.dispatch({
            type: "reset",
            data: "redemption"
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
            partnercode,
            awardcode,
            redemptiondate,
            resultSearch,
            partnerOptions,
            awardOptions
        } = dashboardReport.redemption;

        return (
            <React.Fragment>
                {(responsemessage === '') ? '' : <div>
                    <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
                </div>}
                <Form layout='horizontal'>
                    <Row type="flex" justify='center'>
                        <DateRangeBase form={this.props.form} datafield="redemptiondate" placeholder={['Enrollment Date', 'End Date']} defaultValue={redemptiondate} dateformat="YYYY-MM-DD" maxDate={moment()} onChange={value => this.handleChangeData("redemptiondate", value)} />
                        <SelectBase style={{ width: 120, marginRight: 10, marginLeft: 10 }} form={form} datafield="partnercode" placeholder="Partner" options={partnerOptions} defaultValue={partnercode} onChange={value => this.handleChangeData("partnercode", value)} allowClear={false} />
                        <SelectBase style={{ width: 120, marginRight: 10, marginLeft: 10 }} form={form} datafield="awardcode" placeholder="Award" options={awardOptions} defaultValue={awardcode} onChange={value => this.handleChangeData("awardcode", value)} allowClear={false} />
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
            memberactivitycorporatedate,
            partnerOptions,
            awardOptions
        } = dashboardReport.memberactivityCorporate

        return {
            activitytype,
            memberactivitycorporatedate,
            partnerOptions,
            awardOptions
        };
    },
})(Layout));