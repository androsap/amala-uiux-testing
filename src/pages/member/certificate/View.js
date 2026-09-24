import React from 'react';
import { Link } from 'react-router-dom';
import Certificate from '../../../components/Certificate/Index';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { Row, Col, Divider, Typography } from 'antd';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import moment from 'moment';

const { Title } = Typography;
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberid: props.match.params.ID,
            certificateid: props.match.params.certificateid,
            status: null,
            awardmiles: null,
        }
    }

    componentDidMount() {
        this.retrieveStatus();
    }

    retrieveStatus() {
        const { certificateid } = this.state;
        let url = api.url.redemptioncertificate.detail;
        let data = { certificateid };
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                const status = (result && result['redeemusers'] && result['redeemusers']['status']) ? result['redeemusers']['status'] : null;
                const certificateprice = (result && result['redeemusers'] && result['redeemusers']['certificateprice']) ? result['redeemusers']['certificateprice'] : null;
                this.setState({ status, awardmiles: -certificateprice });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    handleChangeStatus() {
        const { memberid, certificateid, awardmiles } = this.state;
        const trxdate = moment().format('YYYY-MM-DD');
        const tiermiles = 0;
        const frequency = 0;
        let url = api.url.redemptioncertificate.spendingredeem;
        let data = { certificateid, trxdate, memberid, awardmiles, tiermiles, frequency };
        DetailRequest(url, data).then((response) => {
            let { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                Alert.success(status.responsemessage);
                this.props.history.push('/member/form/' + memberid + '/certificate')
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    render() {
        const { memberid, certificateid, status } = this.state;
        return (
            <Row>
                <Title level={4}>
                    <Button url={'/member/form/' + memberid + '/certificate'} shape="circle" icon="left" /> Certificate
                </Title>
                <Divider />
                <Certificate {...this.props} number={1} certificateid={certificateid} source={'memberCertif'}/>
                <Col style={{ textAlign: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Link to={"/member/form/" + memberid + "/certificate"}>
                        <Button url={'/member/form/' + memberid + '/certificate'} label="Certificate List" />
                    </Link>
                    {(status === "VOUCHER_CREATED") ? <Button htmlType="button" onClick={() => this.handleChangeStatus()} label="Re-issued" type="primary" /> : null}
                </Col>
            </Row>
        )
    }
}

export default App;