import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../utilities/RequestService';
import { formatNumber, debounce } from '../../utilities/Helpers';
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
            masked: true,
            profile: {},
            memberidentity: '-',
            isHoldingCardnumber: false,
            isHoldingDoB: false,
            mileageExpiryModal: {
                isLoading: false,
                visible: false
            },
            dimensions: {
                height: window.innerHeight,
                width: window.innerWidth
            }
        };
        this.showDetailAccount = this.showDetailAccount.bind(this);
    };

    componentDidMount() {
        const debouncedHandleResize = debounce(this.handleResize, 1000);
        window.addEventListener("resize", debouncedHandleResize);
    };

    handleResize = () => {
        this.setState({
            dimensions: {
                height: window.innerHeight,
                width: window.innerWidth
            }
        });
    };

    handleOpenModal = () => {
        this.setState({ showModal: true });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false });
    };

    handleCloseModalRefresh = () => {
        this.setState({ showModal: false });
    };

    retrieveData = (memberid) => {
        let url = api.url.member.profile;
        let type = 'SUMMARY';
        let data = { memberid, type };
        this.setState({ isLoading: true });

        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let expireddate = (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].enddate !== undefined && result.membertiers[0].enddate !== null) ? moment(result.membertiers[0].enddate).format("DD/MM/YYYY") : null;
                let membershipperiod = (result.membershipperiod !== null && result.membershipperiod !== undefined) ? moment(result.membershipperiod).format("DD/MM/YYYY") : null;
                let validthru = null;

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

                if (expireddate && membershipperiod) {
                    if (expireddate > membershipperiod) {
                        validthru = expireddate;
                    } else {
                        validthru = membershipperiod;
                    }
                } else {
                    if (expireddate === null && membershipperiod) {
                        validthru = membershipperiod;
                    } else if (membershipperiod === null && expireddate) {
                        validthru = expireddate
                    }
                }

                const { status, corporatedetailinfo, mergewith, mergewithdate, nameoncard, membertiers } = result || {};
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
                    cardnumbermask: (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].cardnumber !== undefined) ?
                        result.membercards[0].cardnumber.replace(/^(.)(.*)(.{3})$/, (_, first, middle, last) => {
                            return first + middle.replace(/./g, '*') + last;
                        }) : '-',
                    membershipid: (result.membercards !== null && result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].membershipid !== undefined) ? result.membercards[0].membershipid : '-',
                    awardmiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['awardmiles'] !== undefined && result.memberaccount[0]['awardmiles'] !== null) ? result.memberaccount[0]['awardmiles'] : '-',
                    tiermiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['tiermiles'] !== undefined && result.memberaccount[0]['tiermiles'] !== null) ? result.memberaccount[0]['tiermiles'] : '-',
                    frequency: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['frequency'] !== undefined && result.memberaccount[0]['frequency'] !== null) ? result.memberaccount[0]['frequency'] : '-',
                    tierrenewal: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['tierrenewal'] !== undefined && result.memberaccount[0]['tierrenewal'] !== null) ? result.memberaccount[0]['tierrenewal'] : '-',
                    frequencyrenewal: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['frequencyrenewal'] !== undefined && result.memberaccount[0]['frequencyrenewal'] !== null) ? result.memberaccount[0]['frequencyrenewal'] : '-',
                    memberaccountid: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['memberaccountid'] !== undefined && result.memberaccount[0]['memberaccountid'] !== null) ? result.memberaccount[0]['memberaccountid'] : null,
                    membersince: (result.enrollmentdate !== undefined && result.enrollmentdate !== null) ? moment(result.enrollmentdate).format("DD/MM/YYYY") : "-",
                    effectivedate: (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].startdate !== undefined && result.membertiers[0].startdate !== null) ? moment(result.membertiers[0].startdate).format("DD/MM/YYYY") : "-",
                    expireddate: (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].enddate !== undefined && result.membertiers[0].enddate !== null) ? moment(result.membertiers[0].enddate).format("DD/MM/YYYY") : '-',
                    membershipperiod: (result.membershipperiod !== null && result.membershipperiod !== undefined) ? moment(result.membershipperiod).format("DD/MM/YYYY") : '-',
                    dateofbirth: (result.dateofbirth !== undefined && result.dateofbirth !== null) ? moment(result.dateofbirth).format("DD/MM/YYYY") : "-",
                    urlcard: (result.membercards !== undefined && result.membercards[0] !== undefined && result.membercards[0].tiertemplatecard !== undefined) ? result.membercards[0].tiertemplatecard : '-',
                    startqualificationperiod: (result.startqualificationperiod) ? moment(result.startqualificationperiod).format('DD/MM/YYYY') : '-',
                    endqualificationperiod: (result.endqualificationperiod) ? moment(result.endqualificationperiod).format('DD/MM/YYYY') : '-',
                    startrenewalperiod: (membertiers !== null && membertiers !== undefined && membertiers[0] !== undefined && membertiers[0].startdate !== undefined && membertiers[0].startdate !== null) ? moment(membertiers[0].startdate).format('DD/MM/YYYY') : null,
                    endrenewalperiod: (membertiers !== null && membertiers !== undefined && membertiers[0] !== undefined && membertiers[0].enddate !== undefined && membertiers[0].enddate !== null) ? moment(membertiers[0].enddate).format('DD/MM/YYYY') : null,
                };

                RetrieveRequest(api.url.mileagecriteria.list, { tierid: profile.tierid, type: 'UPGRADE' }, {}, [], { expireddate: 'desc' }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode === '0000' && result) {
                        const maxfrequency = (result !== null && result !== undefined && result[0] !== undefined && result[0].maxfrequency !== undefined) ? result[0].maxfrequency : '-';
                        const maxmileage = (result !== null && result !== undefined && result[0] !== undefined && result[0].maxmileage !== undefined) ? result[0].maxmileage : '-';
                        const expireddate = (result !== null && result !== undefined && result[0] !== undefined && result[0].expireddate !== undefined) ? moment(result[0].expireddate).format('YYYY/MM/DD') : '-';
                        const today = moment().format('YYYY/MM/DD');
                        const validate = expireddate > today;

                        this.setState({ maxfrequency, maxmileage, validate });
                    }
                });

                RetrieveRequest(api.url.tierrank.list, { membershipid: profile.membershipid }, {}, [], { rank: 'asc' }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode === '0000' && result && result[0]) {
                        let membershipidrank = result[0].rank ? result[0].rank : '-';
                        let membershipidtier = result[0].tiername ? result[0].tiername : '-';
                        this.setState({ membershipidrank, membershipidtier });
                    }
                })

                RetrieveRequest(api.url.mileagecriteria.list, { tierid: profile.tierid, type: 'MAINTAIN' }).then((response) => {
                    const { status, result } = response;
                    if (status.responsecode === '0000' && result) {
                        const minfrequency2 = (result !== null && result !== undefined && result[0] !== undefined && result[0].minfrequency !== undefined) ? result[0].minfrequency : '-';
                        const minmileage2 = (result !== null && result !== undefined && result[0] !== undefined && result[0].minmileage !== undefined) ? result[0].minmileage : '-';
                        this.setState({ minfrequency2, minmileage2 });
                    }
                })
                this.setState({ profile })
            }
            this.setState({ isLoading: false });
        });
    };

    showDetailAccount = (e) => {
        e.preventDefault();
        this.setState({ mileageExpiryModal: { ...this.state.mileageExpiryModal, visible: true } });
    };

    handleHideDetailAccount = (e) => {
        e.preventDefault();
        this.setState({ mileageExpiryModal: { ...this.state.mileageExpiryModal, visible: false } });
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
                } else Alert.error(responsemessage);
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

    handleMasking = () => {
        this.setState({ masked: !this.state.masked });
    };

    handleHoldStart = (e, field) => {
        e.preventDefault();
        this.setState({ [`isHolding${field}`]: true });
    };

    handleHoldEnd = (e, field) => {
        e.preventDefault();
        this.setState({ [`isHolding${field}`]: false });
    };

    render() {
        const { isLoading, masked, mileageExpiryModal, validate } = this.state;

        if (isLoading) {
            return (
                <Layout className='header-layout'>
                    <Skeleton active />
                </Layout>
            )
        } else {
            const { profile, memberidentity, isBOD, maxfrequency, maxmileage, minfrequency2, minmileage2, dimensions, membershipidrank, membershipidtier, isHoldingCardnumber, isHoldingDoB } = this.state;
            const { memberid, corporatedetailinfo, memberfullname, corporatename, status, membershipname, tiername, cardnumber, branchcode, membershipperiod, startrenewalperiod, endrenewalperiod, startqualificationperiod, cardnumbermask,
                endqualificationperiod, awardmiles, tiermiles, frequency, tierrenewal, frequencyrenewal, memberaccountid, membersince, effectivedate, expireddate, dateofbirth, urlcard, mergewith, mergewithdate, membershipid } = profile || {};

            let screenHuger = dimensions.width > 1200;
            let screenLarger = dimensions.width >= 992;
            let screenMedium = dimensions.width >= 792;

            let returnHuge = <Row gutter={8} style={{ width: '100%' }}>
                <Col xs={24} sm={24} md={3} lg={3} xl={3} style={{ textAlign: 'center', marginLeft: -10, height: '150px', alignContent: 'end' }}>
                    <div className="member-card">
                        <img src={urlcard} alt="" width="130" style={{ marginBottom: 10 }} />
                        {(urlcard) ? <a onClick={this.handleDownloadCard}>Download Card</a> : null}
                    </div>
                </Col>
                <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                    <Row>
                        <Col span={24} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                            <Row style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '16px', color: '#1a1a1a', fontWeight: '700', width: '76%' }}>
                                {(corporatedetailinfo.length > 0) ? corporatename : memberfullname}
                                {memberidentity !== '-' ? <Icon type={tagIdentity[memberidentity]['type']} style={{ fontSize: '16px', marginLeft: '4px', color: tagIdentity[memberidentity]['color'] }} title={tagIdentity[memberidentity]['title']} theme='filled'></Icon> : ''}
                                &emsp;&emsp;&emsp;
                                <Tag color={tagStatus[status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[status]['label']}</Tag>
                            </Row>
                            <Link to="#" onClick={this.handleMasking} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                color: '#717171',
                                textDecoration: 'none'
                            }}>{masked ? 'show data' : 'hide data'} <Icon type={masked ? 'eye' : 'eye-invisible'} style={{ marginLeft: '6px', fontSize: '16px' }} theme='outlined'></Icon></Link>
                        </Col>
                    </Row>
                    <Row className="member-profile">
                        <Col xs={12} sm={24} md={12} lg={12} xl={8} style={{ marginBottom: '5px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                            <p>MEMBERSHIP</p>
                            <span>{membershipname} - {tiername}</span>
                        </Col>
                        <Col
                            xs={12} sm={24} md={12} lg={12} xl={8}
                            style={{ marginBottom: '5px', textAlign: 'center', textTransform: 'uppercase', height: 40, cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'Cardnumber')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'Cardnumber')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                        >
                            <p>CARD NUMBER</p>
                            <span><Icon type="credit-card" /> {(isHoldingCardnumber) ? cardnumber : (masked) ? cardnumbermask : cardnumber}</span>
                        </Col>
                        <Col xs={12} sm={24} md={12} lg={12} xl={8} style={{ marginBottom: '5px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                            <p>BRANCH OFFICE</p>
                            <span><Icon type="environment" /> {branchcode}</span>
                        </Col>
                        {isBOD ? <Col>
                            <Col xs={12} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                <p className="date-label">Effective date</p>
                                <span className="date-value"> {effectivedate}</span>
                            </Col>
                            <Col xs={12} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                <p className="date-label">Valid thru</p>
                                <span className="date-value"> {expireddate}</span>
                            </Col>
                        </Col> : <Col><Col
                            xs={12} sm={24} md={12} lg={12} xl={8}
                            style={{ textAlign: 'center', textTransform: 'uppercase', height: 40, padding: '16px', cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'DoB')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'DoB')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'DoB')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'DoB')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'DoB')}
                        >
                            <p>DATE OF BIRTH</p>
                            <span>{(isHoldingDoB) ? dateofbirth : (masked) ? '**/**/****' : dateofbirth}</span>
                        </Col><Col xs={12} sm={24} md={12} lg={12} xl={8} style={{ textAlign: 'center', textTransform: 'uppercase', height: 40, padding: '16px' }}>
                                <p>MEMBER SINCE</p>
                                <span>{membersince}</span>
                            </Col><Col xs={12} sm={24} md={12} lg={12} xl={8} style={{ textAlign: 'center', textTransform: 'uppercase', height: 40, padding: '16px' }}>
                                <p>MEMBERSHIP END</p>
                                <span>{membershipperiod}</span>
                            </Col></Col>
                        }
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
                <Col xs={24} sm={24} md={12} lg={12} xl={3} style={{ textAlign: 'center', borderRight: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9', padding: '10px 30px' }}>
                    <Row className="member-profile">
                        <Col xs={24} sm={24} md={8} lg={24} style={{ textAlign: 'center', textTransform: 'uppercase', marginTop: 5 }}>
                            <p>Current Balance</p>
                            <span style={{ fontSize: '23px' }}> {formatNumber(awardmiles)}</span>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center', marginTop: 10 }}>
                            <Link to="#" onClick={this.showDetailAccount} style={{ cursor: 'pointer' }}>View Detail Account</Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={5} style={{ textAlign: 'center', borderRight: '1px solid #e9e9e9' }}>
                    <Row className="member-profile">
                        <Col xs={24} sm={24} md={8} lg={24} style={{ textAlign: 'center', height: 40, marginTop: 10, marginBottom: 40 }}>
                            <p>UPGRADE PERIOD</p>
                            <span style={{ fontSize: '12px' }}> {(startqualificationperiod && endqualificationperiod) ? `${startqualificationperiod}  -  ${endqualificationperiod}` : (!startqualificationperiod && endqualificationperiod) ? endqualificationperiod : (startqualificationperiod && !endqualificationperiod) ? startqualificationperiod : '-'}</span>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center', height: 40 }}>
                            <p>TIER MILES</p>
                            {
                                !(tiername == membershipidtier && membershipidrank === 1) && validate ?
                                    <span style={{ fontSize: '16px' }}> {(tiermiles || tiermiles === 0) ? formatNumber(tiermiles) : '-'}/{(maxmileage) ? formatNumber(maxmileage) : '-'}</span>
                                    :
                                    <span style={{ fontSize: '16px' }}> {(tiermiles || tiermiles === 0) ? formatNumber(tiermiles) : '-'}/-</span>
                            }
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center', height: 40, marginBottom: 16 }}>
                            <p>FREQUENCY</p>
                            {
                                !(tiername == membershipidtier && membershipidrank === 1) && validate ?

                                    <span style={{ fontSize: '16px' }}> {(frequency || frequency === 0) ? formatNumber(frequency) : '-'}/{(maxfrequency) ? formatNumber(maxfrequency) : '-'}</span>
                                    :
                                    <span style={{ fontSize: '16px' }}> {(frequency || frequency === 0) ? formatNumber(frequency) : '-'}/-</span>
                            }
                        </Col>
                    </Row >
                </Col >
                <Col xs={24} sm={24} md={12} lg={12} xl={{ span: 4 }} style={{ textAlign: 'center', marginLeft: (window.innerWidth >= 1200) ? 10 : 0 }}>
                    <Row className="member-profile">
                        <Col xs={24} sm={24} md={8} lg={24} style={{ textAlign: 'center', marginTop: 10, marginBottom: 40 }}>
                            <p>RENEWAL PERIOD</p>
                            <span style={{ fontSize: '12px' }}>{(startrenewalperiod && endrenewalperiod) ? `${startrenewalperiod} - ${endrenewalperiod}` : (!startrenewalperiod && endrenewalperiod) ? endrenewalperiod : (startrenewalperiod && !endrenewalperiod) ? startrenewalperiod : '-'}</span>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center' }}>
                            <p>TIER MILES</p>
                            <span style={{ fontSize: '16px' }}> {(tierrenewal || tierrenewal === 0) ? formatNumber(tierrenewal) : '-'}/{(minmileage2) ? formatNumber(minmileage2) : '-'}</span>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center', marginBottom: 16 }}>
                            <p>FREQUENCY</p>
                            <span style={{ fontSize: '16px' }}> {(frequencyrenewal || frequencyrenewal === 0) ? formatNumber(frequencyrenewal) : '-'}/{(minfrequency2) ? formatNumber(minfrequency2) : '-'}</span>
                        </Col>
                    </Row >
                </Col >
            </Row>

            let returnLarge = <Row gutter={24} >
                <Col xs={24} sm={24} md={4} style={{ textAlign: 'center', height: '150px', alignContent: 'end' }}>
                    <div className="member-card">
                        <img src={urlcard} alt="" width="130" style={{ marginBottom: 10 }} />
                        {urlcard ? <a onClick={this.handleDownloadCard} style={{ marginLeft: 'center' }}>Download Card</a> : null}
                    </div>
                </Col>
                <Col xs={24} sm={24} md={19}>
                    <Row gutter={24}>
                        <Col xs={24}>
                            <Row>
                                <Col span={24} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                                    <Row style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '16px', color: '#1a1a1a', fontWeight: '700', width: '76%' }}>
                                        {(corporatedetailinfo.length > 0) ? corporatename : memberfullname}
                                        {memberidentity !== '-' ? <Icon type={tagIdentity[memberidentity]['type']} style={{ fontSize: '16px', marginLeft: '4px', color: tagIdentity[memberidentity]['color'] }} title={tagIdentity[memberidentity]['title']} theme='filled'></Icon> : ''}
                                        &emsp;&emsp;&emsp;
                                        <Tag color={tagStatus[status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[status]['label']}</Tag>
                                    </Row>
                                    <Link to="#" onClick={this.handleMasking} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        color: '#717171',
                                        textDecoration: 'none'
                                    }}>{masked ? 'show data' : 'hide data'} <Icon type={masked ? 'eye' : 'eye-invisible'} style={{ marginLeft: '6px', fontSize: '16px' }} theme='outlined'></Icon></Link>
                                </Col>
                            </Row>
                            <Row className="member-profile" >
                                <Col xs={12} sm={24} md={12} lg={4} style={{ marginBottom: '5px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                    <p>MEMBERSHIP</p>
                                    <span>{membershipname} - {tiername}</span>
                                </Col>
                                <Col
                                    xs={12} sm={24} md={12} lg={4}
                                    style={{ marginBottom: '5px', textAlign: 'center', textTransform: 'uppercase', height: 40, cursor: 'pointer' }}
                                    onMouseDown={(e) => this.handleHoldStart(e, 'Cardnumber')}
                                    onMouseUp={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                    onMouseLeave={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                    onTouchStart={(e) => this.handleHoldStart(e, 'Cardnumber')}
                                    onTouchEnd={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                >
                                    <p>CARD NUMBER</p>
                                    <span><Icon type="credit-card" /> {(isHoldingCardnumber) ? cardnumber : (masked) ? cardnumbermask : cardnumber}</span>
                                </Col>
                                <Col xs={12} sm={24} md={12} lg={4} style={{ marginBottom: '5px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                    <p>BRANCH OFFICE</p>
                                    <span><Icon type="environment" /> {branchcode}</span>
                                </Col>
                                {isBOD ? <Col>
                                    <Col xs={12} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                        <p className="date-label">Effective date</p>
                                        <span className="date-value"> {effectivedate}</span>
                                    </Col>
                                    <Col xs={12} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                        <p className="date-label">Valid thru</p>
                                        <span className="date-value"> {expireddate}</span>
                                    </Col>
                                </Col> : <Col><Col
                                    xs={12} sm={24} md={12} lg={4}
                                    style={{ textAlign: 'center', textTransform: 'uppercase', height: 40, cursor: 'pointer' }}
                                    onMouseDown={(e) => this.handleHoldStart(e, 'DoB')}
                                    onMouseUp={(e) => this.handleHoldEnd(e, 'DoB')}
                                    onMouseLeave={(e) => this.handleHoldEnd(e, 'DoB')}
                                    onTouchStart={(e) => this.handleHoldStart(e, 'DoB')}
                                    onTouchEnd={(e) => this.handleHoldEnd(e, 'DoB')}
                                >
                                    <p>DATE OF BIRTH</p>
                                    <span>{(isHoldingDoB) ? dateofbirth : (masked) ? '**/**/****' : dateofbirth}</span>
                                </Col><Col xs={12} sm={24} md={12} lg={4} style={{ textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                        <p>MEMBER SINCE</p>
                                        <span>{membersince}</span>
                                    </Col><Col xs={12} sm={24} md={12} lg={4} style={{ textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                        <p>MEMBERSHIP END</p>
                                        <span>{membershipperiod}</span>
                                    </Col></Col>
                                }
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
                    </Row>
                    <Row style={{ marginTop: 10, borderTop: '1px solid #e9e9e9' }}>
                        <Col xs={24} sm={24} md={12} lg={6} style={{ textAlign: 'center', borderRight: '1px solid #e9e9e9' }}>
                            <Row className="member-profile">
                                <Col xs={24} sm={24} md={8} lg={24} style={{ textAlign: 'center', textTransform: 'uppercase', marginTop: 15 }}>
                                    <p>Current Balance</p>
                                    <span style={{ fontSize: '23px' }}> {formatNumber(awardmiles)}</span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center', marginTop: 10 }}>
                                    <Link to="#" onClick={this.showDetailAccount} style={{ cursor: 'pointer' }}>View Detail Account</Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={24} sm={24} md={10} style={{ textAlign: 'center', borderRight: '1px solid #e9e9e9' }}>
                            <Row className="member-profile">
                                <Col xs={24} sm={24} md={8} lg={24} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>UPGRADE PERIOD</p>
                                    <span style={{ fontSize: '12px' }}> {(startqualificationperiod && endqualificationperiod) ? `${startqualificationperiod}  -  ${endqualificationperiod}` : (!startqualificationperiod && endqualificationperiod) ? endqualificationperiod : (startqualificationperiod && !endqualificationperiod) ? startqualificationperiod : '-'}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center' }}>
                                    <p>TIER MILES</p>
                                    <span style={{ fontSize: '14px' }}> {(tiermiles || tiermiles === 0) ? formatNumber(tiermiles) : '-'}/{(maxmileage) ? formatNumber(maxmileage) : '-'}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center', marginBottom: 5 }}>
                                    <p>FREQUENCY</p>
                                    <span style={{ fontSize: '14px' }}> {(frequency || frequency === 0) ? formatNumber(frequency) : '-'}/{(maxfrequency) ? formatNumber(maxfrequency) : '-'}</span>
                                </Col>
                            </Row >
                        </Col >
                        <Col xs={24} sm={24} md={8} style={{ textAlign: 'center' }}>
                            <Row className="member-profile">
                                <Col xs={24} sm={24} md={8} lg={24} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>RENEWAL PERIOD</p>
                                    <span style={{ fontSize: '12px' }}>{(startrenewalperiod && endrenewalperiod) ? `${startrenewalperiod} - ${endrenewalperiod}` : (!startrenewalperiod && endrenewalperiod) ? endrenewalperiod : (startrenewalperiod && !endrenewalperiod) ? startrenewalperiod : '-'}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center' }}>
                                    <p>TIER MILES</p>
                                    <span style={{ fontSize: '14px' }}> {(tierrenewal || tierrenewal === 0) ? formatNumber(tierrenewal) : '-'}/{(minmileage2) ? formatNumber(minmileage2) : '-'}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center', marginBottom: 5 }}>
                                    <p>FREQUENCY</p>
                                    <span style={{ fontSize: '14px' }}> {(frequencyrenewal || frequencyrenewal === 0) ? formatNumber(frequencyrenewal) : '-'}/{(minfrequency2) ? formatNumber(minfrequency2) : '-'}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            let returnMedium = <Row gutter={24} >
                <Col xs={24} sm={24} md={4} style={{ textAlign: 'center', height: '150px', alignContent: 'end' }}>
                    <div className="member-card">
                        <img src={urlcard} alt="" width="130" style={{ marginBottom: 10, marginLeft: (dimensions.width < 860) ? -10 : 0 }} />
                        {(urlcard) ? <a onClick={this.handleDownloadCard} style={{ marginLeft: 'center' }}>Download Card</a> : null}
                    </div>
                </Col>
                <Col xs={24} sm={24} md={19}>
                    <Row gutter={24}>
                        <Col xs={20}>
                            <Row>
                                <Col span={24} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                                    <Row style={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '16px', color: '#1a1a1a', fontWeight: '700', width: '76%' }}>
                                        {(corporatedetailinfo.length > 0) ? corporatename : memberfullname}
                                        {memberidentity !== '-' ? <Icon type={tagIdentity[memberidentity]['type']} style={{ fontSize: '16px', marginLeft: '4px', color: tagIdentity[memberidentity]['color'] }} title={tagIdentity[memberidentity]['title']} theme='filled'></Icon> : ''}
                                        &emsp;&emsp;&emsp;
                                        <Tag color={tagStatus[status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[status]['label']}</Tag>
                                    </Row>
                                    <Link to="#" onClick={this.handleMasking} style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        color: '#717171',
                                        textDecoration: 'none'
                                    }}>{masked ? 'show data' : 'hide data'} <Icon type={masked ? 'eye' : 'eye-invisible'} style={{ marginLeft: '6px', fontSize: '16px' }} theme='outlined'></Icon></Link>
                                </Col>
                            </Row>
                            <Row className="member-profile" >
                                <Col xs={8} style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                    <p>MEMBERSHIP</p>
                                    <span>{membershipname} - {tiername}</span>
                                </Col>
                                <Col
                                    xs={8}
                                    style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}
                                    onMouseDown={(e) => this.handleHoldStart(e, 'Cardnumber')}
                                    onMouseUp={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                    onMouseLeave={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                    onTouchStart={(e) => this.handleHoldStart(e, 'Cardnumber')}
                                    onTouchEnd={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                >
                                    <p>CARD NUMBER</p>
                                    <span><Icon type="credit-card" /> {(isHoldingCardnumber) ? cardnumber : (masked) ? cardnumbermask : cardnumber}</span>
                                </Col>
                                <Col xs={8} style={{ marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                    <p>BRANCH OFFICE</p>
                                    <span><Icon type="environment" /> {branchcode}</span>
                                </Col>
                                {isBOD ? <Col>
                                    <Col xs={12} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                        <p className="date-label">Effective date</p>
                                        <span className="date-value"> {effectivedate}</span>
                                    </Col>
                                    <Col xs={12} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                        <p className="date-label">Valid thru</p>
                                        <span className="date-value"> {expireddate}</span>
                                    </Col>
                                </Col> : <Col><Col
                                    xs={8}
                                    style={{ textAlign: 'center', textTransform: 'uppercase', height: 40 }}
                                    onMouseDown={(e) => this.handleHoldStart(e, 'DoB')}
                                    onMouseUp={(e) => this.handleHoldEnd(e, 'DoB')}
                                    onMouseLeave={(e) => this.handleHoldEnd(e, 'DoB')}
                                    onTouchStart={(e) => this.handleHoldStart(e, 'DoB')}
                                    onTouchEnd={(e) => this.handleHoldEnd(e, 'DoB')}
                                >
                                    <p>DATE OF BIRTH</p>
                                    <span>{(isHoldingDoB) ? dateofbirth : (masked) ? '**/**/****' : dateofbirth}</span>
                                </Col><Col xs={8} style={{ textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                        <p>MEMBER SINCE</p>
                                        <span>{membersince}</span>
                                    </Col><Col xs={8} style={{ textAlign: 'center', textTransform: 'uppercase', height: 40 }}>
                                        <p>MEMBERSHIP END</p>
                                        <span>{membershipperiod}</span>
                                    </Col></Col>
                                }
                                {
                                    (status === 'MERGED' && mergewith && mergewith.memberid) ? <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center', marginTop: '5px' }}>
                                        <a href={'/' + this.props.match.url.split('/')[1] + '/form/' + mergewith.memberid} style={{ cursor: 'pointer' }}>
                                            This account has been merged at {(mergewithdate) ? moment(mergewithdate).format("DD-MM-YYYY") : "-"}, click here to view active account
                                        </a>
                                    </Col> : null
                                }
                            </Row>
                        </Col>
                        <Col xs={4} style={{ borderLeft: '1px solid #e9e9e9' }}>
                            <Row className="member-profile">
                                <Col xs={24} style={{ textAlign: 'center', textTransform: 'uppercase', marginTop: 15 }}>
                                    <p>Current Balance</p>
                                    <span style={{ fontSize: '23px' }}> {formatNumber(awardmiles)}</span>
                                </Col>
                                <Col xs={24} style={{ textAlign: 'center', marginTop: 10 }}>
                                    <Link to="#" onClick={this.showDetailAccount} style={{ cursor: 'pointer' }}>View Detail Account</Link>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10, borderTop: '1px solid #e9e9e9' }}>
                        <Col xs={13} style={{ textAlign: 'center', borderRight: '1px solid #e9e9e9' }}>
                            <Row className="member-profile">
                                <Col xs={(dimensions.width < 860) ? 24 : 12} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>UPGRADE PERIOD</p>
                                    <span style={{ fontSize: '12px' }}> {(startqualificationperiod && endqualificationperiod) ? `${startqualificationperiod}  -  ${endqualificationperiod}` : (!startqualificationperiod && endqualificationperiod) ? endqualificationperiod : (startqualificationperiod && !endqualificationperiod) ? startqualificationperiod : '-'}</span>
                                </Col>
                                <Col xs={(dimensions.width < 860) ? 12 : 6} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>TIER MILES</p>
                                    <span style={{ fontSize: '12px' }}> {(tiermiles || tiermiles === 0) ? formatNumber(tiermiles) : '-'}/{(maxmileage) ? formatNumber(maxmileage) : '-'}</span>
                                </Col>
                                <Col xs={(dimensions.width < 860) ? 12 : 6} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>FREQUENCY</p>
                                    <span style={{ fontSize: '12px' }}> {(frequency || frequency === 0) ? formatNumber(frequency) : '-'}/{(maxfrequency) ? formatNumber(maxfrequency) : '-'}</span>
                                </Col>
                            </Row >
                        </Col >
                        <Col xs={11} style={{ textAlign: 'center' }}>
                            <Row className="member-profile">
                                <Col xs={(dimensions.width < 860) ? 24 : 12} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>RENEWAL PERIOD</p>
                                    <span style={{ fontSize: '12px' }}>{(startrenewalperiod && endrenewalperiod) ? `${startrenewalperiod} - ${endrenewalperiod}` : (!startrenewalperiod && endrenewalperiod) ? endrenewalperiod : (startrenewalperiod && !endrenewalperiod) ? startrenewalperiod : '-'}</span>
                                </Col>
                                <Col xs={(dimensions.width < 860) ? 12 : 6} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>TIER MILES</p>
                                    <span style={{ fontSize: '12px' }}> {(tierrenewal || tierrenewal === 0) ? formatNumber(tierrenewal) : '-'}/{(minmileage2) ? formatNumber(minmileage2) : '-'}</span>
                                </Col>
                                <Col xs={(dimensions.width < 860) ? 12 : 6} style={{ textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                                    <p>FREQUENCY</p>
                                    <span style={{ fontSize: '12px' }}> {(frequencyrenewal || frequencyrenewal === 0) ? formatNumber(frequencyrenewal) : '-'}/{(minfrequency2) ? formatNumber(minfrequency2) : '-'}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            let returnSmall = <Row gutter={8} style={{ width: '100%', textAlign: 'center' }}>
                <Col span={24} style={{ marginBottom: '15px', textTransform: 'uppercase', fontSize: '16px', color: '#1a1a1a', fontWeight: '700' }}>
                    {(corporatedetailinfo.length > 0) ? corporatename : memberfullname}</Col>
                <Col span={24} >
                    {memberidentity !== '-' ? <Icon type={tagIdentity[memberidentity]['type']} style={{ fontSize: '16px', color: tagIdentity[memberidentity]['color'], marginRight: 20 }} title={tagIdentity[memberidentity]['title']} theme='filled'></Icon> : ''}
                    <Tag color={tagStatus[status]['color']} style={{ color: 'white' }}>{tagStatus[status]['label']}</Tag>
                    <Link to="#" onClick={this.handleMasking} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#717171',
                        textDecoration: 'none'
                    }}>{masked ? 'show data' : 'hide data'} <Icon type={masked ? 'eye' : 'eye-invisible'} style={{ marginLeft: '6px', fontSize: '16px' }} theme='outlined'></Icon></Link>
                </Col>
                <Col xs={24} style={{ marginTop: 10 }}>
                    <div className="member-card">
                        <Col xs={24} ><img src={urlcard} alt="" width="130" style={{ marginBottom: 10 }} /></Col>
                        <Col xs={24} >{(urlcard) ? <a onClick={this.handleDownloadCard}>Download Card</a> : null}</Col>
                    </div>
                </Col>
                <Col xs={24}>
                    <Row className="member-profile">
                        <Row span={24}>
                            <Col xs={12} style={{ marginTop: 10, textAlign: 'center', textTransform: 'uppercase' }}>
                                <p>MEMBERSHIP</p>
                                <span>{membershipname} - {tiername}</span>
                            </Col>
                            <Col
                                xs={12}
                                style={{ marginTop: 10, textAlign: 'center', textTransform: 'uppercase' }}
                                onMouseDown={(e) => this.handleHoldStart(e, 'Cardnumber')}
                                onMouseUp={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                onMouseLeave={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                                onTouchStart={(e) => this.handleHoldStart(e, 'Cardnumber')}
                                onTouchEnd={(e) => this.handleHoldEnd(e, 'Cardnumber')}
                            >
                                <p>CARD NUMBER</p>
                                <span><Icon type="credit-card" /> {(isHoldingCardnumber) ? cardnumber : (masked) ? cardnumbermask : cardnumber}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col xs={12} style={{ marginTop: 10, textAlign: 'center', textTransform: 'uppercase' }}>
                                <p>BRANCH OFFICE</p>
                                <span><Icon type="environment" /> {branchcode}</span>
                            </Col>
                            {(isBOD) ? <Col xs={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                <p className="date-label">Effective date</p>
                                <span className="date-value"> {effectivedate}</span>
                            </Col> : <Col
                                xs={12}
                                style={{ marginTop: 10, textAlign: 'center', textTransform: 'uppercase' }}
                                onMouseDown={(e) => this.handleHoldStart(e, 'DoB')}
                                onMouseUp={(e) => this.handleHoldEnd(e, 'DoB')}
                                onMouseLeave={(e) => this.handleHoldEnd(e, 'DoB')}
                                onTouchStart={(e) => this.handleHoldStart(e, 'DoB')}
                                onTouchEnd={(e) => this.handleHoldEnd(e, 'DoB')}
                            >
                                <p>DATE OF BIRTH</p>
                                <span>{(isHoldingDoB) ? dateofbirth : (masked) ? '**/**/****' : dateofbirth}</span>
                            </Col>}
                        </Row>
                        {(isBOD) ? <Row span={24}>
                            <Col xs={12} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                <p className="date-label">Valid thru</p>
                                <span className="date-value"> {expireddate}</span>
                            </Col> </Row> : <Row span={24}>
                            <Col xs={12} style={{ marginTop: 10, textAlign: 'center', textTransform: 'uppercase' }}>
                                <p>MEMBER SINCE</p>
                                <span>{membersince}</span>
                            </Col><Col xs={12} style={{ marginTop: 10, textAlign: 'center', textTransform: 'uppercase' }}>
                                <p>MEMBERSHIP END</p>
                                <span>{membershipperiod}</span>
                            </Col></Row>
                        }
                        {
                            (status === 'MERGED' && mergewith && mergewith.memberid) ? <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center', marginTop: '5px' }}>
                                <a href={'/' + this.props.match.url.split('/')[1] + '/form/' + mergewith.memberid} style={{ cursor: 'pointer' }}>
                                    This account has been merged at {(mergewithdate) ? moment(mergewithdate).format("DD-MM-YYYY") : "-"}, click here to view active account
                                </a>
                            </Col> : null
                        }
                    </Row>
                </Col>
                <Col xs={24} style={{ textAlign: 'center', padding: '10px 30px' }}>
                    <Row className="member-profile">
                        <Col xs={24} tyle={{ textAlign: 'center', textTransform: 'uppercase', marginTop: 5 }}>
                            <p>Current Balance</p>
                            <span style={{ fontSize: '23px' }}> {formatNumber(awardmiles)}</span>
                        </Col>
                        <Col xs={24} style={{ textAlign: 'center', marginTop: 10 }}>
                            <Link to="#" onClick={this.showDetailAccount} style={{ cursor: 'pointer' }}>View Detail Account</Link>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Row className="member-profile">
                        <Col xs={24} style={{ marginTop: 10, marginBottom: 5 }}>
                            <p>UPGRADE PERIOD</p>
                            <span style={{ fontSize: '12px' }}> {(startqualificationperiod && endqualificationperiod) ? `${startqualificationperiod}  -  ${endqualificationperiod}` : (!startqualificationperiod && endqualificationperiod) ? endqualificationperiod : (startqualificationperiod && !endqualificationperiod) ? startqualificationperiod : '-'}</span>
                        </Col>
                        <Row>
                            <Col xs={12} style={{ marginBottom: 10 }}>
                                <p>TIER MILES</p>
                                <span style={{ fontSize: '16px' }}> {(tiermiles || tiermiles === 0) ? formatNumber(tiermiles) : '-'}/{(maxmileage) ? formatNumber(maxmileage) : '-'}</span>
                            </Col>
                            <Col xs={12} style={{ marginBottom: 10 }}>
                                <p>FREQUENCY</p>
                                <span style={{ fontSize: '16px' }}> {(frequency || frequency === 0) ? formatNumber(frequency) : '-'}/{(maxfrequency) ? formatNumber(maxfrequency) : '-'}</span>
                            </Col>
                        </Row>
                    </Row >
                </Col >
                <Col xs={24}>
                    <Row className="member-profile">
                        <Col xs={24} style={{ textAlign: 'center', marginTop: 10, marginBottom: 5 }}>
                            <p>RENEWAL PERIOD</p>
                            <span style={{ fontSize: '12px' }}>{(startrenewalperiod && endrenewalperiod) ? `${startrenewalperiod} - ${endrenewalperiod}` : (!startrenewalperiod && endrenewalperiod) ? endrenewalperiod : (startrenewalperiod && !endrenewalperiod) ? startrenewalperiod : '-'}</span>
                        </Col>
                        <Row>
                            <Col xs={12} style={{ marginBottom: 10 }}>
                                <p>TIER MILES</p>
                                <span style={{ fontSize: '16px' }}> {(tierrenewal || tierrenewal === 0) ? formatNumber(tierrenewal) : '-'}/{(minmileage2) ? formatNumber(minmileage2) : '-'}</span>
                            </Col>
                            <Col xs={12} style={{ marginBottom: 10 }}>
                                <p>FREQUENCY</p>
                                <span style={{ fontSize: '16px' }}> {(frequencyrenewal || frequencyrenewal === 0) ? formatNumber(frequencyrenewal) : '-'}/{(minfrequency2) ? formatNumber(minfrequency2) : '-'}</span>
                            </Col>
                        </Row>
                    </Row >
                </Col >
            </Row>

            return (
                <Layout className='header-layout'>
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
                    </Modal> : <Modal visible={mileageExpiryModal.visible} title="Member Account Detail" loading={mileageExpiryModal.isLoading} onCancel={this.handleHideDetailAccount} footer={null} destroyOnClose={true} width={1360}>
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
                    {
                        (screenHuger) ? returnHuge : (screenLarger) ? returnLarge : (screenMedium) ? returnMedium : returnSmall
                    }
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={8} style={{ borderRight: '1px solid #e9e9e9', borderLeft: '1px solid #e9e9e9', padding: '12px' }}>
                            <Row className="member-balance">
                                <Col xs={24} sm={24} md={8} lg={5} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Current Balance</p>
                                    <span> {formatNumber(awardmiles)}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={4} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Mileage</p>
                                    <span>{formatNumber(tiermiles)}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={5} xl={5} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Frequency</p>
                                    <span>{formatNumber(frequency)}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={4} xl={4} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Tier Renewal</p>
                                    <span>{formatNumber(tierrenewal)}</span>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={6} xl={6} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                                    <p>Frequency Renewal</p>
                                    <span>{formatNumber(frequencyrenewal)}</span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: 'center' }}>
                                    <Link to="#" onClick={this.showDetailAccount} style={{ cursor: 'pointer' }}>View Detail Account</Link>
                                </Col>
                            </Row>
                        </Col> */}
                    {/* {
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
                                    <Col xs={24} sm={4} md={3} lg={4} xl={3} className="member-date">
                                        <Row hidden={isBOD}>
                                            <Col xs={10} sm={24} md={24} lg={17} xl={17} className="date-label">Member Since</Col>
                                            <Col xs={6} sm={24} md={24} lg={3} xl={3} className="date-value"> {membersince}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={18} sm={24} md={24} lg={17} xl={17} className="date-label">Effective date</Col>
                                            <Col xs={4} sm={24} md={24} lg={3} xl={3} className="date-value"> {effectivedate}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={18} sm={24} md={24} lg={17} xl={17} className="date-label">Valid thru</Col>
                                            <Col xs={4} sm={24} md={24} lg={3} xl={3} className="date-value"> {expireddate}</Col>
                                        </Row>
                                        <Row hidden={isBOD}>
                                            <Col xs={10} sm={24} md={24} lg={17} xl={17} className="date-label">Membership end</Col>
                                            <Col xs={6} sm={24} md={24} lg={3} xl={3} className="date-value"> {membershipperiod}</Col>
                                        </Row>
                                        <Row hidden={isBOD}>
                                            <Col xs={10} sm={24} md={24} lg={17} xl={17} className="date-label">Date of birth </Col>
                                            <Col xs={6} sm={24} md={24} lg={3} xl={3} className="date-value"> {dateofbirth}</Col>
                                        </Row>
                                    </Col> : ''
                        } */}
                </Layout>
            )
        }
    }
}
export default App;