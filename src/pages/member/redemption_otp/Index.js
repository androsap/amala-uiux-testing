import React from 'react';
import { Redirect } from 'react-router-dom';
import { api } from '../../../config/Services';
import { Link } from 'react-router-dom';
import { Button, SearchForm, TableBase, Alert, ErrorGeneral, CheckboxBase, AwardTypeSelect } from '../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../utilities/RequestService';
import { getProfile } from '../../../utilities/AuthService';
import { Form, Divider, Row, Col, Typography, Skeleton, Spin, Modal, Statistic, Tag, Tooltip } from 'antd';
import { FinishOTP } from '../../../utilities/Helpers';
import moment from 'moment';
import TicketNumberForm from '../certificate/TicketNumber';

const { Countdown } = Statistic;
const { Title, Text } = Typography;
const { confirm } = Modal;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            responseMessage: '',
            eligibleredeemstatus: false,
            addticketnumber: false,
            path: null,
            isLoadingTicketNumber: false,
            otpvalue: false,
            fieldvalue: {
                certificateid: null,
                cardnumber: null,
                name: null,
                familyname: null
            }
        }
    };

    getEligibleRedeem = () => {
        let cardnumber = this.props.cardnumber;
        let data = { cardnumber };
        let url = api.url.redemption.eligibleredeem;
        this.props.handleLoading(true);
        DetailRequest(url, data).then((response) => {
            const { result } = response;
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0' && result.redeemstatus !== undefined) {
                this.setState({ eligibleredeemstatus: result.redeemstatus, responseMessage: responsemessage });
            } else {
                Alert.error(responsemessage);
                this.setState({ responseMessage: responsemessage });
            }
            this.props.handleLoading(false);
        });
    };

    componentDidMount() {
        this.getEligibleRedeem();
        this.props.retrieveSession();
    };

    handleSearchForm = (criteria) => {
        this.componentTable.handleSearchForm(criteria);
    };

    handleAllAward = (event) => {
        let showall = event === null ? null : event.target.checked;
        const { awardmiles, tierid } = this.props;
        let criteria = {
            channel: "BO",
            showall,
            mileage: awardmiles,
            username: getProfile().username,
            eligibletier: tierid
        };

        this.componentTable.handleSearchForm(criteria);
    };

    handleValidationBuy = (path) => {
        let username = getProfile().username;
        let data = { username };
        let url = api.url.redemptioncertificate.getemptyticketnumber;
        this.setState({ isLoadingTicketNumber: true });
        /* check ticket number empty */
        DetailRequest(url, data).then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                const { result } = response;
                if (result.length > 0) {
                    const certificateid = (result && result[0]) ? result[0] : null;
                    let url = api.url.redemptioncertificate.detail;
                    let data = { certificateid };
                    //call loader
                    /* get data cardnumber & name from service detail certificate */
                    DetailRequest(url, data).then((response) => {
                        let { status, result } = response;
                        if (status.responsecode.substring(0, 1) === '0' && result) {
                            const cardnumber = (result && result['redeemusers'] && result['redeemusers']['memberiduser']) ? result['redeemusers']['memberiduser'] : null;
                            const name = (result && result['redeemusers'] && result['redeemusers']['name']) ? result['redeemusers']['name'] : null;
                            const familyname = (result && result['redeemusers'] && result['redeemusers']['familyname']) ? result['redeemusers']['familyname'] : null;

                            const fieldvalue = { ...this.state.fieldvalue, certificateid, cardnumber, name, familyname };

                            this.setState({ addticketnumber: true, isLoadingTicketNumber: false, fieldvalue });
                        } else {
                            Alert.error(response.status.responsemessage);
                            this.setState({ isLoadingTicketNumber: false });
                        }
                    });
                } else {
                    this.setState({ addticketnumber: false, path, isLoadingTicketNumber: false });
                }
            } else {
                Alert.error(response.status.responsemessage);
                this.setState({ isLoadingTicketNumber: false });
            }
        });
    };

    handleCancel = () => {
        this.setState({ addticketnumber: false, path: null });
    }

    generateOTP = (val, type) => {
        const callback = () => {
            this.props.handleLoading(true);

            let url = api.url.memberotp.generate;
            let memberid = this.props.match.params.ID;
            let transactiontype = 'REDEMPTION';
            let channel = 'BO';
            let data = { memberid, transactiontype, channel };
            let message = 'Generating OTP...';
            DetailRequest(url, data).then((response) => {
                const { responsecode, responsemessage } = (response) ? response.status : {};
                if (responsecode === '0000') {
                    message = (responsemessage) ? responsemessage : message;
                    this.props.retrieveTimeOTP();
                    Alert.success(message);
                } else {
                    this.props.handleLoading(false);
                    Alert.error(responsemessage);
                };
            });
        };

        confirm({
            title: (type === 'generateotp') ? 'Are you sure to generate OTP?' : 'Are you sure to resend OTP?',
            content: (
                <div>
                    <p style={{ color: 'red' }}>Note: This otp will be send to member email</p>
                </div>
            ),
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    finishOTPTime = async () => {
        // let memberid = this.props.match.params.ID;
        await this.props.refreshHeader();
        // await FinishOTP(this.props.dataOTP.otpsessionid, memberid);
        await this.props.retrieveSession();
    };

    checkOTP = () => {
        this.props.retrieveSession();
    };

    render() {
        document.title = "Member Redemption OTP | Loyalty Management System";

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };
        const { awardmiles, tierid, dataOTP, isLoading } = this.props;
        const { isLoadingTicketNumber, eligibleredeemstatus, responseMessage, addticketnumber, fieldvalue } = this.state;
        const { statusScreenOTP, countdownSession, countdownTimeVerify } = dataOTP || {}
        let xtraSmallWidthScreen = (window.innerWidth < 767);

        let configurationTable = {
            url: api.url.awardlist.getawardredeemlist,
            criteria: {
                channel: "BO",
                showall: false,
                mileage: awardmiles,
                username: getProfile().username,
                eligibletier: tierid
            },
            columns: [
                { type: 'field', title: 'Award Code', dataIndex: 'awardcode', sorter: true },
                { type: 'field', title: 'Award Type', dataIndex: 'awardtypename', sorter: true },
                { type: 'field', title: 'Name', dataIndex: 'name', sorter: true },
                {
                    type: 'html', title: 'Partner Code', dataIndex: 'partnercode', sorter: true,
                    render: (value, row, index) => { return (value) ? value : '-' }
                },
                {
                    type: 'html', title: 'Start Date', dataIndex: 'startdate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'End Date', dataIndex: 'enddate', sorter: true,
                    render: (value, row, index) => { return (value) ? moment(value).format('DD/MM/YYYY') : '-' }
                },
                {
                    type: 'html', title: 'Price', dataIndex: 'pricingby', sorter: true,
                    render: (value, row, index) => { return (value) ? value : row.pricingby }
                },
                {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: (value, row, index) => {
                        let url = row.categorycode.toLowerCase();
                        return (
                            <span>
                                <Button htmlType="button" size="small" label="Buy" onClick={() => this.handleValidationBuy(this.props.match.url + '/' + url + '/' + row.awardcode)} />
                            </span>
                        )
                    }
                },
            ]
        };

        let configurationSearchForm = [
            { labeltext: "Award Type", datafield: "awardtypecode", type: 'component', placeholder: 'Award Type', component: AwardTypeSelect, showDefaultSearch: true },
            { labeltext: "Award Code", datafield: "awardcode", type: 'text', placeholder: 'Award Code', showDefaultSearch: true },
            { labeltext: "Name", datafield: "name", type: 'text', placeholder: 'Name', showDefaultSearch: true },
            { labeltext: "Partner Code", datafield: "partnercode", type: 'text', placeholder: 'Partner Code', showDefaultSearch: true },
            { labeltext: "Start Date", datafield: "startdate", type: 'datepicker', placeholder: 'Start Date', showDefaultSearch: false },
            { labeltext: "End Date", datafield: "enddate", type: 'datepicker', placeholder: 'End Date', showDefaultSearch: false },
        ];

        if (!isLoading) {
            if (!addticketnumber && this.state.path) { return (<Redirect to={{ pathname: this.state.path }} />) }
            if (eligibleredeemstatus && responseMessage !== '') {
                return (
                    <React.Fragment>
                        {
                            //Screen to redeem due to available session
                            (statusScreenOTP === 'allowed') ? <Row>
                                <Spin spinning={isLoadingTicketNumber} tip="Please wait while checking the ticket number">
                                    <Col xs={12}>
                                        <Title level={4}>Redemption OTP</Title>
                                    </Col>
                                    <Col xs={(xtraSmallWidthScreen) ? 4 : 8}>
                                        <Row type="flex" justify="end">
                                            <div style={{ display: 'inline-flex', fontSize: '16px', color: 'black' }}>
                                                {(xtraSmallWidthScreen) ? null : <span>OTP Time Limit =&nbsp;</span>}
                                                <Tooltip placement="topRight" title={`OTP Time Limit`}>
                                                    <strong>
                                                        <Tag>
                                                            <Countdown
                                                                valueStyle={{ fontSize: '16px' }}
                                                                value={countdownSession}
                                                                format="mm:ss"
                                                                onFinish={this.finishOTPTime}
                                                            />
                                                        </Tag>
                                                    </strong>
                                                </Tooltip>
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col xs={(xtraSmallWidthScreen) ? 8 : 4} style={{ textAlign: "right", marginTop: 3 }}>
                                        <CheckboxBase form={this.props.form} datafield='showallaward' onChange={this.handleAllAward}>All Award</CheckboxBase>
                                    </Col>
                                    <Divider />
                                    <TicketNumberForm {...fieldvalue} visible={addticketnumber} handleClose={this.handleCancel} />
                                    <SearchForm form={this.props.form} showAdvanceSearch={true} optionsConfiguration={configurationSearchForm} onSubmit={this.handleSearchForm} />
                                    {
                                        ((awardmiles !== null && awardmiles !== undefined) && tierid) ? <TableBase ref={(e) => { this.componentTable = e }} configuration={configurationTable} /> : null
                                    }
                                </Spin>
                            </Row> :

                                //Screen to waiting verify otp
                                (statusScreenOTP === 'verify') ? <Form {...formItemLayout}>
                                    <Row>
                                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 100 }}>
                                            <Title level={2}>Verification</Title>
                                        </Row>
                                        <Row gutter={24} type="flex" justify="center">
                                            <Text strong>Please wait until OTP member has been verified</Text>
                                        </Row>
                                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 20, marginLeft: 12 }}>
                                            <Countdown valueStyle={{ fontSize: '16px' }} value={countdownTimeVerify} format="mm:ss" onFinish={this.finishOTPTime} />
                                            <Button htmlType='button' style={{ marginLeft: 20 }} type="default" shape="circle" icon="reload" size={'small'} onClick={() => this.checkOTP()} />
                                        </Row>
                                    </Row>
                                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 20 }}>
                                        <Text strong>
                                            Didn't receive OTP Code ? <Link to='#' onClick={(val) => this.generateOTP(val, 'resendotp')} style={{ cursor: 'pointer' }}>Click here</Link> to Resend
                                        </Text>
                                    </Row>
                                </Form> :

                                    //Screen to generate otp 
                                    (statusScreenOTP === 'generate') ? <Form {...formItemLayout}>
                                        <Row>
                                            <Row gutter={24} type="flex" justify="center">
                                                <Title level={2} style={{ textAlign: 'center', marginTop: 230 }} className={''}>This page need OTP Authentication, you can generate OTP code below</Title>
                                            </Row>
                                        </Row>
                                        <br></br>
                                        <Row gutter={24} type="flex" justify="center">
                                            <Button htmlType="submit" type="primary" label="Generate OTP" actioncode="UPDATE" onClick={(val) => this.generateOTP(val, 'generateotp')}></Button>
                                        </Row>
                                    </Form> : null
                        }

                    </React.Fragment>
                );
            } else if (responseMessage === '') {
                return <Skeleton />
            } else return (<ErrorGeneral {...this.props} message={responseMessage} custom={true} />);
        } else return (<Skeleton />);
    };
};

export default Form.create()(App);