import React, { Component } from 'react';
import { api } from '../../../config/Services';
import Alert from '../../../components/Alert';
import { RetrieveRequest, DetailRequest } from '../../../utilities/RequestService';
import Breadcrumb from '../../../components/Breadcrumb';
import HeaderMemberProfile from '../../../components/Header/MemberProfile';
import ErrorGeneral from '../../error/ErrorGeneral';
import List from './List';
import MemberCertificates from '../member_certificates/Index';

import { connect } from "react-redux";
import { setData, changePage } from "../../../utilities/actions/RedemptionActions";
import { loadDataMemberHeader } from "../../../utilities/actions/MemberActions";

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formrender: true,
            optionsAwardType: [],
            targetSection: '',
            memberid: null,
            awardsid: 0,
            cardnumber: this.props.match.params.cardnumber,
            tierid: null,
            awardmiles: null,
            countrycode: null,
            branchcode: null,
            showall: false,
            refreshComponent: {
                headerMemberProfile: false
            }
        }
    }

    componentDidMount() {
        document.title = "Redemption | Loyalty Management System";
        // this.getOptionAwardType();
        this.getEligibleRedeem();
        this.props.changePage("PAGE", 'step1');
    }

    getEligibleRedeem() {
        let url = api.url.redemption.eligibleredeem;
        const { cardnumber } = this.state;
        let data = { cardnumber };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result && result.redeemstatus) {
                let redeemstatus = result.redeemstatus;
                let memberid = result.memberid;

                let data = { memberid, cardnumber, redeemstatus };
                //reducer redemption
                this.props.setData("SETDATA", data);

                this.setState({
                    memberid
                }, () => this.getMemberProfile(memberid));
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

    getMemberProfile(memberid) {
        let url = api.url.member.profile;
        let type = 'SUMMARY';

        let data = { memberid, type };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { result } = response;

            let awardmiles = result.memberaccount.awardmiles;
            let tierid = (result.membertiers !== null && result.membertiers !== undefined && result.membertiers[0] !== undefined && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null;

            this.setState({
                tierid, awardmiles, memberid
            }, () => this.getOptionAwardType());
        });
    }

    getCountryCodeFromBranch(branchcode) {
        let url = api.url.brancharea.detail;
        let data = { branchcode };
        //call loader
        this.setState({ loading: true });
        DetailRequest(url, data).then((response) => {
            const { result } = response;

            let countrycode = (result.countrycode) ? result.countrycode : null;
            this.setState({ countrycode });
        });
    }

    getStore() {
        return this.state;
    }

    updatePage(value) {
        this.setState(value);
    }

    refreshHeader(value) {
        this.setState({
            refreshComponent: { ...value }
        });
    }

    getOptionAwardType() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            categorytype: 'asc'
        };
        let criteria = {};
        let url = api.url.awardtype.list;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsAwardType = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.awardtypename;
                    result2['value'] = obj.awardtypecode;
                    return result2;
                })

                this.setState({
                    optionsAwardType
                });
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    //handle reload data
    handleRefresh = () => {
        this.componentDidMount();
    }

    handleGoSection(event, targetSection) {
        this.setState({ targetSection });
    }

    render() {
        const { formrender, refreshComponent } = this.state;
        if (formrender) {
            const { optionsAwardType, memberid, cardnumber, tierid, countrycode, awardmiles, showall } = this.state;
            const tabsAwardType = [];
            const contentAwardType = [];
            for (const field in optionsAwardType) {
                var activeTabs = 'nav-link';
                var activeContent = 'tab-pane fade';
                if (field === '0') {
                    activeTabs = 'nav-link active';
                    activeContent = 'tab-pane fade show active';
                }
                tabsAwardType[field] = <li className="nav-item" key={field}>
                    <a className={activeTabs} data-toggle="pill" href={"#" + field} role="tab" aria-controls="pills-home" aria-selected="true" style={{ wordBreak: 'break-all' }}>{optionsAwardType[field].label}</a>
                </li>;

                contentAwardType[field] = <div key={field} className={activeContent} id={field} role="tabpanel" aria-labelledby="pills-home-tab">
                    <List cardnumber={cardnumber} showall={showall} awardmiles={awardmiles} tierid={tierid} countrycode={countrycode} menuname={optionsAwardType[field].label + optionsAwardType[field].value} awardtypecode={optionsAwardType[field].value} />
                </div>;
            }

            var headerProfile = '';
            if (memberid) {
                headerProfile = <HeaderMemberProfile id={memberid} refresh={refreshComponent.headerMemberProfile} />
            }

            return (
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Redemption" />
                    {headerProfile}
                    <nav className="mt-3">
                        <ul className="list-unstyled nav nav-tabs list-5">
                            <li><a href="#available_awards" className="tab-control2 active" data-toggle="tab"> Available Awards</a></li>
                            <li><a href="#member_certificates" className="tab-control2" data-toggle="tab"> Member Certificates </a></li>
                        </ul>
                    </nav>
                    <div className="tab-entry tab-content">
                        <div className="tab-pane fade show active" id="available_awards">
                            <div className="full-section is-profile" style={{ overflow: "visible" }}>
                                <aside className="left-section">
                                    <div className="left-entry">
                                        <div className="sidebox-menu">
                                            <div className="aside-title">
                                                <h3>Award Type</h3>
                                            </div>
                                            <ul className="nav nav-pills" id="pills-tabContent" role="tablist">
                                                {tabsAwardType}
                                            </ul>
                                        </div>
                                    </div>
                                </aside>
                                <div className="right-section">
                                    <button type="button" className="toggle-option"><i className="mdi mdi-chevron-double-right"></i></button>
                                    <div className="container-fluid">
                                        <div className="tab-content" id="pills-tabContent">
                                            {contentAwardType}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="member_certificates">
                            <MemberCertificates {...this.props} memberid={memberid} cardnumber={cardnumber} />
                        </div>
                    </div>
                </div>
            )
        } else {
            return (<ErrorGeneral message={this.state.responseMessage} />);
        }
    }
}

const mapStateToProps = state => ({
    ...state
});
const mapDispatchToProps = dispatch => ({
    setData: (type, data) => dispatch(setData(type, data)),
    changePage: (type, data) => dispatch(changePage(type, data)),
    loadDataMemberHeader: (id, type) => dispatch(loadDataMemberHeader(id, type))
});
export default connect(mapStateToProps, mapDispatchToProps)(Layout);