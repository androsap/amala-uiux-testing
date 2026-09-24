import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Layout, Form } from 'antd';
import { getProfile } from '../../utilities/AuthService';
import { MemberLockHelper } from '../../helper/member';
import MemberManagementSider from '../../components/Sider/MemberManagementSider';
import MemberHeader from '../../components/Header/MemberProfile';
import MemberManagementRouter from '../../routers/MemberManagement.router';
import ErrorGeneral from '../error/ErrorGeneral';
import momentzone from 'moment-timezone';
import moment from 'moment';
import Alert from '../../components/Alert';

const { Content } = Layout;

const isBOD = getProfile().rolename === 'BOD';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: false,
            fieldvalue: {
                cardnumber: null,
                tierid: null,
                membertierid: null,
                membershipid: null,
                statusScreenOTP: 'generate',
                countdownSession: Date.now() + 3000000,
                countdownTimeVerify: Date.now() + 300000,
            },
            headerdata: {
                cardnumber: null,
                tierid: null,
                membertierid: null,
                awardmiles: 0,
                profile: {}
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            },
            memberlock: null
        };
        this.componentMemberHeader = React.createRef();
    };

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    };

    componentDidMount() {
        this.checkPermission();
        this.redirectHomePage();
        this.getMemberLock();
        let id = this.props.match.params.ID;
        this.componentMemberHeader.retrieveData(id);
        document.title = "Member Management | Loyalty Management System";
        this.retrieveSession();
        this.retrieveTimeOTP();
    };

    getMemberLock = () => {
        const { ID } = this.props.match.params;
        MemberLockHelper.retrieve({
            criteria: {
                memberid: ID,
                active: true
            }
        }, (status, data) => {
            let memberlock = null;
            if (status && data) if (data.length) memberlock = data[0];
            this.setState({ memberlock });
        })
    };

    getDetail = (memberid) => {
        let url = api.url.member.profile;
        let type = 'SUMMARY';
        let data = { memberid, type };
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    headerdata: {
                        ...this.state.headerdata,
                        cardnumber: (result.membercards && result.membercards[0] && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : null,
                        tierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null,
                        membertierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membertierid !== undefined) ? result.membertiers[0].membertierid : null,
                        membershipid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershipid !== undefined) ? result.membertiers[0].membershipid : null,
                        membershiptypeid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershiptypeid !== undefined) ? result.membertiers[0].membershiptypeid : null,
                        awardmiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['awardmiles'] !== undefined && result.memberaccount[0]['awardmiles'] !== null) ? result.memberaccount[0]['awardmiles'] : 0,
                        profile: {
                            firstname: (result.firstname) ? result.firstname : '',
                            lastname: (result.lastname) ? result.lastname : '',
                            username: (result.username) ? result.username : '',
                            email: (result.email) ? result.email : null,
                            salutationcode: (result.salutationcode) ? result.salutationcode : null,
                            dateofbirth: (result.dateofbirth) ? result.dateofbirth : null,
                            cardnumber: (result.membercards && result.membercards[0] && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : null,
                            tierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null,
                            membertierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membertierid !== undefined) ? result.membertiers[0].membertierid : null,
                            membershipid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershipid !== undefined) ? result.membertiers[0].membershipid : null,
                            membershiptypeid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershiptypeid !== undefined) ? result.membertiers[0].membershiptypeid : null,
                            awardmiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['awardmiles'] !== undefined && result.memberaccount[0]['awardmiles'] !== null) ? result.memberaccount[0]['awardmiles'] : 0,
                            membertiers: (result.membertiers && result.membertiers[0]) ? result.membertiers[0] : {},
                            status: (result.status) ? result.status : null,
                        }
                    },
                    formrender: true
                });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
            this.setState({ isLoading: false });
        });
    };

    redirectHomePage = () => {
        const { permission, match, location } = this.props;
        if (location.pathname === '/member/form/' + match.params.ID) {
            let menuListMember = [
                { menucode: (isBOD) ? 'BMEMMGT' : 'MMBRPROF', url: '/personal-information' },
                { menucode: 'MMBRADRS', url: '/address' },
                { menucode: 'MMBRCNTC', url: '/contact' },
                { menucode: 'MMBRIDT', url: '/identity' },
                { menucode: 'MMBRHOBI', url: '/hobbies' },
                { menucode: 'MBRACC', url: '/account' },
                { menucode: 'MBRTIER', url: '/tier' },
                { menucode: 'MBRCRD', url: '/card' },
                { menucode: 'MBRACT', url: '/activity' },
                { menucode: 'MBRTRANS', url: '/transaction' },
                { menucode: 'MBRRECPT', url: '/receipt' },
                { menucode: 'MBALIAS', url: '/alias' },
                { menucode: 'REDEEM', url: '/redemption' },
                { menucode: 'REDEEM', url: '/redemptionotp' },
                { menucode: 'MBNOTES', url: '/notes' },
                { menucode: 'MBRMAIL', url: '/mailing' },
                { menucode: 'MBBUYMIL', url: '/buy-mileage' },
                { menucode: 'MBLOCK', url: '/lock' },
                { menucode: 'MBALIAS', url: '/terminate-reactivate' },
                { menucode: 'MYAPPR', url: '/my-approval' },
                { menucode: 'MBBUYPRO', url: '/buy-product' }
            ];
            for (const field in menuListMember) {
                let menucode = menuListMember[field]['menucode'];
                if (permission['usermenu'][menucode][menucode + "_ACCESS"]) {
                    this.props.history.push(match.url + menuListMember[field]['url']);
                    break;
                }
            }
        }
    };

    refreshHeader = async () => {
        let id = this.props.match.params.ID;
        await this.componentMemberHeader.retrieveData(id);
        await this.getDetail(id);
        if (!isBOD) { await this.componentMemberSider.retrieveProgression() };
    };

    retrieveSession = () => {
        this.setState({ isLoading: true })
        const memberid = this.props.match.params.ID;
        DetailRequest(api.url.memberotp.secondstimelimitses, { memberid, transactiontype: 'REDEMPTION' }).then((response) => {
            const { status, result } = response || {};
            const { channel, memberid, otpcode, redeemcode, transactiontype, otpsessiontimelimit, secondstimelimit, otpsessionid } = result ? result : {};

            if (status.responsecode === "0000" && result) {
                if (secondstimelimit && secondstimelimit > 0) {
                    this.setState({
                        channel, memberid, otpcode, redeemcode, transactiontype, otpsessiontimelimit, secondstimelimit, otpsessionid,
                        isLoading: false,
                        fieldvalue: {
                            ...this.state.fieldvalue,
                            statusScreenOTP: 'allowed',
                            countdownSession: Date.now() + (secondstimelimit * 1000)
                        }
                    });
                } else {
                    this.setState({
                        otpsessionid,
                        isLoading: false,
                        messageSubTitle: "The OTP code has expired, please retry for a new code",
                        fieldvalue: {
                            ...this.state.fieldvalue,
                            statusScreenOTP: 'generate',
                            countdownSession: Date.now() + 3000000
                        }
                    });
                    this.retrieveTimeOTP();
                };
            } else {
                const responseMessage = (status && status.responsemessage) ? status.responsemessage : "The OTP code has invalid, please generate new or check latest OTP code we send to you, or contact customer service";
                if (status.responsecode === "9999") Alert.error(responseMessage);
                this.retrieveTimeOTP();
            }
        });
    }

    retrieveTimeOTP = (type) => {
        const memberid = this.props.match.params.ID;
        DetailRequest(api.url.memberotp.secondstimelimit, { memberid, transactiontype: (type === 'profile') ? 'UPDATEPROFILE' : 'REDEMPTION' }).then((response) => {
            const { status, result } = response || {};
            const { secondstimelimit } = result ? result : {};

            if (status.responsecode === "0000" && result) {
                if (secondstimelimit && secondstimelimit > 0) {
                    this.setState({
                        isLoading: false,
                        fieldvalue: {
                            ...this.state.fieldvalue,
                            statusScreenOTP: 'verify',
                            countdownTimeVerify: Date.now() + (secondstimelimit * 1000)
                        }
                    });
                } else this.setState({
                    isLoading: false,
                    fieldvalue: {
                        ...this.state.fieldvalue,
                        statusScreenOTP: 'generate',
                        countdownTimeVerify: Date.now() + 300000
                    }
                });
            } else {
                const responseMessage = (status && status.responsemessage) ? status.responsemessage : "The OTP code has invalid, please generate new or check latest OTP code we send to you, or contact customer service";
                if (status.responsecode === "9999") Alert.error(responseMessage);
                this.setState({
                    isLoading: false,
                    fieldvalue: {
                        ...this.state.fieldvalue,
                        statusScreenOTP: 'generate',
                        countdownTimeVerify: Date.now() + 300000
                    }
                });
            };
        });
    };

    onFinish = (otpsessiontimelimit, otpsessionid) => {
        const limit = moment(otpsessiontimelimit).format('YYYY/MM/DD HH:mm:ss');
        const now = momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
        const validate = limit <= now;

        if (validate && otpsessionid) {
            DetailRequest(api.url.memberotp.delete, { otpsessionid }).then((response) => {
                const { status } = response;
                const { responsecode } = status || {};
                if (responsecode === '0000') {
                    this.setState({ otpsessiontimelimit: null, otpsessionid: null });
                    window.location.href = '/member/form/' + this.props.match.params.ID + '/redemptionotp';
                }
            });
        };
    };

    handleLoading = (value) => {
        this.setState({ isLoading: value })
    };

    render() {
        const { headerdata, formrender, responseCode, fieldvalue, otpsessionid, expiredtime, otpsessiontimelimit,
            isLoading, memberlock, channel, otpcode, redeemcode, secondstimelimit, transactiontype } = this.state;
        const { statusScreenOTP, countdownSession, countdownTimeVerify } = fieldvalue;
        const dataOTP = { statusScreenOTP, countdownSession, countdownTimeVerify, otpsessionid };
        const memberid = this.props.match.params.ID;
        const responseSession = { channel, otpcode, redeemcode, secondstimelimit, transactiontype };

        //For OTP Session
        const limit = moment(otpsessiontimelimit).format('YYYY/MM/DD HH:mm:ss');
        const now = momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
        const difference = (limit) ? moment(limit).diff(now) : null;
        const countdown = Date.now() + difference;
        const validate = limit > now;

        //For OTP Time Expired
        const limit2 = moment(expiredtime).format('YYYY/MM/DD HH:mm:ss');
        const now2 = momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
        const difference2 = (limit2) ? moment(limit2).diff(now2) : null;
        const countdown2 = Date.now() + difference2;
        const validate2 = limit2 > now2;

        if (responseCode.substring(0, 1) === '0') {
            return (
                <Content style={{ margin: '16px 0', background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <MemberHeader ref={(e) => { this.componentMemberHeader = e }} {...this.props} memberid={memberid} />
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <MemberManagementSider onRef={(e) => (this.componentMemberSider = e)} memberid={memberid} {...this.props} />
                        <Content style={{ padding: '0 24px', overflowY: 'hidden' }}>
                            {
                                (formrender) ?
                                    <MemberManagementRouter {...this.props}
                                        isLoading={isLoading}
                                        headerdata={headerdata}
                                        getMemberLock={this.getMemberLock}
                                        handleLoading={this.handleLoading}
                                        memberlock={memberlock}
                                        countdown={countdown}
                                        validate={validate}
                                        countdown2={countdown2}
                                        validate2={validate2}
                                        otpsessionid={otpsessionid}
                                        otpsessiontimelimit={otpsessiontimelimit}
                                        refreshHeader={this.refreshHeader}
                                        retrieveSession={this.retrieveSession}
                                        retrieveTimeOTP={this.retrieveTimeOTP}
                                        retrieveFinish={() => this.onFinish(otpsessiontimelimit, otpsessionid)}
                                        responseSession={responseSession}
                                        dataOTP={dataOTP} /> : null
                            }
                        </Content>
                    </Layout>
                </Content>
            )
        } else {
            return (
                <Content style={{ margin: '16px 0', background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <ErrorGeneral {...this.props} message={this.state.responseMessage} />
                </Content>
            );
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));