import React, { Component } from 'react';
import { DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { connect } from "react-redux";
import { Button, Alert, InputText } from '../../../../components/Base/BaseComponent';
import { Form, Row, Spin, Divider, Card, Col, Typography, Empty } from 'antd';
import moment from 'moment';
import { formatNumber } from '../../../../utilities/Helpers';

const { Title, Text } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            // dataList: props.location.state.priceList,
            awardinfo: props.awardinfo,
            quantity: props.quantity,
            price: props.price,
            cardnumber: this.props.cardnumber,
            pricingby: props.pricingby,
            promoList: [],
            promoData: []
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData = (promocode) => {
        const { awardinfo, price, quantity, cardnumber } = this.state;
        const { awardcode, partnercode, startdate, categorytype } = awardinfo || {};
        let url = api.url.redeempromo.getpromo;
        let data = {
            "promocode": promocode,
            "promotype": categorytype,
            "cardnumber": cardnumber,
            "channel": "amalabo",
            "awardcode": awardcode,
            "total": price,
            "checkdate": true,
            "nonairactivity": {
                "partnercode": partnercode,
                "activitydate": moment(startdate).format('YYYY-MM-DD'),
                "quantity": quantity
            }
        };
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status || {};
            if (responsecode) {
                let promoList = result;
                var promoData = [];
                var key = 0;
                for (const field in result) {
                    promoData[key] = {};
                    promoData[key]['discount'] = result[field].discount;
                    promoData[key]['promocode'] = result[field].promocode;
                    promoData[key]['catalogname'] = result[field].catalogname;
                    promoData[key]['discounttype'] = result[field].discounttype;
                    promoData[key]['totaldiscount'] = result[field].totaldiscount;
                    promoData[key]['totalafterdiscount'] = result[field].totalafterdiscount;
                    promoData[key]['enddate'] = (!result[field].unlimitedperiod) ? moment(result[field].enddate).format('DD/MM/YYYY') : "Unlimited";
                    key++;
                }
                this.setState({ promoList, promoData, responsemessage });
            } else {
                Alert.error(responsemessage);
            }
            this.setState({ isLoading: false });
        });
    }

    handleSearchPromo = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, input) => {
            const { criteriapromocode } = input || {};
            this.retrieveData(criteriapromocode);
        });
    }

    handleUsePromo = (totalafterdiscount, promocode, catalogname, discount, discounttype, totaldiscount) => {
        this.props.setStateOfParent(totalafterdiscount, promocode, catalogname, discount, discounttype, totaldiscount);
        this.props.onClose(promocode);
    }

    render() {
        const { promoData, responsemessage } = this.state;
        let promoMapping = null;
        if (promoData.length) {
            promoMapping = promoData.map((val, i) =>
                <Card key={i} bordered={false} style={{ marginBottom: 10, boxShadow: '0 2px 5px 0 rgba(27,27,27,.1)' }}>
                    <Row type="flex" justify="space-around" align="middle">
                        <Col xs={24} sm={24} md={24} lg={20} xl={20}>
                            <Title level={4}>{val.catalogname}</Title>
                            <Text type="secondary">End Period Promo {val.enddate}</Text>
                            <br />
                            <Text>Discount {formatNumber(val.totaldiscount)}</Text>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                            <Button htmlType="button" size="small" label="Use Promo" onClick={() => this.handleUsePromo(val.totalafterdiscount, val.promocode, val.catalogname, val.discount, val.discounttype, val.totaldiscount)} className="btn-custom-dark-blue" />
                        </Col>
                    </Row>
                </Card>
            )
        } else {
            promoMapping = <Row type="flex" justify="space-around" align="middle">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>{responsemessage}</span>} />
            </Row>
        }

        return (
            <Spin spinning={this.state.isLoading}>
                <Row gutter={24}>
                    <Form onSubmit={this.handleSearchPromo}>
                        <Row>
                            <Col className="gutter-row" xs={14} sm={14} md={14} lg={18} xl={18}>
                                <InputText wrapperCol={{ span: 18 }} labelCol={{ span: 6 }} form={this.props.form} labeltext="Promo Code" datafield="criteriapromocode" />
                            </Col>
                            <Col className="gutter-row" xl={4} md={4} sm={4} style={{ lineHeight: '40px' }}>
                                <Button htmlType="submit" label="Check Promo" />
                            </Col>
                        </Row>
                    </Form>

                    <Divider>or</Divider>

                    <Title level={4}>Choose Promo:</Title>
                    <div style={{ background: '#f0f2f5', padding: '20px', overflow: 'scroll', height: '400px', marginBottom: 30 }}>
                        {promoMapping}
                    </div>
                </Row>
            </Spin>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
