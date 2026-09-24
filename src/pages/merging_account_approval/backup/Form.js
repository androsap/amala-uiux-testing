import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest, SaveRequest } from '../../utilities/RequestService';
import { Alert, Button, TextArea, InputText } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Card, Icon } from 'antd';
import moment from 'moment';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            originPersonal: [],
            destinationPersonal: [],
            checkRemarks: false
        }
    }

    componentDidMount() {
        document.title = 'Manage Merge Account Log | Loyalty Management System';
        const { cardnumbermastermember, cardnumbermergewith, mergeid } = this.props;
        this.getRetrieveOri(cardnumbermastermember);
        this.getRetrieveDes(cardnumbermergewith);
        this.getDetail(mergeid);
    };

    getDetail = (mergeid) => {
        let url = api.url.profileintegration.detail;
        let criteria = { mergeid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let mergeid = (result.mergeid) ? result.mergeid : undefined;
                    let requestnotes1 = (result.requestnotes) ? result.requestnotes.split('#')[0] : '';
                    let requestnotes2 = (result.requestnotes) ? result.requestnotes.split('#')[1] : '';
                    let requestnotes3 = (result.requestnotes) ? result.requestnotes.split('#')[2] : '';
                    let detailofrequest = (result.detailofrequest) ? result.detailofrequest : '';
                    let remarks = (result.remarks) ? result.remarks : undefined;
                    let createdBy = (result.createdBy) ? result.createdBy : undefined;
                    let createdDate = (result.createdDate) ? result.createdDate : undefined;
                    let processedby = (result.processedby) ? result.processedby : undefined;
                    let processeddate = (result.processeddate) ? result.processeddate : undefined;

                    let setValue = { mergeid, requestnotes1, requestnotes2, requestnotes3, detailofrequest, remarks, createdBy, createdDate, processedby, processeddate };
                    this.props.form.setFieldsValue(setValue);
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    getRetrieveOri = (cardnumbermastermember) => {
        this.setState({ isLoading: true });
        let url = api.url.member.profile;
        let oricardnumber = null;
        DetailRequest(url, { cardnumber: cardnumbermastermember, type: 'ALL' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                // if (response.result.status !== 'MERGED') {
                const { username, firstname, lastname, gender, dateofbirth, nationality, religionname, langname, passportnumber, idcardnumber, nameoncard, membercards, enrollmentdate, membercontacts } = result;
                oricardnumber = membercards.length !== 0 ? membercards[0].cardnumber : undefined;
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
                // } else {
                //     Alert.error('This member origin already merged');
                //     this.props.onClose();
                // }
            }
        });
        // DetailRequest(url, { cardnumber: mastermember, type: 'ALL' }).then((response) => {
        //     const { status = {}, result } = response || {};
        //     if (status.responsecode === '0000') {
        //         if (response.result.status !== 'MERGED') {
        //             const { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands } = result;
        //             let memberOrigin = { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands }
        //         } else {
        //             Alert.error('This member origin already merged');
        //             // this.props.onClose();
        //         }
        //     }
        // });
        this.setState({ isLoading: false });
    };

    getRetrieveDes = (cardnumbermergewith) => {
        this.setState({ isLoading: true });
        let url = api.url.member.profile;
        let descardnumber = null;
        DetailRequest(url, { cardnumber: cardnumbermergewith, type: 'ALL' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                // if (response.result.status !== 'MERGED') {
                const { username, firstname, lastname, gender, dateofbirth, nationality, religionname, langname, passportnumber, membercards, idcardnumber, nameoncard, enrollmentdate, membercontacts } = result;
                descardnumber = membercards.length !== 0 ? membercards[0].cardnumber : undefined;
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
                // } else {
                //     Alert.error('This member destination already merged');
                //     // this.props.onClose();
                // }
            }
        });
        // DetailRequest(url, { cardnumber: mergewith, type: 'ALL' }).then((response) => {
        //     const { status = {}, result } = response || {};
        //     if (status.responsecode === '0000') {
        //         if (response.result.status !== 'MERGED') {
        //             const { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands, enrollmentdate } = result;
        //             let memberDestination = { memberaddress, memberaccount, memberalias, membertiers, membercards, membercobrands, enrollmentdate }
        //         } else {
        //             Alert.error('This member destination already merged');
        //             // this.props.onClose();
        //         }
        //     }
        // });
        this.setState({ isLoading: false });
    };

    handleMenuCallback = () => {
        this.props.handleMenuCallback({ choosen: 'address', profile: 1 });
    }

    getMergingAccount = (status) => {
        this.setState(
            {
                checkRemarks: status === 'REJECTED',
            },
            () => {
                this.props.form.validateFields(['remarks'], { force: true });
                this.setState({ isLoading: true });

                this.props.form.validateFieldsAndScroll((err, input) => {
                    if (!err) {
                        this.setState({ loading: true });
                        let mergeid = this.props.mergeid;
                        let requestnotes1 = this.props.requestnotes.split('#')[0];
                        let requestnotes2 = this.props.requestnotes.split('#')[1];
                        let requestnotes3 = this.props.requestnotes.split('#')[2];
                        let detailofrequest = this.props.detailofrequest;
                        let remarks = (input.remarks) ? input.remarks : null;
                        let mastermember = this.props.mastermember;
                        let mergewith = this.props.mergewith;

                        let data = { mergeid, status, detailofrequest, requestnotes: requestnotes1 + '#' + requestnotes2 + '#' + requestnotes3, remarks, mastermember, mergewith }
                        let url = api.url.profileintegration.update;

                        SaveRequest(url, data).then((response) => {
                            const { status = {}, result } = response || {};
                            if (status.responsecode === '0000') {
                                Alert.success(status.responsemessage);
                                this.props.refreshList();
                                this.props.onClose();
                            } else {
                                Alert.error(status.responsemessage);
                            }
                            this.setState({ isLoading: false });
                        })
                    }
                });
            },
        );
    };

    render() {
        const { isLoading, originPersonal, destinationPersonal } = this.state;
        let oriPersonal = originPersonal.length === 0 ? undefined : originPersonal;
        let desPersonal = destinationPersonal.length === 0 ? undefined : destinationPersonal;
        const status = this.props.status;

        return (
            <React.Fragment>
                <Row>
                    <Row gutter={24}>
                        <Col xs={24} sm={24} lg={12}>
                            <Card title={`${desPersonal === undefined || desPersonal.membercards.length === 0 ? '' : desPersonal.membercards[0].cardnumber} - ${desPersonal === undefined ? '-' : desPersonal.nameoncard}`} bordered={false} className='card-shadow' style={{ marginLeft: 5 }}>
                                <Spin spinning={isLoading}>
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
                        <Col xs={24} sm={24} lg={12}>
                            <Card title={`${oriPersonal === undefined || oriPersonal.membercards.length === 0 ? '' : oriPersonal.membercards[0].cardnumber} - ${oriPersonal === undefined ? '-' : oriPersonal.nameoncard}`} bordered={false} className='card-shadow' style={{ marginRight: 5 }} >
                                <Spin spinning={isLoading} >
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
                    </Row>
                    <Form>
                        <Row gutter={24}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12, offset: 4 }} xl={{ span: 12, offset: 6 }}>
                                <TextArea form={this.props.form} labeltext="Source Request" datafield="requestnotes1" maxLength={255} disabled={true} />
                                <InputText form={this.props.form} labeltext="Channel Request" datafield="requestnotes2" maxLength={255} disabled={true} />
                                <InputText form={this.props.form} labeltext="Date of Request" datafield="requestnotes3" disabled={true} />
                                <TextArea form={this.props.form} labeltext="Details of Request" datafield="detailofrequest" maxLength={255} disabled={true} />
                                <TextArea form={this.props.form} labeltext="Remarks Process" datafield="remarks" maxLength={255} disabled={(status === 'FINISHED' || status === 'REJECTED') ? true : false}
                                    validationrules={[(rule, value, callback) => {
                                        if (!value && this.state.checkRemarks) callback('Remarks is required for Reject')
                                        else callback()
                                    }]} />
                            </Col>
                        </Row>
                    </Form>
                    {(status === 'INPROGRESS') ?
                        <Row gutter={24} type='flex' justify='center' >
                            <Button htmlType="submit" type="danger" label="Reject" onClick={() => this.getMergingAccount('REJECTED')} actioncode="UPDATE"></Button>
                            <Button htmlType="submit" type="primary" label="Approve" onClick={() => this.getMergingAccount('FINISHED')} actioncode="UPDATE"></Button>
                        </Row>
                        : (status === 'REQUESTED') ?
                            <Row gutter={24} type='flex' justify='center' >
                                <Button htmlType="submit" type="primary" label="In Progress" onClick={() => this.getMergingAccount('INPROGRESS')} actioncode="UPDATE"></Button>
                            </Row>
                            : null
                    }
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);