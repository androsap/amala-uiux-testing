import React from 'react';
import { api } from '../../../../config/Services';
import { Alert } from '../../../../components/Base/BaseComponent';
import { DetailRequest } from '../../../../utilities/RequestService';
import { Form, Row, Col, Card, Button, Icon, Spin, Empty } from 'antd';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberOriginPrivate: [],
            memberDestinationPrivate: [],
            memberOriginBusiness: [],
            memberDestinationBusiness: [],
            membercardOri: [],
            membercardDes: [],
            isLoading: false,
        }
    };

    componentDidMount() {
        document.title = 'Merge Member | Loyalty Management System';
        let { memberOriginPrivate, memberOriginBusiness, memberDestinationPrivate, memberDestinationBusiness } = this.state;
        for (let i = 0; i < this.props.memberOrigin.length; i++) {
            if (this.props.memberOrigin[i].active) {
                if (this.props.memberOrigin[i].addresstype === 'PRIVATE') {
                    memberOriginPrivate.push(this.props.memberOrigin[i]);
                } else {
                    memberOriginBusiness.push(this.props.memberOrigin[i]);
                }
            }
        };
        for (let i = 0; i < this.props.memberDestination.length; i++) {
            if (this.props.memberDestination[i].active) {
                if (this.props.memberDestination[i].addresstype === 'PRIVATE') {
                    memberDestinationPrivate.push(this.props.memberDestination[i]);
                } else {
                    memberDestinationBusiness.push(this.props.memberDestination[i]);
                }
            }
        };
        this.setState({ memberOriginPrivate, memberOriginBusiness, memberDestinationPrivate, memberDestinationBusiness });
        this.getCardnumber();
    };

    getCardnumber = () => {
        const { memberidOri, memberidDes } = this.props;
        this.setState({ isLoading: true });
        let url = api.url.member.profile;
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
            this.props.handleMenuCallback({ choosen: 'account', profile: 2 });
        } else {
            this.props.handleMenuCallback({ choosen: 'personal-information', profile: 0 });
        }
    };

    render() {
        const { isLoading, memberOriginPrivate, memberDestinationPrivate, memberOriginBusiness, memberDestinationBusiness, membercardOri, membercardDes } = this.state;

        let cardnumberOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : (membercardOri[0].membercards.length !== 0) ? membercardOri[0].membercards[0].cardnumber : '';
        let cardnumberDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : (membercardDes[0].membercards.length !== 0) ? membercardDes[0].membercards[0].cardnumber : '';
        let nameOri = (membercardOri === undefined || membercardOri.length === 0) ? '' : membercardOri[0].nameoncard;
        let nameDes = (membercardDes === undefined || membercardDes.length === 0) ? '' : membercardDes[0].nameoncard;

        let oriPrivate = memberOriginPrivate.map((val, i) =>
            <Card title='Private Address' bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Home Address</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.address ? val.address : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Postal Code</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.postalcode ? val.postalcode : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Country</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.countryname ? val.countryname : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Province / State</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.statename ? val.statename : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>City</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.cityname ? val.cityname : '-'}</Col>
                </Row>
            </Card>
        );

        let oriBusiness = memberOriginBusiness.map((val, i) =>
            <Card title='Business Address' bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Company Name</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.companyname ? val.companyname : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Department</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.department ? val.department : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Position</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.position ? val.position : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Address</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.address ? val.address : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Postal Code</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.postalcode ? val.postalcode : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Country</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.countryname ? val.countryname : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Province / State</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.statename ? val.statename : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>City</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.cityname ? val.cityname : '-'}</Col>
                </Row>
            </Card>
        );

        let desPrivate = memberDestinationPrivate.map((val, i) =>
            <Card title='Private Address' bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Home Address</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.address ? val.address : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Postal Code</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.postalcode ? val.postalcode : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Country</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.countryname ? val.countryname : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Province / State</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.statename ? val.statename : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>City</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.cityname ? val.cityname : '-'}</Col>
                </Row>
            </Card>
        );

        let desBusiness = memberDestinationBusiness.map((val, i) =>
            <Card title='Business Address' bordered={false} className='card-shadow' style={{ marginBottom: 15 }}>
                <Row className="gutter-row" span={24}>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Company Name</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.companyname ? val.companyname : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Department</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.department ? val.department : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Position</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.position ? val.position : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Address</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.address ? val.address : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Postal Code</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.postalcode ? val.postalcode : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Country</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.countryname ? val.countryname : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>Province / State</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.statename ? val.statename : '-'}</Col>
                    <Col xs={24} xl={10} style={{ marginBottom: '10px' }}><label>City</label></Col>
                    <Col xs={1} style={{ marginBottom: '10px' }}>:</Col>
                    <Col xs={23} xl={11} style={{ marginBottom: '10px' }}>{val.cityname ? val.cityname : '-'}</Col>
                </Row>
            </Card>
        );

        return (
            <React.Fragment>
                <Row>
                    <Spin spinning={isLoading}>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberOri} - ${nameOri}`} bordered={true} >
                                    <div style={{ background: '#ffffff', overflow: 'auto', height: '330px', width: '500px', paddingRight: '5px' }} >
                                        {(memberOriginPrivate.length === 0 && memberOriginBusiness.length === 0) ?
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : <div>{oriPrivate}{oriBusiness}</div>
                                        }
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} lg={12}>
                                <Card title={`${cardnumberDes} - ${nameDes}`} bordered={true} >
                                    <div style={{ background: '#ffffff', overflow: 'auto', height: '330px', width: '500px', paddingRight: '5px' }} >
                                        {(memberDestinationPrivate.length === 0 && memberDestinationBusiness.length === 0) ?
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingBlockStart: 150 }} /> : <div>{desPrivate}{desBusiness}</div>
                                        }
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
