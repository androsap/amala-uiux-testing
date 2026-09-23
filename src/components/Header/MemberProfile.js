import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../utilities/RequestService';
import { formatNumber } from '../../utilities/Helpers';
import { Skeleton } from 'antd';
import { Tabs, Layout, Row, Col, Tag, Icon, Modal } from 'antd';
import { Alert } from '../../components/Base/BaseComponent';
import { getProfile } from '../../utilities/AuthService';
import moment from 'moment';

import AccountDetailPage from '../../pages/member/account/Detail';
import AccountDetailCorporatePage from '../../pages/member_corporate/account/Detail';

const { TabPane } = Tabs;
const { confirm } = Modal;
const isBOD = getProfile().rolename === 'BOD';

const tagStatus = {
    ACTIVE: { value: 'ACTIVE', label: 'ACTIVE', color: '#13d416' },
    INACTIVE: { value: 'INACTIVE', label: 'INACTIVE', color: '#f1f514' },
    INACTIVEEMAIL: { value: 'INACTIVEEMAIL', label: 'INACTIVE EMAIL', color: '#c91010' },
    GRACEPERIOD: { value: 'GRACEPERIOD', label: 'GRACE PERIOD', color: '#c97010' },
    MERGED: { value: 'MERGED', label: 'MERGED', color: '#c91010' },
    DECEASED: { value: 'DECEASED', label: 'DECEASED', color: '#c91010' },
    TEST: { value: 'TEST', label: 'TEST', color: '#135ad4' },
    SUSPECTEDFRAUD: { value: 'SUSPECTEDFRAUD', label: 'SUSPECTED FRAUD', color: '#c91010' },
    FRAUD: { value: 'FRAUD', label: 'FRAUD', color: '#c91010' },
    TERMINATED: { value: 'TERMINATED', label: 'TERMINATED', color: '#c91010' },
    SUSPECTDUPLICATE: { value: 'SUSPECTDUPLICATE', label: 'SUSPECT DUPLICATE', color: '#0de0ba' },
    DUPLICATE: { value: 'DUPLICATE', label: 'DUPLICATE', color: '#0de0ba' }
}

