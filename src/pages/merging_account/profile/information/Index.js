import React from 'react';
import { api } from '../../../../config/Services';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Alert } from '../../../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Card, Button, Icon } from 'antd';
import moment from 'moment';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoadingOri: false,
            isLoadingDes: false,
            originPersonal: [],
            destinationPersonal: []
        }
    }

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        const { memberOrigin, memberDestination } = this.props;
        this.getRetrieveOri(memberOrigin);
        this.getRetrieveDes(memberDestination);
    };

    getRetrieveOri = (memberOrigin) => {
        this.setState({ isLoadingOri: true });
        let url = api.url.member.profile;
        let oricardnumber = null;
        DetailRequest(url, { memberid: memberOrigin, type: 'SUMMARY' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    const { username, firstname, lastname, gender, dateofbirth, nationality, religionname, langname, passportnumber, idcardnumber, nameoncard, membercards, enrollmentdate, membercontacts } = result;
                    oricardnumber = membercards.length !== 0  ? membercards[0].cardnumber : undefined;
                    let prefnumber = membercontacts.find(obj => obj.preferrednumber === true)
                    let mobilenumber = membercontacts.find(obj => obj.phonetype === 'MOBILE')
                    let privatenumber = membercontacts.find(obj => obj.phonetype === 'PRIVATEPHONE')
                    let businessnumber = membercontacts.find(obj => obj.phonetype === 'BUSINESSPHONE')
                    let memberOriContact =
                        (prefnumber !== undefined && prefnumber.active) ? prefnumber.phonetype === 'MOBILE' ? `${prefnumber.countryphonecode}${prefnumber.phonenumber}` : `${prefnumber.countryphonecode}${prefnumber.regioncode}-${prefnumber.phonenumber}` :
                            (mobilenumber !== undefined && mobilenumber.active) ? `${mobilenumber.countryphonecode}${mobilenumber.phonenumber}` :
                                (privatenumber !== undefined && privatenumber.active) ? `${privatenumber.countryphonecode}${privatenumber.regioncode}-${privatenumber.phonenumber}` :
                                    (businessnumber !== undefined && businessnumber.active) ? `${businessnumber.countryphonecode}${businessnumber.regioncode}-${businessnumber.phonenumber}` : '-'

                    let originPersonal = { username, firstname, lastname, gender, dateofbirth, nationality, religionname, langname, passportnumber, membercards, idcardnumber, nameoncard, enrollmentdate, memberOriContact }
                    this.setState({ originPersonal });
                } else {
                    Alert.error('This member origin already merged');
                    this.props.onClose();
                }
            }
        });
        DetailRequest(url, { memberid: memberOrigin, type: 'ALL' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    const { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands } = result;
                    let memberOrigin = { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands }
                    this.props.getRetrieveOri(oricardnumber, memberOrigin);
                } else {
                    Alert.error('This member origin already merged');
                    this.props.onClose();
                }
            }
        });
        this.setState({ isLoadingOri: false });
    };

    getRetrieveDes = (memberDestination) => {
        this.setState({ isLoadingDes: true });
        let url = api.url.member.profile;
        let descardnumber = null;
        DetailRequest(url, { memberid: memberDestination, type: 'SUMMARY' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    const { username, firstname, lastname, gender, dateofbirth, nationality, religionname, langname, passportnumber, membercards, idcardnumber, nameoncard, enrollmentdate, membercontacts } = result;
                    descardnumber = membercards.length !== 0  ? membercards[0].cardnumber : undefined;
                    let prefnumber = membercontacts.find(obj => obj.preferrednumber === true)
                    let mobilenumber = membercontacts.find(obj => obj.phonetype === 'MOBILE')
                    let privatenumber = membercontacts.find(obj => obj.phonetype === 'PRIVATEPHONE')
                    let businessnumber = membercontacts.find(obj => obj.phonetype === 'BUSINESSPHONE')
                    let memberDesContact =
                        (prefnumber !== undefined && prefnumber.active) ? prefnumber.phonetype === 'MOBILE' ? `${prefnumber.countryphonecode}${prefnumber.phonenumber}` : `${prefnumber.countryphonecode}${prefnumber.regioncode}-${prefnumber.phonenumber}` :
                            (mobilenumber !== undefined && mobilenumber.active) ? `${mobilenumber.countryphonecode}${mobilenumber.phonenumber}` :
                                (privatenumber !== undefined && privatenumber.active) ? `${privatenumber.countryphonecode}${privatenumber.regioncode}-${privatenumber.phonenumber}` :
                                    (businessnumber !== undefined && businessnumber.active) ? `${businessnumber.countryphonecode}${businessnumber.regioncode}-${businessnumber.phonenumber}` : '-'
                    let destinationPersonal = { username, firstname, lastname, gender, dateofbirth, nationality, religionname, langname, membercards, passportnumber, idcardnumber, nameoncard, enrollmentdate, memberDesContact }
                    this.setState({ destinationPersonal });
                } else {
                    Alert.error('This member destination already merged');
                    this.props.onClose();
                }
            }
        });
        DetailRequest(url, { memberid: memberDestination, type: 'ALL' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    const { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands, enrollmentdate } = result;
                    let memberDestination = { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands, enrollmentdate }
                    this.props.getRetrieveDes(descardnumber, memberDestination);
                } else {
                    Alert.error('This member destination already merged');
                    this.props.onClose();
                }
            }
        });
        this.setState({ isLoadingDes: false });
    };

    handleMenuCallback = () => {
        this.props.handleMenuCallback({ choosen: 'address', profile: 1 });
    }

    render() {
        const { isLoadingOri, isLoadingDes, originPersonal, destinationPersonal } = this.state;
        let oriPersonal = originPersonal.length === 0 ? undefined : originPersonal;
        let desPersonal = destinationPersonal.length === 0 ? undefined : destinationPersonal;

        return (
            <React.Fragment>
                <Row>
                    <Row gutter={24}>
                        <Col xs={24} sm={24} lg={12}>
                            <Card title={`${desPersonal === undefined || desPersonal.membercards.length === 0 ? '' : desPersonal.membercards[0].cardnumber} - ${oriPersonal === undefined ? '-' : oriPersonal.nameoncard}`} bordered={false} className='card-shadow' style={{ marginRight: 5 }} >
                                <Spin spinning={isLoadingOri} >
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Email</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal === undefined ? '-' : (oriPersonal.username ? oriPersonal.username : '-')}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Name</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal === undefined ? '-' : oriPersonal.firstname ? `${oriPersonal.firstname} ${oriPersonal.lastname}` : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Gender</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.gender ? oriPersonal.gender : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Date of Birth</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.dateofbirth ? moment(oriPersonal.dateofbirth).format('DD/MM/YYYY') : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Nationality</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.nationality ? oriPersonal.nationality : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Religion</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.religionname ? oriPersonal.religionname : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Preferred Language</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.langname ? oriPersonal.langname : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Contact</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal === undefined ? '-' : oriPersonal.memberOriContact ? oriPersonal.memberOriContact : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Passport No.</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.passportnumber ? oriPersonal.passportnumber : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>ID Card No.</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.idcardnumber ? oriPersonal.idcardnumber : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Tier</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal === undefined || oriPersonal.membercards.length === 0 ? '-' : oriPersonal.membercards[0].tiername ? oriPersonal.membercards[0].tiername : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Name on Card</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal !== undefined ? (oriPersonal.nameoncard ? oriPersonal.nameoncard : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Enrollment Date</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {oriPersonal === undefined ? '-' : oriPersonal.enrollmentdate ? moment(oriPersonal.enrollmentdate).format('DD/MM/YYYY') : '-'}</Col>
                                        </Row>
                                    </div>
                                </Spin>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} lg={12}>
                            <Card title={`${desPersonal === undefined || desPersonal.membercards.length === 0 ? '' : desPersonal.membercards[0].cardnumber} - ${desPersonal === undefined ? '-' : desPersonal.nameoncard}`} bordered={false} className='card-shadow' style={{ marginLeft: 5 }}>
                                <Spin spinning={isLoadingDes}>
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Email</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal === undefined ? '-' : (desPersonal.username ? desPersonal.username : '-')}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Name</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.firstname ? `${desPersonal.firstname} ${desPersonal.lastname}` : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Gender</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.gender ? desPersonal.gender : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Date of Birth</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.dateofbirth ? moment(desPersonal.dateofbirth).format('DD/MM/YYYY') : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Nationality</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.nationality ? desPersonal.nationality : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Religion</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.religionname ? desPersonal.religionname : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Preferred Language</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.langname ? desPersonal.langname : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Contact</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal === undefined ? '-' : desPersonal.memberDesContact ? desPersonal.memberDesContact : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Passport No.</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.passportnumber ? desPersonal.passportnumber : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>ID Card No.</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.idcardnumber ? desPersonal.idcardnumber : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Tier</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal === undefined || desPersonal.membercards.length === 0 ? '-' : desPersonal.membercards[0].tiername ? desPersonal.membercards[0].tiername : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Name on Card</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal !== undefined ? (desPersonal.nameoncard ? desPersonal.nameoncard : '-') : '-'}</Col>
                                        </Row>
                                        <Row className="gutter-row" span={24}>
                                            <Col xs={24} xl={11} style={{ marginBottom: '10px' }}><label>Enrollment Date</label></Col>
                                            <Col xs={24} xl={13} style={{ marginBottom: '10px' }}>: {desPersonal === undefined ? '-' : desPersonal.enrollmentdate ? moment(desPersonal.enrollmentdate).format('DD/MM/YYYY') : '-'}</Col>
                                        </Row>
                                    </div>
                                </Spin>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                        <Button type='primary' onClick={() => this.handleMenuCallback()}> Next  <Icon type='right' /></Button>
                    </Row>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);