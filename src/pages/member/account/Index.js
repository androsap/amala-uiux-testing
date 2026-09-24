import React from 'react';
import { DetailRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { Form, Table, Divider, Row, Col, Typography } from 'antd';
import moment from 'moment';

const { Column } = Table;
const { Title } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10,
            dataList: [],
            sort: {},
            loading: false
        };
    }

    componentDidMount() {
        document.title = "Manage Account | Loyalty Management System";
        this.getList(this.props.match.params.ID);
    }

    getList(memberid) {
        let url = api.url.memberaccount.detail;
        let data = { memberid };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let dataList = result.sort((a, b) => a.startperiod < b.startperiod);

                this.setState({ dataList, loading: false });
            } else {
                this.setState({
                    responseCode: status.responsecode,
                    responseMessage: status.responsemessage,
                    formrender: false
                });
            }
        });
    }

    render() {
        const { dataList, loading } = this.state;
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>Manage Account</Title>
                    </Col>
                    <Divider />
                </Row>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.membershipname} dataSource={dataList} size="middle" pagination={false} loading={loading} scroll={{ y: 460 }}>
                        <Column title="No" dataIndex="number" key="number" render={(val, row, i) => i + 1} width="5%"/>
                        <Column title="Tier" dataIndex="membertier" key="membertier" render={(val, row) => (val) ? row.membertier.membershipname + ' - ' + row.membertier.tiername : '-'} width="15%"/>
                        <Column title="Award Miles" dataIndex="awardmiles" key="awardmiles" width="10%"/>
                        <Column title="Tier Miles" dataIndex="tiermiles" key="tiermiles" width="10%"/>
                        <Column title="Frequency" dataIndex="frequency" key="frequency" width="10%"/>
                        <Column title="Notes" dataIndex="notes" key="notes" render={(value) => value ? value.length > 20 ? value.substring(0, 20) + '...' : value : '-'}/>
                        <Column title="Start Period" dataIndex="startperiod" key="startperiod" render={(val) => val ? moment(val).format('DD/MM/YYYY') : '-'} width="10%"/>
                        <Column title="End Period" dataIndex="endperiod" key="endperiod" render={(val) => val ? moment(val).format('DD/MM/YYYY') : '-'} width="10%"/>
                        <Column title="Status" dataIndex="active" key="active" render={(val) => (val) ? 'Active' : 'Inactive'}  width="10%"/>
                    </Table>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);