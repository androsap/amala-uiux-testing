import React from 'react';
import { api } from '../../../../config/Services';
import { Alert } from '../../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Form, Row, Col, Card, Empty, Button, Icon, Spin } from 'antd';
import moment from 'moment';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberOriginCobrands: [],
            memberDestinationCobrands: [],
            membercardOri: [],
            membercardDes: [],
            isLoading: false
        }
    };

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        this.setState({
            memberOriginCobrands: this.props.memberOrigin,
            memberDestinationCobrands: this.props.memberDestination
        })
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
            this.props.handleMenuCallback({ choosen: 'activity', current: 2 });
        } else {
            this.props.handleMenuCallback({ choosen: 'member-card', current: 1, membership: 1 });
        }
    };

    render() {
        const { isLoading, memberOriginCobrands, memberDestinationCobrands, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        let originMember = memberOriginCobrands.map((val, i) =>
            <Card bordered={true} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Cobrand Code</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.cobrandcode ? val.cobrandcode : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Cobrand Name</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.cobrandname ? val.cobrandname : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Status</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.status ? val.status : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Start Date</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.startdate ? moment(val.startdate).format('DD/MM/YYYY') : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>End Date</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.enddate ? moment(val.enddate).format('DD/MM/YYYY') : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Terminate Date</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.terminatedate ? moment(val.terminatedate).format('DD/MM/YYYY') : '-'}</Col>
                </Row>
            </Card>
        );
        let destinationMember = memberDestinationCobrands.map((val, i) =>
            <Card bordered={true} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Cobrand Code</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.cobrandcode ? val.cobrandcode : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Cobrand Name</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.cobrandname ? val.cobrandname : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Status</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.status ? val.status : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Start Date</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.startdate ? moment(val.startdate).format('DD/MM/YYYY') : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>End Date</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.enddate ? moment(val.enddate).format('DD/MM/YYYY') : '-'}</Col>
                    <Col xs={24} xl={9} style={{ marginBottom: '10px' }}><label>Terminate Date</label></Col>
                    <Col xs={24} xl={15} style={{ marginBottom: '10px' }}>: {val.terminatedate ? moment(val.terminatedate).format('DD/MM/YYYY') : '-'}</Col>
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
                                        {(memberOriginCobrands.length === 0) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : originMember}
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={true}>
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        {(memberDestinationCobrands.length === 0) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : destinationMember}
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
