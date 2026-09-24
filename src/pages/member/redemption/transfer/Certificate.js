import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Certificate from '../../../../components/Certificate/Index';
import { Row, Divider, Typography, Col, Button } from 'antd';

const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificateid: []
        }
    }

    componentDidMount() {
        const { state } = this.props.location;
        let memberid = this.props.match.params.ID;
        if (state === undefined) {
            this.props.history.push(`/member/form/${memberid}/redemption/`);
        } else {
            const { redeemuser } = state.responseBuyAward;
            let certificateid = redeemuser.map((obj, key) => { return obj.certificateid });

            this.setState({ certificateid });
        }
    }

    render() {
        const { certificateid } = this.state;
        let memberid = this.props.match.params.ID;
        return (
            <Row>
                <Title level={4}>Certificate</Title>
                <Divider />
                {
                    certificateid.map((value, key) => {
                        return <Certificate number={key + 1} certificateid={value} />
                    })
                }
                <Col style={{ textAlign: 'center' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Link to={`/member/form/${memberid}/redemption`}>
                        <Button htmlType="button" type="primary">New Redeem</Button>
                    </Link>
                </Col>
            </Row>
        )
    }
}

export default App;
