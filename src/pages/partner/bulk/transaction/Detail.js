import React from 'react';
import { DetailRequest, RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Link } from 'react-router-dom';
import { Form, Table, Row, Col, Spin, Divider, Card, Typography } from 'antd';
import { Alert } from '../../../../components/Base/BaseComponent';
import moment from 'moment';
import { formatNumber } from '../../../../utilities/Helpers';

const { Column } = Table;
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            partnertrxid: this.props.partnertrxid ? this.props.partnertrxid : null,
            partnercode: this.props.partnercode ? this.props.partnercode : null
        };
    }

    componentDidMount() {
        const { partnercode, partnertrxid } = this.state;
        document.title = "Detail Partner Bulk | Loyalty Management System";
        this.getList(partnercode, partnertrxid);
    }

    getList(partnercode, partnertrxid) {
        let url = api.url.partnertransaction.retrieve;
        let criteria = { partnercode, partnertrxid };
        //call loader
        this.setState({ partnertrxid: true, isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let dataList = result.sort((a, b) => a.activitydate < b.activitydate || (a.activitydate === null) ? 1 : -1);

                this.setState({ dataList, partnertrxid: false, isLoading: false });
            } else {
                Alert.error(status.responsemessage)
                this.setState({ formrender: false, partnertrxid: false, isLoading: false });
            }
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 7 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };

        const { dataList, isLoading } = this.state;
        // console.log(dataList[0].partnercode)
        return (
            <Spin spinning={isLoading}>
                <Form {...formItemLayout}>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={4}>Transaction Detail</Title>
                        </Col>
                        <Divider />
                        <Divider orientation="left">Transaction Information</Divider>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 24, offset: 2 }} xl={{ span: 24, offset: 2 }}>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Transaction Date </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.trxdate ? moment(dataList[0].trxdate).format('DD/MM/YYYY') : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Card Number </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.cardnumber ? dataList[0].cardnumber : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Member Name </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.membername ? dataList[0].membername : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Partner Trx Type </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.partnertrxtype ? dataList[0].partnertrxtype : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Comment </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.comment ? dataList[0].comment : '-'} </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }}>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Ref Code </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.refcode ? dataList[0].refcode : '-'} </Col>
                            </Row>
                        </Col>
                        <Divider orientation="left">Detail Information</Divider>
                        <Col className="gutter-row" xs={24} sm={24} md={24} lg={{ span: 24, offset: 2 }} xl={{ span: 24, offset: 2 }}>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Bulk ID </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.partnerbulkid ? dataList[0].partnerbulkid : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Award Bulk Miles </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.bulkmiles ? formatNumber(dataList[0].bulkmiles) : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Regular Miles </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.regularmiles ? formatNumber(dataList[0].regularmiles) : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Act. Code </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.activitycode ? dataList[0].activitycode : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Created By </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.createdBy ? dataList[0].createdBy : '-'} </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={6} xl={5}><label> Created Date </label></Col>
                                <Col xs={24} sm={24} md={24} lg={6} xl={15}>: {dataList?.[0]?.createdDate ? moment(dataList[0].createdDate).format('DD/MM/YYYY') : '-'} </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Spin >
        );
    }
}

export default Form.create()(App);