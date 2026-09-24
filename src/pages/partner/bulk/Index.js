import React, { Component } from 'react';
import { SaveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import { connect } from "react-redux";
import { Alert, Button, ErrorGeneral } from '../../../components/Base/BaseComponent';
import { Form, Row, Spin, Tabs, Typography, Divider } from 'antd';
import TopUp from './topup/Index';
import Report from './report/Index';
import Transaction from './transaction/Index';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            validationrulesvalue: [],
            maxlengthvalue: null,
            partnercode: this.props.location.state ? this.props.location.state.partnercode : null,
            partnername: this.props.location.state ? this.props.location.state.partnername : null,
            fielddisabled: {
                generalfielddisabled: false,
                specialfielddisabled: false
            }
        }
    }

    render() {

        if (this.props.location.state) {

            //render form
            return (
                <Row>
                    <Title level={3}><Button url={'/partner'} shape="circle" icon="left" className="btn-custom-back" /> Manage Partner Bulk Miles {this.state.partnername} [{this.state.partnercode}]</Title>
                    <Divider />
                    <Spin spinning={this.state.isLoading}>
                        <Tabs tabPosition="left" destroyInactiveTabPane={true}>
                            {
                                <TabPane tab="Top up Bulk Miles" key="1">
                                    {
                                        <TopUp {...this.props} />
                                    }
                                </TabPane>
                            }
                            {
                                <TabPane tab="Transaction" key="2">
                                    <Transaction {...this.props} />
                                </TabPane>
                            }
                            {
                                <TabPane tab="Partner Report" key="3">
                                    <Report {...this.props} />
                                </TabPane>
                            }
                        </Tabs>
                    </Spin>
                </Row>
            )
        } else {
            return (<ErrorGeneral {...this.props} message="Partner Code not detected, please do not use tab" />);
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));