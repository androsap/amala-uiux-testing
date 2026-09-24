import React, { Component } from 'react';
import { Pie } from '@ant-design/charts';
import { Row, Spin, Empty, Form, Alert } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { SelectBase, Button, DatePickerBase } from '../../../components/Base/BaseComponent';
import store from "../../../utilities/store/Store";
import { connect } from "react-redux";
import { setData } from "../../../utilities/actions/RedemptionActions";

const optionGender = [
    { label: 'All Gender', value: 'ALL' },
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' }
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
    };

    async retrieveData() {
        const { dashboardReport } = store.getState();
        let {
            gender,
            startdate
        } = dashboardReport.memberTier;

        this.setState({ isLoading: true });

        await RetrieveRequest(api.url.dashboard.membertier, {}, {}, [], {}, {
            gender,
            startdate: startdate.format("YYYY-MM-DD")
        }).then(({ status, result }) => {
            const { responsecode, responsemessage } = status || {};

            if (responsecode  === '0000') {
                let dataApi = [];
                result.forEach(({ tiername, gender, percentage, jumlah }) => dataApi.push({ type: tiername, value: percentage, gender: gender, jumlah: jumlah }))
                this.setState({ isLoading: false });
                store.dispatch({
                    type: "memberTier",
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
            type: "memberTier",
            data: {
                [field]: value
            }
        })
        this.retrieveData()
    };

    handleReset = () => {
        store.dispatch({
            type: "reset",
            data: "memberTier"
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
            gender,
            startdate,
            resultSearch
        } = dashboardReport.memberTier;

        return (
            <React.Fragment>
                {(responsemessage === '') ? '' : <div>
                    <Alert message={responsemessage} type="error" closable style={{ marginBottom: 10 }} />
                </div>}
                <Form layout='horizontal' style={{ marginBottom: 55 }} >
                    <Row type="flex" justify='center'>
                        <DatePickerBase form={this.props.form} datafield="startdate" placeholder='Start Date' defaultValue={startdate} dateformat="YYYY-MM-DD" onChange={value => this.handleChangeData("startdate", value)} />
                        <SelectBase style={{ width: 100, marginRight: 5, marginLeft: 5 }} form={form} datafield="gender" placeholder="Gender" options={optionGender} defaultValue={gender} onChange={value => this.handleChangeData("gender", value)} allowClear={false} />
                        <Button style={{ marginTop: 3 }} htmlType="button" icon="reload" onClick={this.handleReset} />
                    </Row>
                </Form>
                <Spin spinning={isLoading}>
                    {resultSearch.length ?
                        <Pie forceFit='true' radius='0.8' data={resultSearch} angleField='value' colorField='type' label={{ formatter: (value) => value + '%', visible: true, type: 'inner' }} tooltip={{ visible: true, offset: 20, fields: ['jumlah', 'gender'] }} />
                        : <Row style={{ paddingTop: 133 }}><Row style={{ paddingBottom: 133 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Row></Row>}
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
            gender,
            startdate,
            resultSearch
        } = dashboardReport.memberTier

        return {
            gender,
            startdate,
            resultSearch
        };
    },
})(Layout));