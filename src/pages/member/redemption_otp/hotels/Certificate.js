import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Divider, Typography, Col, Button, Statistic, Tag, Tooltip } from 'antd';
import { Button as ButtonComponent } from '../../../../components/Base/BaseComponent';
import Certificate from '../../../../components/Certificate/Index';

const { Title } = Typography;
const { Countdown } = Statistic;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificateid: []
        }
    };

    componentDidMount() {
        const { state } = this.props.location;
        let memberid = this.props.match.params.ID;
        if (state === undefined) {
            this.props.history.push(`/member/form/${memberid}/redemptionotp`);
        } else {
            const { redeemuser } = state.responseBuyAward;
            let certificateid = redeemuser.map((obj, key) => { return obj.certificateid });

            this.setState({ certificateid });
        }
        this.props.retrieveSession();
    };

    finishOTPTime = () => {
        let memberid = this.props.match.params.ID;
        this.props.history.push(`/member/form/${memberid}/redemptionotp`);
    };

    render() {
        const { certificateid } = this.state;
        const { statusScreenOTP, countdownSession } = this.props.dataOTP;
        
        let xtraSmallWidthScreen = (window.innerWidth < 767);
        let memberid = this.props.match.params.ID;

        if (statusScreenOTP === 'allowed') {
            return (
                <Row>
                    <Col xs={(xtraSmallWidthScreen) ? 18 : 12}>
                        <Title level={4}> <ButtonComponent url={{ pathname: `/member/form/${memberid}/redemptionotp` }} shape='circle' icon='left' />  {(xtraSmallWidthScreen) ? 'Certif OTP Hotel' : 'Certificate with OTP Hotel'}</Title>
                    </Col>
                    <Col xs={(xtraSmallWidthScreen) ? 6 : 12} >
                        <Row type='flex' justify='end'>
                            <div style={{ display: 'inline-flex', fontSize: '16px', color: 'black' }}>
                                {(xtraSmallWidthScreen) ? null : <span>OTP Time Limit =&nbsp;</span>}
                                <Tooltip placement="topRight" title={`OTP Time Limit`}>
                                    <Tag color='blue'>
                                        <Countdown
                                            valueStyle={{ fontSize: '16px', color: 'blue' }}
                                            value={countdownSession}
                                            format='mm:ss'
                                            onFinish={this.finishOTPTime}
                                        />
                                    </Tag>
                                </Tooltip>
                            </div>
                        </Row>
                    </Col>
                    <Divider />

                    {
                        certificateid.map((value, key) => { return <Certificate number={key + 1} certificateid={value} /> })
                    }

                    <Col style={{ textAlign: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Link to={`/member/form/${memberid}/redemptionotp`}>
                            <Button htmlType='button' type='primary'>New Redeem</Button>
                        </Link>
                    </Col>
                </Row>
            )
        } else return (
            <Row>
                <Row gutter={24} type='flex' justify='center'>
                    <Title level={2} style={{ textAlign: 'center', marginTop: 350 }} className={''}>This page need OTP Authentication, please back to Redemption page</Title>
                </Row>
                <Row gutter={24} type='flex' justify='center'>
                    <ButtonComponent url={`/member/form/${this.props.match.params.ID}/redemptionotp`} htmlType='link' type='default' label='Back' />
                </Row>
            </Row>
        )
    };
}

export default App;