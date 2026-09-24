import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Divider, Typography, Button, Card, Icon, Tag } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';

const { Title } = Typography;

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

    componentDidMount() {
        document.title = 'Merge Result | Loyalty Management System';
    }

    render() {
        const { result, memberidOri, memberidDes } = this.props.location.state;
        const { originmember, destinationmember, isneedcorrection } = result;

        if (originmember !== undefined && destinationmember !== undefined) {
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}><Title level={3}>Merging Result</Title></Col>
                        <Divider />
                    </Row>
                    <Row gutter={24} type="flex" justify="space-around" align="middle">
                        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                            <Card>
                                <Title level={3}> {jsUcfirst(originmember.name)} </Title>
                                <Row gutter={24} style={{ marginBottom: '10px', marginTop: '20px' }}>
                                    <Col xs={24} xl={6}><label>Status</label></Col>
                                    <Col xs={24} xl={18}>: {<Tag color={tagStatus[originmember.status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[originmember.status]['label']}</Tag>}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Email</label></Col>
                                    <Col xs={24} xl={18}>: {originmember.email}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Gender</label></Col>
                                    <Col xs={24} xl={18}>: {originmember.gender}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Date of Birth</label></Col>
                                    <Col xs={24} xl={18}>: {moment(originmember.dateofbirth).format('DD/MM/YYYY')}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Award Miles</label></Col>
                                    <Col xs={24} xl={18}>: {originmember.awardmiles}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Tier Miles</label></Col>
                                    <Col xs={24} xl={18}>: {originmember.tiermiles}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '30px' }}>
                                    <Col xs={24} xl={6}><label>Frequency</label></Col>
                                    <Col xs={24} xl={18}>: {originmember.frequency}</Col>
                                </Row>
                                <div> This account has been successfully merged </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                            <Row type='flex' justify='center'> Merged To </Row>
                            <Row type='flex' justify='center'><Icon type='double-right' style={{ fontSize: '32px', marginTop: '8px' }} /></Row>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                            <Card>
                                <Title level={3}>{jsUcfirst(destinationmember.name)}</Title>
                                <Row gutter={24} style={{ marginBottom: '10px', marginTop: '20px' }} >
                                    <Col xs={24} xl={6}><label>Status</label></Col>
                                    <Col xs={24} xl={18}>: {<Tag color={tagStatus[destinationmember.status]['color']} style={{ marginRight: 0, color: 'white' }}>{tagStatus[destinationmember.status]['label']}</Tag>}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Email</label></Col>
                                    <Col xs={24} xl={18}>: {destinationmember.email}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Gender</label></Col>
                                    <Col xs={24} xl={18}>: {destinationmember.gender}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Date of Birth</label></Col>
                                    <Col xs={24} xl={18}>: {moment(destinationmember.dateofbirth).format('DD/MM/YYYY')}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Award Miles</label></Col>
                                    <Col xs={24} xl={18}>: {destinationmember.awardmiles}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '10px' }}>
                                    <Col xs={24} xl={6}><label>Tier Miles</label></Col>
                                    <Col xs={24} xl={18}>: {destinationmember.tiermiles}</Col>
                                </Row>
                                <Row gutter={24} style={{ marginBottom: '30px' }}>
                                    <Col xs={24} xl={6}><label>Frequency</label></Col>
                                    <Col xs={24} xl={18}>: {destinationmember.frequency}</Col>
                                </Row>
                                <div> This active account </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20, textAlign: 'center' }}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {`Member ${originmember.name} has success merge to member ${destinationmember.name}.`}
                            {isneedcorrection ? <Row>But system has detect duplicate transaction must to correction. Click this
                                <Link to={{ pathname: '/correction-transaction', state: { memberidorigin: memberidOri, memberiddestination: memberidDes } }}> link to do correction</Link></Row> : ''}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginTop: 20 }}>
                            <Link to={'/merging-account'}>
                                <Button htmlType='button' type='primary'>New Merge</Button>
                            </Link>
                            <Link to={'/member/form/' + memberidDes} target='_blank'>
                                <Button htmlType='button' type='default' className='btn-custom-info'>Go to Member Profile</Button>
                            </Link>
                        </Col>
                    </Row>
                </Row>
            )
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));