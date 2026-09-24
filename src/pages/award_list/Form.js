import React, { Component } from 'react';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Row, Col, Divider, Typography, Spin, Tabs } from 'antd';
import { DetailRequest } from '../../utilities/RequestService';
import BasicInfo from './basic_info/Form';
import Partner from './partner/Form';
import CancelUpdate from './cancel_update/Form';
import EligibleTier from './eligible_tiers/Form';
import EligibleBranch from './eligible_branch/Form';
import PriceDerived from './price/derived/Index';
import FixedNonAirPrice from './price/fixed_nonair/Form';
import CertificateTextId from './certificate_text_id/Form';
import VoucherText from './voucher_text/Index';
import AwardStatus from './status/Form';
// import AwardDuration from './duration/Form';

const { TabPane } = Tabs;
const { Title } = Typography;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            awardcode: null,
            optionsChannel: [],
            statementcode: (this.props.location.state && this.props.location.state.statementcode) ? this.props.location.state.statementcode : null,
            statementname: (this.props.location.state && this.props.location.state.statementname) ? this.props.location.state.statementname : "",
            statementtype: (this.props.location.state && this.props.location.state.statementtype) ? this.props.location.state.statementtype : "",
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
            let titlepage = 'Edit Award';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;
            //role can't update action
            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View Award';
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

    getDetail(awardcode, actionspage) {
        let url = api.url.awardmaster.detailbasicinfo;
        awardcode = decodeURIComponent(awardcode);
        let data = { awardcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode === '0000' && result) {
                const { awardtypecode, pricingby, categorytype, categorycode, awardcode, allcountries, alltiers, allbranch } = result || {};
                const responsebasicprofile = response;

                this.setState({ responsebasicprofile, pricingby, categorytype, awardcode, categorycode, allcountries, alltiers, allbranch, actionspage, awardtypecode });
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
        const { actionspage, awardcode, categorytype, alltiers, pricingby, allbranch, categorycode, awardtypecode } = this.state;
        return (
            <Row>
                <Row>
                    <Col xs={24} xl={22}>
                        <Title level={3}>Award</Title>
                    </Col>
                    <Divider />
                </Row>
                <Spin spinning={this.state.isLoading}>
                    <Tabs tabPosition="left" destroyInactiveTabPane={true}>
                        <TabPane tab="Basic Info" key="1">
                            {
                                (actionspage === 'create' || awardcode) ? <BasicInfo {...this.props} awardcode={awardcode} /> : null
                            }
                        </TabPane>
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Partner" key="2">
                                    <Partner {...this.props} awardcode={awardcode} categorytype={categorytype} />
                                </TabPane> : null
                        }
                        {
                            (actionspage !== 'create' && awardcode && pricingby !=='MANUAL') ?
                                <TabPane tab="Price" key="3">
                                    {
                                        (pricingby === 'FIXED') ?
                                            <FixedNonAirPrice {...this.props} awardcode={awardcode} awardtypecode={awardtypecode} />
                                            : (pricingby === 'DERIVED') ?
                                                <PriceDerived {...this.props} awardcode={awardcode} categorycode={categorycode} awardtypecode={awardtypecode} />
                                                : null
                                    }
                                </TabPane>
                                : null
                        }
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Cancel/Update" key="4">
                                    <CancelUpdate {...this.props} awardcode={awardcode} categorytype={categorytype} />
                                </TabPane> : null
                        }
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Eligible Branch" key="6">
                                    <EligibleBranch {...this.props} awardcode={awardcode} categorytype={categorytype} allbranch={allbranch} refreshMainPage={(e) => this.checkPermission()} />
                                </TabPane>
                                : null
                        }
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Eligible Tiers" key="7">
                                    <EligibleTier {...this.props} awardcode={awardcode} categorytype={categorytype} alltiers={alltiers} refreshMainPage={(e) => this.checkPermission()} />
                                </TabPane>
                                : null
                        }
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Certificate Text ID" key="8">
                                    <CertificateTextId {...this.props} awardcode={awardcode} categorytype={categorytype} />
                                </TabPane>
                                : null
                        }
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Certificate Text" key="9">
                                    <VoucherText {...this.props} awardcode={awardcode} categorycode={categorycode} />
                                </TabPane>
                                : null
                        }
                        {
                            (actionspage !== 'create' && awardcode) ?
                                <TabPane tab="Status" key="10">
                                    <AwardStatus {...this.props} awardcode={awardcode} categorycode={categorycode} />
                                </TabPane>
                                : null
                        }
                        {/* {
                            (actionspage !== 'create' && awardcode && categorycode === 'TRANSFER') ?
                                <TabPane tab="Duration" key="11">
                                    <AwardDuration {...this.props} awardcode={awardcode} />
                                </TabPane> : null
                        } */}
                    </Tabs>
                </Spin>
            </Row>
        )
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);