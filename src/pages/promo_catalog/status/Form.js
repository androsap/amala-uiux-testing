import React from 'react';
import { DetailRequest, SaveRequest } from '../../../utilities/RequestService';
import { connect } from "react-redux";
import { api } from '../../../config/Services';
import { Alert } from '../../../components/Base/BaseComponent';
import { Form, Divider, Row, Col, Typography, Card, Switch, Spin } from 'antd';
const { Title, Text } = Typography;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoading: false,
            status: null
        };
    }

    componentDidMount() {
        document.title = "Redemption Promo Status | Loyalty Management System";
        this.getList();
    }

    getList() {
        this.setState({ isLoading: true });
        DetailRequest(api.url.redemptionpromo.catalog.detail, { promocatalogcode: this.props.promocatalogcode }).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    status: response.result.active
                });
                this.setState({ isLoading: false })
            }
        });
    }

    onClick = (value) => {
        this.setState({ isLoading: true });
        let status = value;
        this.props.action(value);

        const promocatalogcode = this.props.promocatalogcode
        let url = (value) ? api.url.redemptionpromo.catalog.activate : api.url.redemptionpromo.catalog.deactivate;
        SaveRequest(url, { promocatalogcode: promocatalogcode }).then((response) => {
            const { responsecode, responsemessage } = response.status;
            if (responsecode.substring(0, 1) === '0') {
                let message = 'Data has been updated';
                Alert.success(message);
                this.getList();
            } else {
                Alert.error(responsemessage);
            }
            //hide loader
            this.setState({ status: status, isLoading: false });
        })
    };

    render() {
        const status = this.state.status;
        return (
            <React.Fragment>
                <Col xs={24} xl={22}>
                    <Title level={4}>Change Status</Title>
                </Col>
                <Divider />
                <Spin spinning={this.state.isLoading}>
                    <Row style={{ marginBottom: 30 }}>
                        <Card style={{ width: '100%' }}>
                            <Row type="flex" justify="center">
                                <Text strong>INACTIVE</Text>
                                <Switch style={{ margin: '0 20px' }} checked={status} onClick={this.onClick}></Switch>
                                <Text strong>ACTIVE</Text>
                            </Row>
                        </Card>
                    </Row>
                </Spin>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));
