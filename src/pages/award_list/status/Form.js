import React from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Button, Alert } from '../../../components/Base/BaseComponent';
import { Form, Table, Divider, Row, Col, Typography, Card, Spin } from 'antd';
const { Column } = Table;
const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            awardstatus: null,
            dataList: [],
            loading: false
        };
    }

    componentDidMount() {
        document.title = "Award Status | Loyalty Management System";
        this.getList();
    }

    getList() {
        let awardcode = this.props.awardcode;
        let url = api.url.awardmaster.detailstatus;
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let dataList = [
                    { id: 'partner', component: 'Partner', status: (result.partnerstatus === false) ? "Not Completed" : "Completed" },
                    { id: 'price', component: 'Price', status: (result.pricestatus === false) ? "Not Completed" : "Completed" },
                    { id: 'certificatetextid', component: 'Certificate Text ID', status: (result.certificateidtextstatus === false) ? "Not Completed" : "Completed" },
                    { id: 'vouchertext', component: 'Certificate Text', status: (result.vouchertextstatus === false) ? "Not Completed" : "Completed" },
                ]

                let number = 0;
                dataList = dataList.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                this.setState({
                    loading: false,
                    dataList,
                    awardstatus: result.awardstatus
                });
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    updateAction = (e, type) => {
        e.preventDefault();
        //call loader
        this.setState({ loading: true });
        //define parameter
        let awardcode = this.props.awardcode;
        let pricestatus = true;
        let partnerstatus = true;
        let certificateidtextstatus = true;
        let vouchertextstatus = true;
        let message = 'Data has been updated';
        let url = (type === 'activate') ? api.url.awardmaster.activatestatus : api.url.awardmaster.terminatestatus;
        let awardstatus = (type === 'activate') ? 'ACTIVATED' : 'DEACTIVATED';
        let data = { awardcode, pricestatus, partnerstatus, certificateidtextstatus, vouchertextstatus, awardstatus };

        var requestData = SaveRequest(url, data);
        if (requestData) {
            requestData.then((response) => {
                const { responsecode, responsemessage } = response.status;
                if (responsecode.substring(0, 1) === '0') {
                    message = (responsemessage) ? responsemessage : message;
                    Alert.success(message);
                    //after action, check permission
                    this.getList();
                } else {
                    Alert.error(responsemessage);
                }
                //hide loader
                this.setState({ loading: false });
            })
        }
    };

    render() {
        const { menucode, prefixmenuname, permission } = this.props;
        const { usermenu } = permission;
        const { dataList, loading, awardstatus } = this.state;
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>Status </Title>
                    </Col>
                    <Divider />
                </Row>
                {
                    (awardstatus === 'ACTIVATED') ?
                        <Spin spinning={loading}>
                            <Row style={{ marginBottom: 30 }}>
                                <Card style={{ width: '100%' }}>
                                    <Text strong>Status : ACTIVATED</Text>
                                </Card>
                            </Row>
                        </Spin>
                        :
                        <Row style={{ marginBottom: 30 }}>
                            <Table rowKey={record => record.id} dataSource={dataList} size="middle" pagination={false} loading={loading} >
                                <Column title="No" dataIndex="number" key="number" />
                                <Column title="Award Component" dataIndex="component" key="component" />
                                <Column title="Status" dataIndex="status" key="status" />
                            </Table>
                            <Col style={{ marginTop: 10 }}>
                                <Text type="secondary">Warning: All components status must be Completed to enable Activate Award Status</Text>
                            </Col>
                        </Row>
                }
                <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                    {
                        (usermenu[menucode][prefixmenuname + '_UPDATE']) ?
                            (awardstatus === 'ACTIVATED') ?
                                <Button htmlType="button" type="danger" label="Terminate" onClick={(e) => this.updateAction(e, 'terminate')} />
                                :
                                <Button htmlType="button" type="primary" label="Activate" onClick={(e) => this.updateAction(e, 'activate')} />
                            : null
                    }
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);