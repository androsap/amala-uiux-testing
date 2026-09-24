import React, { Component } from 'react';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { SaveRequest } from '../../../../utilities/RequestService';
import { Alert, Button, SelectBase, DateRangeBase } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin } from 'antd';
import moment from 'moment';
import { TPMRevenue } from '../../../../data';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionsmasterpage: (this.props && this.props.actionspage) ? this.props.actionspage : null,
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            formrender: true,
        }
    }

    checkPermission() {
        const { prruledetailid, permission, prefixmenuname, menucode } = this.props;
        const { actionsmasterpage } = this.state;
        const { usermenu } = permission;
        if (prruledetailid) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            if (actionsmasterpage !== 'create' && (actionsmasterpage === 'view' || !usermenu[menucode][prefixmenuname + "_UPDATE"])) {
                titlepage = 'View';
                actionspage = 'view';
            }
            this.setState({ titlepage, actionspage });
            this.props.setTitlePage(titlepage);
            this.getDetail();
        } else {
            this.props.setTitlePage('Create');
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    getDetail = async () => {
        this.setState({ isLoading: true });
        const { datasource, prruledetailid } = this.props;
        const detailrule = datasource.filter(obj => obj.prruledetailid === prruledetailid);

        const accrualbased = (detailrule && detailrule[0] && detailrule[0]['accrualbased']) ? detailrule[0]['accrualbased'] : undefined;
        const startdate = (detailrule && detailrule[0] && detailrule[0]['startdate']) ? moment(detailrule[0]['startdate']) : undefined;
        const enddate = (detailrule && detailrule[0] && detailrule[0]['enddate']) ? moment(detailrule[0]['enddate']) : undefined;
        const date = [startdate, enddate];

        await this.props.form.setFieldsValue({ accrualbased, date });
        this.setState({ isLoading: false });
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                const { prruleid } = this.props;
                const { actionsmasterpage, actionspage } = this.state;
                const { accrualbased, date } = input || null

                const data = { accrualbased, startdate: moment(date[0]).format("YYYY-MM-DD"), enddate: moment(date[1]).format("YYYY-MM-DD"), active: true };

                if (actionsmasterpage === 'create') {
                    if (actionspage === 'create') {
                        data.prruledetailid = moment().format("YYYYMMDDHHmmss");
                    } else if (actionspage === 'update') {
                        data.prruledetailid = this.props.prruledetailid;
                    }

                    this.props.handleSavePrice(actionspage, data);
                    this.setState({ isLoading: false });
                } else if (actionsmasterpage === 'update') {
                    let url = '';
                    if (actionspage === 'create') {
                        data.prruleid = prruleid;
                        url = api.url.revenuebased.adddetail;
                    } else {
                        data.prruledetailid = this.props.prruledetailid;
                        url = api.url.revenuebased.updaterule;
                    }

                    SaveRequest(url, data).then((response) => {
                        const { status = {} } = response || {};
                        if (status.responsecode === "0000") {
                            Alert.success(status.responsemessage);

                            this.props.handleClose();
                            this.props.handleRefresh(prruleid);
                        } else {
                            Alert.error(status.responsemessage);
                        }
                        this.setState({ isLoading: false });
                    })
                }
            }
        });
    }

    render() {
        const { prefixmenuname, menucode } = this.props;
        const { actionsmasterpage, actionspage } = this.state;
        const actioncode = (actionsmasterpage === 'create') ? "CREATE" : "UPDATE";
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Form {...formItemLayout} onSubmit={this.saveAction}>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 18, offset: 2 }} xl={{ span: 18, offset: 2 }}>
                                <DateRangeBase form={this.props.form} labeltext="Date" datafield="date" placeholder={['Start Date', 'End Date']} validationrules={['required']} minDate={moment()} />
                                <SelectBase form={this.props.form} labeltext="TPM/Revenue" datafield="accrualbased" options={TPMRevenue} validationrules={['required']} />
                            </Col>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                            {
                                (actionspage === 'create' && actionsmasterpage !== 'view') ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> :
                                    (actionspage === 'update' && actionsmasterpage !== 'view') ? <Button htmlType="submit" type="default" label="Save" menucode={menucode} prefixmenuname={prefixmenuname} actioncode={actioncode}></Button> : null
                            }
                        </Row>
                    </Form>
                </Spin>
            </Row>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
