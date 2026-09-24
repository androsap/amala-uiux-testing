import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, Row, Spin } from 'antd';
import { SaveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { Alert, Button } from '../../components/Base/BaseComponent';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            loading: false,
            actionspage: 'create',
            visible: false,
            retroclaimid: this.props.retroclaimid
        }
    }

    onSubmit = () => {
        const { retroclaimid } = this.state
        const { alliancetype, airlinecode, fltnumber } = this.props.codeShare
        const url = (alliancetype === 'SKYTEAM') ? api.url.retroclaim.retroclaimskyteam : (alliancetype === 'INTERNALGA') ? api.url.retroclaim.retroclaimga : api.url.retroclaim.retroclaimstar
        const data = { ...this.props.data, retrofrom: alliancetype, operatingairline: airlinecode, operatingfltnumber: fltnumber }
        SaveRequest(url, data).then((response) => {
            const { status } = response;
            const { responsemessage } = response.status;
            if (status.responsecode === '0000') {
                Alert.success(responsemessage);
            } else {
                Alert.error(responsemessage);
            }
            //hide loader
            this.setState({ isLoading: false });
        })
        setTimeout(() => {
            this.props.history.push({ pathname: (alliancetype === 'INTERNALGA') ? '/retro-claim-ga-manager' : (alliancetype === 'SKYTEAM') ? '/retro-claim-skyteam-manager' : '/retro-claim-staralliance-manager', state: { data: this.props.data, ID: retroclaimid, codeShare: this.props.codeShare } });
            this.props.form.resetFields(['alliancetype', []])
        }, 5500);
    }

    render() {
        //render form
        return (
            <Row>
                <Spin spinning={this.state.isLoading}>
                    <Row gutter={24} type="flex" justify="center" style={{ marginTop: 10 }}>
                        <Button htmlType="button" type="primary" label="OK" onClick={this.onSubmit} />
                    </Row>
                </Spin>
            </Row>
        )
    }
}
const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));