import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Row, Col, Divider, Typography, Spin, Tabs } from 'antd';
import { RetrieveRequest } from '../../utilities/RequestService';
import { Button } from '../../components/Base/BaseComponent';
import BasicInfo from './basic_info/Form';
import SLA from './sla/Index';

// import AwardDuration from './duration/Form';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            vendorcode: null,
            actionspage: 'create'
        }
    }

    componentDidMount() {
        this.checkPermission();
    }

    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit Vendor';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Vendor';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            this.setState({ id, titlepage, actionspage, specialfielddisabled, generalfielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ responseMessage: "Sorry, your role can't perform this action", formrender: false });
            }
        }
    }

    getDetail(vendorcode) {
        let url = api.url.vendor.retrieve;
        let criteria = { vendorcode };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let vendorcode = (result[0].vendorcode) ? result[0].vendorcode : '';
                let vendorname = (result[0].vendorname) ? result[0].vendorname : '';

                this.setState({ vendorcode, vendorname });
            } else {
                this.setState(
                    {
                        responseCode: status.responsecode,
                        responseMessage: status.responsemessage,
                        formrender: false
                    }
                );
            }
        });
    }


    render() {
        const { vendorcode, actionspage, vendorname } = this.state;

        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}><Button url={'/vendor'} shape="circle" icon="left" />{(actionspage === 'create') ? ' Create Vendor' : ` Edit Vendor ${vendorname}`}</Title>
                    </Col>
                    <Divider />
                </Row>
                {(actionspage === 'create') ? <BasicInfo {...this.props} vendorcode={vendorcode} /> :
                    <Spin spinning={this.state.isLoading}>
                        <Tabs tabPosition="left" destroyInactiveTabPane={true}>
                            <TabPane tab="Basic Info" key="1">
                                <BasicInfo {...this.props} vendorcode={vendorcode} />
                            </TabPane>
                            <TabPane tab="SLA" key="2">
                                <SLA {...this.props} vendorcode={vendorcode} />
                            </TabPane>

                        </Tabs>
                    </Spin>
                }
            </Row>
        )

    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);