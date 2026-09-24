import React from 'react';
import { DetailRequest, SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Button } from '../../components/Base/BaseComponent';
import { Divider, Row, Col, Typography, Table, Spin } from 'antd';
import { Alert } from '../../components/Base/BaseComponent';
import moment from 'moment';

const { Title } = Typography;
const { Column } = Table;
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactioncorrection: [],
            dataList: [],
            isLoading: false,
            memberorigin: [],
            memberdestination: []
        }
    }

    componentDidMount() {
        document.title = "Correction Transaction | Loyalty Management System";
        this.getDetail();
    }

    getDetail = () => {
        const { memberidorigin, memberiddestination } = this.props.location.state;
        this.setState({ isLoading: true });
        DetailRequest(api.url.member.profile, { memberid: memberidorigin }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                let memberorigin = response.result;
                this.setState({ memberorigin });
            }
        });
        DetailRequest(api.url.member.profile, { memberid: memberiddestination }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                let memberdestination = response.result;
                this.setState({ memberdestination });
            }
        });

        DetailRequest(api.url.mergetransactioncorrection.retrievedetail, { memberidorigin, memberiddestination }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                let number = 0;
                let dataList = response.result;
                let transactioncorrection = response.result.transactioncorrection.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });

                this.setState({ dataList, transactioncorrection, isLoading: false });
            } else {
                Alert.error(response.status.responsemessage);
                this.setState({ isLoading: false });
            }
        });
    }

    getCorrection = () => {
        this.setState({ isLoading: true });
        const { transactioncorrection } = this.state;

        SaveRequest(api.url.profileintegration.correction, { mergingid: transactioncorrection[transactioncorrection.length - 1].mergingid }).then((response) => {
            const { status = {} } = response || {};
            if (status.responsecode === '0000') {
                Alert.success(status.responsemessage);
            } else {
                Alert.error(status.responsemessage);
            }
            this.setState({ isLoading: false });
        })
    };

    render() {
        const { isLoading, dataList, transactioncorrection, memberorigin, memberdestination } = this.state;
        const { mergedate, mergedby } = dataList;

        return (
            <React.Fragment>
                <Spin spinning={isLoading}>
                    <Row>
                        <Col>
                            <Title level={3}>Correction Transaction</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Row gutter={24} style={{ margin: 10 }}>
                        <Col className="gutter-row" span={12}>
                            <Col xs={24} xl={7}><label>Origin Member</label></Col>
                            <Col xs={24} xl={17}>: {memberorigin ? `${memberorigin.firstname} ${memberorigin.lastname}` : '-'}</Col>
                            <Col xs={24} xl={7} style={{ marginTop: 10 }}><label>Destination Member</label></Col>
                            <Col xs={24} xl={17} style={{ marginTop: 10 }}>: {memberdestination ? `${memberdestination.firstname} ${memberdestination.lastname}` : '-'}</Col>
                        </Col>
                        <Col className="gutter-row" span={12} style={{ marginBottom: 25 }}>
                            <Col xs={24} xl={7}><label>Merge Date</label></Col>
                            <Col xs={24} xl={17}>: {dataList ? moment(mergedate).format("DD/MM/YYYY") : '-'}</Col>
                            <Col xs={24} xl={7} style={{ marginTop: 10 }}><label>Merge by</label></Col>
                            <Col xs={24} xl={17} style={{ marginTop: 10 }}>: {dataList ? mergedby : '-'}</Col>
                        </Col>
                    </Row>

                    <Table rowKey={record => record.number} dataSource={transactioncorrection} size='middle' pagination={false} >
                        <Column title='No' dataIndex='number' key='No' render={(val, row, i) => i + 1} width='9%' />
                        <Column title='Transaction ID' dataIndex='transactionid' key='Trx Type' width='40%' />
                        <Column title='Award Miles' dataIndex='awardmiles' key='Award Miles' width='17%' />
                        <Column title='Tier Miles' dataIndex='tiermiles' key='Tier Miles' width='17%' />
                        <Column title='Frequency' dataIndex='frequency' key='Frequency' width='17%' />
                    </Table>

                    <Row gutter={24} type='flex' justify='center' style={{ marginTop: 20 }}>
                        <Button htmlType='button' type='primary' size='default' label='Correction' onClick={() => this.getCorrection()} />
                    </Row>
                </Spin>
            </React.Fragment>
        );
    }
}

export default App;