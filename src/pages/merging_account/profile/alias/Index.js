import React from 'react';
import { api } from '../../../../config/Services';
import { Alert } from '../../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Form, Row, Col, Card, Empty, Button, Icon, Spin } from 'antd';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberOriginAlias: [],
            memberDestinationAlias: [],
            membercardOri: [],
            membercardDes: [],
            isLoading: false
        }
    }

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        this.setState({
            memberOriginAlias: this.props.memberOrigin,
            memberDestinationAlias: this.props.memberDestination
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
            this.props.handleMenuCallback({ choosen: 'member-tier', membership: 0, current: 1 });
        } else {
            this.props.handleMenuCallback({ choosen: 'account', profile: 2 });
        }
    };

    render() {
        const { isLoading, memberOriginAlias, memberDestinationAlias, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        let originMember = memberOriginAlias.map((val, i) =>
            <Card bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Type</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.type === undefined ? '-' : val.type ? val.type : '-'}</Col>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Member Name</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.membername === undefined ? '-' : val.membername ? val.membername : '-'}</Col>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Ticket Name</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.ticketname === undefined ? '-' : val.ticketname ? val.ticketname : '-'}</Col>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Cardnumber</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.cardnumber === undefined ? '-' : val.cardnumber ? val.cardnumber : '-'}</Col>
                </Row>
            </Card>
        );
        let destinationMember = memberDestinationAlias.map((val, i) =>
            <Card bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Type</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.type === undefined ? '-' : val.type ? val.type : '-'}</Col>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Member Name</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.membername === undefined ? '-' : val.membername ? val.membername : '-'}</Col>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Ticket Name</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.ticketname === undefined ? '-' : val.ticketname ? val.ticketname : '-'}</Col>
                    <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Cardnumber</label></Col>
                    <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {val.cardnumber === undefined ? '-' : val.cardnumber ? val.cardnumber : '-'}</Col>
                </Row>
            </Card>
        );
        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberOri} - ${nameOri}`} bordered={true}>
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        {(memberOriginAlias.length === 0) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : originMember}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={true} >
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        {(memberOriginAlias.length === 0) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : destinationMember}
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
