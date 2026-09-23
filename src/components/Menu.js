import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Menu, Modal, Icon } from 'antd';
import { logout, getProfile } from '../utilities/AuthService';

const { SubMenu } = Menu;
const { confirm } = Modal;

const relationManagementGroup = [
	{ menucode: 'RELATYPE', accesscode: 'RELATYPE_ACCESS' }
];

const approvalListGroup = [
	{ menucode: 'APPRBML', accesscode: 'APPRBML_ACCESS' },
	{ menucode: 'APPRRED', accesscode: 'APPRRED_ACCESS' },
	{ menucode: 'APPRUPD', accesscode: 'APPRUPD_ACCESS' },
	{ menucode: 'APPRCAN', accesscode: 'APPRCAN_ACCESS' }
];

const approvalMember = [
	...approvalListGroup,
	{ menucode: 'MYAPPR', accesscode: 'MYAPPR_ACCESS' },
];

const approvalCorporate = [
	{ menucode: 'APPRCORP', accesscode: 'APPRCORP_ACCESS' },
];

const approvalGroup = [
	...approvalMember, approvalCorporate
];

const basicConfigurationGroup = [
	{ menucode: 'MSDTREGION', accesscode: 'REGION_ACCESS' },
	{ menucode: 'MSDTCOUNTRY', accesscode: 'COUNTRY_ACCESS' },
	{ menucode: 'MSDTSTATE', accesscode: 'STATE_ACCESS' },
	{ menucode: 'MSDTCITY', accesscode: 'CITY_ACCESS' },
	{ menucode: 'MSDTAIRPORT', accesscode: 'AIRPORT_ACCESS' },
	{ menucode: 'MSDTCURRENCY', accesscode: 'CURRENCY_ACCESS' },
	{ menucode: 'MSDTGENCONFIG', accesscode: 'GENCONF_ACCESS' },
	{ menucode: 'JOBCTLG', accesscode: 'JOBCTLG_ACCESS' }
];

const memberConfigurationGroup = [
	{ menucode: 'MSDTTITLE', accesscode: 'TITLE_ACCESS' },
	{ menucode: 'MSDTSALUTATION', accesscode: 'SALUTATI_ACCESS' },
	{ menucode: 'MSDTHOBBIES', accesscode: 'HOBBIES_ACCESS' },
	{ menucode: 'MSDTRELIGION', accesscode: 'RELIGION_ACCESS' },
	{ menucode: 'MSDTLANGUAGE', accesscode: 'LANGUAGE_ACCESS' }
];

const branchManagementGroup = [
	{ menucode: 'BRANCH', accesscode: 'BRANCH_ACCESS' },
	{ menucode: 'TICKOFFC', accesscode: 'TICKOFFC_ACCESS' },
];

const partnerManagementGroup = [
	{ menucode: 'AIRLINE', accesscode: 'AIRLINE_ACCESS' },
	{ menucode: 'CDESHAR', accesscode: 'CDESHAR_ACCESS' },
	{ menucode: 'PROGLOYAL', accesscode: 'PRGLOYAL_ACCESS' },
	{ menucode: 'PARTNER', accesscode: 'PARTNER_ACCESS' },
	{ menucode: 'PARTNGRP', accesscode: 'PARTNGRP_ACCESS' },
	{ menucode: 'PARTBULK', accesscode: 'PARTBULK_ACCESS' },
	{ menucode: 'EARMILES', accesscode: 'EARMILES_ACCESS' },
	{ menucode: 'DSTRANGE', accesscode: 'DSTRANGE_ACCESS' }
];

const tierBonusGroup = [
	{ menucode: 'TIERMACTBONUS', accesscode: 'ACTBONUS_ACCESS' },
	{ menucode: 'TIERMENRBONUS', accesscode: 'ENBONUS_ACCESS' },
	{ menucode: 'TIERMRELBONUS', accesscode: 'RELBONUS_ACCESS' },
	{ menucode: 'TIERMFACTBONUS', accesscode: 'FACBONUS_ACCESS' },
	{ menucode: 'BDAYBON', accesscode: 'BDAYBON_ACCESS' },
	{ menucode: 'PROMBON', accesscode: 'PROMBON_ACCESS' },
	{ menucode: 'TIERBON', accesscode: 'TIERBON_ACCESS' },
	{ menucode: 'REFFBON', accesscode: 'REFFBON_ACCESS' }
];

const tierManagementGroup = [
	...tierBonusGroup,
	{ menucode: 'TIERMMSHIPTYPE', accesscode: 'MBSPTYPE_ACCESS' },
	{ menucode: 'TIERMMSHIP', accesscode: 'MSHIP_ACCESS' },
	{ menucode: 'TIERMTIREASON', accesscode: 'TIREASON_ACCESS' },
	{ menucode: 'TIERMTIER', accesscode: 'TIER_ACCESS' },
	{ menucode: 'TIERMTIDURATION', accesscode: 'TIDURATI_ACCESS' },
	{ menucode: 'TIERMMILCRITE', accesscode: 'MILCRITE_ACCESS' },
];

const orderManagementGroup = [
	{ menucode: 'DLVRD', accesscode: 'DLVRD_ACCESS' },
	{ menucode: 'PCKD', accesscode: 'PCKD_ACCESS' },
	{ menucode: 'PRTD', accesscode: 'PRTD_ACCESS' },
	{ menucode: 'REORDER', accesscode: 'REORDER_ACCESS' },
	{ menucode: 'RETURN', accesscode: 'RETURN_ACCESS' },
];

