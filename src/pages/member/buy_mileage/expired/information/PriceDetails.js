import React from 'react';
import { api } from '../../../../../config/Services';
import { SaveRequest } from '../../../../../utilities/RequestService';
import { Form, Col, Row, Card, Divider, Typography } from 'antd';
import { jsUcfirst } from '../../../../../utilities/Helpers';
import { Alert, Button } from '../../../../../components/Base/BaseComponent';
import moment from 'moment';

const { Text } = Typography;

class App extends React.Component {

    componentDidMount() { }

    handleDownload = async () => {
        await this.setState({ isLoading: true });
        SaveRequest(api.url.memberreceipt.download, { receiptnumber: this.props.fieldvalue.receiptnumber }).then(async (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                window.location.href = response.result.path;
                Alert.success((responsemessage) ? responsemessage : 'Downloading file...');
            } else Alert.error(responsemessage);
            await this.setState({ isLoading: false });
        })
    };

    render() {
        const { fieldvalue, priceDetail, catalogData, status, blockaccrual, actionspage } = this.props;
        const { buymileagename, mileagetype, vatamount, totalamount, pricetype, currencycode, includevat, totalprice, packagemileage, buydate } = priceDetail;
        const { paymentType } = fieldvalue;

        let selectedTransaction = this.props.selectedTransaction;

        if ((actionspage !== 'create') && selectedTransaction.length !== 0) {
            selectedTransaction = selectedTransaction.map(a => a.accountdetails).map(a => Object.values(a)).flat(1);
        }

        const miles = (selectedTransaction.length !== 0) ? selectedTransaction.map(a => a.awardmiles).reduce(function (a, b) { return a + b; }, 0) : [];
        const expired = (selectedTransaction.length !== 0) ? selectedTransaction.map(a => { if (moment((actionspage !== 'create') ? a.expireddatebefore : a.expireddate).isBefore((actionspage !== 'create') ? moment(buydate).subtract(1, 'days') : moment().subtract(1, 'days'))) { return a.awardmiles } return undefined }) : [];
        const extended = (selectedTransaction.length !== 0) ? selectedTransaction.map(a => { if (moment((actionspage !== 'create') ? a.expireddatebefore : a.expireddate).isAfter((actionspage !== 'create') ? moment(buydate).subtract(1, 'days') : moment().subtract(1, 'days'))) { return a.awardmiles } return undefined }) : [];
        const expiredmiles = (expired.length !== 0) ? expired.reduce(function (a, b) { return a + (b || 0); }, 0) : [];
        const extendedmiles = (expired.length !== 0) ? extended.reduce(function (a, b) { return a + (b || 0); }, 0) : [];

        return (
            <React.Fragment>
                <Row>
                    <Card title='Price Details' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: 20 }}>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Catalogue Name</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{buymileagename ? buymileagename : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Mileage Type</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{mileagetype ? jsUcfirst(mileagetype) : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Price Type</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{pricetype ? jsUcfirst(pricetype) : (catalogData && catalogData.pricetype) ? jsUcfirst(catalogData.pricetype) : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Expired Miles</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{(expiredmiles && totalamount) ? `${expiredmiles.toLocaleString('en-US')} Miles` : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Extended Miles</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{(extendedmiles && totalamount) ? `${extendedmiles.toLocaleString('en-US')} Miles` : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Total Miles</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{(miles && totalamount) ? `${miles.toLocaleString('en-US')} Miles` : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Package Mileage</label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{((packagemileage || packagemileage === 0) && totalamount) ? `${packagemileage.toLocaleString('en-US')} Miles` : '-'}</Col>
                        </Row>
                        <Row style={{ marginBottom: 10 }}>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Price </label></Col>
                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{(totalprice) ? ((paymentType === 'CASH') ? `${currencycode} ${totalprice}` : `${totalprice} Miles`) : '-'}</Col>
                        </Row>
                        {(paymentType === 'CASH') ? <Text type='danger' style={{ fontSize: '10px', fontWeight: 'bold', fontStyle: 'italic' }}>{(includevat) ? `* Include VAT ` : `* Exclude VAT `}</Text> : null}
                        <Divider />
                        {(paymentType === 'CASH') ? <Row style={{ marginBottom: 10 }}>
                            <Text strong style={{ display: 'block' }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>VAT</label></Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{(includevat) ? `${currencycode} 0` : ((!includevat && vatamount) ? `${currencycode} ${vatamount}` : '-')}</Col>
                            </Text>
                        </Row> : null}
                        <Row style={{ marginBottom: 10 }}>
                            <Text strong style={{ display: 'block' }}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={10}><label>Total Price</label></Col>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={12} xl={14} style={{ textAlign: 'right' }}>{(totalamount) ? ((paymentType === 'CASH') ? `${currencycode} ${totalamount}` : `${totalamount} Miles`) : '-'}</Col>
                            </Text>
                        </Row>
                        {
                            (status === 'SUCCESS' && !blockaccrual) ? <Button htmlType='button' label='Download Receipt' type='primary' icon='download' block onClick={this.handleDownload} /> : null
                        }
                    </Card>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);