const tagIdentity = {
    VERIFIED: { value: 'VERIFIED', title: 'verified', type: 'check-circle', color: '#1890ff' },
    UNVERIFIED: { value: 'UNVERIFIED', title: 'unverified', type: 'minus-circle', color: '#fadb14' },
    REJECTED: { value: 'REJECTED', title: 'rejected', type: 'close-circle', color: '#cf1322' },
    NOIDENTITY: { value: 'NOIDENTITY', title: 'no identity', type: 'minus-circle', color: '#fadb14' }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            loading: true,
            showModal: false,
            isLoading: true,
            profile: {},
            memberidentity: '-',
            mileageExpiryModal: {
                isLoading: false,
                visible: false
            }
        };

        this.showDetailAccount = this.showDetailAccount.bind(this);
    }

    //handle open modal
    handleOpenModal = () => {
        this.setState({ showModal: true });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false });
    }

    //handle close modal and reload data
    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
    }

    retrieveData = (memberid) => {
        let url = api.url.member.profile;
        let type = 'SUMMARY';
        let data = { memberid, type };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                // let expireddate = (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].enddate !== undefined && result.membertiers[0].enddate !== null) ? moment(result.membertiers[0].enddate).format("DD/MM/YYYY") : null;
                // let membershipperiod = (result.membershipperiod !== null && result.membershipperiod !== undefined) ? moment(result.membershipperiod).format("DD/MM/YYYY") : null;
                // let validthru = null;

                // //logic valid thru
                // if (expireddate && membershipperiod) {
                //     if (expireddate > membershipperiod) {
                //         validthru = expireddate;
                //     } else {
                //         validthru = membershipperiod;
                //     }
                // } else {
                //     if (expireddate === null && membershipperiod) {
                //         validthru = membershipperiod;
                //     } else if (membershipperiod === null && expireddate) {
                //         validthru = expireddate
                //     }
                // }
                RetrieveRequest(api.url.memberidentity.retrieve, { memberid }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode.substring(0, 1) === '0' && result) {
                        if (result.length === 0) { this.setState({ memberidentity: 'NOIDENTITY' }) }
                        else {
                            if (result.find(e => e.status === 'VERIFIED')) {
                                this.setState({ memberidentity: 'VERIFIED' })
                            } else if (result.find(e => e.status === 'UNVERIFIED')) {
                                this.setState({ memberidentity: 'UNVERIFIED' })
                            } else this.setState({ memberidentity: 'REJECTED' })
                        }
                    }
                })

                const { status, corporatedetailinfo, mergewith, mergewithdate, nameoncard } = result || '-';
                const profile = {
                    status, corporatedetailinfo, mergewith, mergewithdate, nameoncard,
                    memberid: result.memberid,
                    branchcode: result.branchcodeaddress,
                    corporatename: result.corporatedetailinfo.length ? result.corporatedetailinfo[0].corporatename : '-',
                    memberfullname: result.firstname + " " + ((result.lastname) ? result.lastname : ''),
                    membershipname: (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].membershipname !== undefined) ? result.membercards[0].membershipname : '-',
                    tiername: (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].tiername !== undefined) ? result.membercards[0].tiername : '-',
                    tierid: (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].tierid !== undefined) ? result.membercards[0].tierid : '-',
                    cardnumber: (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : '-',
                    awardmiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['awardmiles'] !== undefined && result.memberaccount[0]['awardmiles'] !== null) ? result.memberaccount[0]['awardmiles'] : '-',
                    tiermiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['tiermiles'] !== undefined && result.memberaccount[0]['tiermiles'] !== null) ? result.memberaccount[0]['tiermiles'] : '-',
                    frequency: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['frequency'] !== undefined && result.memberaccount[0]['frequency'] !== null) ? result.memberaccount[0]['frequency'] : '-',
                    memberaccountid: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['memberaccountid'] !== undefined && result.memberaccount[0]['memberaccountid'] !== null) ? result.memberaccount[0]['memberaccountid'] : null,
                    membersince: (result.enrollmentdate !== undefined && result.enrollmentdate !== null) ? moment(result.enrollmentdate).format("DD/MM/YYYY") : "-",
                    effectivedate: (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].startdate !== undefined && result.membertiers[0].startdate !== null) ? moment(result.membertiers[0].startdate).format("DD/MM/YYYY") : "-",
                    expireddate: (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].enddate !== undefined && result.membertiers[0].enddate !== null) ? moment(result.membertiers[0].enddate).format("DD/MM/YYYY") : '-',
                    membershipperiod: (result.membershipperiod !== null && result.membershipperiod !== undefined) ? moment(result.membershipperiod).format("DD/MM/YYYY") : '-',
                    dateofbirth: (result.dateofbirth !== undefined && result.dateofbirth !== null) ? moment(result.dateofbirth).format("DD/MM/YYYY") : "-",
                    urlcard: (result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].tiertemplatecard !== undefined) ? result.membercards[0].tiertemplatecard : '-',
                };

                this.setState({ profile })
            }
            //call loader
            this.setState({ isLoading: false });
        });

    }

    showDetailAccount = (e) => {
        e.preventDefault();

        this.setState({
            mileageExpiryModal: { ...this.state.mileageExpiryModal, visible: true }
        });
    };

    handleHideDetailAccount = (e) => {
        e.preventDefault();

        this.setState({
            mileageExpiryModal: { ...this.state.mileageExpiryModal, visible: false }
        });
    };

    handleDownloadCard = () => {
        const { tierid, cardnumber, nameoncard, expireddate } = this.state.profile;
        const callback = () => {
            let url = api.url.member.downloadcard;
            let data = { tierid, cardnumber, nameoncard, expireddate };
            let message = 'Downloading card...';
            DetailRequest(url, data).then((response) => {
                const { status = {}, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000') {
                    window.location.href = result.url;
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                } else {
                    Alert.error(responsemessage);
                }
            });
        }
        confirm({
            title: 'Are you sure to download this card?',
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
        const { isLoading } = this.state;
        const { mileageExpiryModal } = this.state;

        if (isLoading) {
            return (
                <Layout className='header-layout'>
                    <Skeleton active />
                </Layout>
            )
        } else {
            const { profile, memberidentity } = this.state;
            const {
                memberid, corporatedetailinfo, memberfullname, corporatename, status, membershipname, tiername, cardnumber, branchcode, membershipperiod,
                awardmiles, tiermiles, frequency, memberaccountid, membersince, effectivedate, expireddate, dateofbirth, urlcard, mergewith, mergewithdate
            } = profile || '-';

            return (
                <Layout style={{ background: '#fff', padding: '24px', borderBottom: '2px solid rgb(233, 233, 233)' }}>

                    {this.props.match.path.split('/')[1] === 'member' ? <Modal visible={mileageExpiryModal.visible} title={`${cardnumber} - ${memberfullname}`} loading={mileageExpiryModal.isLoading} onCancel={this.handleHideDetailAccount} footer={null} destroyOnClose={true} width={1360}>
                        <Tabs defaultActiveKey="1" tabPosition='left' destroyInactiveTabPane={true}>
                            <TabPane tab="All Account Detail" key={1}>
                                <AccountDetailPage type="allaccountdetail" permission={this.props.permission} memberid={memberid} cardnumber={cardnumber} memberaccountid={memberaccountid} memberfullname={memberfullname} />
                            </TabPane>
                            <TabPane tab="All Account Detail Summary" key={2}>
                                <AccountDetailPage type="allaccountdetailsummary" {...this.props} memberid={memberid} memberaccountid={memberaccountid} cardnumber={cardnumber} memberfullname={memberfullname} />
                            </TabPane>
                            <TabPane tab="All Expired Account" key={3}>
                                <AccountDetailPage type="allexpiredaccount" permission={this.props.permission} memberid={memberid} cardnumber={cardnumber} memberaccountid={memberaccountid} memberfullname={memberfullname} />
                            </TabPane>
                            <TabPane tab="Expired This Month" key={4}>
                                <AccountDetailPage type="expiredthismonth" permission={this.props.permission} memberid={memberid} cardnumber={cardnumber} memberaccountid={memberaccountid} memberfullname={memberfullname} />
                            </TabPane>
                        </Tabs>
                    </Modal> :
                        <Modal visible={mileageExpiryModal.visible} title="Member Account Detail" loading={mileageExpiryModal.isLoading} onCancel={this.handleHideDetailAccount} footer={null} destroyOnClose={true} width={1360}>
                            <Tabs defaultActiveKey="1" tabPosition='left' destroyInactiveTabPane={true}>
                                <TabPane tab="All Account Detail" key={1}>
                                    <AccountDetailCorporatePage type="allaccountdetail" memberid={memberid} memberaccountid={memberaccountid} />
                                </TabPane>
                                <TabPane tab="All Expired Account" key={2}>
                                    <AccountDetailCorporatePage type="allexpiredaccount" memberid={memberid} memberaccountid={memberaccountid} />
                                </TabPane>
                                <TabPane tab="Expired This Month" key={3}>
                                    <AccountDetailCorporatePage type="expiredthismonth" memberid={memberid} memberaccountid={memberaccountid} />
                                </TabPane>
                            </Tabs>
                        </Modal>}

                    <Row gutter={8} style={{ width: '100%' }}>
                        <Col xs={8} sm={7} md={5} lg={4} xl={3} style={{ textAlign: 'center' }}>
                            <div className="member-card">
                                <img src={urlcard} alt="" width="130" style={{ marginBottom: 10 }} />
                                {urlcard ? <a onClick={this.handleDownloadCard}>Download Card</a> : null}
                            </div>
                        </Col>
                        <Col xs={16} sm={6} md={6} lg={6} xl={9}>
                            <Row>
                                <Col span={24} style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase', fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                                    {(corporatedetailinfo.length > 0) ? corporatename : memberfullname}&nbsp;
                                    {memberidentity !== '-' ? <Icon type={tagIdentity[memberidentity]['type']} style={{ fontSize: '16px', color: tagIdentity[memberidentity]['color'] }} title={tagIdentity[memberidentity]['title']} theme='filled'></Icon> : ''}
                                </Col>
                            </Row>
                            <Row className="member-profile">
                                <Col xs={12} sm={24} md={12} lg={12} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase', height: 50 }}>
                                    <p>STATUS</p>
                                    <Tag color={tagStatus[status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[status]['label']}</Tag>
                                </Col>
                                <Col xs={12} sm={24} md={12} lg={12} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase', height: 50 }}>
                                    <p>MEMBERSHIP</p>
                                    <span>{membershipname} - {tiername}</span>
                                </Col>
                                <Col xs={12} sm={24} md={12} lg={12} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase', height: 50 }}>
                                    <p>CARD NUMBER</p>
                                    <span><Icon type="credit-card" /> {cardnumber}</span>
                                </Col>
                                <Col xs={12} sm={24} md={12} lg={12} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase', height: 50 }}>
                                    <p>BRANCH OFFICE</p>
                                    <span><Icon type="environment" /> {branchcode}</span>
                                </Col>
                                {/* <Col xs={20} sm={20} md={5} lg={5} xl={5} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>IDENTITY</p>
                                    {memberidentity !== '-' ? <Tag color={tagIdentity[memberidentity]['color']} style={{ marginRight: 0, color: 'white' }}>{tagIdentity[memberidentity]['label']}</Tag> : ''}
                                </Col> */}
                                {
                                    (status === 'MERGED' && mergewith && mergewith.memberid) ?
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center', marginTop: '5px' }}>
                                            <a href={'/' + this.props.match.url.split('/')[1] + '/form/' + mergewith.memberid} style={{ cursor: 'pointer' }}>
                                                This account has been merged at {(mergewithdate) ? moment(mergewithdate).format("DD-MM-YYYY") : "-"}, click here to view active account
                                            </a>
                                        </Col> : null
                                }
                            </Row>
                        </Col>
                        <Col xs={24} sm={7} md={8} lg={10} xl={8} className="side-border">
                            <Row className="member-balance">
                                <Col xs={8} sm={24} md={24} lg={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Current Balance</p>
                                    <span> {formatNumber(awardmiles)}</span>
                                </Col>
                                <Col xs={8} sm={24} md={24} lg={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Mileage</p>
                                    <span>{formatNumber(tiermiles)}</span>
                                </Col>
                                <Col xs={8} sm={24} md={24} lg={8} xl={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Frequency</p>
                                    <span>{formatNumber(frequency)}</span>
                                </Col>
                                <Col xs={8} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center' }} hidden={isBOD}>
                                    <Link to="#" onClick={this.showDetailAccount} style={{ cursor: 'pointer' }}>View Detail Account</Link>
                                </Col>
                            </Row>
                        </Col>
                        {
                            isBOD && (window.innerWidth < 767) ?
                                <Col xs={24} sm={7} md={8} lg={10} xl={8} className="member-date">
                                    <Col xs={12} sm={24} md={24} lg={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                        <p className="date-label">Effective date</p>
                                        <span className="date-value"> {effectivedate}</span>
                                    </Col>
                                    <Col xs={12} sm={24} md={24} lg={8} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                        <p className="date-label">Valid thru</p>
                                        <span className="date-value"> {expireddate}</span>
                                    </Col>
                                </Col> : (window.innerWidth > 767) ?
                                    <Col xs={24} sm={4} md={3} lg={4} xl={4} className="member-date">
                                        <Row hidden={isBOD}>
                                            <Col xs={10} sm={24} md={24} lg={14} xl={14} className="date-label">Member Since</Col>
                                            <Col xs={6} sm={24} md={24} lg={8} xl={8} className="date-value"> {membersince}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={18} sm={24} md={24} lg={14} xl={14} className="date-label">Effective date</Col>
                                            <Col xs={4} sm={24} md={24} lg={8} xl={8} className="date-value"> {effectivedate}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={18} sm={24} md={24} lg={14} xl={14} className="date-label">Valid thru</Col>
                                            <Col xs={4} sm={24} md={24} lg={8} xl={8} className="date-value"> {expireddate}</Col>
                                        </Row>
                                        <Row hidden={isBOD}>
                                            <Col xs={10} sm={24} md={24} lg={14} xl={14} className="date-label">Membership end</Col>
                                            <Col xs={6} sm={24} md={24} lg={8} xl={8} className="date-value"> {membershipperiod}</Col>
                                        </Row>
                                        <Row hidden={isBOD}>
                                            <Col xs={10} sm={24} md={24} lg={14} xl={14} className="date-label">Date of birth </Col>
                                            <Col xs={6} sm={24} md={24} lg={8} xl={8} className="date-value"> {dateofbirth}</Col>
                                        </Row>
                                    </Col> : ''
                        }
                    </Row >
                </Layout >
            )
        }
    }
}
export default App;