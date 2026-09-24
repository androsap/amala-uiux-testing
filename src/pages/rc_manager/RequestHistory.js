import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Form, Row, Col, Divider, Spin, Empty, Table } from 'antd';
import moment from 'moment';
import { jsUcfirst } from '../../utilities/Helpers';

const { Column } = Table;
class RequestHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false,
            responseCode: '0',
            responseMessage: '',
            formrender: true,
            fieldvalue: {
                cardnumber: null,
                ticketname: null,
                operatingairline: null,
                operatingfltnumber: null,
                origin: null,
                destination: null,
                operatingbookingsubclass: null,
                requestdate: null,

            }
        }
    }

    componentDidMount() {
        const { retroclaimid } = this.props;
        this.getDetail(retroclaimid);
    }

    getDetail = (retroclaimid) => {
        let url = api.url.retroclaim.reqinfohistory;
        let data = { retroclaimid };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                let cardnumber = (result.cardnumber) ? result.cardnumber : '-';
                let ticketname = (result.ticketname) ? result.ticketname : '-';
                let operatingairline = (result.operatingairline) ? result.operatingairline : '-';
                let operatingfltnumber = (result.operatingfltnumber) ? result.operatingfltnumber : '-';
                let origin = (result.origin) ? result.origin : '-';
                let destination = (result.destination) ? result.destination : '-';
                let operatingbookingsubclass = (result.operatingbookingsubclass) ? result.operatingbookingsubclass : '-';
                let requestdate = (result.requestdate) ? moment(result.requestdate).format('DD/MM/YYYY') : '-';

                let fieldvalue = {
                    ...this.state.fieldvalue,
                    cardnumber, ticketname, operatingairline, operatingfltnumber, origin, destination,
                    operatingbookingsubclass, requestdate
                };

                this.setState({
                    fieldvalue,
                    dataList: response.result.reqhistorylist,
                    isLoading: false,
                    formrender: true
                });
            } else {
                this.setState({
                    responseCode: response.status.responsecode,
                    responseMessage: response.status.responsemessage,
                    formrender: false,
                    isLoading: false
                });
            }
        })
    }

    render() {
        const { isLoading, responseMessage, formrender, fieldvalue, dataList } = this.state;
        const { cardnumber, ticketname, operatingairline, operatingfltnumber, origin, destination, operatingbookingsubclass, requestdate } = fieldvalue;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 10 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const formItemStyle = {
            style: {
                marginTop: 0,
                marginBottom: 0
            }
        }

        if (formrender) {
            return (
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 10, offset: 2 }} xl={{ span: 10, offset: 2 }}>
                                <Form.Item label="Card Number" {...formItemStyle}>
                                    <span className="ant-form-text">{cardnumber}</span>
                                </Form.Item>
                                <Form.Item label="Name On Ticket" {...formItemStyle}>
                                    <span className="ant-form-text">{ticketname}</span>
                                </Form.Item>
                                <Form.Item label="Airline" {...formItemStyle}>
                                    <span className="ant-form-text">{operatingairline}</span>
                                </Form.Item>
                                <Form.Item label="Flight Number" {...formItemStyle}>
                                    <span className="ant-form-text">{operatingfltnumber}</span>
                                </Form.Item>
                            </Col>
                            <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 10, offset: 2 }} xl={{ span: 10, offset: 2 }}>
                                <Form.Item label="Route" {...formItemStyle}>
                                    <span className="ant-form-text">{origin} - {destination}</span>
                                </Form.Item>
                                <Form.Item label="Subclass" {...formItemStyle}>
                                    <span className="ant-form-text">{operatingbookingsubclass}</span>
                                </Form.Item>
                                <Form.Item label="Request Date " {...formItemStyle}>
                                    <span className="ant-form-text">{requestdate}</span>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Divider>Request History</Divider>
                            <Table rowKey={record => record.partnerbulk} dataSource={dataList} size="middle" pagination={false} loading={isLoading} scroll={{ y: 240 }}>
                                <Column title="No" dataIndex="number" key="number" render={(val, row, i) => i + 1} width="5%" />
                                <Column
                                    title="Request Info"
                                    dataIndex="reqinfo"
                                    key="reqinfo"
                                    width="45%"
                                    render={(value, row) => (
                                        <span>
                                            {(value) ? jsUcfirst(value, "_") : "-"}
                                        </span>
                                    )}
                                />
                                <Column
                                    title="Date"
                                    dataIndex="actiondate"
                                    key="actiondate"
                                    width="10%"
                                    render={(value, row) => (
                                        <span>
                                            {(value) ? moment(value).format("DD/MM/YYYY") : '-'}
                                        </span>
                                    )}
                                />
                                <Column
                                    title="Time"
                                    dataIndex="actiondate"
                                    key="actiondate"
                                    width="10%"
                                    render={(value, row) => (
                                        <span>
                                            {moment(value).format('HH:mm:ss')}
                                        </span>
                                    )}
                                />
                                <Column title="Action by" dataIndex="actionby" key="actionby" width="30%" />
                            </Table>
                        </Row>
                    </Form>
                </Spin>
            )
        } else {
            return (
                <Empty description={responseMessage} />
            )
        }
    }
}

export default RequestHistory;