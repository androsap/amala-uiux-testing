import React from 'react';
import { Row, Col, Form, Card, Spin } from 'antd';
import { api } from '../../../config/Services';
import { Alert, ErrorGeneral } from '../../../components/Base/BaseComponent';
import { RetrieveRequest } from '../../../utilities/RequestService';
import moment from 'moment';

import FormConfirmBuyMileage from '../../member/buy_mileage/Confirmation';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: {}
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    getDetail = () => {
        const { reqdatas, responsedatas } = this.props.resultdata;
        const { memberbuymileageid } = (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ?
            reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
        RetrieveRequest(api.url.memberbuymileage.list, { memberbuymileageid }).then((response) => {
            const { status = {}, result } = response || {};
            const { responsecode, responsemessage } = status || {};
            if (responsecode === '0000' && result) {
                this.setState({ result: result[0] });
            } else {
                Alert.error(responsemessage);
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const { resultdata, formrender, responseMessage } = this.props;
        const { cardnumber, reqdatas, responsedatas, requeststatus, createdBy } = resultdata;
        const { buymileageid, buydate, source, qty, currencycode, memberbuymileageid, memberid, memberprimaryemail, totalamount, catalogueprice, includevat, vatamount } = this.state.result;
        const { paymentmethod, cardissuer, cardidentifier, refnumber, transactioncode } = (responsedatas === undefined || responsedatas === null) ? reqdatas : responsedatas.result === undefined ?
            reqdatas : responsedatas.result.responsedata !== undefined ? responsedatas.result.responsedata : reqdatas;
        const buymileagedetail = this.state.result;

        if (!formrender) {
            return (<ErrorGeneral {...this.props} message={responseMessage} />);
        }
        return (
            <React.Fragment>
                <Spin spinning={((Object.keys(buymileagedetail).length !== 0) && resultdata) ? false : true}>
                    {(requeststatus === 'REVISE' && (Object.keys(buymileagedetail).length !== 0) && resultdata) ?
                        <FormConfirmBuyMileage {...this.props} actionsconfirmationpage={'view'} memberid={memberid} memberbuymileageid={memberbuymileageid} primaryemail={memberprimaryemail} buymileagedetail={buymileagedetail} updateApproval={true} resultApproval={resultdata} /> :
                        <Form {...formItemLayout}>
                            <Row gutter={24} style={{ marginBottom: 30 }}>
                                <Col className="gutter-row" span={24} offset={2}>
                                    <Card title="Buy Mileage Details" bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Buy ID</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(buymileageid) ? buymileageid : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Card Number</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(cardnumber) ? cardnumber : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Buy Date</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(buydate) ? moment(buydate).format("DD/MM/YYYY") : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Issued By</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(createdBy) ? createdBy : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Source</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(source) ? source : '-'}</Col>
                                            </Row>
                                        </Col>
                                        <Col className="gutter-row" span={12}>
                                            <Row>
                                                <Col xs={24} xl={8}><label>Price</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(catalogueprice) ? catalogueprice : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={8}><label>Currency Code</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(currencycode) ? currencycode : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={8}><label>Quantity</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(qty) ? qty : '-'}</Col>
                                            </Row>
                                            {!includevat ? <Row>
                                                <Col xs={24} xl={8}><label>VAT Amount</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(vatamount) ? vatamount : '-'}</Col>
                                            </Row> : ''}
                                            <Row>
                                                <Col xs={24} xl={8}><label>Total Price</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(totalamount) ? ((includevat) ? (<Row>
                                                    {totalamount}<strong style={{ color: 'red' }}>    *Include VAT</strong>
                                                </Row>) : totalamount) : '-'}</Col>
                                            </Row>
                                        </Col>
                                    </Card>
                                </Col>
                                <Col className="gutter-row" span={24} offset={2}>
                                    <Card title="Confirmation Details" bordered={false} className="card-shadow" style={{ marginBottom: 10, width: '85%' }}>
                                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 12 }} xl={{ span: 12 }}>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Card Issuer</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(cardissuer) ? cardissuer : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Card Identifier</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(cardidentifier) ? cardidentifier : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={6}><label>Ref Number</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 16, pull: 1 }}>{(refnumber) ? refnumber : '-'}</Col>
                                            </Row>
                                        </Col>
                                        <Col className="gutter-row" span={12}>
                                            <Row>
                                                <Col xs={24} xl={8}><label>Payment Method</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(paymentmethod) ? paymentmethod : '-'}</Col>
                                            </Row>
                                            <Row>
                                                <Col xs={24} xl={8}><label>Transaction Code</label></Col>
                                                <Col xs={1} xl={2}><label>:</label></Col>
                                                <Col xs={23} xl={{ span: 14, pull: 1 }}>{(transactioncode) ? transactioncode : '-'}</Col>
                                            </Row>
                                        </Col>
                                    </Card>
                                </Col>
                            </ Row >
                        </Form>}
                </Spin>
            </React.Fragment>
        )
    }
}

export default App;