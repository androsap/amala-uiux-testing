import React from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert } from '../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Table } from 'antd';
const { Title } = Typography;
const { Column } = Table;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false
        }
    }
    componentDidMount() {
        document.title = "Manage Distance Range | Loyalty Management System";
        this.getDetail();
    }

    getDetail = () => {
        this.setState({ isLoaded: true });

        let route = (this.props.route) ? this.props.route : null;
        let bottomrange = (this.props.bottomrange !== undefined) ? this.props.bottomrange : null;
        let upperrange = (this.props.upperrange !== undefined) ? this.props.upperrange : null;
        let airlinecode = (this.props.airlinecode) ? this.props.airlinecode : null;
        let data = { route, bottomrange, upperrange, airlinecode };
        let url = api.url.accrualruleod.getcitypairbydistancerange;
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let number = 0;
                let dataList = response.result.map((obj, key) => { return ({ number: number + (key + 1), ...obj }) });
                this.setState({ dataList, isLoaded: false });
            } else if (status.responsecode !== '9003') {
                Alert.error(response.status.responsemessage);
            }
            this.setState({ isLoaded: false });
        });
    }

    render() {
        const { dataList, isLoaded } = this.state;
        return (
            <React.Fragment>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={4}>Manage Distance Range City Pair - {this.props.distancerangename} </Title>
                    </Col>
                    <Divider />
                </Row>
                <Row style={{ marginBottom: 30 }}>
                    <Table rowKey={record => record.odruleid} dataSource={dataList} size="middle" pagination={false} loading={isLoaded} scroll={{ y: 240 }}>
                        <Column title="No" dataIndex="number" key="number" />
                        <Column title="First Airport Code" dataIndex="originairport" key="originairport" />
                        <Column title="Second Airport Code" dataIndex="destinationairport" key="destinationairport" />
                        <Column title="Airline Code" dataIndex="airlinecode" key="airlinecode" />
                    </Table>
                </Row>
            </React.Fragment>
        );
    }
}

export default Form.create()(App);