const mailingProductGroup = [
	...orderManagementGroup,
	{ menucode: 'PRMCT', accesscode: 'PRMCT_ACCESS' },
	{ menucode: 'INVSYS', accesscode: 'INVSYS_ACCESS' },
	{ menucode: 'LETTER', accesscode: 'LETTER_ACCESS' },
];

const dataManagementGroup = [
	...basicConfigurationGroup, ...memberConfigurationGroup, ...tierManagementGroup, ...partnerManagementGroup, ...branchManagementGroup, mailingProductGroup,
	{ menucode: 'CARDINVE', accesscode: 'CARDINVE_ACCESS' }
];

const redemptionPromoGroup = [
	{ menucode: 'PROMCT', accesscode: 'PROMCT_ACCESS' },
	{ menucode: 'CRITYPE', accesscode: 'CRITYPE_ACCESS' },
	{ menucode: 'PROFILE', accesscode: 'PROFILE_ACCESS' }
]

const awardManagementgroup = [
	...redemptionPromoGroup,
	{ menucode: 'AWRDTYPE', accesscode: 'AWRDTYPE_ACCESS' },
	{ menucode: 'AWARD', accesscode: 'AWARD_ACCESS' },
	{ menucode: 'PEAKSEAS', accesscode: 'PEAKSEAS_ACCESS' },
	{ menucode: 'BLACKOUT', accesscode: 'BLACKOUT_ACCESS' },
]

const userManagementGroup = [
	{ menucode: 'USER', accesscode: 'USER_ACCESS' },
	{ menucode: 'USERLOG', accesscode: 'USERLOG_ACCESS' },
	{ menucode: 'ROLE', accesscode: 'ROLE_ACCESS' }
]

const retroManagementGroup = [
	{ menucode: 'RETROCL', accesscode: 'RETROCL_ACCESS' },
	{ menucode: 'RETCAPR', accesscode: 'RETCAPR_ACCESS' }
]

const accrualAirGroup = [
	{ menucode: 'ACCRLOD', accesscode: 'ACCRLOD_ACCESS' },
	{ menucode: 'ACCRLBC', accesscode: 'ACCRLBC_ACCESS' },
	{ menucode: 'ACCRLRL', accesscode: 'ACCRLRL_ACCESS' }
]

const accrualGroup = [
	...accrualAirGroup,
	{ menucode: 'ACCRLNA', accesscode: 'ACCRLNA_ACCESS' },
	{ menucode: 'ACCRLPR', accesscode: 'ACCRLPR_ACCESS' }
]

const buyMileageGroup = [
	{ menucode: 'BUYMILCT', accesscode: 'BUYMILCT_ACCESS' },
	{ menucode: 'BUYMILPR', accesscode: 'BUYMILPR_ACCESS' }
]

const activityCodeGroup = [
	{ menucode: 'ACTYCODE', accesscode: 'ACTYCODE_ACCESS' },
	{ menucode: 'ACCLMTNA', accesscode: 'ACCLMTNA_ACCESS' },
]

const catalogueGroup = [
	...accrualGroup,
	...retroManagementGroup,
	...buyMileageGroup,
	...activityCodeGroup,
	{ menucode: 'RECPCATG', accesscode: 'RECPCATG_ACCESS' },
	{ menucode: 'CUSTTRAN', accesscode: 'CUSTTRAN_ACCESS' },
	{ menucode: 'CUSTROLE', accesscode: 'CUSTROLE_ACCESS' },
	{ menucode: 'NEWS', accesscode: 'NEWS_ACCESS' },
	{ menucode: 'STATMENT', accesscode: 'STATMENT_ACCESS' },
	{ menucode: 'FILE', accesscode: 'FILE_ACCESS' },
	{ menucode: 'AIRLINE', accesscode: 'AIRLINE_ACCESS' }
]

const accrualReport = [
	{ menucode: 'REPARAC', accesscode: 'REPARAC_ACCESS' },
	{ menucode: 'REPNAAC', accesscode: 'REPNAAC_ACCESS' }
]

const awardReport = [
	{ menucode: 'REPARAW', accesscode: 'REPARAW_ACCESS' },
	{ menucode: 'REPNAAW', accesscode: 'REPNAAW_ACCESS' }
]

const dashboardReport = [
	{ menucode: 'REPACCT', accesscode: 'REPACCT_ACCESS' },
	{ menucode: 'RDASEXE', accesscode: 'RDASEXE_ACCESS' },
	{ menucode: 'RDASPER', accesscode: 'RDASPER_ACCESS' },
	{ menucode: 'RDASBIZ', accesscode: 'RDASBIZ_ACCESS' },
	{ menucode: 'REPFSUS', accesscode: 'REPFSUS_ACCESS' }
]

const cobrandReport = [
	{ menucode: 'REPCBAC', accesscode: 'REPCBAC_ACCESS' },
	{ menucode: 'REPCBSU', accesscode: 'REPCBSU_ACCESS' },
	{ menucode: 'REPCBTR', accesscode: 'REPCBTR_ACCESS' },
	{ menucode: 'REPCBFT', accesscode: 'REPCBFT_ACCESS' },
]

const reportGroup = [
	...accrualReport,
	...awardReport,
	...dashboardReport,
	...cobrandReport,
	{ menucode: 'REPRDP', accesscode: 'REPRDP_ACCESS' },
	{ menucode: 'REPCUST', accesscode: 'REPCUST_ACCESS' },
	{ menucode: 'REPMMBR', accesscode: 'REPMMBR_ACCESS' },
	{ menucode: 'REPBUYML', accesscode: 'REPBUYML_ACCESS' },
	{ menucode: 'REPDOWN', accesscode: 'REPDOWN_ACCESS' },
]

