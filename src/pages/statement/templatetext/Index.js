import React, { Component } from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import ErrorGeneral from '../../error/ErrorGeneral';
import { connect } from "react-redux";
import { Alert, Button } from '../../../components/Base/BaseComponent';
import { Form, Row, Col, Divider, Typography, Spin, Tabs } from 'antd';
import StatementTextList from './List';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            optionsChannel: [],
            statementcode: (this.props.location.state && this.props.location.state.statementcode) ? this.props.location.state.statementcode : null,
            statementname: (this.props.location.state && this.props.location.state.statementname) ? this.props.location.state.statementname : "",
            statementtype: (this.props.location.state && this.props.location.state.statementtype) ? this.props.location.state.statementtype : "",
        }
    }

    componentDidMount() {
        this.getOptionsChannel();
    }

    getOptionsChannel() {
        let paging = { limit: -1, page: 1 }
        let sort = { channelname: 'asc' };
        let criteria = {};
        let url = api.url.channel.list;
        let column = [];
        var result = RetrieveRequest(url, criteria, paging, column, sort);
        this.setState({ isLoading: true });
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsChannel = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.channelname;
                    result2['value'] = obj.channelid;
                    return result2;
                })

                this.setState({ optionsChannel, isLoading: false });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    render() {
        const { statementcode, statementname, statementtype, optionsChannel } = this.state;
        if (statementcode && statementname && statementtype) {
            return (
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}><Button url={'/statement'} shape="circle" icon="left" /> Template Text - {statementname}</Title>
                        </Col>
                        <Divider />
                    </Row>
                    <Spin spinning={this.state.isLoading}>
                        <Tabs tabPosition="left" destroyInactiveTabPane={true}>
                            {
                                optionsChannel.map((obj, key) => {
                                    return (
                                        <TabPane tab={obj.label ? obj.label.length > 15 ? obj.label.substring(0, 15) + '...' : obj.label : null} key={key}>
                                            <StatementTextList statementcode={statementcode} statementname={statementname} statementtype={statementtype} channelname={obj.label} channelid={obj.value} />
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message="Statement ID not detected, please do not use tab and try again" />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));