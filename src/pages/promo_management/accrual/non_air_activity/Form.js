import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Spin, Divider, Card } from 'antd';

import SetupFormIndex from './SetupFormIndex';
import SetupForm from './SetupForm';

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
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='partner' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='activity_code' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='partner_location_code' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Activity Date</Divider>
                        <SetupForm {...this.props} type='activity_date' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Max Process</Divider>
                        <SetupForm {...this.props} type='max_process' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Minimum Transfer Point</Divider>
                        <SetupForm {...this.props} type='minimum_transfer_point' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Total Miles Accumulation</Divider>
                        <SetupForm {...this.props} type='total_miles_accumulation' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Minimum Transaction</Divider>
                        <SetupForm {...this.props} type='mininum_transaction' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Accumulation Per Month</Divider>
                        <SetupForm {...this.props} type='accumulation_per_month' promocode={promocode} />
                    </Card>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));