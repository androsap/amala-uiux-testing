import React from 'react';
import { api } from '../../../../config/Services';
import { Alert } from '../../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Form, Row, Col, Card, Button, Icon, Spin } from 'antd';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberOriginAccount: [],
            memberDestinationAccount: [],
            membercardOri: [],
            membercardDes: [],
            isLoading: false
        }
    };

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        let memberOriginAccount = this.props.memberOrigin.find(o => o.active === true);
        let memberDestinationAccount = this.props.memberDestination.find(o => o.active === true);
        this.setState({ memberOriginAccount, memberDestinationAccount });
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
    }

    handleMenuCallback = (type) => {
        if (type === 'next') {
            this.props.handleMenuCallback({ choosen: 'alias', profile: 3 });
        } else {
            this.props.handleMenuCallback({ choosen: 'address', profile: 1 });
        }
    };

    render() {
        const { isLoading, memberOriginAccount, memberDestinationAccount, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberOri} - ${nameOri}`} bordered={false} className='card-shadow' >
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        <Card bordered={false} className='card-shadow'>
                                            <Col className="gutter-row" span={24}>
                                                <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Tier Miles</label></Col>
                                                <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {memberOriginAccount === undefined ? '-' : memberOriginAccount.tiermiles ? memberOriginAccount.tiermiles : '0'}</Col>
                                                <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Award Miles</label></Col>
                                                <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {memberOriginAccount === undefined ? '-' : memberOriginAccount.awardmiles ? memberOriginAccount.awardmiles : '0'}</Col>
                                                <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Frequency</label></Col>
                                                <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {memberOriginAccount === undefined ? '-' : memberOriginAccount.frequency ? memberOriginAccount.frequency : '0'}</Col>
                                            </Col>
                                        </Card>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={false} className='card-shadow' >
                                    <div style={{ background: '#ffffff', paddingRight: '5px', overflow: 'auto', height: '330px', width: '500px' }} >
                                        <Card bordered={false} className='card-shadow'>
                                            <Col className="gutter-row" span={24}>
                                                <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Tier Miles</label></Col>
                                                <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {memberDestinationAccount === undefined ? '-' : memberDestinationAccount.tiermiles ? memberDestinationAccount.tiermiles : '0'}</Col>
                                                <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Award Miles</label></Col>
                                                <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {memberDestinationAccount === undefined ? '-' : memberDestinationAccount.awardmiles ? memberDestinationAccount.awardmiles : '0'}</Col>
                                                <Col xs={24} xl={8} style={{ marginBottom: '10px' }}><label>Frequency</label></Col>
                                                <Col xs={24} xl={16} style={{ marginBottom: '10px' }}>: {memberDestinationAccount === undefined ? '-' : memberDestinationAccount.frequency ? memberDestinationAccount.frequency : '0'}</Col>
                                            </Col>
                                        </Card>
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
