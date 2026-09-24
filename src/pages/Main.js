import React from 'react';
import { DetailRequest } from '../utilities/RequestService';
import { api } from '../config/Services';
// import { checkSessionTimeout } from '../utilities/AuthService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import Menu from '../components/Menu';
// import Shortcut from '../components/Shortcut';
// import Footer from '../components/Footer';
// import MainRoter from '../routers/Main.router';


import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { setPermission } from "..//utilities/actions/PermissionAction";

import { getProfile, isLoggedIn } from '../utilities/AuthService';
import LoginRouter from '../routers/Login.router';
import MiniViewRouter from '../routers/MiniView.router';

import { Layout, Spin, Breadcrumb, Menu } from 'antd';

import Error404 from './error/Error404';
import TitleRouter from '../routers/Title.router';
import CountryRouter from '../routers/Country.router';
import StateRouter from '../routers/State.router';
import CityRouter from '../routers/City.router';
import AirportRouter from '../routers/Airport.router';
import CurrencyRouter from '../routers/Currency.router';
import GeneralConfigurationRouter from '../routers/GeneralConfiguration.router';
import RegionRouter from '../routers/Region.router';
import SalutationRouter from '../routers/Salutation.router';
import HobbiesRouter from '../routers/Hobbies.router';
import ReligionRouter from '../routers/Religion.router';
import LanguageRouter from '../routers/Language.router';
import MembershipTypeRouter from '../routers/MembershipType.router';
import MembershipRouter from '../routers/Membership.router';
import TierReasonRouter from '../routers/TierReason.router';
import TierRouter from '../routers/Tier.router';
import TierDurationRouter from '../routers/TierDuration.router';
import ActivityBonusRouter from '../routers/ActivityBonus.router';
import EnrollBonusRouter from '../routers/EnrollBonus.router';
import MileageCriteriaRouter from '../routers/MileageCriteria.router';
import RelationBonusRouter from '../routers/RelationBonus.router';
import CommunicationRouter from '../routers/Communication.router';
import RelationTypeRouter from '../routers/RelationType.router';
import CardInventoryRouter from '../routers/CardInventory.router';
import OBPDataRouter from '../routers/OBPData.router';
import BranchRouter from '../routers/Branch.router';
import TicketOfficeRouter from '../routers/TicketOffice.router';
import DistanceRangeRouter from '../routers/DistanceRange.router';
import EarningMilesRouter from '../routers/EarningMiles.router';
import PartnerGroupRouter from '../routers/PartnerGroup.router';
import CodeShareListRouter from '../routers/CodeShareList.router';
import ProgramRouter from '../routers/Program.router';
import PartnerRouter from '../routers/Partner.router';
import StatementRouter from '../routers/Statement.router';
import AwardTypeRouter from '../routers/AwardType.router';
import PeakSeasonRouter from '../routers/PeakSeason.router';
import AirlineRouter from '../routers/Airline.router';
import FileManagementRouter from '../routers/FileManagement.router';
import ActivityCodeRouter from '../routers/ActivityCode.router';
import CustomTransactionRouter from '../routers/CustomTransaction.router';
import CustomTransactionRoleRouter from '../routers/CustomTransactionRole.router';
import ReceiptCatalogueRouter from '../routers/ReceiptCatalogue.router';
import AccrualRuleODRouter from '../routers/AccrualRuleOD.router';
import AccrualRuleBCRouter from '../routers/AccrualRuleBC.router';
import AccrualRuleNonAirRouter from '../routers/AccrualRuleNonAir.router';
import RetroClaimManagerRouter from '../routers/RetroClaimManager.router';
import RetroClaimApprovalRouter from '../routers/RetroClaimApproval.router';
import UserRouter from '../routers/User.router';
import ParkActivityRouter from '../routers/ParkActivity.router';
import SuspectDuplicateRouter from '../routers/SuspectDuplicate.router';
import MemberIdentityRouter from '../routers/MemberIdentity.router';
import InvalidNameCheckRouter from '../routers/InvalidNameCheck.router';
import MemberRouter from '../routers/Member.router';
import MemberCorporateRouter from '../routers/MemberCorporate.router';
import BlackoutRouter from '../routers/Blackout.router';
import AwardListRouter from '../routers/AwardList.router';
import EnrollmentRouter from '../routers/Enrollment.router';
import EnrollmentCorporateRouter from '../routers/EnrollmentCorporate.router';
import RoleRouter from '../routers/Role.router';
import RedemptionRouter from '../routers/Redemption.router';
import JobCatalogueRouter from '../routers/JobCatalogue.router';
import TransferMileageRouter from '../routers/TransferMileage.router';
import MergingAccountRouter from '../routers/MergingAccount.router';
import TransferMileageLogRouter from '../routers/TransferMileageLog.router';

