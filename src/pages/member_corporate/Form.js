import React, { Component } from 'react';
import { DetailRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import { connect } from "react-redux";
import { Layout, Form } from 'antd';
import MemberCorporateSider from '../../components/Sider/MemberCorporateSider';
import MemberHeader from '../../components/Header/MemberProfile';
import MemberManagementRouter from '../../routers/MemberManagement.router';
import ErrorGeneral from '../error/ErrorGeneral';

const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            titlepage: 'Create',
            actionspage: 'create',
            responseCode: '0',
            responseMessage: '',
            formrender: false,
            fieldvalue: {
                cardnumber: null,
                tierid: null,
                membertierid: null,
                membershipid: null
            },
            headerdata: {
                cardnumber: null,
                tierid: null,
                membertierid: null,
                awardmiles: 0,
                profile: {}
            },
            fielddisabled: {
                specialfielddisabled: false,
                generalfielddisabled: false
            }
        };
        this.componentMemberHeader = React.createRef();
    }
    checkPermission() {
        let id = this.props.match.params.ID;
        const { menucode, permission, prefixmenuname } = this.props;
        const { usermenu } = permission;
        if (id) {
            let titlepage = 'Edit';
            let actionspage = 'update';
            let specialfielddisabled = true;
            let generalfielddisabled = false;

            if (!usermenu[menucode][prefixmenuname + "_UPDATE"]) {
                titlepage = 'View';
                actionspage = 'view';
                generalfielddisabled = true;
            }
            //change into update page
            let fielddisabled = { specialfielddisabled, generalfielddisabled };
            this.setState({ titlepage, actionspage, fielddisabled });
            this.getDetail(id, actionspage);
        } else {
            if (!usermenu[menucode][prefixmenuname + "_CREATE"]) {
                this.setState({ formrender: false });
            }
        }
    }

    componentDidMount() {
        this.checkPermission();
        this.redirectHomePage();
        let id = this.props.match.params.ID;
        this.componentMemberHeader.retrieveData(id);
        document.title = "Member Management | Loyalty Management System";
    }

    getDetail = (memberid) => {
        let url = api.url.member.profile;
        let type = 'SUMMARY';
        let data = { memberid, type };
        //call loader
        this.setState({ isLoading: true });
        DetailRequest(url, data).then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0' && result) {
                this.setState({
                    headerdata: {
                        ...this.state.headerdata,
                        cardnumber: (result.membercards && result.membercards[0] && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : null,
                        tierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null,
                        membertierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membertierid !== undefined) ? result.membertiers[0].membertierid : null,
                        membershipid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershipid !== undefined) ? result.membertiers[0].membershipid : null,
                        membershiptypeid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershiptypeid !== undefined) ? result.membertiers[0].membershiptypeid : null,
                        awardmiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['awardmiles'] !== undefined && result.memberaccount[0]['awardmiles'] !== null) ? result.memberaccount[0]['awardmiles'] : 0,
                        profile: {
                            corporatecode: (result.corporatedetailinfo && result.corporatedetailinfo.length) ? result.corporatedetailinfo[0].corporatecode : null,
                            firstname: (result.firstname) ? result.firstname : '',
                            lastname: (result.lastname) ? result.lastname : '',
                            username: (result.username) ? result.username : '',
                            email: (result.email) ? result.email : null, 
                            // cardnumber: (result.cardnumber) ? result.cardnumber : null,
                            salutationcode: (result.salutationcode) ? result.salutationcode : null,
                            dateofbirth: (result.dateofbirth) ? result.dateofbirth : null,
                            cardnumber: (result.membercards && result.membercards[0] && result.membercards[0].cardnumber !== undefined) ? result.membercards[0].cardnumber : null,
                            tierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].tierid !== undefined) ? result.membertiers[0].tierid : null,
                            membertierid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membertierid !== undefined) ? result.membertiers[0].membertierid : null,
                            membershipid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershipid !== undefined) ? result.membertiers[0].membershipid : null,
                            membershiptypeid: (result.membertiers && result.membertiers[0] && result.membertiers[0].membershiptypeid !== undefined) ? result.membertiers[0].membershiptypeid : null,
                            awardmiles: (result.memberaccount && result.memberaccount[0] && result.memberaccount[0]['awardmiles'] !== undefined && result.memberaccount[0]['awardmiles'] !== null) ? result.memberaccount[0]['awardmiles'] : 0,
                            membertiers: (result.membertiers && result.membertiers[0]) ? result.membertiers[0] : {},
                            status: (result.status) ? result.status : null,
                        }
                    },
                    formrender: true
                });
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

    redirectHomePage = () => {
        const { permission, match, location } = this.props;
        if (location.pathname === '/member-corporate/form/' + match.params.ID) {
            let menuListMember = [
                { menucode: 'MBERCORP', url: '/profile' },
                { menucode: 'MBRACC', url: '/account' },
                { menucode: 'MBRTIER', url: '/tier' },
                { menucode: 'MBRCRD', url: '/card' },
                { menucode: 'MBRACT', url: '/activity' },
                { menucode: 'MBRTRANS', url: '/transaction' },
                { menucode: 'MBRRECPT', url: '/receipt' },
                { menucode: 'MBALIAS', url: '/alias' },
                { menucode: 'REDEEM', url: '/redemption' },
                { menucode: 'MBNOTES', url: '/notes' },
                { menucode: 'MBCOTOUR', url: '/tour-code' },
                { menucode: 'MBCOTOUR', url: '/travel-coordinator' },
                { menucode: 'MBRMAIL', url: '/mailing' }
            ];
            for (const field in menuListMember) {
                let menucode = menuListMember[field]['menucode'];
                if (permission['usermenu'][menucode][menucode + "_ACCESS"]) {
                    this.props.history.push(match.url + menuListMember[field]['url']);
                    break;
                }
            }
        }
    }

    refreshHeader = () => {
        let id = this.props.match.params.ID;
        this.componentMemberHeader.retrieveData(id);
    }

    render() {
        const { headerdata, formrender, responseCode } = this.state;
        let memberid = this.props.match.params.ID;

        if (responseCode.substring(0, 1) === '0') {
            return (
                <Content style={{ margin: '16px 0', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <MemberHeader ref={(e) => { this.componentMemberHeader = e }} {...this.props} memberid={memberid} />
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <MemberCorporateSider memberid={memberid} {...this.props} />
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            {
                                (formrender) ?
                                    <MemberManagementRouter {...this.props} headerdata={headerdata} refreshHeader={this.refreshHeader} />
                                    : null
                            }
                        </Content>
                    </Layout>
                </Content>
            )
        } else {
            return (
                <Content style={{ margin: '16px 0', minHeight: 500, background: '#fff', boxShadow: '0 1px 15px 1px rgba(69,65,78,.1)' }}>
                    <ErrorGeneral {...this.props} message={this.state.responseMessage} />
                </Content>
            );
        }
    }
}

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(Form.create()(App));