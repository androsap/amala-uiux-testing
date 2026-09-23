import React from 'react';
import { Row, Col, Card } from 'antd';
import { jsUcfirst, jsCapitalEachWord } from '../../utilities/Helpers';

class CatalogMailingDetails extends React.Component {

    render() {
        const { mailingproduct, variantdata, inventoryvariantid } = this.props;
        const { mailingproductname } = mailingproduct || {};
        const { variants } = variantdata || {};
        const { inventoryvariantname, quantity } = (variants === undefined) ? {} : (variants.find(val => val.inventoryvariantid === inventoryvariantid) || {});

        return (
            <React.Fragment>
                <Card title='Catalogue Information' bordered={true} style={{ boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)', margin: '20px 0', marginTop: -2, borderRadius: '10px'  }}>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Product Name</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(mailingproductname) ? jsCapitalEachWord(mailingproductname) : '-'}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Variant Name</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(inventoryvariantname) ? jsUcfirst(inventoryvariantname) : '-'}</Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col className='gutter-row' xs={24} sm={12} xl={10}><label>Variant Stock</label></Col>
                        <Col className='gutter-row' xs={24} sm={12} xl={14} style={{ textAlign: 'right' }}>{(quantity === 0) ? 'Out of Stock' : (quantity) ? `${quantity} Stock` : '-'}</Col>
                    </Row>
                </Card>
            </React.Fragment>
        )
    }
}

export default CatalogMailingDetails;