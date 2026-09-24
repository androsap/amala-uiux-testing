import React from 'react';
import { Form, Row, Col } from 'antd';
import { jsUcfirst } from '../../../../utilities/Helpers';
import { Button } from '../../../../components/Base/BaseComponent';

class App extends React.Component {

    render() {
        const { type, LetterDetails, VendorDetails, MemberDetails } = this.props;
        const { lettername, languagename, papervariant, envelopevariant, papername, envelopename } = LetterDetails || {};
        const { phone, vendorcode, vendorname, email } = VendorDetails || {};
        const { memberAddress, memberState, memberCity, memberCountry, memberPostalCode } = MemberDetails || {};

        return (
            <React.Fragment >

                <Row style={{ marginBottom: 5 }}>
                    <Row style={{ marginBottom: 5 }}>
                        <Col className='gutter-row' xs={24} md={9}><label>
                            {
                                (type === 'letter') ? 'Letter Name' : (type === 'member') ? 'Country' : 'Code'
                            }
                        </label></Col>
                        <Col className='gutter-row' xs={1}>: </Col>
                        <Col className='gutter-row' xs={23} md={14} xl={14}>
                            {
                                (type === 'letter') ? (lettername) ? lettername : '-' :
                                    (type === 'member') ? (memberCountry) ? memberCountry : '-' :
                                        (vendorcode) ? vendorcode : '-'
                            }
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col className='gutter-row' xs={24} md={9}><label>
                            {
                                (type === 'letter') ? 'Language' : (type === 'member') ? 'State' : 'Name'
                            }
                        </label></Col>
                        <Col className='gutter-row' xs={1}>: </Col>
                        <Col className='gutter-row' xs={23} md={14} xl={14}>
                            {
                                (type === 'letter') ? (languagename) ? languagename : '-' :
                                    (type === 'member') ? (memberState) ? memberState : '-' :
                                        (vendorname) ? vendorname : '-'
                            }
                        </Col>
                    </Row>
                    {type === 'vendor' ? null :
                        <Row style={{ marginBottom: 5 }}>
                            <Col className='gutter-row' xs={24} md={9}><label>
                                {
                                    (type === 'letter') ? 'Paper' : 'City'
                                }
                            </label></Col>
                            <Col className='gutter-row' xs={1}>: </Col>
                            <Col className='gutter-row' xs={23} md={14} xl={14}>
                                {
                                    (type === 'letter') ? (papervariant) ? papervariant : '-' :
                                        (memberCity) ? memberCity : '-'
                                }
                            </Col>
                        </Row>
                    }
                    <Row style={{ marginBottom: 5 }}>
                        <Col className='gutter-row' xs={24} md={9}><label>
                            {
                                (type === 'letter') ? 'Paper Variant' : (type === 'member') ? 'Address' : 'Phone'
                            }
                        </label></Col>
                        <Col className='gutter-row' xs={1}>: </Col>
                        <Col className='gutter-row' xs={23} md={14} xl={14}>
                            {
                                (type === 'letter') ? (papername) ? jsUcfirst(papername) : '-' :
                                    (type === 'member') ? (memberAddress) ? memberAddress : '-' :
                                        (phone) ? phone : '-'
                            }
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col className='gutter-row' xs={24} md={9}><label>
                            {
                                (type === 'letter') ? 'Envelope' : (type === 'member') ? 'Postal Code' : 'Email'
                            }
                        </label></Col>
                        <Col className='gutter-row' xs={1}>: </Col>
                        <Col className='gutter-row' xs={23} md={14} xl={14}>
                            {
                                (type === 'letter') ? (envelopevariant) ? envelopevariant : '-' :
                                    (type === 'member') ? (memberPostalCode) ? memberPostalCode : '-' :
                                        (email) ? email : '-'
                            }
                        </Col>
                    </Row>
                    {
                        (type === 'letter') ? <Row style={{ marginBottom: 5 }}>
                            <Col className='gutter-row' xs={24} md={9}><label>Envelope Variant</label></Col>
                            <Col className='gutter-row' xs={1}>: </Col>
                            <Col className='gutter-row' xs={23} md={14} xl={14}>
                                {
                                    (envelopename) ? jsUcfirst(envelopename) : '-'
                                }
                            </Col>
                        </Row> : null
                    }

                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                        <Button htmlType='button' type='primary' label='Ok' onClick={() => { this.props.onClose() }} />
                    </Row>
                </Row>
            </React.Fragment >
        );
    }
}

export default Form.create()(App);