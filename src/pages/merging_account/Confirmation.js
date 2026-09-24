import React from "react";
import { Result, Col, Row, Form, Skeleton, Typography, Icon, Divider, Card, Modal, Input, Layout, Alert as AlertANT, Tooltip, Drawer } from "antd";
import { api } from "../../config/Services";
import { EmailChecklist } from "../../components/IconSVG/index";
import { RetrieveRequest, DetailRequest, CancelRequest, } from "../../utilities/RequestService";
import { loginNoAuth, setIdToken, setTimeToken, setProfile, setAPIToken, } from "../../utilities/AuthService";
import { Alert, Button } from "../../components/Base/BaseComponent";
import moment from "moment";
import momentzone from "moment-timezone";
import './index.css'
import { jwtDecode } from "jwt-decode";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

class MergingConfirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otpvalue: false,
            isLoading: false,
            otprender: true,
            verified: false,
            showconfirmation: false,
            showconfirmatio: false,
            showModal: false,
            successMerge: false,
            cancelledMerge: false,
            waitingMerge: false,
            modalSuccessMerge: false,
            memberOriginOpen: true, // accordion state
            showAddressBTooltip: false, // for mobile tooltip
            showMemberCard: false, // untuk tombol show member
            showAddressATooltip: false,
            fieldvalue: {
                generatedtime: 0,
                expiredtime: 0,
            },
        };
    }
    handleToggleMemberOrigin = () => {
        this.setState((prevState) => ({ memberOriginOpen: !prevState.memberOriginOpen }));
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        document.title = "Confirmation Merge | Loyalty Management System";
    }

    getDetail = () => {
        let key = this.props.match.params.mergeid;
        if (key) key = jwtDecode(key);
        let url = api.url.profileintegration.detail;
        let data = { mergeid: key };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let oriCardnumber = result.originMember.cardnumber ? result.originMember.cardnumber : "-";
                    let oriMembername = result.originMember.name ? result.originMember.name : "-";
                    let oriEmail = result.originMember.email ? result.originMember.email : "-";
                    let oriPhone = result.originMember.membercontacts.length !== 0 ? result.originMember.membercontacts[0].countryphonecode + result.originMember.membercontacts[0].phonenumber : "-"
                    let oriAddress = result.originMember.memberaddress.length !== 0 ? result.originMember.memberaddress[0].address : "-";
                    let oriMemberid = result.originMember.memberid ? result.originMember.memberid : "-";

                    let desCardnumber = result.mergeWith.cardnumber ? result.mergeWith.cardnumber : "-";
                    let desMembername = result.mergeWith.name ? result.mergeWith.name : "-";
                    let desEmail = result.mergeWith.email ? result.mergeWith.email : "-";
                    let desPhone = result.mergeWith.membercontacts.length !== 0 ? result.mergeWith.membercontacts[0].countryphonecode + result.mergeWith.membercontacts[0].phonenumber : "-"
                    let desAddress = result.mergeWith.memberaddress.length !== 0 ? result.mergeWith.memberaddress[0].address : "-";
                    let desMemberid = result.mergeWith.memberid ? result.mergeWith.memberid : "-";

                    let setValue = { oriCardnumber, desCardnumber, oriMembername, desMembername, oriEmail, oriAddress, oriPhone, desAddress, desEmail, desPhone, oriMemberid, desMemberid };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ fieldvalue: setValue });

                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    cancelMerge() {
        let url = api.url.profileintegration.update;
        let key = this.props.match.params.mergeid;
        if (key) key = jwtDecode(key);
        let mergeid = key;
        let mastermember = this.state.fieldvalue.oriMemberid;
        let mergewith = this.state.fieldvalue.desMemberid;
        let data = { mergeid, mastermember, mergewith, status: 'CANCELLED' };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                let message = (responsemessage) ? responsemessage : 'Requested Merge has been cancelled';
                this.setState({ showModal: false, cancelledMerge: true });
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
        };
        CancelRequest(url, data, callback, 'Are you sure to cancel this request?');
    }

    saveAction = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                this.setState({ isLoading: true });
                //define parameter
                let mergeTypeEnum = (input.mergeTypeEnum) ? 'ADMIN' : 'MEMBER';
                let email = this.props.email;
                let memberphoneid = this.props.phone;
                let memberaddressid = this.props.address;
                let mastermember = this.props.memberOri;
                let mergewithid = this.props.memberDes;

                let data = { email, memberphoneid, memberaddressid, mastermember, mergewithid, mergeTypeEnum };

                let message = 'New data has been merged';
                let url = api.url.member.merging;

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode === '0000') {
                        let mergeid = response.result.mergeid;
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        if (mergeid) window.location.href = `/merging-account/detail/${mergeid}`;
                    } else {
                        Alert.error(responsemessage);
                    }
                    //hide loader
                    this.setState({ isLoading: false });
                })
            }
        });
    };

    checkKey = () => {
        this.setState({ isLoading: true });
        let token = this.props.location.search.split("=")[1];
        let url = api.url.member.token;
        DetailRequest(url, { token }).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000') {
                // this.setState({ key });
            } else {
                this.setState({ responseCode: status.responsecode });
            }
        });
        this.setState({ isLoading: false });
    }

    approveMerge = (type) => {
        const callback = () => {
            let key = this.props.match.params.mergeid;
            if (key) key = jwtDecode(key);
            let mergeid = key;
            let keyMemberid = key;
            let mastermember = this.state.fieldvalue.oriMemberid;
            let mergewith = this.state.fieldvalue.desMemberid;
            let url = api.url.profileintegration.approved;

            DetailRequest(url, {
                mergeid,
                mastermember: keyMemberid === mastermember ? mastermember : null,
                mergewith: keyMemberid === mergewith ? mergewith : null
            }).then((response) => {
                const { status, result } = response;
                if (status.responsecode === '0000') {
                    // success
                    if (result.iscompleted === false) this.setState({ showModal: false, waitingMerge: true });
                    if (result.iscompleted === true) this.setState({ showModal: false, successMerge: true });
                } else {
                    this.setState({ responseCode: status.responsecode });
                }
            });
        };
        confirm({
            title: 'Are you sure to approve this request merge?',
            onOk(e) {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    callback();
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    };

    render() {
        const { showModal, fieldvalue, verified, type, successMerge, waitingMerge, cancelledMerge, errortype, showconfirmation, showconfirmatio, modalSuccessMerge, isLoading, responseCode } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
        };
        const { oriCardnumber, desCardnumber, oriMembername, desMembername, oriEmail, oriAddress, oriPhone, desAddress, desEmail, desPhone } = fieldvalue;
        const mobileScreen = window.screen.width < 600;

        const timeExpiredServer = (fieldvalue) ? moment(fieldvalue.expiredtime).format('YYYY/MM/DD HH:mm:ss') : momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
        const currentLocalTimetoServer = momentzone().tz('Asia/Jakarta').format('YYYY/MM/DD HH:mm:ss');
        const difference = (timeExpiredServer) ? moment(timeExpiredServer).diff(currentLocalTimetoServer) : null;
        const otprender = 5
        // const isLoading = false;

        // const desAddress = 'Jl. A member origin address address';
        // const oriAddress = 'Jl. B member origin address address';

        if (isLoading) {
            return <Skeleton active={true}></Skeleton>;
        } else if (verified) {
            return (
                <Row type="flex" justify="center">
                    <Col>
                        <Row type="flex" justify="center" style={{ margin: mobileScreen ? '70px 0px 0px 0px' : '70px 0px' }}>
                            <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 300} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
                            <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 190} />
                        </Row>
                        <Result
                            icon={<Icon component={EmailChecklist} {...this.props} />}
                            title="Congratulations!"
                            subTitle="OTP verified successfully"
                        />
                    </Col>
                </Row>
            )
        } else return (
            <Row style={{ height: '100%' }}>
                <Modal
                    title="Do you want to approve this excess request?"
                    visible={showconfirmation}
                    onOk={console.log('Yes, Approve')}
                    onCancel={() => { this.setState({ showconfirmation: false }) }}
                    style={{ borderBottom: 'none', borderRadius: "16px" }}
                    footer={null}
                    width={480}
                >
                    <Row type="flex" justify="center" >
                        <Text style={{ textAlign: 'left' }}>
                            Please ensure the details before proceeding. The excess miles will be billed in the next month.
                        </Text>

                        <TextArea rows={4} placeholder={'Add some remarks here ...'} style={{ marginTop: 12 }} />
                        <Row type="flex" justify="center" style={{ marginTop: 30 }} >
                            <Button
                                htmlType="button"
                                type="default"
                                label="No, Cancel"
                                onClick={() => { this.setState({ showconfirmation: false }) }}
                                style={{ minWidth: 100, marginRight: 10 }}
                            />
                            <Button
                                htmlType="button"
                                type="primary"
                                label="Yes, Approve"
                                onClick={() => { this.setState({ showconfirmation: false }) }}
                                style={{ minWidth: 100 }}
                            />
                        </Row>
                    </Row>
                </Modal>
                <Modal
                    title="Do you want to reject this excess request?"
                    visible={showconfirmatio}
                    onOk={console.log('Yes, Reject')}
                    onCancel={() => { this.setState({ showconfirmatio: false }) }}
                    style={{ borderBottom: 'none', borderRadius: "16px" }}
                    footer={null}
                    width={480}
                >
                    <Row type="flex" justify="center" >
                        <Text>
                            Make sure all information is correct before rejecting this request. You won’t be able to reverse this action
                        </Text>
                        <TextArea rows={4} placeholder={'Add some remarks here ...'} style={{ marginTop: 12 }} />
                        <Row type="flex" justify="center" style={{ marginTop: 30 }} >
                            <Button
                                htmlType="button"
                                type="default"
                                label="No, Cancel"
                                onClick={() => { this.setState({ showconfirmatio: false }) }}
                                style={{ minWidth: 100, marginRight: 10 }}
                            />
                            <Button
                                htmlType="button"
                                type="danger"
                                label="Yes, Reject"
                                onClick={() => { this.setState({ showconfirmatio: false }) }}
                                style={{ minWidth: 100 }}
                            />
                        </Row>
                    </Row>
                </Modal>
                <Modal
                    title={(type === 'approve') ? `Do you want to continue approve this merge?` : 'Are you sure you want to cancel this merge request?'}
                    visible={showModal && !mobileScreen}
                    onOk={console.log('Yes, Approve')}
                    onCancel={() => { this.setState({ showModal: false }) }}
                    footer={null}
                    width={624}
                    style={{
                        borderBottom: 'none',
                        borderRadius: "16px",
                        top: '5%',
                        left: '28%',
                        position: 'fixed',
                        padding: 0,
                        margin: 0,
                        maxHeight: '98vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    bodyStyle={{
                        padding: 24,
                        maxHeight: '84vh',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Row type="flex" justify="center" >
                        <Text style={{ textAlign: 'left' }}>
                            {type === 'approve' ? 'Please ensure the details before proceeding. You are about merge and deactivate previous account below to new account' : 'Please review the details before proceeding. If you cancel, this merge request will not be processed.'}
                        </Text>
                        <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', }}>
                            {type === 'approve' ? <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#fffffff", borderRadius: 24, maxWidth: 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: "2px solid #E5EDFF", marginBottom: 16, marginTop: 14 }}>
                                <Row style={{ textAlign: "center" }}>
                                    <Col xs={24} style={{ fontSize: "24px" }}><strong>Previous Account</strong></Col>
                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: "14px", marginBottom: "12px" }}>( This account will be merged and <strong style={{ color: '#c91010' }}>deactivate</strong>)</Col>
                                    <Col xs={24}>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={13} style={{ textAlign: "start" }}>{oriMembername}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={13} style={{ textAlign: "start" }}>{oriCardnumber}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={13} style={{ textAlign: "start" }}>{oriEmail}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{oriPhone}</Col>
                                        </Row>
                                        <Row style={{ marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={13} style={{ textAlign: "start" }}><Tooltip title={desAddress}>{desAddress ? desAddress.length > 22 ? desAddress.substring(0, 22) + '...' : desAddress : '-'}</Tooltip></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card> : null}
                        </Col>
                        <Row type="flex" justify="center">
                            <AlertANT
                                description={
                                    (type === 'approve') ? <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#333', lineHeight: 1.5, maxWidth: 500 }}>
                                        <p>
                                            All data from the <strong>previous account will be transferred to the new account</strong>.
                                            Make sure you confirm the correct information in new account.
                                        </p>
                                        <ul style={{ listStyle: 'none', paddingLeft: 8, marginTop: 8 }}>
                                            <li style={{ marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span style={{ color: '#007BFF', fontWeight: 'bold', marginLeft: 0, marginTop: 2 }}>•</span>
                                                <span>After this process, previous account will no longer be active</span>
                                            </li>
                                            <li style={{ marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span style={{ color: '#007BFF', fontWeight: 'bold', marginLeft: 0, marginTop: 2 }}>•</span>
                                                <span>You cannot undo this action once approved</span>
                                            </li>
                                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span style={{ color: '#007BFF', fontWeight: 'bold', marginLeft: 0, marginTop: 2 }}>•</span>
                                                <span>Merge complete after two account confirm merging</span>
                                            </li>
                                        </ul>
                                    </div> : <div>
                                        <p>
                                            No data will be transferred if you cancel this merge. This action will discard the merge request.
                                        </p>
                                    </div>
                                }
                                type="warning"
                                style={{ width: '75vw', maxWidth: '500px', marginBottom: 12, borderRadius: 8, marginTop: 12 }}
                            />
                        </Row>
                        <Row type="flex" justify="center" style={{ marginTop: 14 }} >
                            <Button
                                htmlType="button"
                                type="default"
                                label={`No, ${(type === 'approve') ? 'Cancel' : 'Go Back'}`}
                                onClick={() => { this.setState({ showModal: false }) }}
                                style={{ minWidth: 160, height: 52, borderRadius: 55, marginRight: 10 }}
                            />
                            <Button
                                style={{ minWidth: 160, height: 52, borderRadius: 55 }}
                                htmlType="button"
                                type="primary"
                                label={`Yes, ${(type === 'approve') ? 'Approve' : 'Cancel Merge'}`}
                                onClick={() => (type === 'approve' ? this.approveMerge(type) : this.cancelMerge())}
                            />
                        </Row>
                    </Row>
                </Modal>
                <Modal
                    visible={modalSuccessMerge && !mobileScreen}
                    onOk={console.log('Yes, Reject')}
                    onCancel={() => { this.setState({ modalSuccessMerge: false }) }}
                    footer={null}
                    width={480}
                    style={(successMerge === true) ? null : {
                        borderBottom: 'none',
                        borderRadius: "16px",
                        top: '5%',
                        left: '34%',
                        position: 'fixed',
                        padding: 0,
                        margin: 0,
                        maxHeight: '92vh',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    bodyStyle={(successMerge === true) ? null : {
                        padding: 24,
                        maxHeight: '90vh',
                        overflowY: 'false',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Row type="flex" justify="center" align="middle" style={{ padding: '48px 0px 24px 0px' }}>
                        <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', marginBottom: 24 }}>
                            <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#E5EDFF", borderRadius: 24, maxWidth: mobileScreen ? 340 : 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                                <Row style={{ textAlign: "center" }}>
                                    <Col xs={24} style={{ fontSize: "24px", }}><strong>✨ New Account ✨</strong></Col>
                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: mobileScreen ? "12px" : "14px", marginBottom: "12px" }}>{(successMerge === true) ? <p>This is your <strong style={{ color: '#13d416' }}>active</strong> account </p> : <p> This will be your <strong style={{ color: '#13d416' }}>active</strong> account after merging </p>}</Col>
                                    <Col xs={24}>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desMembername}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desCardnumber}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desEmail}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{desPhone}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>
                                                <Tooltip
                                                    title={desAddress}
                                                    visible={mobileScreen ? this.state.showAddressATooltip : undefined}
                                                    onVisibleChange={visible => {
                                                        if (mobileScreen) this.setState({ showAddressATooltip: visible });
                                                    }}
                                                >
                                                    <span
                                                        onClick={() => {
                                                            if (mobileScreen) this.setState({ showAddressATooltip: true });
                                                        }}
                                                        style={{ cursor: mobileScreen ? 'pointer' : 'default' }}
                                                    >
                                                        {
                                                            desAddress
                                                                ? desAddress.length > (mobileScreen ? 21 : 22)
                                                                    ? desAddress.substring(0, mobileScreen ? 21 : 22) + '...'
                                                                    : desAddress
                                                                : '-'
                                                        }
                                                    </span>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        {(successMerge !== true) ?
                            <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center' }}>
                                <Card bordered={false} style={{ textAlign: "center", borderRadius: 24, width: mobileScreen ? 340 : 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: "2px solid #E5EDFF" }}>
                                    <Row style={{ textAlign: "center", cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Col xs={24} style={{ fontSize: "24px", textAlign: 'center', paddingLeft: 12 }}><strong>Previous Account</strong></Col>
                                    </Row>
                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: mobileScreen ? "12px" : "14px", marginBottom: "12px" }}>( This account will be merged and {<strong style={{ color: '#c91010' }}> deactivate </strong>} )</Col>
                                    <Col xs={24}>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriMembername}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriCardnumber}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriEmail}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{oriPhone}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>
                                                <Tooltip
                                                    title={oriAddress}
                                                    visible={mobileScreen ? this.state.showAddressBTooltip : undefined}
                                                    onVisibleChange={visible => {
                                                        if (mobileScreen) this.setState({ showAddressBTooltip: visible });
                                                    }}
                                                >
                                                    <span
                                                        onClick={() => {
                                                            if (mobileScreen) this.setState({ showAddressBTooltip: true });
                                                        }}
                                                        style={{ cursor: mobileScreen ? 'pointer' : 'default' }}
                                                    >
                                                        {
                                                            oriAddress
                                                                ? oriAddress.length > (mobileScreen ? 21 : 22)
                                                                    ? oriAddress.substring(0, mobileScreen ? 21 : 22) + '...'
                                                                    : oriAddress
                                                                : '-'
                                                        }
                                                    </span>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Card>
                            </Col> : null
                        }
                    </Row>
                </Modal>

                <Drawer
                    height={(type === 'approve') ? '100vh' : '65vh'}
                    destroyOnClose={true}
                    placement={'bottom'}
                    closable={true}
                    onClose={() => { this.setState({ showModal: false }) }}
                    visible={showModal && mobileScreen}
                    title={(type === 'approve') ? `Do you want to approve this request?` : 'Are you sure you want to cancel this merge request?'}
                >
                    <Row type="flex" justify="center" >
                        <Text>
                            {type === 'approve' ? 'Please ensure the details before proceeding. You are about to merge and deactivate previous account below to new account	' : 'Please review the details before proceeding. If you cancel, this merge request will not be processed.'}
                        </Text>
                        <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', marginBottom: 16, marginTop: 12 }}>
                            {type === 'approve' ? <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#E5EDFF", borderRadius: 24, maxWidth: 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                                <Row style={{ textAlign: "center" }}>
                                    <Col xs={24} style={{ fontSize: "24px" }}><strong>Previous Account</strong></Col>
                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: "12px", marginBottom: "12px" }}>( This account will be merged and <strong style={{ color: '#c91010' }}>deactivate</strong>)</Col>
                                    <Col xs={24}>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriMembername}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriCardnumber}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}><Tooltip title={oriEmail}>{oriEmail ? oriEmail.substring(0, 18) + '...' : '-'}</Tooltip></Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{oriPhone}</Col>
                                        </Row>
                                        <Row style={{ marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}><Tooltip title={desAddress}>{desAddress ? desAddress.substring(0, 20) + '...' : '-'}</Tooltip></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card> : null}
                        </Col>
                        <Row type="flex" justify="center">
                            <AlertANT
                                description={
                                    (type === 'approve') ? <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#333', lineHeight: 1.5, maxWidth: 500 }}>
                                        <p>
                                            All data from the <strong>previous account will be transferred to the new account</strong>.
                                            Make sure you confirm the correct information in the new account.
                                        </p>
                                        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 16 }}>
                                            <li style={{ marginBottom: 8, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span style={{ color: '#007BFF', fontWeight: 'bold', marginLeft: 0, marginTop: 2 }}>•</span>
                                                <span>After this process, previous account will no longer be active</span>
                                            </li>
                                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span style={{ color: '#007BFF', fontWeight: 'bold', marginLeft: 0, marginTop: 2 }}>•</span>
                                                <span>You cannot undo this action once approved</span>
                                            </li>
                                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                <span style={{ color: '#007BFF', fontWeight: 'bold', marginLeft: 0, marginTop: 2 }}>•</span>
                                                <span>Merge complete after two account confirm merging</span>
                                            </li>
                                        </ul>
                                    </div> : <div>
                                        <p>
                                            No data will be transferred if you cancel this merge. This action will discard the merge request.
                                        </p>
                                    </div>
                                }
                                type="warning"
                                style={{ width: '88vw', maxWidth: '480px', marginBottom: 16, borderRadius: 8, marginTop: 12 }}
                            />
                        </Row>
                        <Row type="flex" justify="center" style={{ marginTop: 16 }} >
                            <Button
                                htmlType="button"
                                type="default"
                                label={`No, ${(type === 'approve') ? 'Cancel' : 'Go Back'}`}
                                onClick={() => { this.setState({ showModal: false }) }}
                                style={{ minWidth: 140, height: 52, borderRadius: 55, marginRight: 10 }}
                            />
                            <Button
                                style={{ minWidth: 140, height: 52, borderRadius: 55 }}
                                htmlType="button"
                                type="primary"
                                label={`Yes, ${(type === 'approve') ? 'Approve' : 'Cancel Merge'}`}
                                onClick={() => (type === 'approve' ? this.approveMerge(type) : this.cancelMerge())}
                            />
                        </Row>
                    </Row>
                </Drawer>

                <Drawer
                    height={(type === 'approve') ? '100vh' : '65vh'}
                    destroyOnClose={true}
                    placement={'bottom'}
                    closable={true}
                    onClose={() => { this.setState({ modalSuccessMerge: false }) }}
                    visible={modalSuccessMerge && mobileScreen}
                >
                    <Row type="flex" justify="center" align="middle" style={{ padding: '36px 0px 12	px 0px' }}>
                        <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', marginBottom: 24, paddingTop: 36 }}>
                            <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#E5EDFF", borderRadius: 24, maxWidth: mobileScreen ? 340 : 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                                <Row style={{ textAlign: "center" }}>
                                    <Col xs={24} style={{ fontSize: "24px", }}><strong>✨ New Account ✨</strong></Col>
                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: mobileScreen ? "12px" : "14px", marginBottom: "12px" }}>{(successMerge === true) ? <p>This is your <strong style={{ color: '#13d416' }}>active</strong> account </p> : <p> This will be your <strong style={{ color: '#13d416' }}>active</strong> account after merging </p>}</Col>
                                    <Col xs={24}>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desMembername}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desCardnumber}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desEmail ? desEmail.substring(0, 18) + '...' : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{desPhone}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>
                                                <Tooltip
                                                    title={desAddress}
                                                    visible={mobileScreen ? this.state.showAddressATooltip : undefined}
                                                    onVisibleChange={visible => {
                                                        if (mobileScreen) this.setState({ showAddressATooltip: visible });
                                                    }}
                                                >
                                                    <span
                                                        onClick={() => {
                                                            if (mobileScreen) this.setState({ showAddressATooltip: true });
                                                        }}
                                                        style={{ cursor: mobileScreen ? 'pointer' : 'default' }}
                                                    >
                                                        {desAddress ? desAddress.substring(0, 20) + '...' : '-'}
                                                    </span>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        {(successMerge !== true) ?
                            <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center' }}>
                                <Card bordered={false} style={{ textAlign: "center", borderRadius: 24, width: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: "2px solid #E5EDFF" }}>
                                    <Row style={{ textAlign: "center", cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Col xs={24} style={{ fontSize: "24px", textAlign: 'center', paddingLeft: 12 }}><strong>Previous Account</strong></Col>
                                    </Row>
                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: mobileScreen ? "12px" : "14px", marginBottom: "12px" }}>( This account will be merged and {<strong style={{ color: '#c91010' }}> deactivate </strong>} )</Col>
                                    <Col xs={24}>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriMembername}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriCardnumber}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriEmail ? oriEmail.substring(0, 18) + '...' : '-'}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{oriPhone}</Col>
                                        </Row>
                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>
                                                <Tooltip
                                                    title={oriAddress}
                                                    visible={mobileScreen ? this.state.showAddressBTooltip : undefined}
                                                    onVisibleChange={visible => {
                                                        if (mobileScreen) this.setState({ showAddressBTooltip: visible });
                                                    }}
                                                >
                                                    <span
                                                        onClick={() => {
                                                            if (mobileScreen) this.setState({ showAddressBTooltip: true });
                                                        }}
                                                        style={{ cursor: mobileScreen ? 'pointer' : 'default' }}
                                                    >
                                                        {oriAddress ? oriAddress.substring(0, 20) + '...' : '-'}
                                                    </span>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Card>
                            </Col> : null
                        }
                    </Row>
                </Drawer>

                {(otprender === 1) ? (
                    <Form {...formItemLayout}>
                        <Row type="flex" justify="center" style={{ height: "100%", alignContent: 'center' }}>
                            <Col style={{ height: "100vh", alignContent: 'center' }}>
                                <Row type="flex" justify="center" style={{ justifyItems: 'center', width: '100%' }}>
                                    <Col className="gutter-row" xs={24} style={{ textAlign: "center", justifyItems: 'center' }}>
                                        <Row type="flex" justify="center" style={{ marginBottom: 60 }}>
                                            <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
                                            <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 180} height={'100%'} style={{ marginTop: 12 }} />
                                        </Row>
                                        <img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/rejected.png" alt="Approve" width={mobileScreen ? 130 : 300} />

                                        <Title level={2}>Activity Rejected</Title>
                                        <Text style={{ marginTop: 20 }}>
                                            This activity has been rejected, with some remarks. You may view the activity details for more information.<br></br>
                                        </Text>
                                        <div className="quote-box">
                                            <Paragraph>
                                                <strong>
                                                    Remarks
                                                </strong>
                                            </Paragraph>
                                            <Paragraph>
                                                Your request didn’t meet the requirements. Please check your account status and minimum top-up amount before trying again.
                                            </Paragraph>
                                        </div>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{ gap: 24, width: '100%', marginTop: 24 }}>
                                    <Button
                                        htmlType="button"
                                        type="primary"
                                        label="Detail Activity"
                                        onClick={() => { this.setState({ showconfirmation: true }) }}
                                        style={{ minWidth: 100 }}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                ) : (otprender === 2) ? (
                    <Form {...formItemLayout}>
                        <Row type="flex" justify="center" style={{ height: "100%", alignContent: 'center' }}>
                            <Col style={{ height: "100vh", alignContent: 'center' }}>
                                <Row type="flex" justify="center" style={{ justifyItems: 'center', width: '100%' }}>
                                    <Col className="gutter-row" xs={24} style={{ textAlign: "center", justifyItems: 'center' }}>
                                        <Row type="flex" justify="center" style={{ marginBottom: 60 }}>
                                            <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
                                            <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 180} height={'100%'} style={{ marginTop: 12 }} />
                                        </Row>
                                        <img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/approve.png" alt="Approve" width={mobileScreen ? 130 : 300} />

                                        <Title level={2}>Activity Approved</Title>
                                        <Text style={{ marginTop: 20 }}>
                                            This activity has been approved with some remarks. You may view the activity details for more information.
                                        </Text>
                                        <div className="quote-box-success">
                                            <Paragraph>
                                                <strong>
                                                    Remarks
                                                </strong>
                                            </Paragraph>
                                            <Paragraph>
                                                This activity request has been reviewed and successfully approved. The excess miles will be billed in the next month
                                            </Paragraph>
                                        </div>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{ gap: 24, width: '100%', marginTop: 24 }}>
                                    <Button
                                        htmlType="button"
                                        type="primary"
                                        label="Detail Activity"
                                        onClick={() => { this.setState({ showconfirmation: true }) }}
                                        style={{ minWidth: 100 }}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                ) : (otprender === 3) ? (
                    <Form {...formItemLayout}>
                        <Row type="flex" justify="center" style={{ height: "100%", alignContent: 'center' }}>
                            <Col style={{ height: "100vh", alignContent: 'center' }}>
                                <Row type="flex" justify="center" style={{ justifyItems: 'center', width: '100%' }}>
                                    <Col className="gutter-row" xs={24} style={{ textAlign: "center", justifyItems: 'center' }}>
                                        <Row type="flex" justify="center" style={{ marginBottom: 60 }}>
                                            <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
                                            <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 180} height={'100%'} style={{ marginTop: 12 }} />
                                        </Row>
                                        <Title level={2}>Approval Activity</Title>
                                        <Text style={{ marginTop: 20 }}>
                                            You're being asked to review and approve or reject this activity request. Please ensure the details before proceeding. <br></br> The excess miles will be billed in the next month
                                        </Text>
                                        <Card bordered={true} style={{ width: 360, alignContent: "center", borderRadius: 12, marginTop: 24 }}>
                                            <Row style={{ marginTop: 20 }}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'left' }}>Create miles</Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}><strong>1,999</strong></Col>
                                            </Row>
                                            <Row style={{ marginTop: 10 }}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'left' }}>Bulk miles balance</Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}><strong>1,500</strong></Col>
                                            </Row>
                                            <Divider />
                                            <Row style={{ marginTop: 10 }}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'left' }}>Excess miles</Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}><strong>-499</strong></Col>
                                            </Row>
                                            <Divider />
                                            <Row style={{ marginTop: 10, color: '#F9B42D' }}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'left' }}><strong>Request excess miles</strong></Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ textAlign: 'right' }}><strong>499</strong></Col>
                                            </Row>
                                        </Card>
                                        {/* <Text strong style={{ marginTop: 30 }}>
											Please contact customer service if you don't receive an email or resend code
										</Text> */}
                                    </Col>
                                </Row>
                                <Row type="flex" justify="center" style={{ gap: 24, width: '100%', marginTop: 24 }}>
                                    <Button
                                        htmlType="button"
                                        type="danger"
                                        label="Reject"
                                        onClick={() => { this.setState({ showconfirmatio: true }) }}
                                        style={{ minWidth: 100 }}
                                    />
                                    <Button
                                        htmlType="button"
                                        type="primary"
                                        label="Approve"
                                        onClick={() => { this.setState({ showconfirmation: true }) }}
                                        style={{ minWidth: 100 }}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                ) : (otprender === 4) ? (
                    <Row type="flex" justify="center" style={{ height: "100%", alignContent: 'center' }}>
                        <Col style={{ height: "100vh", alignContent: 'center' }}>
                            <Row type="flex" justify="center" >
                                <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
                                <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 180} height={'100%'} style={{ marginTop: 12 }} />
                            </Row>
                            <Result
                                icon={<img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/Cancel-illustration.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginBottom: 20 }} />}
                                status="error"
                                title={(errortype === 'service') ? "Connection Issue" : "Activity Request was Cancelled"}
                                subTitle={'This activity request was cancelled by TelkoUser at 15:29 (Wednesday 28, 2025)'}
                            />
                        </Col>
                    </Row>
                ) : (successMerge) ? (
                    <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #b7ffb0 0%, #e0ffd6 100%)' }}>
                        <Col xs={24} style={{ maxWidth: mobileScreen ? 320 : 400, margin: 'auto', background: '#fff', borderRadius: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: mobileScreen ? '32px 24px' : '32px 12px', textAlign: 'center' }}>
                            <Row type="flex" justify="center" >
                                <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 90 : 100} height={'100%'} />
                                <Divider type='vertical' style={{ height: 36, margin: '0px 24px' }} />
                                <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 72 : 90} height={'100%'} style={{ marginTop: mobileScreen ? 0 : 0 }} />
                            </Row>
                            <div>
                                <svg width="160" height="160" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="40" cy="40" r="40" fill="#fff" />
                                    <path d="M24 42L36 54L56 34" stroke="#13d416" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 20, color: '#13d416', marginBottom: 8 }}>Awesome!</div>
                            <div style={{ fontSize: 18, fontWeight: 500, color: '#333', marginBottom: 12 }}>Congratulations.<br />Your merge is successful!</div>
                            <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>All data has been merged. You can now use your new member.</div>
                            <Button
                                htmlType="button"
                                label="Check on website"
                                type="primary"
                                style={{ width: '100%', borderRadius: 24, height: 48, fontWeight: 600, fontSize: 16, background: 'linear-gradient(90deg, #7be87b 0%, #b7ffb0 100%)', border: 'none', color: '#fff', marginBottom: 12 }}
                                onClick={() => window.open('https://garuda-indonesia.com/id/id/login', '_blank')}
                            />
                            <Button
                                htmlType="button"
                                label={"Show Member"}
                                type="default"
                                style={{ width: '100%', borderRadius: 24, height: 44, fontWeight: 500, fontSize: 15, background: '#e0ffd6', color: '#13d416', marginBottom: 12, border: '1px solid #b7ffb0' }}
                                onClick={() => this.setState({ modalSuccessMerge: true })}
                            />
                        </Col>
                    </Row>
                ) : (waitingMerge) ? (
                    <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FEFBE8 0%, #FEFBE8 100%)' }}>
                        <Col xs={24} style={{ maxWidth: mobileScreen ? 320 : 400, margin: 'auto', background: '#fff', borderRadius: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: mobileScreen ? '32px 24px' : '32px 12px', textAlign: 'center' }}>
                            <Row type="flex" justify="center" >
                                <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 90 : 100} height={'100%'} />
                                <Divider type='vertical' style={{ height: 36, margin: '0px 24px' }} />
                                <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 72 : 90} height={'100%'} style={{ marginTop: mobileScreen ? 0 : 0 }} />
                            </Row>
                            <div style={{ padding: 24 }}>
                                <Icon type="clock-circle" style={{ color: '#ffe066', fontSize: 100 }} />
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 20, color: '#ffcc00ff', marginBottom: 8 }}>Waiting for Confirmation</div>
                            <div style={{ fontSize: 14, color: '#888', marginBottom: 24, padding: '0px 12px' }}>Your part is done. Waiting for the other member to approve.</div>
                            <Button
                                htmlType="button"
                                label={"Show detail"}
                                type="default"
                                style={{ width: '100%', borderRadius: 24, height: 44, fontWeight: 500, fontSize: 15, background: '#fff7b0', color: '#f8c600ff', marginBottom: 12, border: '1px solid #fcc900ff' }}
                                onClick={() => this.setState({ modalSuccessMerge: true })}
                            />
                        </Col>
                    </Row>
                ) : (cancelledMerge) ? (
                    <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #b0d8ff 0%, #e0f3ff 100%)' }}>
                        <Col xs={24} style={{ maxWidth: mobileScreen ? 320 : 400, margin: 'auto', background: '#fff', borderRadius: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: mobileScreen ? '32px 24px' : '32px 12px', textAlign: 'center' }}>
                            <Row type="flex" justify="center" >
                                <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 80 : 100} height={'100%'} />
                                <Divider type='vertical' style={{ height: 36, margin: '0px 24px' }} />
                                <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 72 : 90} height={'100%'} />
                            </Row>
                            <div >
                                <svg width="160" height="160" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="40" cy="40" r="40" fill="#fff" />
                                    <path d="M24 42L36 54L56 34" stroke="#4a90e2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 20, color: '#4a90e2', marginBottom: 8 }}>Merge Cancelled</div>
                            <div style={{ fontSize: 18, fontWeight: 500, color: '#333', marginBottom: 12 }}>No member was merged</div>
                            <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>The merge request was cancelled by you or the other member.</div>
                            <Button
                                htmlType="button"
                                label={"Check on website"}
                                type="primary"
                                style={{ width: '100%', borderRadius: 24, height: 48, fontWeight: 600, fontSize: 16, background: 'linear-gradient(90deg, #7bbcff 0%, #b0d8ff 100%)', border: 'none', color: '#fff' }}
                                onClick={() => window.open('https://garuda-indonesia.com/id/id/login', '_blank')}
                            />
                        </Col>
                    </Row>
                ) : (responseCode === '9999') ? (
                    <Row type="flex" justify="center" style={{ height: "100%", alignContent: 'center' }}>
                        <Col style={{ height: "100vh", alignContent: 'center' }}>
                            <Row type="flex" justify="center" >
                                <img src="/assets/images/logoGA.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginRight: (mobileScreen) ? 0 : 80 }} />
                                <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 130 : 180} height={'100%'} style={{ marginTop: 12 }} />
                            </Row>
                            <Result
                                icon={<img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/Cancel-illustration.png" alt="GA Logo" width={mobileScreen ? 180 : 300} height={'100%'} style={{ marginBottom: 20 }} />}
                                status="error"
                                title={(errortype === 'service') ? "Connection Issue" : "Token is Expired"}
                                subTitle={'The token has expired, please retry for a new token'}
                            />
                        </Col>
                    </Row>
                ) : (
                    <Layout>
                        <Layout.Content style={{ minHeight: 500, background: '#fff', padding: 60 }}>
                            <Row type="flex" justify="center" style={{ alignContent: 'center' }}>
                                <Col style={{ alignContent: 'start', paddingBottom: 12 }}>
                                    <Row type="flex" justify="center" style={{ textAlign: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', }} >
                                        <img src="/assets/images/logoGA.png" alt="GA Logo" width={150} height={'100%'} style={{ marginRight: 0 }} />
                                        <Divider type='vertical' style={{ height: 36, margin: '0px 24px' }} />
                                        <img src="/assets/images/logo.png" alt="Asyst Logo" width={mobileScreen ? 100 : 72} height={'100%'} style={{ marginTop: 4, marginRight: mobileScreen ? 20 : 60 }} />
                                    </Row>
                                    <Result
                                        icon={<img src="https://amala-pdt.garuda-indonesia.com/uploads/managetier/profile.png" alt="GA Logo" width={180} height={'100%'} style={{ marginBottom: 20 }} />}
                                        status="error"
                                        title={"Confirm Account Merge"}
                                        subTitle={`You are about to merge previous account to new account. Please review the details below and confirm your action.`}
                                    />
                                    <Row type="flex" justify="center" align="middle" style={{ marginBottom: 48 }}>
                                        <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', marginBottom: 24 }}>
                                            <Card bordered={false} style={{ textAlign: "center", backgroundColor: "#E5EDFF", borderRadius: 24, maxWidth: mobileScreen ? 340 : 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                                                <Row style={{ textAlign: "center" }}>
                                                    <Col xs={24} style={{ fontSize: "24px", }}><strong>✨ New Account ✨</strong></Col>
                                                    <Col xs={24} style={{ marginBottom: "10px", fontSize: mobileScreen ? "12px" : "14px", marginBottom: "12px" }}>( This will be your <strong style={{ color: '#13d416' }}>active</strong> account after merging )</Col>
                                                    <Col xs={24}>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desMembername}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desCardnumber}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{desEmail}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{desPhone}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>
                                                                <Tooltip
                                                                    title={desAddress}
                                                                    visible={mobileScreen ? this.state.showAddressATooltip : undefined}
                                                                    onVisibleChange={visible => {
                                                                        if (mobileScreen) this.setState({ showAddressATooltip: visible });
                                                                    }}
                                                                >
                                                                    <span
                                                                        onClick={() => {
                                                                            if (mobileScreen) this.setState({ showAddressATooltip: true });
                                                                        }}
                                                                        style={{ cursor: mobileScreen ? 'pointer' : 'default' }}
                                                                    >
                                                                        {
                                                                            desAddress
                                                                                ? desAddress.length > (mobileScreen ? 21 : 22)
                                                                                    ? desAddress.substring(0, mobileScreen ? 21 : 22) + '...'
                                                                                    : desAddress
                                                                                : '-'
                                                                        }
                                                                    </span>
                                                                </Tooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col className="gutter-row" xs={24} style={{ textAlign: "center", alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center' }}>
                                            <Card bordered={false} style={{ textAlign: "center", borderRadius: 24, width: mobileScreen ? 340 : 360, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: "2px solid #E5EDFF" }}>
                                                <Row style={{ textAlign: "center", cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Col xs={24} style={{ fontSize: "24px", textAlign: 'center', paddingLeft: 12 }}><strong>Previous Account</strong></Col>
                                                </Row>
                                                <Col xs={24} style={{ marginBottom: "10px", fontSize: mobileScreen ? "12px" : "14px", marginBottom: "12px" }}>( This account will be merged and {<strong style={{ color: '#c91010' }}> deactivate </strong>} )</Col>
                                                {!this.state.memberOriginOpen && (
                                                    <Col xs={24}>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Name</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriMembername}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Cardnumber</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriCardnumber}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Email</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>{oriEmail}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Phone</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>+{oriPhone}</Col>
                                                        </Row>
                                                        <Row style={{ marginBottom: '12px', marginTop: "12px" }} type="flex" justify='start'>
                                                            <Col className="gutter-row" xs={8} style={{ textAlign: "start", marginLeft: "20px" }} ><label>Address</label></Col>
                                                            <Col className="gutter-row" xs={1} style={{ textAlign: "start" }}>:</Col>
                                                            <Col className="gutter-row" xs={12} style={{ textAlign: "start" }}>
                                                                <Tooltip
                                                                    title={oriAddress}
                                                                    visible={mobileScreen ? this.state.showAddressBTooltip : undefined}
                                                                    onVisibleChange={visible => {
                                                                        if (mobileScreen) this.setState({ showAddressBTooltip: visible });
                                                                    }}
                                                                >
                                                                    <span
                                                                        onClick={() => {
                                                                            if (mobileScreen) this.setState({ showAddressBTooltip: true });
                                                                        }}
                                                                        style={{ cursor: mobileScreen ? 'pointer' : 'default' }}
                                                                    >
                                                                        {
                                                                            oriAddress
                                                                                ? oriAddress.length > (mobileScreen ? 21 : 22)
                                                                                    ? oriAddress.substring(0, mobileScreen ? 21 : 22) + '...'
                                                                                    : oriAddress
                                                                                : '-'
                                                                        }
                                                                    </span>
                                                                </Tooltip>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                )}

                                                <Col xs={24}><Row style={{ textAlign: "center", cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={this.handleToggleMemberOrigin}>
                                                    <Col xs={24} style={{ fontSize: "12px", textAlign: 'center' }}><span style={{ color: '#6996ffff' }}>{(this.state.memberOriginOpen) ? `${mobileScreen ? 'tap' : 'click'} to detail` : `${mobileScreen ? 'tap' : 'click'} to hide`}</span></Col>
                                                </Row>
                                                </Col>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', margin: '8px 28px' }}>
                                        By confirming, I agree to merge the accounts as described above. This action cannot be undone
                                    </p>
                                    <Row type="flex" justify="center" style={{ gap: 24, width: '100%', margin: '24px 0px' }}>
                                        <Button
                                            htmlType="button"
                                            type="danger"
                                            label="Cancel merge"
                                            onClick={() => { this.setState({ showModal: true, type: 'reject' }) }}
                                            style={{ minWidth: 160, height: 52, borderRadius: 55, width: mobileScreen ? '100%' : 160 }}
                                        />
                                        <Button
                                            htmlType="button"
                                            type="primary"
                                            label="Confirm & approve"
                                            onClick={() => { this.setState({ showModal: true, type: 'approve' }) }}
                                            style={{ minWidth: 160, height: 52, borderRadius: 55, width: mobileScreen ? '100%' : 160 }}
                                        />
                                    </Row>
                                </Col>
                            </Row>
                        </Layout.Content>
                    </Layout >
                )
                }
            </Row>
        );
    }
}
export default Form.create()(MergingConfirmation);