const { Content, Footer } = Layout;

const router = [
	{ prefixname: "REGION", menucode: "MSDTREGION", component: RegionRouter, path: "region", },
	{ prefixname: "COUNTRY", menucode: "MSDTCOUNTRY", component: CountryRouter, path: "country" },
	{ prefixname: "STATE", menucode: "MSDTSTATE", component: StateRouter, path: "state" },
	{ prefixname: "CITY", menucode: "MSDTCITY", component: CityRouter, path: "city" },
	{ prefixname: "AIRPORT", menucode: "MSDTAIRPORT", component: AirportRouter, path: "airport" },
	{ prefixname: "CURRENCY", menucode: "MSDTCURRENCY", component: CurrencyRouter, path: "currency" },
	{ prefixname: "GENCONF", menucode: "MSDTGENCONFIG", component: GeneralConfigurationRouter, path: "general-configuration" },
	{ prefixname: "TITLE", menucode: "MSDTTITLE", component: TitleRouter, path: "title" },
	{ prefixname: "SALUTATI", menucode: "MSDTSALUTATION", component: SalutationRouter, path: "salutation" },
	{ prefixname: "HOBBIES", menucode: "MSDTHOBBIES", component: HobbiesRouter, path: "hobbies" },
	{ prefixname: "RELIGION", menucode: "MSDTRELIGION", component: ReligionRouter, path: "religion" },
	{ prefixname: "LANGUAGE", menucode: "MSDTLANGUAGE", component: LanguageRouter, path: "language" },
	{ prefixname: "MBSPTYPE", menucode: "TIERMMSHIPTYPE", component: MembershipTypeRouter, path: "membership-type" },
	{ prefixname: "MSHIP", menucode: "TIERMMSHIP", component: MembershipRouter, path: "membership" },
	{ prefixname: "TIREASON", menucode: "TIERMTIREASON", component: TierReasonRouter, path: "tier-reason" },
	{ prefixname: "TIER", menucode: "TIERMTIER", component: TierRouter, path: "tier" },
	{ prefixname: "TIDURATI", menucode: "TIERMTIDURATION", component: TierDurationRouter, path: "tier-duration" },
	{ prefixname: "ACTBONUS", menucode: "TIERMACTBONUS", component: ActivityBonusRouter, path: "activity-bonus" },
	{ prefixname: "ENBONUS", menucode: "TIERMENRBONUS", component: EnrollBonusRouter, path: "enroll-bonus" },
	{ prefixname: "MILCRITE", menucode: "TIERMMILCRITE", component: MileageCriteriaRouter, path: "mileage-criteria" },
	{ prefixname: "RELBONUS", menucode: "TIERMRELBONUS", component: RelationBonusRouter, path: "relation-bonus" },
	{ prefixname: "NEWS", menucode: "NEWS", component: CommunicationRouter, path: "communication" },
	{ prefixname: "RELATYPE", menucode: "RELATYPE", component: RelationTypeRouter, path: "relation-type" },
	{ prefixname: "CARDINVE", menucode: "CARDINVE", component: CardInventoryRouter, path: "card-inventory" },
	{ prefixname: "CARDINVE", menucode: "CARDINVE", component: OBPDataRouter, path: "obp" },
	{ prefixname: "BRANCH", menucode: "BRANCH", component: BranchRouter, path: "branch" },
	{ prefixname: "TICKOFFC", menucode: "TICKOFFC", component: TicketOfficeRouter, path: "ticket-office" },
	{ prefixname: "DSTRANGE", menucode: "DSTRANGE", component: DistanceRangeRouter, path: "distance-range" },
	{ prefixname: "EARMILES", menucode: "EARMILES", component: EarningMilesRouter, path: "earning-miles" },
	{ prefixname: "PARTNGRP", menucode: "PARTNGRP", component: PartnerGroupRouter, path: "partner-group" },
	{ prefixname: "CDESHAR", menucode: "CDESHAR", component: CodeShareListRouter, path: "codeshare-list" },
	{ prefixname: "PRGLOYAL", menucode: "PROGLOYAL", component: ProgramRouter, path: "program" },
	{ prefixname: "PARTNER", menucode: "PARTNER", component: PartnerRouter, path: "partner" },
	{ prefixname: "STATMENT", menucode: "STATMENT", component: StatementRouter, path: "statement" },
	{ prefixname: "AWRDTYPE", menucode: "AWRDTYPE", component: AwardTypeRouter, path: "award-type" },
	{ prefixname: "PEAKSEAS", menucode: "PEAKSEAS", component: PeakSeasonRouter, path: "peak-season" },
	{ prefixname: "AIRLINE", menucode: "AIRLINE", component: AirlineRouter, path: "airline" },
	{ prefixname: "FILE", menucode: "FILE", component: FileManagementRouter, path: "file-management" },
	{ prefixname: "ACTYCODE", menucode: "ACTYCODE", component: ActivityCodeRouter, path: "activity-code" },
	{ prefixname: "CUSTTRAN", menucode: "CUSTTRAN", component: CustomTransactionRouter, path: "custom-transaction" },
	{ prefixname: "CUSTROLE", menucode: "CUSTROLE", component: CustomTransactionRoleRouter, path: "custom-transaction-role" },
	{ prefixname: "RECPCATG", menucode: "RECPCATG", component: ReceiptCatalogueRouter, path: "receipt-catalogue" },
	{ prefixname: "ACCRLOD", menucode: "ACCRLOD", component: AccrualRuleODRouter, path: "accrual-rule-od" },
	{ prefixname: "ACCRLBC", menucode: "ACCRLBC", component: AccrualRuleBCRouter, path: "accrual-rule-bc" },
	{ prefixname: "ACCRLNA", menucode: "ACCRLNA", component: AccrualRuleNonAirRouter, path: "accrual-rule-non-air" },
	{ prefixname: "RETROCL", menucode: "RETROCL", component: RetroClaimManagerRouter, path: "retro-claim-manager" },
	{ prefixname: "RETCAPR", menucode: "RETCAPR", component: RetroClaimApprovalRouter, path: "retro-claim-approval" },
	{ prefixname: "USER", menucode: "USER", component: UserRouter, path: "user" },
	{ prefixname: "PARKACTI", menucode: "PARKACTI", component: ParkActivityRouter, path: "park-activity" },
	{ prefixname: "SUSPDUP", menucode: "SUSPDUP", component: SuspectDuplicateRouter, path: "suspect-duplicate" },
	{ prefixname: "MMBRIDT", menucode: "MMBRIDT", component: MemberIdentityRouter, path: "member-identity" },
	{ prefixname: "INCNAME", menucode: "INCNAME", component: InvalidNameCheckRouter, path: "invalid-name-check" },
	{ prefixname: "MEMBERMG", menucode: "MEMBERMG", component: MemberRouter, path: "member" },
	{ prefixname: "MBERCORP", menucode: "MBERCORP", component: MemberCorporateRouter, path: "member-corporate" },
	{ prefixname: "BLACKOUT", menucode: "BLACKOUT", component: BlackoutRouter, path: "blackout" },
	{ prefixname: "AWARD", menucode: "AWARD", component: AwardListRouter, path: "award-list" },
	{ prefixname: "ENRLINDV", menucode: "ENRLINDV", component: EnrollmentRouter, path: "enrollment" },
	{ prefixname: "ENRLCORP", menucode: "ENRLCORP", component: EnrollmentCorporateRouter, path: "enrollment-corporate" },
	{ prefixname: "ROLE", menucode: "ROLE", component: RoleRouter, path: "role" },
	{ prefixname: "REDEEM", menucode: "REDEEM", component: RedemptionRouter, path: "redemption" },
	{ prefixname: "JOBCTLG", menucode: "JOBCTLG", component: JobCatalogueRouter, path: "job-catalogue" },
	{ prefixname: "TRFMIL", menucode: "TRFMIL", component: TransferMileageRouter, path: "transfer-mileage" },
	{ prefixname: "MERACC", menucode: "MERACC", component: MergingAccountRouter, path: "merging-account" },
	{ prefixname: "MILLOG", menucode: "MILLOG", component: TransferMileageLogRouter, path: "transfer-mileage-log" },
]


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false
		}
	}

	componentWillMount() {
		let rolecode = getProfile().rolecode;
		this.setState({ isLoading: true });
		DetailRequest(api.url.role.retrieveroledetail, { rolecode }).then((reponse) => {
			/* USER MENU MAPPING */
			var usermenu_final = {};
			var menucode = '';
			var functioncode = '';
			var grant = null;
			var responseusermenu = reponse.result.usermenu;
			for (const group_key in responseusermenu) {
				for (const function_key in responseusermenu[group_key]['listmenu']) {
					menucode = responseusermenu[group_key]['listmenu'][function_key]['menucode'];
					if (usermenu_final[menucode] === undefined) { usermenu_final[menucode] = {}; }

					for (const key in responseusermenu[group_key]['listmenu'][function_key]['function']) {
						functioncode = responseusermenu[group_key]['listmenu'][function_key]['function'][key]['functioncode'];
						grant = responseusermenu[group_key]['listmenu'][function_key]['function'][key]['grant'];
						if (usermenu_final[menucode][functioncode] === undefined) { usermenu_final[menucode][functioncode] = null; }
						usermenu_final[menucode][functioncode] = grant;
					}
				}
			}

			/* MAPPING ENROLLMENT ACCESS */
			var enrollmentaccess = {};
			var membershipid = null;
			var responseenrollmembershiplist = reponse.result.enrollmembershiplist;
			for (const key in responseenrollmembershiplist) {
				membershipid = responseenrollmembershiplist[key]['membershipid'];
				grant = responseenrollmembershiplist[key]['grant'];
				enrollmentaccess["MEMBERSHIP_" + membershipid] = grant;
			}
			this.props.setPermission({ usermenu_final, enrollmentaccess });
			this.setState({ isLoading: false });
		});
	}

	/*componentWillMount() {
		let rolecode = getProfile().rolecode;
		this.props.loadPermission(rolecode);
	}*/

	render() {
		const { isLoading } = this.state;
		// var MainRouter = router.map((obj, key) => {
		// 	return (<PrivateRoute key={key} component={obj.component} path={"/" + obj.path} permission={this.props.permission.usermenu} prefixname={obj.prefixname} menucode={obj.menucode} />)
		// });
		var pathname = this.props.location.pathname;
		var modulename = pathname.split("/")[1];

		console.log("this.props MAIN JS", this.props)

		if (isLoggedIn() && modulename !== 'activation' && modulename !== 'mini-view') {
			return (
				// <div className="dashboard">
				// 	<Header />
				// 	<Menu />
				// 	<div className="main-dashboard">
				// 		<div className="main">
				// 			<div className="content">
				// 				<div className="dashboard-content">
				// 					<MainRoter />
				// 					{MainRouter}
				// 				</div>
				// 			</div>
				// 			<Footer />
				// 		</div>
				// 	</div>
				// </div>
				// <Spin spinning={false}>
				// 	<Layout style={{ minHeight: '100vh' }}>
				// 		<Layout>
				// 			<Header />
				// 			<Breadcrumb style={{ margin: '16px 0' }}>
				// 				<Breadcrumb.Item>Home</Breadcrumb.Item>
				// 				<Breadcrumb.Item>List</Breadcrumb.Item>
				// 				<Breadcrumb.Item>App</Breadcrumb.Item>
				// 			</Breadcrumb>
				// 			<Content style={{ padding: '0 50px', marginTop: 64 }}>
				// 				<div style={{ padding: 24, background: '#fff', minHeight: '100%', maxWidth: '100%', boxShadow: '0 1px 15px 1px rgba(69,65,78,.08)' }}>
				// 					<Switch>
				// 						{
				// 							(!isLoading) ? router.map((obj, key) => {
				// 								return (<PrivateRoute {...this.props} key={key} component={obj.component} path={"/" + obj.path} permission={this.props.permission.usermenu} prefixname={obj.prefixname} menucode={obj.menucode} />)
				// 							}) : null
				// 						}
				// 						<Route component={Error404} />
				// 					</Switch>
				// 				</div>
				// 			</Content>
				// 			<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
				// 		</Layout>
				// 	</Layout>
				// </Spin>
				<Spin spinning={isLoading}>
					<Layout>
						<Header />
						<Content style={{ padding: '0 50px', marginTop: 64 }}>
							<Breadcrumb style={{ margin: '16px 0' }}>
								<Breadcrumb.Item>Home</Breadcrumb.Item>
								<Breadcrumb.Item>List</Breadcrumb.Item>
								<Breadcrumb.Item>App</Breadcrumb.Item>
							</Breadcrumb>
							<div style={{ background: '#fff', padding: 24, minHeight: 500 }}>
								<Switch>
									{
										(!isLoading) ? router.map((obj, key) => {
											return (<PrivateRoute {...this.props} key={key} component={obj.component} path={"/" + obj.path} permission={this.props.permission.usermenu} prefixname={obj.prefixname} menucode={obj.menucode} />)
										}) : null
									}
									<Route component={Error404} />
								</Switch>
							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
					</Layout>
				</Spin>
			)
		} else {
			return ((modulename === 'mini-view') ? <MiniViewRouter /> : <LoginRouter />);
		}
	}
}

function PrivateRoute({ component: Component, ...props }) {
	let permission = props.permission;
	let menucode = props.menucode;
	let access = props.prefixname + "_ACCESS";
	return (<Route {...props} render={props => (permission[menucode] !== undefined) ? (permission[menucode][access]) ? <Component {...props} /> : <Error404 {...props} /> : null} />);
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
	// loadPermission: (rolecode) => dispatch(loadPermission(rolecode))
	setPermission: (data) => dispatch(setPermission(data))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));