import React from 'react';
import { Row, Col, Card, Alert as AlertAntd } from 'antd';

class VendorBuyProductDetail extends React.Component {

    render() {
        const { vendorInformation } = this.props;
        const { mailingproduct, region, useprintingvendor, usepackagingvendor, usecouriervendor, vendorproduct } = vendorInformation;
        const { producttype } = mailingproduct || {};

        const vendorList = (vendorproduct === undefined || !vendorproduct[0]) ? undefined : (vendorproduct.filter(val => { return val !== null && val !== undefined }));
        const printing = (!useprintingvendor) ? 'No' : (vendorList === undefined || !vendorList[0]) ? 'No Vendor' : (vendorList.find(val => val.vendortype === 'PRINTING') ?
            (vendorList.find(val => val.vendortype === 'PRINTING').vendorname) : 'No Vendor');
        const packaging = (!usepackagingvendor) ? 'No' : (vendorList === undefined || !vendorList[0]) ? 'No Vendor' : (vendorList.find(val => val.vendortype === 'PACKAGING') ?
            (vendorList.find(val => val.vendortype === 'PACKAGING').vendorname) : 'No Vendor');

        const courierList = (vendorList === undefined || !vendorList) ? undefined : (vendorList.filter(val => val.vendortype === 'COURIER'));
        const courier = (!usecouriervendor) ? 'No' : (!region) ? 'Please select courier region' : (!courierList || !region) ? 'No Vendor' : (courierList.length === 0) ? 'No Vendor' : (courierList.find(val => val.allregion === true)) ?
            courierList.find(val => val.allregion === true).vendorname : (courierList.find((val) => { return val.regions.find((e) => { return (e.regioncode === region); }) })) ?
                courierList.find((val) => { return val.regions.find((e) => { return (e.regioncode === region); }) }).vendorname : 'No Vendor';

        return (
            <React.Fragment>
                <Card title='Vendor Information' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', marginBottom: 20, borderRadius: '10px' }}>
                    {(producttype === 'CARD') ? <Row style={{ marginBottom: (useprintingvendor && printing === 'No Vendor') ? 0 : 15 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Printing</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{printing ? printing : '-'}</Col>
                        {(useprintingvendor && printing === 'No Vendor') ? <Col xs={24} style={{ marginTop: 10, marginBottom: 10 }}>
                            <AlertAntd message='Vendor not available for this product' type='warning' closable />
                        </Col> : null}
                    </Row> : null}
                    <Row style={{ marginBottom: (usepackagingvendor && packaging === 'No Vendor') ? 0 : 15 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Packaging</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{packaging ? packaging : '-'}</Col>
                        {(usepackagingvendor && packaging === 'No Vendor') ? <Col xs={24} style={{ marginTop: 10, marginBottom: 10 }}>
                            <AlertAntd message='Vendor not available for this product' type='warning' closable />
                        </Col> : null}
                    </Row>
                    <Row style={{ marginBottom: 5 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Courier</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{courier ? courier : '-'}</Col>
                        {(usecouriervendor && courier === 'No Vendor') ? <Col xs={24} style={{ marginTop: 10, marginBottom: 10 }}>
                            <AlertAntd message='Vendor not available for this product / region' type='warning' closable />
                        </Col> : null}
                    </Row>
                </Card>
            </React.Fragment>
        )
    }
}

export default VendorBuyProductDetail;