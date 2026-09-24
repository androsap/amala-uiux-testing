import React from 'react';
import { api } from '../../../config/Services';
import { DetailRequest, RetrieveRequest, SaveRequest } from '../../../utilities/RequestService';
import { Alert, Button, InputText } from '../../../components/Base/BaseComponent';
import { Row, Col, Typography, Spin, Card, Form, Modal } from 'antd';
import { formatNumber, jsCapitalEachWord } from '../../../utilities/Helpers';
import ErrorGeneral from '../../error/ErrorGeneral';
import moment from 'moment';

const { Title } = Typography;
const { confirm } = Modal;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            responseCode: '0000',
            responseMessage: '',
            formrender: true,
            isLoading: false,
            fieldvalue: {
                amount: null,
                mailingproduct: {},
                inventoryvariant: {},
                orderInformation: {}
            },
        }
    };

    componentDidMount() {
        this.getDetail();
    };

    getDetail = () => {
        this.setState({ isLoading: true });

        const ordercode = this.props.match.params.ordercode
        const url = api.url.memberbuyproduct.retrieve;
        RetrieveRequest(url, { ordercode }).then((response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;

            if (responsecode === '0000' && result) {
                const { mailingproduct, inventoryvariant, ordercode, orderdate, paymenttype, paymentmethod, totalprice, usecouriercode, usepackagingvendor, qty, vendorregion, status,
                    useprintingvendor, printingvendorcode, packagingvendorcode, couriervendorcode, reordernumber, reorderdate, mailingproductcode, currencycode } = result[0] || {};

                const vendorcode = [printingvendorcode, packagingvendorcode, couriervendorcode];
                const vendortype = ['printingvendor', 'packagingvendor', 'couriervendor'];

                vendorcode.map((value, index) => {
                    if (value) {
                        RetrieveRequest(api.url.mailingproduct.vendor.retrieve, { vendorcode: value }).then((response) => {
                            const { status, result } = response;
                            const { responsecode } = status;
                            if (responsecode === '0000') {
                                const { vendorname, vendorcode } = result[0] || {};

                                this.setState({
                                    isLoading: false,
                                    fieldvalue: {
                                        ...this.state.fieldvalue, orderInformation: {
                                            ...this.state.fieldvalue.orderInformation,
                                            [vendortype[index]]: (responsecode === '0000') ? { vendorname, vendorcode } : undefined
                                        }
                                    }
                                });
                            } else Alert.error(status.responsemessage);
                        });
                    } else this.setState({
                        isLoading: false,
                        fieldvalue: {
                            ...this.state.fieldvalue, orderInformation: {
                                ...this.state.fieldvalue.orderInformation, [vendortype[index]]: undefined
                            }
                        }
                    });
                });
                DetailRequest(api.url.memberbuyproduct.getcancelfee, { mailingproductcode, paymenttype, currencycode, feetype: 'CANCEL', }).then((response) => {
                    const { status, result } = response;
                    const { responsecode, responsemessage } = status || {};

                    if (responsecode === '0000') {
                        const { amount } = result || {};
                        this.setState({ fieldvalue: { ...this.state.fieldvalue, amount } });
                    } else Alert.error(responsemessage);
                });

                RetrieveRequest(api.url.mailingproduct.vendor.retrieve, { vendorcode: printingvendorcode }).then((response) => {
                    const { status, result } = response;
                    const { responsecode } = status;

                    if (responsecode === '0000') {
                        const printingvendorname = (result) ? result[0].vendorname : undefined;

                        this.setState({
                            isLoading: false,
                            fieldvalue: {
                                ...this.state.fieldvalue, orderInformation: {
                                    ...this.state.fieldvalue.orderInformation, printingvendorname
                                }
                            }
                        });
                    } else Alert.error(status.responsemessage);
                });

                let orderInformation = {
                    ordercode, orderdate, paymenttype, paymentmethod, totalprice, usecouriercode, usepackagingvendor, useprintingvendor,
                    vendorregion, printingvendorcode, packagingvendorcode, couriervendorcode, status, reordernumber, reorderdate, qty,
                };
                this.setState({
                    isLoading: false,
                    fieldvalue: { ...this.state.fieldvalue, mailingproduct, inventoryvariant, orderInformation, ordercode }
                });
            } else {
                Alert.error(responsemessage);
                this.setState({ isLoading: false, responseCode: responsecode, responseMessage: responsemessage, formrender: false });
            };
        });
    };

    saveAction = async (e) => {
        e.preventDefault();
        const callback = async (input) => {
            this.setState({ isLoading: true });

            const { amount, ordercode } = this.state.fieldvalue || {}
            const { trxid } = input || {};
            const memberid = this.props.match.params.ID;

            let url = api.url.memberbuyproduct.cancel;
            let data = { ordercode };

            SaveRequest(url, data).then(async (response) => {
                const { status, result } = response;
                const { responsecode, responsemessage } = status;
                if (responsecode === '0000' && result) {
                    Alert.success((responsemessage) ? responsemessage : 'New data has been created');
                    this.props.history.push(`/member/form/${memberid}/buy-product`);
                } else {
                    Alert.error(responsemessage);
                    this.setState({ isLoading: false });
                };
            });
        }
        await this.props.form.validateFieldsAndScroll((err, input) => {
            if (!err) {
                confirm({
                    title: 'Are you sure cancel this product?',
                    onOk(e) {
                        return new Promise((resolve, reject) => {
                            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                            callback(input);
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel() { },
                });
            }
        })
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12, pull: 2 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 10 }, md: { span: 8, pull: 2 } }
        };
        const { responseMessage, formrender, isLoading, fieldvalue } = this.state;
        const { mailingproduct, inventoryvariant, orderInformation, amount } = fieldvalue || {};
        const { mailingproductname, producttype } = mailingproduct || {};
        const { inventoryvariantname } = inventoryvariant || {};
        const { ordercode, orderdate, paymenttype, paymentmethod, totalprice, usecouriercode, usepackagingvendor, useprintingvendor,
            printingvendor, packagingvendor, couriervendor, status, reordernumber, reorderdate, qty, currencycode } = orderInformation || {};

        const memberid = this.props.match.params.ID;
        const variantName = (inventoryvariantname) ? jsCapitalEachWord(inventoryvariantname) : '';

        if (formrender) {
            return (
                <React.Fragment>
                    <Spin spinning={isLoading}>

                        <Row style={{ marginBottom: 10 }}>
                            <Col xs={24} xl={20}>
                                <Title level={4}><Button url={`/member/form/${memberid}/buy-product`} shape='circle' icon='left' />  Cancel Product - {mailingproductname} / {variantName}</Title>
                            </Col>
                        </Row>

                        <Form {...formItemLayout} onSubmit={this.saveAction}>
                            <Row style={{ padding: 15 }}>
                                <Card title='Order Information' bordered={false} style={{ boxShadow: '0 1px 2.5px 0 rgba(27,27,27,.1)', marginBottom: '25px', borderRadius: '10px' }} >
                                    <div style={{ background: '#ffffff', height: '100%' }} >
                                        <Col xs={24} md={10}>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Order Code</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(ordercode) ? ordercode : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Order Date</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(orderdate) ? moment(orderdate).format('DD/MM/YYYY') : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Product Type</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(producttype) ? producttype : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Payment Type</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(paymenttype) ? paymenttype : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Payment Method</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(paymentmethod) ? paymentmethod : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Quantity</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(qty) ? qty : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={11}><label>Total Price</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={12}>{(totalprice || totalprice === 0) ? formatNumber(totalprice) : '-'}</Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24} md={14}>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={10}><label>Use Printing Vendor</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={13}>{(useprintingvendor) ? `Yes ${(printingvendor) ? `- ${printingvendor.vendorname}` : ''}` : 'No'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={10}><label>Use Packaging Vendor</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={13}>{(usepackagingvendor) ? `Yes ${(packagingvendor) ? `- ${packagingvendor.vendorname}` : ''}` : 'No'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={10}><label>Use Courier Vendor</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={13}>{(usecouriercode) ? `Yes ${(couriervendor) ? `- ${couriervendor.vendorname}` : ''}` : 'No'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={10}><label>Status</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={13}>{(status) ? status : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={10}><label>Reorder Number</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={13}>{(reordernumber || reordernumber === 0) ? reordernumber : '-'}</Col>
                                            </Row>
                                            <Row style={{ marginBottom: 5 }}>
                                                <Col className='gutter-row' xs={24} md={10}><label>Reorder Date</label></Col>
                                                <Col className='gutter-row' xs={1}>: </Col>
                                                <Col className='gutter-row' xs={23} md={13}>{(reorderdate) ? moment(reorderdate).format('DD/MM/YYYY') : '-'}</Col>
                                            </Row>
                                        </Col>
                                    </div>
                                </Card>
                                <Card title='Cancellation Fee' bordered={false} style={{ boxShadow: '0 1px 2.5px 0 rgba(27,27,27,.1)', marginBottom: '16px', borderRadius: '10px' }} >
                                    <div style={{ background: '#ffffff', height: '100%' }} >
                                        <Row gutter={24}>
                                            <Col className='gutter-row' xs={24} sm={24} md={24} lg={22} xl={22}>
                                                <Form.Item label='Fee'>
                                                    {
                                                        (paymenttype === 'CASH') ?
                                                            <Row>{(currencycode) ? currencycode : ''} <Title level={4} className='ant-form-text' id='totalstandardfee'>{(amount) ? amount : '-'}</Title></Row> :
                                                            <Row><Title level={4} className='ant-form-text' id='totalstandardfee'>{(amount) ? amount : '-'} </Title> Miles</Row>
                                                    }
                                                </Form.Item>
                                                {
                                                    (paymenttype === 'CASH') ? <InputText form={this.props.form} labeltext='Cancellation Transaction Code' datafield='trxid' validationrules={['pattern.number', 'max.10']} maxLength={10} disabled={(status !== `CANCEL`) ? false : true} /> : null
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                                <Row gutter={24} type='flex' justify='center' style={{ marginTop: 30 }}>
                                    <Button htmlType='submit' type='primary' label='Confirm' disabled={(status === 'CANCEL') ? true : false} />
                                </Row>
                            </Row>
                        </Form>
                    </Spin>
                </React.Fragment>
            );
        } else return (<ErrorGeneral {...this.props} message={responseMessage} />);
    };
}

export default Form.create()(App);