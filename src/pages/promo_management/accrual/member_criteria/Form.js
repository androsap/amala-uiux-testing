import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, Row, Spin, Divider, Card } from 'antd';

import SetupFormIndex from './SetupFormIndex';
import SetupFormEnrollGender from './SetupFormEnrollGender';
import SetupFormMiles from './SetupFormMiles';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
    };

    componentDidMount() {
        this.setState({ isLoading: true });
        setTimeout(() => { this.setState({ isLoading: false }) }, 500);
    };

    render() {
        const { promocode } = (this.props.datapromo) ? this.props.datapromo[0] : undefined;

        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='membership' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='tier' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='country' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='nationality' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='branch_office_enrollment' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='branch_office_address' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Enroll Channel</Divider>
                        <SetupFormEnrollGender {...this.props} type='enroll_channel' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Gender</Divider>
                        <SetupFormEnrollGender {...this.props} type='gender' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Miles Accumulation</Divider>
                        <SetupFormMiles {...this.props} type='set_miles' promocode={promocode} />
                    </Card>

                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Total Tier Miles Accumulation</Divider>
                        <SetupFormMiles {...this.props} type='total_miles' promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='specific_member' upload={true} promocode={promocode} />
                    </Card>
                    <Card size="small" bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='corporate' upload={true} promocode={promocode} />
                    </Card>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));