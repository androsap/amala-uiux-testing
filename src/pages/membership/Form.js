import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Row, Col, Divider, Typography, Spin, Tabs } from 'antd';
import { RetrieveRequest } from '../../utilities/RequestService';
import BasicInfo from './basic_info/Form';
import Period from './qualification_period/Index';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            membershipid: null,
            actionspage: 'create',
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
            let titlepage = 'Edit Membership';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Membership';
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

    getDetail(membershipid) {
        let url = api.url.membership.list;
        let criteria = { membershipid };
        //call loader
        this.setState({ loading: true });
        RetrieveRequest(url, criteria).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                let membershipid = (result[0].membershipid) ? result[0].membershipid : '';

                this.setState({ membershipid });
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
        const { actionspage, membershipid, titlepage } = this.state;
        return (
            <Row>
                <Row>
                    <Row>
                        <Col xs={24} xl={22}>
                            <Title level={3}>{titlepage} Membership</Title>
                        </Col>
                        <Divider />
                    </Row>
                </Row>
                <Spin spinning={this.state.isLoading}>
                    <Tabs tabPosition="left" destroyInactiveTabPane={true}>
                        <TabPane tab="Basic Info" key="1">
                            {
                                (actionspage === 'create' || membershipid) ? <BasicInfo {...this.props} membershipid={membershipid} /> : null
                            }
                        </TabPane>
                        {
                            (actionspage !== 'create' && membershipid) ?
                                <TabPane tab="Qualification (Upgrade Period)" key="2">
                                    <Period {...this.props} membershipid={membershipid} />
                                </TabPane> : null
                        }
                    </Tabs>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);