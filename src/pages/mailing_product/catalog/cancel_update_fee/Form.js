import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, Row, Tabs } from 'antd';
import { DetailRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import { Alert } from '../../../../components/Base/BaseComponent';

import Cancel from './Form/Cancel';
import Update from './Form/Update';


const { TabPane } = Tabs;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            mailingproduct: {},
            activeTab: 'cancel'
        }
    };

    componentDidMount() {
        document.title = `Cancel / Update Mailing Product | Loyalty Management System`;
        this.checkPermission();
    };

    checkPermission() {
        const mailingproductcode = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (mailingproductcode) {
            let actionspage = 'update';
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                actionspage = 'view';
            }
            this.setState({ actionspage });
            this.getDetail();
        };

        this.setState({ formrender: true });
    };

    handleChange = (activeTab) => {
        this.props.form.resetFields();
        this.getDetail(activeTab);
    };

    getDetail = (activeTab) => {
        const mailingproductcode = this.props.match.params.ID;
        activeTab = (activeTab) ? activeTab : this.state.activeTab;

        DetailRequest(api.url.mailingproduct.detail, { mailingproductcode }).then(async (response) => {
            const { status, result } = response;
            const { responsecode, responsemessage } = status;
            if (responsecode === '0000' && result) {
                let mailingproduct = result;
                await this.setState({ mailingproduct, activeTab });

                if (activeTab) {
                    if (activeTab === 'cancel') {
                        await this.componentCancel.handleReset();
                        await this.componentCancel.getDetail();
                    } else {
                        await this.componentUpdate.handleReset();
                        await this.componentUpdate.getDetail();
                    };
                } else await this.componentCancel.checkPermission();
            } else Alert.error(responsemessage);
        });
    };

    render() {
        const { formrender, mailingproduct } = this.state;

        if (formrender) {
            return (
                <Row>
                    <Tabs defaultActiveKey={'cancel'} onChange={(activeTab) => this.handleChange(activeTab)}>
                        <TabPane tab='Fee of Cancel' key='cancel'>
                            <Cancel {...this.props} ref={(e) => { this.componentCancel = e }} mailingproduct={mailingproduct} getDetail={this.getDetail} />
                        </TabPane>
                        <TabPane tab='Fee of Update' key='update'>
                            <Update {...this.props} ref={(e) => { this.componentUpdate = e }} mailingproduct={mailingproduct} getDetail={this.getDetail} />
                        </TabPane>
                    </Tabs>
                </Row>
            )
        }
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));