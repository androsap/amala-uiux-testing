import React from 'react';
import { Row, Col, Card } from 'antd';
import { jsUcfirst } from '../../utilities/Helpers';

class CertificateDetails extends React.Component {

    render() {
        const { redeemuser } = this.props;
        const { certificateid, salutationcode, name, familyname, certificateprice, travelertype, selfusage, status } = redeemuser;

        return (
            <React.Fragment>
                {
                    Array.isArray(redeemuser) ? redeemuser.map((val, i) =>
                        <Card title={`Certificate Details ${i + 1}`} bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }} key={i}>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                <Row>
                                    <Col xs={24} xl={6}><label>Certificate ID</label></Col>
                                    <Col xs={1} xl={2}><label>:</label></Col>
                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(val.certificateid) ? val.certificateid : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={24} xl={6}><label>Name</label></Col>
                                    <Col xs={1} xl={2}><label>:</label></Col>
                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(val.name) ? `${val.salutationcode ? jsUcfirst(val.salutationcode) : ''} ${jsUcfirst(val.name)} ${jsUcfirst(val.familyname)}` : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={24} xl={6}><label>Traveler Type</label></Col>
                                    <Col xs={1} xl={2}><label>:</label></Col>
                                    <Col xs={23} xl={{ span: 16, pull: 1 }}>{(val.travelertype) ? val.travelertype : '-'}</Col>
                                </Row>
                            </Col >
                            <Col className="gutter-row" span={12}>
                                <Row>
                                    <Col xs={24} xl={8}><label>Price</label></Col>
                                    <Col xs={1} xl={2}><label>:</label></Col>
                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(val.certificateprice) ? val.certificateprice : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={24} xl={8}><label>Self Usage</label></Col>
                                    <Col xs={1} xl={2}><label>:</label></Col>
                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(val.selfusage) ? 'Yes' : 'No'}</Col>
                                </Row>
                                <Row>
                                    <Col xs={24} xl={8}><label>Status</label></Col>
                                    <Col xs={1} xl={2}><label>:</label></Col>
                                    <Col xs={23} xl={{ span: 14, pull: 1 }}>{(val.status) ? val.status : '-'}</Col>
                                </Row>
                            </Col>
                        </Card >) : <Card title={`Certificate Details`} bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }} key='certificateDetails'>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                            <Row>
                                <Col xs={24} xl={6}><label>Certificate ID</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(certificateid) ? certificateid : '-'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={6}><label>Name</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(name) ? `${salutationcode ? jsUcfirst(salutationcode) : ''} ${jsUcfirst(name)} ${jsUcfirst(familyname)}` : '-'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={6}><label>Traveler Type</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(travelertype) ? travelertype : '-'}</Col>
                            </Row>
                        </Col >
                        <Col className="gutter-row" span={12}>
                            <Row>
                                <Col xs={24} xl={8}><label>Price</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(certificateprice) ? certificateprice : '-'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={8}><label>Self Usage</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(selfusage) ? 'Yes' : 'No'}</Col>
                            </Row>
                            <Row>
                                <Col xs={24} xl={8}><label>Status</label></Col>
                                <Col xs={1} xl={2}><label>:</label></Col>
                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(status) ? status : '-'}</Col>
                            </Row>
                        </Col>
                    </Card >
                }
            </React.Fragment>
        )
    }
}

export default CertificateDetails;