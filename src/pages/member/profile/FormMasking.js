import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Tag, Icon } from 'antd';
import { api } from '../../../config/Services';
import { RetrieveRequest } from '../../../utilities/RequestService';
import Button from '../../../components/Button';
import { Link } from 'react-router-dom';
import moment from 'moment';

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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nationalityname: null,
            isHoldingUsername: false,
            isHoldingEmail: false,
            isHoldingDoB: false,
            isHoldingPassport: false,
            isHoldingIdCard: false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            let url = api.url.country.list;
            let criteria = { countrycode: this.props.data?.memberaddress[0]?.countrycode };
            RetrieveRequest(url, criteria).then((response) => {
                if (response.status.responsecode === '0000') {
                    this.setState({ nationalityname: response.result?.[0]?.nationality || '-' });
                } else this.setState({ nationalityname: '-' });
            });
        }, 1000);
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
        const { nationalityname, isHoldingUsername, isHoldingEmail, isHoldingDoB, isHoldingPassport, isHoldingIdCard } = this.state || {};
        const { data, isBOD, menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const { branchcodeenrollname, branchcodeaddressname, username, email, dateofbirth, passportnumber, idcardnumber, emailverified, firstname, lastname,
            nameoncard, langname, religionname, memberid, referralcode, referencecode, enrollmentdate, terminated_date, gender, titlename,
            enrollchannel, salutationname, terminated_by, status, emailsubscription, nationality } = data || {};

        let usernamemask = (username) ? (username.length <= 2) ? username : username[0] + '*'.repeat(username.length - 2) + username[username.length - 1] : '-';
        let emailmask = (email) ? (() => {
            const [name, domain] = email.split('@');
            return name ? name[0] + '*'.repeat(name.length - 1) + '@' + domain : email;
        })() : '-';

        let dateofbirthmask = (dateofbirth) ? '**/**/****' : '-';
        let passportnumbermask = (passportnumber) ? (passportnumber.length <= 3) ? passportnumber : passportnumber[0] + '*'.repeat(passportnumber.length - 3) + passportnumber.slice(-2) : '-';
        let idcardnumbermask = (idcardnumber) ? (idcardnumber.length <= 4) ? idcardnumber : '*'.repeat(idcardnumber.length - 4) + idcardnumber.slice(-4) : '-';

        return (
            <Row gutter={24}>
                <Col className='gutter-row' xs={24} sm={24} md={{ span: 16, offset: 2 }} lg={{ span: 16, offset: 2 }} xl={{ span: 12, offset: 4 }}>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Branch Enrollment :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(branchcodeenrollname) ? branchcodeenrollname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Branch Address :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(branchcodeaddressname) ? branchcodeaddressname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Username :
                        </Col>
                        <Col
                            xs={24}
                            sm={14}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'Username')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'Username')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'Username')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'Username')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'Username')}
                        >
                            {(isHoldingUsername) ? username : usernamemask}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Email :
                        </Col>
                        <Col
                            xs={24}
                            sm={8}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'Email')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'Email')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'Email')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'Email')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'Email')}
                        >
                            {(isHoldingEmail) ? email : emailmask} {(!emailverified) ? null : <Icon type="check-circle" theme="twoTone" />}
                        </Col>
                        {(!emailverified) ? <Col xs={24} sm={6}>
                            <Button htmlType="button" type="primary" label="Verify Email" onClick={() => this.props.handleOpenModal('viewverify')} />
                        </Col> : null}
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Subscription :
                        </Col>
                        <Col xs={24} sm={8} style={{ marginLeft: '10px' }}>
                            {(emailsubscription) ? 'Yes' : 'No'}
                        </Col>
                        <Col xs={24} sm={6}>
                            <Button htmlType="button" type="default" label="View History" title="View Subscription History" onClick={() => this.props.handleDetailModals()} />
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Your refferal code :
                        </Col>
                        <Col xs={24} sm={8} style={{ marginLeft: '10px' }}>
                            {(referralcode) ? referralcode : '-'}
                        </Col>
                        <Col xs={24} sm={6}>
                            {(referralcode) ?
                                <Button htmlType="button" label="View Reference" onClick={() => this.props.handleOpenModal('viewreference')} /> :
                                <Button htmlType="button" label="Generate Code" onClick={() => this.props.generateRefCode(memberid)} />
                            }
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Reference code :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(referencecode) ? referencecode : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Date of enrollment :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(enrollmentdate) ? enrollmentdate : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Date of terminate :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(terminated_date) ? (terminated_date) : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Terminate by :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(terminated_by) ? terminated_by : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Enrollment channel :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(enrollchannel) ? enrollchannel : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            First name :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(firstname) ? firstname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Last name :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(lastname) ? lastname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Name on card :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(nameoncard) ? nameoncard : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Status :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {
                                (status) ? <Tag color={tagStatus[status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[status]['label']}</Tag> : '-'
                            }
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Salutation :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(salutationname) ? salutationname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Title :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(titlename) ? titlename : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Gender :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(gender) ? gender : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Date of birth :
                        </Col>
                        <Col
                            xs={24}
                            sm={14}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'DoB')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'DoB')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'DoB')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'DoB')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'DoB')}
                        >
                            {(isHoldingDoB) ? moment(dateofbirth).format('DD/MM/YYYY') : (dateofbirthmask) ? dateofbirthmask : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Nationality :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(nationalityname || nationality) ? (nationality && nationality.length > 2) ? nationality : nationalityname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Religion :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(religionname) ? religionname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Preferred language :
                        </Col>
                        <Col xs={24} sm={14} style={{ marginLeft: '10px' }}>
                            {(langname) ? langname : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            Passport no :
                        </Col>
                        <Col
                            xs={24}
                            sm={14}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'Passport')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'Passport')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'Passport')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'Passport')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'Passport')}
                        >
                            {(isHoldingPassport) ? passportnumber : (passportnumbermask) ? passportnumbermask : '-'}
                        </Col>
                    </Row>
                    <Row style={{ height: 48, marginBottom: 4 }}>
                        <Col xs={24} sm={8} style={{ textAlign: "right", fontWeight: 600, color: '#000000' }}>
                            ID card no :
                        </Col>
                        <Col
                            xs={24}
                            sm={14}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onMouseDown={(e) => this.handleHoldStart(e, 'IdCard')}
                            onMouseUp={(e) => this.handleHoldEnd(e, 'IdCard')}
                            onMouseLeave={(e) => this.handleHoldEnd(e, 'IdCard')}
                            onTouchStart={(e) => this.handleHoldStart(e, 'IdCard')}
                            onTouchEnd={(e) => this.handleHoldEnd(e, 'IdCard')}
                        >
                            {(isHoldingIdCard) ? idcardnumber : (idcardnumbermask) ? idcardnumbermask : '-'}
                        </Col>
                    </Row>
                    {
                        (!isBOD) ?
                            <Form.Item wrapperCol={{ offset: 8 }} className={(usermenu[menucode][prefixmenuname + '_UPDATE']) ? (status === 'MERGED') ? 'hidden' : '' : 'hidden'}>
                                <Link to='#' onClick={() => this.props.handleOpenModal('originmemberlist')} style={{ cursor: 'pointer' }}>View list of origin member</Link>
                            </Form.Item> : ''
                    }
                </Col>
            </Row >
        )
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));