const memberManagementGroup = [
	{ menucode: 'REDEEM', accesscode: 'REDEEM_ACCESS' },
	{ menucode: 'MEMBERMG', accesscode: 'MEMBERMG_ACCESS' },
	{ menucode: 'MBERCORP', accesscode: 'MBERCORP_ACCESS' },
	{ menucode: 'ENRLINDV', accesscode: 'ENRLINDV_ACCESS' },
	{ menucode: 'ENRLCORP', accesscode: 'ENRLCORP_ACCESS' },
	{ menucode: 'PARKACTI', accesscode: 'PARKACTI_ACCESS' },
	{ menucode: 'INCNAME', accesscode: 'INCNAME_ACCESS' },
	{ menucode: 'SUSPDUP', accesscode: 'SUSPDUP_ACCESS' },
	// { menucode: 'MERACC', accesscode: 'MERACC_ACCESS' },
	{ menucode: 'TRFMIL', accesscode: 'TRFMIL_ACCESS' },
	{ menucode: 'MMBRIDT', accesscode: 'MMBRIDT_ACCESS' },
	{ menucode: 'BMEMMGT', accesscode: 'BMEMMGT_ACCESS' }
]

const vendorManagementGroup = [
	{ menucode: 'VENDOR', accesscode: 'VENDOR_ACCESS' },
	{ menucode: 'VENREG', accesscode: 'VENREG_ACCESS' }
]


const pasGroup = [
	{ menucode: 'DSMON', accesscode: 'DSMON_ACCESS' },
	{ menucode: 'DSCHCK', accesscode: 'DSCHCK_ACCESS' }
]

class App extends React.Component {
	clickLogout() {
		confirm({
			title: 'Are you sure want to logout?',
			onOk() { logout() },
			onCancel() { },
		});
	}

