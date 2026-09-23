import React from 'react';
import { Row, Col, Card, Divider } from 'antd';
import { jsUcfirst, jsCapitalEachWord, formatNumber } from '../../utilities/Helpers';
import { api } from '../../config/Services';
import { SaveRequest } from '../../utilities/RequestService';
import { Alert, Button } from '../Base/BaseComponent';


class CatalogMailingDetails extends React.Component {

    handleDownload = async () => {
        let url = api.url.memberreceipt.download
        let custommessage = 'Downloading file...';
        let data = { receiptnumber: this.props.receiptnumber };

        await this.setState({ isLoading: true });
        SaveRequest(url, data).then(async (response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode === '0000') {
                window.location.href = response.result.path;
                let message = (responsemessage) ? responsemessage : custommessage;
                Alert.success(message);

                await this.componentTable.getList();
            } else Alert.error(responsemessage);
            await this.setState({ isLoading: false });
        })
    };

    render() {
        const { mailingproduct, variantdata, price, inventoryvariantid, currencycode, paymenttype } = this.props.priceData || {};
        const { mailingproductname } = mailingproduct || {};
        const { variants } = variantdata || {};
        const { totalamount, totalprice, quantity } = (!price) ? {} : ((Object.keys(price).length !== 0) ? price.calculation : {});
        const { inventoryvariantname } = (variants === undefined) ? {} : (variants.find(val => val.inventoryvariantid === inventoryvariantid) || {});

        return (
            <React.Fragment>
                <Card title='Price Details' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', margin: '20px 0', marginTop: -2,  borderRadius: '10px' }}>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Product Name</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(mailingproductname) ? jsCapitalEachWord(mailingproductname) : '-'}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Variant Name</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(inventoryvariantname) ? jsUcfirst(inventoryvariantname) : '-'}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Payment Type</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(paymenttype) ? jsUcfirst(paymenttype) : '-'}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Price {(quantity) ? `x (${quantity})` : ''}</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>
                            {
                                (totalprice === null) ? '-' : (totalprice === undefined) ? '-' :
                                    `${(paymenttype === 'CASH') ? `${currencycode} ${formatNumber(totalprice)}` : `${formatNumber(totalprice)} Miles`}`
                            }
                        </Col>
                    </Row>
                    <Divider />
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><strong>Total Price (Include Tax)</strong></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>
                            {
                                (totalamount === null) ? '-' : (totalamount === undefined) ? '-' :
                                    `${(paymenttype === 'CASH') ? `${currencycode} ${formatNumber(totalamount)}` : `${formatNumber(totalamount)} Miles`}`
                            }
                        </Col>
                    </Row>
                    {(this.props.receiptnumber) ? <Button htmlType='button' type='primary' label='Download' block={true} disabled={false} onClick={this.handleDownload} /> : null}
                </Card>
            </React.Fragment>
        )
    }
}

export default CatalogMailingDetails;