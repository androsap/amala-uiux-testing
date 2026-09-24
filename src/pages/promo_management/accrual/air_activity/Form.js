import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Spin, Divider, Card } from 'antd';

import SetupFormOriDes from './SetupFormOriDes';
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
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Setup Ticket Issued Date</Divider>
                        <SetupForm {...this.props} type='ticket_issueddate' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Date of Travel</Divider>
                        <SetupForm {...this.props} type='date_of_travel' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <Divider orientation='left' style={{ marginBottom: 15 }}>Retro Period</Divider>
                        <SetupForm {...this.props} type='retro' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='marketing_airline' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='operating_airline' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='marketing_flight_number' upload={true} promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='operating_flight_number' upload={true} promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='marketing_booking_class' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex  {...this.props} type='operating_booking_class' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormOriDes  {...this.props} type='origin_destination' promocode={promocode} />
                    </Card>
                    <Card size='small' bordered={false} style={{ marginBottom: 5 }}>
                        <SetupFormIndex {...this.props} type='tour_code' promocode={promocode} />
                    </Card>
                </Spin>
            </Row>
        );
    };
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));