	render() {
		let permissionList = this.props.permission.usermenu;
		let isPartner = (getProfile().partnercode) ? true : false;
		let isBOD = (getProfile().rolename === 'BOD');

		return (
			<Menu theme="light" mode="horizontal" defaultSelectedKeys={(isBOD) ? ['MMBR:2'] : ['1']} style={{ lineHeight: '64px', textAlign: 'right' }}>
				<Menu.Item key="1" hidden={isBOD}><Link to={"/"}>Dashboard</Link> </Menu.Item>
				<Menu.Item key="PTOF" hidden={!isPartner}><Link to={"/voucher-verification"}>Voucher Verification</Link></Menu.Item>
				<SubMenu title="Member Management" className={_checkPermissionMenuGroup(permissionList, memberManagementGroup)}>
					<Menu.Item key="MMBR:2" className={_checkPermission(permissionList, 'BMEMMGT', 'BMEMMGT_ACCESS')} hidden={!isBOD}><Link to={"/member"}>Member Data</Link></Menu.Item>
					<Menu.Item key="MMBR:2" className={_checkPermission(permissionList, 'MEMBERMG', 'MEMBERMG_ACCESS')} hidden={isBOD}><Link to={"/member"}>Member Data</Link></Menu.Item>
					<Menu.Item key="MMBR:3" className={_checkPermission(permissionList, 'MBERCORP', 'MBERCORP_ACCESS')}><Link to={"/member-corporate"}>Member Corporate</Link></Menu.Item>
					<Menu.Item key="MMBR:5" className={_checkPermission(permissionList, 'ENRLCORP', 'ENRLCORP_ACCESS')}><Link to={"/enrollment-corporate"}>Corporate Enrollment</Link></Menu.Item>
					<Menu.Item key="MMBR:4" className={_checkPermission(permissionList, 'ENRLINDV', 'ENRLINDV_ACCESS')}><Link to={"/enrollment"}>Individual Enrollment</Link></Menu.Item>
					<Menu.Item key="MMBR:6" className={_checkPermission(permissionList, 'PARKACTI', 'PARKACTI_ACCESS')}><Link to={"/park-activity"}>Park Activity</Link></Menu.Item>
					<Menu.Item key="MMBR:7" className={_checkPermission(permissionList, 'INCNAME', 'INCNAME_ACCESS')}><Link to={"/invalid-name-check"}>Invalid Name Check</Link></Menu.Item>
					<SubMenu title="Retro Claim" className={_checkPermissionMenuGroup(permissionList, retroManagementGroup)}>
						<SubMenu title="Retro Claim Management" style={{ width: "216px" }}>
							<Menu.Item key="RETROCL:1" className={_checkPermission(permissionList, 'RETROCL', 'RETROCL_ACCESS')}><Link to={"/retro-claim-ga-manager"}>Garuda Indonesia</Link></Menu.Item>
							<Menu.Item key="RETROCL:2" className={_checkPermission(permissionList, 'RETROCL', 'RETROCL_ACCESS')}><Link to={"/retro-claim-skyteam-manager"}>SkyTeam</Link></Menu.Item>
							<Menu.Item key="RETROCL:3" className={_checkPermission(permissionList, 'RETROCL', 'RETROCL_ACCESS')}><Link to={"/retro-claim-staralliance-manager"}>Star Alliance</Link></Menu.Item>
							<Menu.Item key="RETROCL:4" className={_checkPermission(permissionList, 'RETROCL', 'RETROCL_ACCESS')}><Link to={"/retro-claim-oneworld-manager"}>Oneworld</Link></Menu.Item>
						</SubMenu>
						<SubMenu title="Retro Claim Approval">
							<Menu.Item key="RETCAPR:1" className={_checkPermission(permissionList, 'RETCAPR', 'RETCAPR_ACCESS')}><Link to={"/retro-claim-ga-approval"}>Garuda Indonesia</Link></Menu.Item>
							<Menu.Item key="RETCAPR:2" className={_checkPermission(permissionList, 'RETCAPR', 'RETCAPR_ACCESS')}><Link to={"/retro-claim-skyteam-approval"}>SkyTeam</Link></Menu.Item>
							<Menu.Item key="RETCAPR:3" className={_checkPermission(permissionList, 'RETCAPR', 'RETCAPR_ACCESS')}><Link to={"/retro-claim-staralliance-approval"}>Star Alliance</Link></Menu.Item>
							<Menu.Item key="RETCAPR:4" className={_checkPermission(permissionList, 'RETCAPR', 'RETCAPR_ACCESS')}><Link to={"/retro-claim-oneworld-approval"}>Oneworld</Link></Menu.Item>
						</SubMenu>
					</SubMenu>
					<Menu.Item key="MMBR:8" className={_checkPermission(permissionList, 'SUSPDUP', 'SUSPDUP_ACCESS')}><Link to={"/suspect-duplicate"}>Suspect Duplicate</Link></Menu.Item>
					{/* <Menu.Item key="MMBR:9" className={_checkPermission(permissionList, 'MERACC', 'MERACC_ACCESS')}><Link to={"/merging-account"}>Merging Account</Link></Menu.Item> */}
					<Menu.Item key="MMBR:10" className={_checkPermission(permissionList, 'TRFMIL', 'TRFMIL_ACCESS')}><Link to={"/transfer-mileage"}>Transfer Mileage</Link></Menu.Item>
					<Menu.Item key="MMBR:11" className={_checkPermission(permissionList, 'MMBRIDT', 'MMBRIDT_ACCESS')}><Link to={"/member-identity"}>Member Identity</Link></Menu.Item>
				</SubMenu>
				<SubMenu title="Approval" className={_checkPermissionMenuGroup(permissionList, approvalGroup)}>
					<SubMenu title="Member" className={_checkPermissionMenuGroup(permissionList, approvalMember)}>
						<Menu.Item key="APPRV:1" className={_checkPermission(permissionList, 'MYAPPR', 'MYAPPR_ACCESS')}><Link to={"/my-approval"}>My Approval</Link></Menu.Item>
						<SubMenu title="Approval List" className={_checkPermissionMenuGroup(permissionList, approvalListGroup)}>
							<Menu.Item key="APPLST:1" className={_checkPermission(permissionList, 'APPRBML', 'APPRBML_ACCESS')}><Link to={"/approval-buy-mileage"}>Buy Mileage</Link></Menu.Item>
							<Menu.Item key="APPLST:2" className={_checkPermission(permissionList, 'APPRRED', 'APPRRED_ACCESS')}><Link to={"/approval-redemption"}>Redemption</Link></Menu.Item>
							<Menu.Item key="APPLST:3" className={_checkPermission(permissionList, 'APPRUPD', 'APPRUPD_ACCESS')}><Link to={"/approval-redemption-update"}>Redemption Update</Link></Menu.Item>
							<Menu.Item key="APPLST:4" className={_checkPermission(permissionList, 'APPRCAN', 'APPRCAN_ACCESS')}><Link to={"/approval-redemption-cancel"}>Redemption Cancel</Link></Menu.Item>
						</SubMenu>
					</SubMenu>
					<SubMenu title="Corporate" className={_checkPermissionMenuGroup(permissionList, approvalCorporate)}>
						<Menu.Item key="APPCRP:1" className={_checkPermission(permissionList, 'APPRCORP', 'APPRCORP_ACCESS')}><Link to={"/approval-corporate-travelco"}>Travel Coordinator</Link></Menu.Item>
						<Menu.Item key="APPCRP:2" className={_checkPermission(permissionList, 'APPRCORP', 'APPRCORP_ACCESS')}><Link to={"/approval-corporate-employee"}>Employee</Link></Menu.Item>
					</SubMenu>
				</SubMenu>
				<SubMenu title="Data Management" className={_checkPermissionMenuGroup(permissionList, dataManagementGroup)}>
					<SubMenu title="Basic Configuration" className={_checkPermissionMenuGroup(permissionList, basicConfigurationGroup)}>
						<Menu.Item key="BSCC:1" className={_checkPermission(permissionList, 'MSDTREGION', 'REGION_ACCESS')}><Link to={"/region"}>Region</Link></Menu.Item>
						<Menu.Item key="BSCC:2" className={_checkPermission(permissionList, 'MSDTCOUNTRY', 'COUNTRY_ACCESS')}><Link to={"/country"}>Country</Link></Menu.Item>
						<Menu.Item key="BSCC:3" className={_checkPermission(permissionList, 'MSDTSTATE', 'STATE_ACCESS')}><Link to={"/state"}>State</Link></Menu.Item>
						<Menu.Item key="BSCC:4" className={_checkPermission(permissionList, 'MSDTCITY', 'CITY_ACCESS')}><Link to={"/city"}>City</Link></Menu.Item>
						<Menu.Item key="BSCC:5" className={_checkPermission(permissionList, 'MSDTAIRPORT', 'AIRPORT_ACCESS')}><Link to={"/airport"}>Airport</Link></Menu.Item>
						<Menu.Item key="BSCC:6" className={_checkPermission(permissionList, 'MSDTCURRENCY', 'CURRENCY_ACCESS')}><Link to={"/currency"}>Currency</Link></Menu.Item>
						<Menu.Item key="BSCC:7" className={_checkPermission(permissionList, 'MSDTGENCONFIG', 'GENCONF_ACCESS')}><Link to={"/general-configuration"}>General Configuration</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Member Configuration" className={_checkPermissionMenuGroup(permissionList, memberConfigurationGroup)} style={{ width: '190px', textAlign: 'left' }}>
						<Menu.Item key="MMBC:1" className={_checkPermission(permissionList, 'MSDTTITLE', 'TITLE_ACCESS')}><Link to={"/title"}>Title</Link></Menu.Item>
						<Menu.Item key="MMBC:2" className={_checkPermission(permissionList, 'MSDTSALUTATION', 'SALUTATI_ACCESS')}><Link to={"/salutation"}>Salutation</Link></Menu.Item>
						<Menu.Item key="MMBC:3" className={_checkPermission(permissionList, 'MSDTHOBBIES', 'HOBBIES_ACCESS')}><Link to={"/hobbies"}>Hobbies</Link></Menu.Item>
						<Menu.Item key="MMBC:4" className={_checkPermission(permissionList, 'MSDTRELIGION', 'RELIGION_ACCESS')}><Link to={"/religion"}>Religion</Link></Menu.Item>
						<Menu.Item key="MMBC:5" className={_checkPermission(permissionList, 'MSDTLANGUAGE', 'LANGUAGE_ACCESS')}><Link to={"/language"}>Language</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Tier Management" className={_checkPermissionMenuGroup(permissionList, tierManagementGroup)}>
						<Menu.Item key="TRMG:1" className={_checkPermission(permissionList, 'TIERMMSHIPTYPE', 'MBSPTYPE_ACCESS')}><Link to={"/membership-type"}>Membership Type</Link></Menu.Item>
						<Menu.Item key="TRMG:2" className={_checkPermission(permissionList, 'TIERMMSHIP', 'MSHIP_ACCESS')}><Link to={"/membership"}>Membership</Link></Menu.Item>
						<Menu.Item key="TRMG:3" className={_checkPermission(permissionList, 'TIERMTIREASON', 'TIREASON_ACCESS')}><Link to={"/tier-reason"}>Tier Reason</Link></Menu.Item>
						<Menu.Item key="TRMG:4" className={_checkPermission(permissionList, 'TIERMTIER', 'TIER_ACCESS')}><Link to={"/tier"}>Tier</Link></Menu.Item>
						<Menu.Item key="TRMG:5" className={_checkPermission(permissionList, 'TIERMTIDURATION', 'TIDURATI_ACCESS')}><Link to={"/tier-duration"}>Tier Duration</Link></Menu.Item>
						<SubMenu title="Tier Bonus" className={_checkPermissionMenuGroup(permissionList, tierBonusGroup)}>
							<Menu.Item key="TRMG:6" className={_checkPermission(permissionList, 'TIERMACTBONUS', 'ACTBONUS_ACCESS')}><Link to={"/activity-bonus"}>Activity Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:7" className={_checkPermission(permissionList, 'TIERMENRBONUS', 'ENBONUS_ACCESS')}><Link to={"/enroll-bonus"}>Enroll Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:8" className={_checkPermission(permissionList, 'TIERMRELBONUS', 'RELBONUS_ACCESS')}><Link to={"/relation-bonus"}>Relation Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:9" className={_checkPermission(permissionList, 'TIERMFACTBONUS', 'FACBONUS_ACCESS')}><Link to={"/first-activity-bonus"}>First Activity Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:10" className={_checkPermission(permissionList, 'BDAYBON', 'BDAYBON_ACCESS')}><Link to={"/birthday-bonus"}>Birthday Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:11" className={_checkPermission(permissionList, 'PROMBON', 'PROMBON_ACCESS')}><Link to={"/promo-completion-bonus"}>Promo Completion Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:12" className={_checkPermission(permissionList, 'TIERBON', 'TIERBON_ACCESS')}><Link to={"/tier-completion-bonus"}>Tier Completion Bonus</Link></Menu.Item>
							<Menu.Item key="TRMG:13" className={_checkPermission(permissionList, 'REFFBON', 'REFFBON_ACCESS')}><Link to={"/referral-bonus"}>Referral Bonus</Link></Menu.Item>
						</SubMenu>
						<Menu.Item key="TRMG:10" className={_checkPermission(permissionList, 'TIERMMILCRITE', 'MILCRITE_ACCESS')}><Link to={"/mileage-criteria"}>Mileage Criteria</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Partner Management" className={_checkPermissionMenuGroup(permissionList, partnerManagementGroup)}>
						<Menu.Item key="PRTN:1" className={_checkPermission(permissionList, 'AIRLINE', 'AIRLINE_ACCESS')}><Link to={"/airline"}>Airline</Link></Menu.Item>
						<Menu.Item key="PRTN:2" className={_checkPermission(permissionList, 'CDESHAR', 'CDESHAR_ACCESS')}><Link to={"/codeshare-list"}>Codeshare List</Link></Menu.Item>
						<Menu.Item key="PRTN:3" className={_checkPermission(permissionList, 'PROGLOYAL', 'PRGLOYAL_ACCESS')}><Link to={"/program"}>Program Loyalty</Link></Menu.Item>
						<Menu.Item key="PRTN:4" className={_checkPermission(permissionList, 'PARTNER', 'PARTNER_ACCESS')}><Link to={"/partner"}>Partner</Link></Menu.Item>
						<Menu.Item key="PRTN:5" className={_checkPermission(permissionList, 'PARTNGRP', 'PARTNGRP_ACCESS')}><Link to={"/partner-group"}>Partner Group</Link></Menu.Item>
						{/* <Menu.Item key="PRTN:6" className={_checkPermission(permissionList, 'PARTBULK', 'PARTBULK_ACCESS')}><Link to={"/bulk-miles"}>Bulk Miles</Link></Menu.Item> */}
						<Menu.Item key="PRTN:7" className={_checkPermission(permissionList, 'EARMILES', 'EARMILES_ACCESS')}><Link to={"/earning-miles"}>Earning Miles</Link></Menu.Item>
						<Menu.Item key="PRTN:8" className={_checkPermission(permissionList, 'DSTRANGE', 'DSTRANGE_ACCESS')}><Link to={"/distance-range"}>Distance Range</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Branch Management" className={_checkPermissionMenuGroup(permissionList, branchManagementGroup)}>
						<Menu.Item key="BRNM:1" className={_checkPermission(permissionList, 'BRANCH', 'BRANCH_ACCESS')}><Link to={"/branch"}>Branch</Link></Menu.Item>
						<Menu.Item key="BRNM:2" className={_checkPermission(permissionList, 'TICKOFFC', 'TICKOFFC_ACCESS')}><Link to={"/ticket-office"}>Ticket Office</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Relation Management" className={_checkPermissionMenuGroup(permissionList, relationManagementGroup)}>
						<Menu.Item key="RLTM:1" className={_checkPermission(permissionList, 'RELATYPE', 'RELATYPE_ACCESS')}><Link to={"/relation-type"}>Relation Type</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Vendor Management" className={_checkPermissionMenuGroup(permissionList, vendorManagementGroup)}>
						<Menu.Item key="VNDR:1" className={_checkPermission(permissionList, 'VENDOR', 'VENDOR_ACCESS')}><Link to={"/vendor"}>Vendor</Link></Menu.Item>
						<Menu.Item key="VNDR:2" className={_checkPermission(permissionList, 'VENREG', 'VENREG_ACCESS')}><Link to={"/vendor-region"}>Vendor Region</Link></Menu.Item>
					</SubMenu>
					<Menu.Item key="CRDM:1" className={_checkPermission(permissionList, 'CARDINVE', 'CARDINVE_ACCESS')}><Link to={"/card-inventory"}>Card Inventory</Link></Menu.Item>
					<SubMenu title="Mailing Product" className={_checkPermissionMenuGroup(permissionList, mailingProductGroup)}>
						<SubMenu title="Order Management" className={_checkPermissionMenuGroup(permissionList, orderManagementGroup)} style={{ width: '180px', textAlign: 'left' }}>
							<Menu.Item key="ORDER:1" className={_checkPermission(permissionList, 'RETURN', 'RETURN_ACCESS')}>
								<Link to={"/order-management/track"}>Track Status Order</Link>
							</Menu.Item>
							<Menu.Item key="ORDER:2" className={_checkPermission(permissionList, 'PRTD', 'PRTD_ACCESS')}>
								<Link to={"/order-management/printing"}>Printing Order</Link>
							</Menu.Item>
							<Menu.Item key="ORDER:3" className={_checkPermission(permissionList, 'PCKD', 'PCKD_ACCESS')}>
								<Link to={"/order-management/package"}>Package Order</Link>
							</Menu.Item>
							<Menu.Item key="ORDER:4" className={_checkPermission(permissionList, 'DLVRD', 'DLVRD_ACCESS')}>
								<Link to={"/order-management/delivery"}>Delivery Order</Link>
							</Menu.Item>
							<Menu.Item key="ORDER:5" className={_checkPermission(permissionList, 'RETURN', 'RETURN_ACCESS')}>
								<Link to={"/order-management/return"}>Return Order</Link>
							</Menu.Item>
							<Menu.Item key="ORDER:6" className={_checkPermission(permissionList, 'REORDER', 'REORDER_ACCESS')}>
								<Link to={"/order-management/reorder"}>Reorder</Link>
							</Menu.Item>
						</SubMenu>
						<Menu.Item key="MLPT:2" className={_checkPermission(permissionList, 'PRMCT', 'PRMCT_ACCESS')}><Link to={"/mailing-product"}>Mailing Product</Link></Menu.Item>
						<Menu.Item key="MLPT:3" className={_checkPermission(permissionList, 'LETTER', 'LETTER_ACCESS')}><Link to={"/letter-management"}>Letter</Link></Menu.Item>
						<Menu.Item key="MLPT:4" className={_checkPermission(permissionList, 'INVSYS', 'INVSYS_ACCESS')}><Link to={"/inventory-management"}>Inventory</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Data Sync" className={_checkPermissionMenuGroup(permissionList, pasGroup)}>
						<Menu.Item key="PAS:1" className={_checkPermission(permissionList, 'DSCHCK', 'DSCHCK_ACCESS')}><Link to={"/data-sync-checking"}>Checking</Link></Menu.Item>
						<Menu.Item key="PAS:2" className={_checkPermission(permissionList, 'DSMON', 'DSMON_ACCESS')}><Link to={"/data-sync-monitoring"}>Monitoring</Link></Menu.Item>
					</SubMenu>
				</SubMenu>
				<SubMenu title="Catalog" className={_checkPermissionMenuGroup(permissionList, catalogueGroup)}>
					<SubMenu title="Accrual Rule" className={_checkPermissionMenuGroup(permissionList, accrualAirGroup)}>
						<SubMenu title="Air">
							<Menu.Item key="ACAR:1" className={_checkPermission(permissionList, 'ACCRLOD', 'ACCRLOD_ACCESS')}><Link to={"/accrual-rule-od"}>Origin Destination</Link></Menu.Item>
							<Menu.Item key="ACAR:2" className={_checkPermission(permissionList, 'ACCRLBC', 'ACCRLBC_ACCESS')}><Link to={"/accrual-rule-bc"}>Booking Class</Link></Menu.Item>
						</SubMenu>
						<Menu.Item key="NOAR:1" className={_checkPermission(permissionList, 'ACCRLNA', 'ACCRLNA_ACCESS')}><Link to={"/accrual-rule-non-air"}>Non Air</Link></Menu.Item>
						<Menu.Item key="ACCRLPR:1" className={_checkPermission(permissionList, 'ACCRLPR', 'ACCRLPR_ACCESS')}><Link to={"/accrual-promo"}>Promo</Link></Menu.Item>
					</SubMenu>
					<Menu.Item key="CTGL:1" className={_checkPermission(permissionList, 'RECPCATG', 'RECPCATG_ACCESS')}><Link to={"/receipt-catalogue"}>Receipt Catalogue</Link></Menu.Item>
					<SubMenu title="Custom Transaction">
						<Menu.Item key="CTGL:1" className={_checkPermission(permissionList, 'CUSTTRAN', 'CUSTTRAN_ACCESS')}><Link to={"/custom-transaction"}>Custom Transaction</Link></Menu.Item>
						<Menu.Item key="CTGL:2" className={_checkPermission(permissionList, 'CUSTROLE', 'CUSTROLE_ACCESS')}><Link to={"/custom-transaction-role"}>Custom Transaction By Role</Link></Menu.Item>
					</SubMenu>
					{/* <Menu.Item key="CTGL:3" className={_checkPermission(permissionList, 'NEWS', 'NEWS_ACCESS')}><Link to={"/communication"}>Communication</Link></Menu.Item> */}
					<SubMenu title="Non Air Activity" className={_checkPermissionMenuGroup(permissionList, activityCodeGroup)}>
						<Menu.Item key="NONAIRACT:1" className={_checkPermission(permissionList, 'ACTYCODE', 'ACTYCODE_ACCESS')}><Link to={"/activity-code"}>Code</Link></Menu.Item>
						<Menu.Item key="NONAIRACT:2" className={_checkPermission(permissionList, 'ACCLMTNA', 'ACCLMTNA_ACCESS')}><Link to={"/activity-code-limit"}>Limit</Link></Menu.Item>
					</SubMenu>
					<Menu.Item key="CTGL:4" className={_checkPermission(permissionList, 'STATMENT', 'STATMENT_ACCESS')}><Link to={"/statement"}>Statement</Link></Menu.Item>
					<Menu.Item key="CTGL:5" className={_checkPermission(permissionList, 'FILE', 'FILE_ACCESS')}><Link to={"/file-management"}>File Management</Link></Menu.Item>
					<SubMenu title="Buy Mileage" className={_checkPermissionMenuGroup(permissionList, buyMileageGroup)}>
						<Menu.Item key="BUYMIL:1" className={_checkPermission(permissionList, 'BUYMILCT', 'BUYMILCT_ACCESS')}><Link to={"/buy-mileage-catalog"}>Catalog</Link></Menu.Item>
						<Menu.Item key="BUYMIL:2" className={_checkPermission(permissionList, 'BUYMILPR', 'BUYMILPR_ACCESS')}><Link to={"/buy-mileage-promo"}>Promo</Link></Menu.Item>
					</SubMenu>
				</SubMenu>
				<SubMenu title="Report" className={_checkPermissionMenuGroup(permissionList, reportGroup)}>
					<SubMenu title="Accrual" className={_checkPermissionMenuGroup(permissionList, accrualReport)}>
						<Menu.Item key="ACRP:1" className={_checkPermission(permissionList, 'REPARAC', 'REPARAC_ACCESS')}><Link to={"/air-accrual-report"}>Air</Link></Menu.Item>
						<Menu.Item key="ACRP:2" className={_checkPermission(permissionList, 'REPNAAC', 'REPNAAC_ACCESS')}><Link to={"/non-air-accrual-report"}>Non Air</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Award" className={_checkPermissionMenuGroup(permissionList, awardReport)}>
						<Menu.Item key="AWRP:1" className={_checkPermission(permissionList, 'REPARAW', 'REPARAW_ACCESS')}><Link to={"/air-award-report"}>Air</Link></Menu.Item>
						<Menu.Item key="AWRP:2" className={_checkPermission(permissionList, 'REPNAAW', 'REPNAAW_ACCESS')}><Link to={"/non-air-award-report"}>Non Air</Link></Menu.Item>
					</SubMenu>
					<Menu.Item key="RPRT:1" className={_checkPermission(permissionList, 'REPRDP', 'REPRDP_ACCESS')}><Link to={"/redeposit-report"}>Redeposit</Link></Menu.Item>
					<Menu.Item key="RPRT:2" className={_checkPermission(permissionList, 'REPCUST', 'REPCUST_ACCESS')}><Link to={"/custom-transaction-report"}>Custom Transaction</Link></Menu.Item>
					<Menu.Item key="RPRT:3" className={_checkPermission(permissionList, 'REPMMBR', 'REPMMBR_ACCESS')}><Link to={"/member-profile-report"}>Member Profile</Link></Menu.Item>
					<Menu.Item key="RPRT:4" className={_checkPermission(permissionList, 'REPBUYML', 'REPBUYML_ACCESS')}><Link to={"/buy-mileage-report"}>Buy Mileage</Link></Menu.Item>
					<Menu.Item key="RPRT:5" className={_checkPermission(permissionList, 'REPDOWN', 'REPDOWN_ACCESS')}><Link to={"/download-report"}>Download Data Report</Link></Menu.Item>
					<SubMenu title="Dashboard" className={_checkPermissionMenuGroup(permissionList, dashboardReport)}>
						<Menu.Item key="DASH:1" className={_checkPermission(permissionList, 'REPACCT', 'REPACCT_ACCESS')}><Link to={"/dashboard-accounting-report"}>Accounting</Link></Menu.Item>
						<Menu.Item key="DASH:2" className={_checkPermission(permissionList, 'RDASEXE', 'RDASEXE_ACCESS')}><Link to={"/dashboard-executive-report"}>Executive</Link></Menu.Item>
						<Menu.Item key="DASH:3" className={_checkPermission(permissionList, 'RDASPER', 'RDASPER_ACCESS')}><Link to={"/dashboard-performance-report"}>Performance</Link></Menu.Item>
						<Menu.Item key="DASH:4" className={_checkPermission(permissionList, 'RDASBIZ', 'RDASBIZ_ACCESS')}><Link to={"/dashboard-bizmiles-report"}>Bizmiles</Link></Menu.Item>
						<Menu.Item key="DASH:5" className={_checkPermission(permissionList, 'REPFSUS', 'REPFSUS_ACCESS')}><Link to={"/fraud-suspect-report"}>Fraud Suspect</Link></Menu.Item>
					</SubMenu>
					<SubMenu title="Cobrand" className={_checkPermissionMenuGroup(permissionList, cobrandReport)}>
						<Menu.Item key="COB:1" className={_checkPermission(permissionList, 'REPCBTR', 'REPCBTR_ACCESS')}><Link to={"/cobrand-earning-report"}>Earning</Link></Menu.Item>
						<Menu.Item key="COB:2" className={_checkPermission(permissionList, 'REPCBFT', 'REPCBFT_ACCESS')}><Link to={"/fast-track-report"}>Fast Track</Link></Menu.Item>
						<Menu.Item key="COB:3" className={_checkPermission(permissionList, 'REPCBAC', 'REPCBAC_ACCESS')}><Link to={"/cobrand-member-report"}>Member</Link></Menu.Item>
						<Menu.Item key="COB:4" className={_checkPermission(permissionList, 'REPCBSU', 'REPCBSU_ACCESS')}><Link to={"/cobrand-summary-report"}>Summary</Link></Menu.Item>
					</SubMenu>
				</SubMenu>
				<SubMenu title="Award Management" className={_checkPermissionMenuGroup(permissionList, awardManagementgroup)}>
					<Menu.Item key="AWDM:1" className={_checkPermission(permissionList, 'AWRDTYPE', 'AWRDTYPE_ACCESS')}><Link to={"/award-type"}>Award Type</Link></Menu.Item>
					<Menu.Item key="AWDM:2" className={_checkPermission(permissionList, 'AWARD', 'AWARD_ACCESS')}><Link to={"/award-list"}>Award List</Link></Menu.Item>
					<Menu.Item key="AWDM:3" className={_checkPermission(permissionList, 'PEAKSEAS', 'PEAKSEAS_ACCESS')}><Link to={"/peak-season"}>Peak Season</Link></Menu.Item>
					<Menu.Item key="AWDM:4" className={_checkPermission(permissionList, 'BLACKOUT', 'BLACKOUT_ACCESS')}><Link to={"/blackout"}>Blackout Period</Link></Menu.Item>
					<SubMenu title="Redemption Promo" className={_checkPermissionMenuGroup(permissionList, redemptionPromoGroup)}>
						<Menu.Item key="RDPRM:1" className={_checkPermission(permissionList, 'PROMCT', 'PROMCT_ACCESS')}><Link to={"/promo-catalog"}>List</Link></Menu.Item>
						<Menu.Item key="RDPRM:2" className={_checkPermission(permissionList, 'CRITYPE', 'CRITYPE_ACCESS')}><Link to={"/promo-criteria-type"}>Promo Criteria Type</Link></Menu.Item>
						<Menu.Item key="RDPRM:3" className={_checkPermission(permissionList, 'PROFILE', 'PROFILE_ACCESS')}><Link to={"/promo-file"}>Promo File</Link></Menu.Item>
					</SubMenu>
				</SubMenu>
				<SubMenu title="User Management" className={_checkPermissionMenuGroup(permissionList, userManagementGroup)}>
					<Menu.Item key="USRM:1" className={_checkPermission(permissionList, 'USER', 'USER_ACCESS')}><Link to={"/user"}>User</Link></Menu.Item>
					<Menu.Item key="USRM:2" className={_checkPermission(permissionList, 'ROLE', 'ROLE_ACCESS')}><Link to={"/role"}>Role</Link></Menu.Item>
					<Menu.Item key="USRM:3" className={_checkPermission(permissionList, 'USERLOG', 'USERLOG_ACCESS')}><Link to={"/user-log"}>User Log Monitoring</Link></Menu.Item>
				</SubMenu>
				<SubMenu title={"Hi, " + getProfile().username}>
					<Menu.Item key="PROFILE" className={isBOD ? (isBOD && _checkPermission(permissionList, 'BPROFL', 'BPROFL_ACCESS')) : true}><Link to={"/profile"}><Icon type="user" />Profile</Link></Menu.Item>
					<Menu.Item> <a onClick={this.clickLogout} target="_blank" rel="noopener noreferrer"> <Icon type="logout" />Logout</a></Menu.Item>
				</SubMenu>
			</Menu>
		)
	}
}

export function _checkPermission(permissionList, menucode, functioncode) {
	let result = '';
	if (permissionList[menucode] && !permissionList[menucode][functioncode]) {
		result = "hidden";
	}
	return result;
}

export function _checkPermissionMenuGroup(permissionList, module) {
	let isBranch = (getProfile().branchcode && getProfile().tickoffid) ? true : false;
	//default menu group is hidden
	let result = 'hidden';
	if (isBranch) {
		//check permission each module
		for (const field in module) {
			var menucode = module[field]['menucode'];
			var accesscode = module[field]['accesscode'];
			if (permissionList[menucode] !== undefined && permissionList[menucode][accesscode]) {
				result = '';
				break;
			}
		}
	}
	return result;
}

// export default Menu;

const mapStateToProps = state => ({ ...state });
export default connect(mapStateToProps)(App);
