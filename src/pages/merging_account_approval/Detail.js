import React from 'react';
import { api } from '../../config/Services';
import { DetailRequest, RetrieveRequest } from '../../utilities/RequestService';
import { Button } from '../../components/Base/BaseComponent';
import { Form, Row, Col, Spin, Divider, Card, Typography, Modal } from 'antd';
import moment from 'moment';

const { Title } = Typography;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            visible: true,
            fieldvalue: {
            },
            beforeData: [],
            afterData: []
        }
    }

    componentDidMount() {
        document.title = 'Details Merge Member Log | Loyalty Management System';
        const { mergeid } = this.props;
        this.getDetail(mergeid);
    };

    getDetail = (mergeid = this.props.match.params.ID) => {
        let url = api.url.profileintegration.retrieve;
        let criteria = { mergeid };
        //call loader
        this.setState({ isLoading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                if (result.length !== 0) {
                    let mastermember = result[0].mastermember ? result[0].mastermember : null;
                    let mergewith = result[0].mergewith ? result[0].mergewith : null;
                    let processeddate = result[0].createdDate ? moment(result[0].createdDate).format('DD-MM-YYYY') : null;
                    let enddate = result[0].processeddate ? moment(result[0].processeddate).format('DD-MM-YYYY') : null;
                    let status = result[0].status ? result[0].status : null;
                    let remarks = result[0].remarks ? result[0].remarks : null;

                    let setValue = { mastermember, mergewith, processeddate, enddate, status, remarks };
                    this.props.form.setFieldsValue(setValue);
                    this.setState({ mastermember, mergewith, processeddate, enddate, status, remarks });
                } else {
                    this.setState({ responseMessage: 'Data not found', formrender: false });
                }
            } else {
                this.setState({ responseCode: status.responsecode, responseMessage: status.responsemessage, formrender: false });
            }
            this.setState({ isLoading: false });
        });
    }

    render() {
        const { isLoading, mastermember, mergewith, processeddate, enddate, status, remarks } = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 8 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
        };

        return (
            <Row>
                <Spin spinning={isLoading}>
                    <Form {...formItemLayout}>
                        <Row>
                            <Row gutter={24}>
                                <Col className='gutter-row' xs={24} sm={24} md={24} lg={24} xl={24} >
                                    <Title level={3}>Details Merge Member Log</Title>
                                    <Divider></Divider>
                                    <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Row>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Member Origin </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {mastermember ? mastermember : '-'} </Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> End Date </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {enddate ? enddate : '-'} </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Member Destination </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {mergewith ? mergewith : '-'}</Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Status </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {status ? status.replace(/_/g, " ") : '-'} </Col>
                                        </Row>
                                        <Row style={{ marginTop: 10 }}>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Start Date </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {processeddate ? processeddate : '-'}</Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}><label> Remarks </label></Col>
                                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>: {remarks ? remarks : '-'} </Col>
                                        </Row>
                                    </Col>
                                </Col>
                            </Row>
                        </Row>
                        <Row gutter={24} type="flex" justify="center" style={{ marginTop: 300 }}>
                            <Button url="/merging-account" htmlType="link" type="default" label="Back" />
                        </Row>
                    </Form>
                </Spin >
            </Row>
        );
    }
}
export default Form.create()(App);