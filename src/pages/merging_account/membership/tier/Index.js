import React from 'react';
import { api } from '../../../../config/Services';
import { Alert } from '../../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Form, Row, Col, Empty, Card, Button, Icon, Spin } from 'antd';
import moment from 'moment';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberOriginTier: [],
            memberDestinationTier: [],
            isLoading: false
        }
    }

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        let memberOriginTier = [];
        let memberDestinationTier = [];
        for (let i = 0; i < this.props.memberOrigin.length; i++) {
            if (this.props.memberOrigin[i].active) {
                memberOriginTier.push(this.props.memberOrigin[i]);
            }
        };
        for (let i = 0; i < this.props.memberDestination.length; i++) {
            if (this.props.memberDestination[i].active) {
                memberDestinationTier.push(this.props.memberDestination[i]);
            }
        };
        this.setState({
            memberOriginTier: memberOriginTier.sort(function (a, b) { return new Date(b.startdate) - new Date(a.startdate) }),
            memberDestinationTier: memberDestinationTier.sort(function (a, b) { return new Date(b.startdate) - new Date(a.startdate) })
        });
        this.getCardnumber();
    };

    getCardnumber = () => {
        const { memberidOri, memberidDes } = this.props;
        let url = api.url.member.profile;
        this.setState({ isLoading: true });
        DetailRequest(url, { memberid: memberidOri, type: 'SUMMARY' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    this.setState({ membercardOri: [result] });
                } else {
                    Alert.error('This member origin already merged');
                    this.props.onClose();
                }
            }
        });
        DetailRequest(url, { memberid: memberidDes, type: 'SUMMARY' }).then((response) => {
            const { status = {}, result } = response || {};
            if (status.responsecode === '0000') {
                if (response.result.status !== 'MERGED') {
                    this.setState({ membercardDes: [result], isLoading: false });
                } else {
                    Alert.error('This member destination already merged');
                    this.props.onClose();
                }
            }
        });
    };

    handleMenuCallback = (type) => {
        if (type === 'next') {
            this.props.handleMenuCallback({ choosen: 'member-card', current: 1, membership: 1 });
        } else {
            this.props.handleMenuCallback({ choosen: 'alias', profile: 3 });
        }
    };

    render() {
        const { isLoading, memberOriginTier, memberDestinationTier, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        let originMember = memberOriginTier.map((val, i) =>
            <Card bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Tier</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.tiername ? val.tiername : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Tier Change Process</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.tierchangeprocess ? val.tierchangeprocess : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Start Date</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.startdate ? moment(val.startdate).format('DD/MM/YYYY') : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>End Date</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.enddate ? moment(val.enddate).format('DD/MM/YYYY') : '-'}</Col>
                </Row>
            </Card>
        );
        let destinationMember = memberDestinationTier.map((val, i) =>
            <Card bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Tier</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.tiername ? val.tiername : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Tier Change Process</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.tierchangeprocess ? val.tierchangeprocess : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Start Date</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.startdate ? moment(val.startdate).format('DD/MM/YYYY') : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>End Date</label></Col>
                    <Col xs={24} xl={14} style={{ marginBottom: '10px' }}>: {val.enddate ? moment(val.enddate).format('DD/MM/YYYY') : '-'}</Col>
                </Row>
            </Card>
        )
        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberOri} - ${nameOri}`} bordered={true} >
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        {(memberOriginTier.length === 0) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : originMember}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={true} >
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        {(memberOriginTier.length === 0) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : destinationMember}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }}>
                            <Col xs={12}>
                                <Button type='default' onClick={() => this.handleMenuCallback('prev')}><Icon type='left' /> Previous </Button>
                            </Col>
                            <Col>
                                <Button type='primary' onClick={() => this.handleMenuCallback('next')}> Next  <Icon type='right' /></Button>
                            </Col>
                        </Row>
                    </Spin>
                </Row>
            </React.Fragment>
        );
    }
}
export default Form.create()(App);
