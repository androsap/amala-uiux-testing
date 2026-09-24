import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { SaveRequest, DeleteRequest, DetailRequest } from '../../utilities/RequestService';
import { Alert, Button, ErrorGeneral } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Empty } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            actionspage: 'create',
            formrender: true,
            responsememberprofile: {},
            checkedList: [],
            memberList: []
        }
    }

    componentDidMount() {
        this.getMemberProfile(this.props.match.params.ID, 'checking')
    }

    getMemberProfile(memberid, purpose) {
        let url = api.url.member.profile;
        let type = 'ALL';
        let data = { memberid, type };
        //call loader
        this.setState((purpose === 'checking') ? { loading: true } : { listLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let firstname = (result.firstname) ? result.firstname : null;
                let lastname = (result.lastname) ? result.lastname : null;
                let gender = (result.gender) ? result.gender : null;
                let enrollmentdate = (result.enrollmentdate) ? moment(result.enrollmentdate) : null;
                let username = (result.username) ? result.username : null;
                let nameoncard = (result.nameoncard) ? result.nameoncard : null;
                let langcode = (result.langcode) ? result.langcode : null;
                let memberaddress = (result.memberaddress) ? result.memberaddress : [];
                let membercontacts = (result.membercontacts) ? result.membercontacts : [];
                let name = null;
                let dateofbirth = null;
                let email = null;
                let enrollchannel = null;
                let address = null;
                let phonenum = null;
                for (const field in memberaddress) {
                    address = (memberaddress[field]['ispreffered'] === true) ? memberaddress[field]['address'] !== null ? memberaddress[field]['address'] : '-' : '-';
                }
                for (const field in membercontacts) {
                    phonenum = (membercontacts[field]['phonetype'] === 'MOBILE') ? membercontacts[field]['phonenumber'] !== null ? membercontacts[field]['phonenumber'] : '-' : '-';
                }

                if (purpose === 'checking') {
                    name = firstname + ' ' + (lastname ? lastname : '');
                    dateofbirth = (result.dateofbirth) ? result.dateofbirth : '-';
                    email = (result.email) ? result.email : '-';
                    enrollchannel = (result.enrollchannel) ? result.enrollchannel : '-';
                    this.setState({
                        loading: false,
                        address: address ? address : '-',
                        name, dateofbirth, email, phonenum, enrollchannel,
                        memberid, firstname, lastname, gender, enrollmentdate, username, nameoncard, langcode,
                        responsememberprofile: result
                    },
                        this.suspectDupCheck(memberid, dateofbirth, firstname, lastname)
                    );
                } else if (purpose === 'matching') {
                    let memberList = this.state.memberList;
                    let memberDetail = {
                        memberid: (result.memberid) ? result.memberid : '-',
                        name: firstname + ' ' + (lastname ? lastname : ''),
                        dateofbirth: (result.dateofbirth) ? result.dateofbirth : '-',
                        email: (result.email) ? result.email : '-',
                        enrollchannel: (result.enrollchannel) ? result.enrollchannel : '-',
                        status: (result.status) ? result.status : '-',
                        address: address ? address : '-',
                        phonenum
                    }
                    memberList.push(memberDetail);
                    this.setState({ listLoading: false, memberList });
                }
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }

    suspectDupCheck(memberid, tanggallahir, firstname, lastname) {
        let url = api.url.suspectdup.check;
        let data = { tanggallahir, firstname, lastname };
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let checkedList = result.memberid;
                this.setState({ checkedList });

                for (const field in checkedList) {
                    if (checkedList[field] !== memberid) { this.getMemberProfile(checkedList[field], 'matching'); }
                }
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }

    saveAction = (e) => {
        e.preventDefault();
        const { actionspage } = this.state;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true });

                let data = {};

                let message = '';
                let url = '';
                if (actionspage === 'create') {
                    message = 'New data has been created';
                    url = api.url.title.create;
                } else {
                    message = 'Data has been updated';
                    url = api.url.title.update;
                }

                SaveRequest(url, data).then((response) => {
                    const { responsecode, responsemessage } = response.status;
                    if (responsecode.substring(0, 1) === '0') {
                        message = (responsemessage) ? responsemessage : message;
                        Alert.success(message);
                        this.props.history.push('/suspect-duplicate');
                    } else {
                        Alert.error(responsemessage);
                    }
                    this.setState({ loading: false });
                })
            }
        });
    }

    deleteData(titlecode, active) {
        let url = (active) ? api.url.title.deactivate : api.url.title.activate;
        let data = { titlecode };
        var callback = (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = (responsemessage) ? responsemessage : 'Selected data has been deleted';
                Alert.success(message);
            } else {
                Alert.error(responsemessage);
            }
            this.checkPermission();
        };
        DeleteRequest(url, data, callback, active);
    }

    render() {
        const { formrender } = this.state;
        const { menucode, prefixmenuname } = this.props;
        const { memberList, loading } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
            colon: false
        };
        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 0
            }
        }

        if (formrender) {
            document.title = "Member Suspect Duplicate Verification | Loyalty Management System";

            let dupMemberList = '';
            if (memberList.length) {
                dupMemberList = memberList.map((val, key) => {
                    <Form {...formItemLayout} loading={loading} className="searching-form" key={key}>
                        <Row>
                            <Col>
                                <Form.Item label="Total Tier Miles" {...formItemStyle}>
                                    <span className="ant-form-text">{val.totaltiermiles}</span>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="Total Award Miles" {...formItemStyle}>
                                    <span className="ant-form-text">{val.totalawardmiles}</span>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Form.Item label="Total Frequency" {...formItemStyle}>
                                    <span className="ant-form-text">{val.totalfrequency}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                })
            } else {
                dupMemberList = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>No Matching Member</span>} />
            }

            //render form
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>Member Suspect Duplicate Verification</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.loading}>
                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row gutter={24}>
                                <Col className="gutter-row" >
                                    <Divider>Duplicate Member</Divider>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }} className="searching-form">
                                    <Col span={12}>
                                        <Form.Item label="Name" {...formItemStyle}>
                                            <span className="ant-form-text">Majihalelo Karaio</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Email" {...formItemStyle}>
                                            <span className="ant-form-text">kaiverau@malkist.yok</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Birthdate" {...formItemStyle}>
                                            <span className="ant-form-text">01/10/2010</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Phone Number" {...formItemStyle}>
                                            <span className="ant-form-text">0345-6271281</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Address" {...formItemStyle}>
                                            <span className="ant-form-text">Kailelo Street, </span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Channel" {...formItemStyle}>
                                            <span className="ant-form-text">CSS, BO, HAH UCUL</span>
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col className="gutter-row" >
                                    <Divider>List of Matching with Existing Member</Divider>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }} className="searching-form">
                                    {/* {dupMemberList} */}

                                    <Col span={12}>
                                        <Form.Item label="Name" {...formItemStyle}>
                                            <span className="ant-form-text">Manjseury Kalanijuara</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Email" {...formItemStyle}>
                                            <span className="ant-form-text">manjara@romakelapa.yok</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Birthdate" {...formItemStyle}>
                                            <span className="ant-form-text">05/15/2055</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Phone Number" {...formItemStyle}>
                                            <span className="ant-form-text">089-9992731900</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Address" {...formItemStyle}>
                                            <span className="ant-form-text">Kelapa Merah Dalam Gang Luar, US Court 28</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Channel" {...formItemStyle}>
                                            <span className="ant-form-text">CSS</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Link to={'/member/form/' + this.props.match.params.ID} className="btn-custom-transparent">View Member</Link>
                                    {/* <Button url={'/member/form/' + this.props.match.params.ID} className="btn-custom-transparent" label="View Member" menucode="MMBRPROF" prefixmenuname="MMBRPROF" actioncode="ACCESS"></Button> */}
                                    </Col>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }} className="searching-form">
                                    {/* {dupMemberList} */}

                                    <Col span={12}>
                                        <Form.Item label="Name" {...formItemStyle}>
                                            <span className="ant-form-text">Manjseury Kalanijuara</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Email" {...formItemStyle}>
                                            <span className="ant-form-text">manjara@romakelapa.yok</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Birthdate" {...formItemStyle}>
                                            <span className="ant-form-text">05/15/2055</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Phone Number" {...formItemStyle}>
                                            <span className="ant-form-text">089-9992731900</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Address" {...formItemStyle}>
                                            <span className="ant-form-text">Kelapa Merah Dalam Gang Luar, US Court 28</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Channel" {...formItemStyle}>
                                            <span className="ant-form-text">CSS</span>
                                        </Form.Item>
                                    </Col>
                                </Col>
                                <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 20, offset: 2 }} xl={{ span: 20, offset: 2 }} className="searching-form">
                                    {/* {dupMemberList} */}

                                    <Col span={12}>
                                        <Form.Item label="Name" {...formItemStyle}>
                                            <span className="ant-form-text">Manjseury Kalanijuara</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Email" {...formItemStyle}>
                                            <span className="ant-form-text">manjara@romakelapa.yok</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Birthdate" {...formItemStyle}>
                                            <span className="ant-form-text">05/15/2055</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Phone Number" {...formItemStyle}>
                                            <span className="ant-form-text">089-9992731900</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Address" {...formItemStyle}>
                                            <span className="ant-form-text">Kelapa Merah Dalam Gang Luar, US Court 28</span>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Channel" {...formItemStyle}>
                                            <span className="ant-form-text">CSS</span>
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                            <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                                <Button htmlType="button" type="danger" label="Reject Enrollment" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.saveAction(e, 'Reject Enrollment')} />
                                <Button htmlType="button" type="primary" label="Accept Duplicate" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="APPROVE" onClick={(e) => this.saveAction(e, 'Accept Duplicate')} />
                                <Button url="/suspect-duplicate" htmlType="link" type="default" label="Back" />
                            </Row>
                        </Form>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
// export default connect(mapStateToProps)(Layout);
export default connect(mapStateToProps)(Form.create()(App));