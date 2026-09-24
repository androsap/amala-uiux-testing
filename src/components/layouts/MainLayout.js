import React, { Suspense, lazy } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { Layout, Spin, Skeleton, Row, Modal } from 'antd';
import axios from 'axios';
import Header from '../Header';
import { getProfile, isLoggedIn, getPermission, logout } from '../../utilities/AuthService';
import { setPermission } from "../../utilities/actions/PermissionAction";
import Error404 from '../../pages/error/Error404';
import Error403 from '../../pages/error/Error403';
import HomePage from '../../pages/home/Index';
import LoginRouter from '../../routers/Login.router';
import MiniViewRouter from '../../routers/MiniView.router';
import DashboardLayout from './DashboardLayout';
import DefaultLayout from './DefaultLayout';
import IdleTimer from 'react-idle-timer';
import CacheBuster from '../../CacheBuster';
import Footer from '../Footer';
import MergingConfirmationRouter from '../../routers/MergingConfirmation.router';
import NomineeConfirmationRouter from '../../routers/NomineeConfirmation.router';

const ProfileComponent = lazy(() => import('../../pages/profile/Index'));
const { Content } = Layout;
const router = [
    { prefixname: "REGION", menucode: "MSDTREGION", layout: DefaultLayout, component: lazy(() => import('../../routers/Region.router')), path: "region", },
    { prefixname: "COUNTRY", menucode: "MSDTCOUNTRY", layout: DefaultLayout, component: lazy(() => import('../../routers/Country.router')), path: "country" },
    { prefixname: "STATE", menucode: "MSDTSTATE", layout: DefaultLayout, component: lazy(() => import('../../routers/State.router')), path: "state" },
    { prefixname: "CITY", menucode: "MSDTCITY", layout: DefaultLayout, component: lazy(() => import('../../routers/City.router')), path: "city" },
    { prefixname: "AIRPORT", menucode: "MSDTAIRPORT", layout: DefaultLayout, component: lazy(() => import('../../routers/Airport.router')), path: "airport" },
    { prefixname: "CURRENCY", menucode: "MSDTCURRENCY", layout: DefaultLayout, component: lazy(() => import('../../routers/Currency.router')), path: "currency" },
    { prefixname: "GENCONF", menucode: "MSDTGENCONFIG", layout: DefaultLayout, component: lazy(() => import('../../routers/GeneralConfiguration.router')), path: "general-configuration" },
    { prefixname: "TITLE", menucode: "MSDTTITLE", layout: DefaultLayout, component: lazy(() => import('../../routers/Title.router')), path: "title" },
    { prefixname: "SALUTATI", menucode: "MSDTSALUTATION", layout: DefaultLayout, component: lazy(() => import('../../routers/Salutation.router')), path: "salutation" },
    { prefixname: "HOBBIES", menucode: "MSDTHOBBIES", layout: DefaultLayout, component: lazy(() => import('../../routers/Hobbies.router')), path: "hobbies" },
    { prefixname: "RELIGION", menucode: "MSDTRELIGION", layout: DefaultLayout, component: lazy(() => import('../../routers/Religion.router')), path: "religion" },
    { prefixname: "LANGUAGE", menucode: "MSDTLANGUAGE", layout: DefaultLayout, component: lazy(() => import('../../routers/Language.router')), path: "language" },
    { prefixname: "MBSPTYPE", menucode: "TIERMMSHIPTYPE", layout: DefaultLayout, component: lazy(() => import('../../routers/MembershipType.router')), path: "membership-type" },
    { prefixname: "MSHIP", menucode: "TIERMMSHIP", layout: DefaultLayout, component: lazy(() => import('../../routers/Membership.router')), path: "membership" },
    { prefixname: "TIREASON", menucode: "TIERMTIREASON", layout: DefaultLayout, component: lazy(() => import('../../routers/TierReason.router')), path: "tier-reason" },
    { prefixname: "TIER", menucode: "TIERMTIER", layout: DefaultLayout, component: lazy(() => import('../../routers/Tier.router')), path: "tier" },
    { prefixname: "TIDURATI", menucode: "TIERMTIDURATION", layout: DefaultLayout, component: lazy(() => import('../../routers/TierDuration.router')), path: "tier-duration" },
    { prefixname: "ACTBONUS", menucode: "TIERMACTBONUS", layout: DefaultLayout, component: lazy(() => import('../../routers/ActivityBonus.router')), path: "activity-bonus" },
    { prefixname: "ENBONUS", menucode: "TIERMENRBONUS", layout: DefaultLayout, component: lazy(() => import('../../routers/EnrollBonus.router')), path: "enroll-bonus" },
    { prefixname: "MILCRITE", menucode: "TIERMMILCRITE", layout: DefaultLayout, component: lazy(() => import('../../routers/MileageCriteria.router')), path: "mileage-criteria" },
    { prefixname: "RELBONUS", menucode: "TIERMRELBONUS", layout: DefaultLayout, component: lazy(() => import('../../routers/RelationBonus.router')), path: "relation-bonus" },
    // { prefixname: "NEWS", menucode: "NEWS", layout: DefaultLayout, component: lazy(() => import('../../routers/Communication.router')), path: "communication" },
    { prefixname: "RELATYPE", menucode: "RELATYPE", layout: DefaultLayout, component: lazy(() => import('../../routers/RelationType.router')), path: "relation-type" },
    { prefixname: "CARDINVE", menucode: "CARDINVE", layout: DefaultLayout, component: lazy(() => import('../../routers/CardInventory.router')), path: "card-inventory" },
    { prefixname: "BRANCH", menucode: "BRANCH", layout: DefaultLayout, component: lazy(() => import('../../routers/Branch.router')), path: "branch" },
    { prefixname: "TICKOFFC", menucode: "TICKOFFC", layout: DefaultLayout, component: lazy(() => import('../../routers/TicketOffice.router')), path: "ticket-office" },
    { prefixname: "DSTRANGE", menucode: "DSTRANGE", layout: DefaultLayout, component: lazy(() => import('../../routers/DistanceRange.router')), path: "distance-range" },
    { prefixname: "EARMILES", menucode: "EARMILES", layout: DefaultLayout, component: lazy(() => import('../../routers/EarningMiles.router')), path: "earning-miles" },
    { prefixname: "PARTNGRP", menucode: "PARTNGRP", layout: DefaultLayout, component: lazy(() => import('../../routers/PartnerGroup.router')), path: "partner-group" },
    { prefixname: "CDESHAR", menucode: "CDESHAR", layout: DefaultLayout, component: lazy(() => import('../../routers/CodeShareList.router')), path: "codeshare-list" },
    { prefixname: "PRGLOYAL", menucode: "PROGLOYAL", layout: DefaultLayout, component: lazy(() => import('../../routers/Program.router')), path: "program" },
    { prefixname: "PARTNER", menucode: "PARTNER", layout: DefaultLayout, component: lazy(() => import('../../routers/Partner.router')), path: "partner" },
    // { prefixname: "PARTBULK", menucode: "PARTBULK", layout: DefaultLayout, component: lazy(() => import('../../routers/BulkMiles.router')), path: "bulk-miles" },
    { prefixname: "STATMENT", menucode: "STATMENT", layout: DefaultLayout, component: lazy(() => import('../../routers/Statement.router')), path: "statement" },
    { prefixname: "AWRDTYPE", menucode: "AWRDTYPE", layout: DefaultLayout, component: lazy(() => import('../../routers/AwardType.router')), path: "award-type" },
    { prefixname: "PEAKSEAS", menucode: "PEAKSEAS", layout: DefaultLayout, component: lazy(() => import('../../routers/PeakSeason.router')), path: "peak-season" },
    { prefixname: "AIRLINE", menucode: "AIRLINE", layout: DefaultLayout, component: lazy(() => import('../../routers/Airline.router')), path: "airline" },
    { prefixname: "FILE", menucode: "FILE", layout: DefaultLayout, component: lazy(() => import('../../routers/FileManagement.router')), path: "file-management" },
    { prefixname: "ACTYCODE", menucode: "ACTYCODE", layout: DefaultLayout, component: lazy(() => import('../../routers/ActivityCode.router')), path: "activity-code" },
    { prefixname: "ACCRLLMTNA", menucode: "ACCRLLMTNA", layout: DefaultLayout, component: lazy(() => import('../../routers/ActivityCodeLimit.router')), path: "activity-code-limit" },
    { prefixname: "CUSTTRAN", menucode: "CUSTTRAN", layout: DefaultLayout, component: lazy(() => import('../../routers/CustomTransaction.router')), path: "custom-transaction" },
    { prefixname: "CUSTROLE", menucode: "CUSTROLE", layout: DefaultLayout, component: lazy(() => import('../../routers/CustomTransactionRole.router')), path: "custom-transaction-role" },
    { prefixname: "RECPCATG", menucode: "RECPCATG", layout: DefaultLayout, component: lazy(() => import('../../routers/ReceiptCatalogue.router')), path: "receipt-catalogue" },
    { prefixname: "ACCRLOD", menucode: "ACCRLOD", layout: DefaultLayout, component: lazy(() => import('../../routers/AccrualRuleOD.router')), path: "accrual-rule-od" },
    { prefixname: "ACCRLBC", menucode: "ACCRLBC", layout: DefaultLayout, component: lazy(() => import('../../routers/AccrualRuleBC.router')), path: "accrual-rule-bc" },
    { prefixname: "ACCRLFF", menucode: "ACCRLFF", layout: DefaultLayout, component: lazy(() => import('../../routers/AccrualRuleFare.router')), path: "accrual-rule-fare-family" },
    { prefixname: "ACCRLNA", menucode: "ACCRLNA", layout: DefaultLayout, component: lazy(() => import('../../routers/AccrualRuleNonAir.router')), path: "accrual-rule-non-air" },
    { prefixname: "RETROCL", menucode: "RETROCL", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimManager.router')), path: "retro-claim-ga-manager" },
    { prefixname: "RETROCL", menucode: "RETROCL", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimManager.router')), path: "retro-claim-skyteam-manager" },
    { prefixname: "RETROCL", menucode: "RETROCL", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimManager.router')), path: "retro-claim-skyteam-in-manager" },
    { prefixname: "RETROCL", menucode: "RETROCL", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimManager.router')), path: "retro-claim-staralliance-manager" },
    { prefixname: "RETROCL", menucode: "RETROCL", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimManager.router')), path: "retro-claim-oneworld-manager" },
    { prefixname: "RETCAPR", menucode: "RETCAPR", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimApproval.router')), path: "retro-claim-ga-approval" },
    { prefixname: "RETCAPR", menucode: "RETCAPR", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimApproval.router')), path: "retro-claim-skyteam-approval" },
    { prefixname: "RETCAPR", menucode: "RETCAPR", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimApproval.router')), path: "retro-claim-staralliance-approval" },
    { prefixname: "RETCAPR", menucode: "RETCAPR", layout: DefaultLayout, component: lazy(() => import('../../routers/RetroClaimApproval.router')), path: "retro-claim-oneworld-approval" },
    { prefixname: "USER", menucode: "USER", layout: DefaultLayout, component: lazy(() => import('../../routers/User.router')), path: "user" },
    { prefixname: "PARKACTI", menucode: "PARKACTI", layout: DefaultLayout, component: lazy(() => import('../../routers/ParkActivity.router')), path: "park-activity" },
    { prefixname: "SUSPDUP", menucode: "SUSPDUP", layout: DefaultLayout, component: lazy(() => import('../../routers/SuspectDuplicate.router')), path: "suspect-duplicate" },
    { prefixname: "MMBRIDT", menucode: "MMBRIDT", layout: DefaultLayout, component: lazy(() => import('../../routers/MemberIdentity.router')), path: "member-identity" },
    { prefixname: "MMBRIDT", menucode: "MMBRIDT", layout: DefaultLayout, component: lazy(() => import('../../routers/MemberLocked.router')), path: "member-locked" },
    { prefixname: "INCNAME", menucode: "INCNAME", layout: DefaultLayout, component: lazy(() => import('../../routers/InvalidNameCheck.router')), path: "invalid-name-check" },
    { prefixname: "MEMBERMG", menucode: "MEMBERMG", layout: null, component: lazy(() => import('../../routers/Member.router')), path: "member" },
    { prefixname: "BMEMMGT", menucode: "BMEMMGT", layout: null, component: lazy(() => import('../../routers/Member.router')), path: "member" },
    { prefixname: "MBERCORP", menucode: "MBERCORP", layout: null, component: lazy(() => import('../../routers/MemberCorporate.router')), path: "member-corporate" },
    { prefixname: "BLACKOUT", menucode: "BLACKOUT", layout: DefaultLayout, component: lazy(() => import('../../routers/Blackout.router')), path: "blackout" },
    { prefixname: "AWARD", menucode: "AWARD", layout: DefaultLayout, component: lazy(() => import('../../routers/AwardList.router')), path: "award-list" },
    { prefixname: "ENRLINDV", menucode: "ENRLINDV", layout: DefaultLayout, component: lazy(() => import('../../routers/Enrollment.router')), path: "enrollment" },
    { prefixname: "ENRLCORP", menucode: "ENRLCORP", layout: DefaultLayout, component: lazy(() => import('../../routers/EnrollmentCorporate.router')), path: "enrollment-corporate" },
    { prefixname: "ROLE", menucode: "ROLE", layout: DefaultLayout, component: lazy(() => import('../../routers/Role.router')), path: "role" },
    // { prefixname: "REDEEM", menucode: "REDEEM", layout: DefaultLayout, component: lazy(() => import('../../routers/Redemption.router')), path: "redemption" },
    // { prefixname: "NEWS", menucode: "NEWS", layout: DefaultLayout, component: lazy(() => import('../../routers/News.router')), path: "news" }
    { prefixname: "REPARAC", menucode: "REPARAC", layout: null, component: lazy(() => import('../../routers/ReportAirAccrual.router')), path: "air-accrual-report" },
    { prefixname: "REPNAAC", menucode: "REPNAAC", layout: null, component: lazy(() => import('../../routers/ReportNonAirAccrual.router')), path: "non-air-accrual-report" },
    { prefixname: "REPARAW", menucode: "REPARAW", layout: null, component: lazy(() => import('../../routers/ReportAirAward.router')), path: "air-award-report" },
    { prefixname: "REPNAAW", menucode: "REPNAAW", layout: null, component: lazy(() => import('../../routers/ReportNonAirAward.router')), path: "non-air-award-report" },
    { prefixname: "REPRDP", menucode: "REPRDP", layout: null, component: lazy(() => import('../../routers/ReportRedeposit.router')), path: "redeposit-report" },
    { prefixname: "REPCUST", menucode: "REPCUST", layout: null, component: lazy(() => import('../../routers/ReportCustomTrx.router')), path: "custom-transaction-report" },
    { prefixname: "REPDOWN", menucode: "REPDOWN", layout: null, component: lazy(() => import('../../routers/ReportDownload.router')), path: "download-report" },
    { prefixname: "REPMMBR", menucode: "REPMMBR", layout: null, component: lazy(() => import('../../routers/ReportMemberProfile.router')), path: "member-profile-report" },
    { prefixname: "REPCBAC", menucode: "REPCBAC", layout: null, component: lazy(() => import('../../routers/ReportCobrand.router')), path: "cobrand-member-report" },
    { prefixname: "REPCBSU", menucode: "REPCBSU", layout: null, component: lazy(() => import('../../routers/ReportCobrandSummary.router')), path: "cobrand-summary-report" },
    { prefixname: "REPCBTR", menucode: "REPCBTR", layout: null, component: lazy(() => import('../../routers/ReportCobrandEarning.router')), path: "cobrand-earning-report" },
    { prefixname: "REPCBFT", menucode: "REPCBFT", layout: null, component: lazy(() => import('../../routers/ReportCobrandFasttrack.router')), path: "fast-track-report" },
    { prefixname: "REPBUYML", menucode: "REPBUYML", layout: null, component: lazy(() => import('../../routers/ReportBuyMileage.router')), path: "buy-mileage-report" },
    { prefixname: "ACCRLNA", menucode: "ACCRLNA", layout: DefaultLayout, component: lazy(() => import('../../routers/AccrualPromo.router')), path: "accrual-promo" },
    { prefixname: "BUYMILCT", menucode: "BUYMILCT", layout: DefaultLayout, component: lazy(() => import('../../routers/BuyMileageCatalog.router')), path: "buy-mileage-catalog" },
    { prefixname: "BUYMILPR", menucode: "BUYMILPR", layout: DefaultLayout, component: lazy(() => import('../../routers/BuyMileagePromo.router')), path: "buy-mileage-promo" },
    { prefixname: "MISTLOG", menucode: "MISTLOG", layout: null, component: lazy(() => import('../../routers/MileageStatementLog.router')), path: "mileage-statement-log" },
    { prefixname: "FACBONUS", menucode: "TIERMFACTBONUS", layout: DefaultLayout, component: lazy(() => import('../../routers/FirstActivityBonus.router')), path: "first-activity-bonus" },
    { prefixname: "BDAYBON", menucode: "BDAYBON", layout: DefaultLayout, component: lazy(() => import('../../routers/BirthdayBonus.router')), path: "birthday-bonus" },
    { prefixname: "TIERBON", menucode: "TIERBON", layout: DefaultLayout, component: lazy(() => import('../../routers/TierCompletionBonus.router')), path: "tier-completion-bonus" },
    { prefixname: "PROMCT", menucode: "PROMCT", layout: DefaultLayout, component: lazy(() => import('../../routers/RedemptionPromoCatalog.router')), path: "promo-catalog" },
    { prefixname: "CRITYPE", menucode: "CRITYPE", layout: DefaultLayout, component: lazy(() => import('../../routers/RedemptionPromoCriteriaType.router')), path: "promo-criteria-type" },
    { prefixname: "PROFILE", menucode: "PROFILE", layout: DefaultLayout, component: lazy(() => import('../../routers/RedemptionPromoFile.router')), path: "promo-file" },
    { prefixname: "MERACC", menucode: "MERACC", layout: DefaultLayout, component: lazy(() => import('../../routers/MergingAccount.router')), path: "merging-account" },
    { prefixname: "MERACC", menucode: "MERACC", layout: DefaultLayout, component: lazy(() => import('../../routers/MergeRequestList.router')), path: "merging-account-log" },
    { prefixname: "MERACC", menucode: "MERACC", layout: DefaultLayout, component: lazy(() => import('../../routers/CorrectionTransaction.router')), path: "correction-transaction" },
    { prefixname: "TRFMIL", menucode: "TRFMIL", layout: DefaultLayout, component: lazy(() => import('../../routers/TransferMileage.router')), path: "transfer-mileage" },
    { prefixname: "PROMBON", menucode: "PROMBON", layout: DefaultLayout, component: lazy(() => import('../../routers/CompletionBonusPromo.router')), path: "promo-completion-bonus" },
    { prefixname: "REFFBON", menucode: "REFFBON", layout: DefaultLayout, component: lazy(() => import('../../routers/ReferralBonus.router')), path: "referral-bonus" },
    { prefixname: "APPRBML", menucode: "APPRBML", layout: DefaultLayout, component: lazy(() => import('../../routers/ApprovalBuyMileage.router')), path: "approval-buy-mileage" },
    { prefixname: "APPRRED", menucode: "APPRRED", layout: DefaultLayout, component: lazy(() => import('../../routers/ApprovalRedemption.router')), path: "approval-redemption" },
    { prefixname: "APPRUPD", menucode: "APPRUPD", layout: DefaultLayout, component: lazy(() => import('../../routers/ApprovalRedemption.router')), path: "approval-redemption-update" },
    { prefixname: "APPRCAN", menucode: "APPRCAN", layout: DefaultLayout, component: lazy(() => import('../../routers/ApprovalRedemption.router')), path: "approval-redemption-cancel" },
    { prefixname: "MYAPPR", menucode: "MYAPPR", layout: DefaultLayout, component: lazy(() => import('../../routers/MyApproval.router')), path: "my-approval" },
    { prefixname: "PRMREGIS", menucode: "PRMREGIS", layout: DefaultLayout, component: lazy(() => import('../../routers/PromoRegistration.router')), path: "promo-registration" },
    { prefixname: "PRMANCT", menucode: "PRMANCT", layout: DefaultLayout, component: lazy(() => import('../../routers/PromoManageCatalog.router')), path: "promo-manage-catalog" },
    // { prefixname: "REPDASH", menucode: "REPDASH", layout: null, component: lazy(() => import('../../routers/ReportDashboard.router')), path: "dashboard-report" },
    { prefixname: "APPRCORP", menucode: "APPRCORP", layout: DefaultLayout, component: lazy(() => import('../../routers/ApprovalCorporateTravelco.router')), path: "approval-corporate-travelco" },
    { prefixname: "APPRCORP", menucode: "APPRCORP", layout: DefaultLayout, component: lazy(() => import('../../routers/ApprovalCorporateEmployee.router')), path: "approval-corporate-employee" },
    { prefixname: "JOBCTLG", menucode: "JOBCTLG", layout: DefaultLayout, component: lazy(() => import('../../routers/JobCatalogue.router')), path: "job-catalogue" },
    { prefixname: "VENDOR", menucode: "VENDOR", layout: DefaultLayout, component: lazy(() => import('../../routers/Vendor.router')), path: "vendor" },
    { prefixname: "VENREG", menucode: "VENREG", layout: DefaultLayout, component: lazy(() => import('../../routers/VendorRegion.router')), path: "vendor-region" },
    { prefixname: "PRMCT", menucode: "PRMCT", layout: DefaultLayout, component: lazy(() => import('../../routers/MailingProduct.router')), path: "mailing-product" },
    { prefixname: "LETTER", menucode: "LETTER", layout: DefaultLayout, component: lazy(() => import('../../routers/LetterManagement.router')), path: "letter-management" },
    { prefixname: "INVSYS", menucode: "INVSYS", layout: DefaultLayout, component: lazy(() => import('../../routers/InventoryManagement.router')), path: "inventory-management" },
    { prefixname: "OBP", menucode: "OBP", layout: DefaultLayout, component: lazy(() => import('../../routers/OBPData.router')), path: "obp" },
    { prefixname: "ACCRLRL", menucode: "ACCRLRL", layout: DefaultLayout, component: lazy(() => import('../../routers/AccrualRule.router')), path: "accrual-rule" },
    { prefixname: "MISTMTEM", menucode: "MISTMTEM", layout: DefaultLayout, component: lazy(() => import('../../routers/MileageStatementTemplate.router')), path: "mileage-statement-template" },
    { prefixname: "NOMIFEE", menucode: "NOMIFEE", layout: DefaultLayout, component: lazy(() => import('../../routers/NomineeFeeConfig.router')), path: "nominee-fee-config" },
    { prefixname: "OBP", menucode: "OBP", layout: DefaultLayout, component: lazy(() => import('../../routers/OBPData.router')), path: "obp" },
    { prefixname: "REPTMT", menucode: "REPTMT", layout: DefaultLayout, component: lazy(() => import('../../routers/ReportTerminateMember.router')), path: "terminate-member-report" },
    { prefixname: "REPACCT", menucode: "REPACCT", layout: DefaultLayout, component: lazy(() => import('../../routers/ReportAccounting.router')), path: "dashboard-accounting-report" },
    { prefixname: "USERLOG", menucode: "USERLOG", layout: DefaultLayout, component: lazy(() => import('../../routers/UserLog.router')), path: "user-log" },
    { prefixname: "RDASBIZ", menucode: "RDASBIZ", layout: DefaultLayout, component: lazy(() => import('../../routers/ReportBizmiles.router')), path: "dashboard-bizmiles-report" },
    { prefixname: "RDASPER", menucode: "RDASPER", layout: DefaultLayout, component: lazy(() => import('../../routers/ReportPerformance.router')), path: "dashboard-performance-report" },
    { prefixname: "RDASEXE", menucode: "RDASEXE", layout: DefaultLayout, component: lazy(() => import('../../routers/ReportExecutive.router')), path: "dashboard-executive-report" },
    { prefixname: "REPFSUS", menucode: "REPFSUS", layout: DefaultLayout, component: lazy(() => import('../../routers/ReportFraudSuspect.router')), path: "fraud-suspect-report" },
    { prefixname: "PRTD", menucode: "PRTD", layout: DefaultLayout, component: lazy(() => import('../../routers/OrderList.router')), path: "order-management/printing" },
    { prefixname: "PCKD", menucode: "PCKD", layout: DefaultLayout, component: lazy(() => import('../../routers/OrderListPackaging.router')), path: "order-management/package" },
    { prefixname: "DLVRD", menucode: "DLVRD", layout: DefaultLayout, component: lazy(() => import('../../routers/OrderListDelivery.router')), path: "order-management/delivery" },
    { prefixname: "REORDER", menucode: "REORDER", layout: DefaultLayout, component: lazy(() => import('../../routers/OrderListReorder.router')), path: "order-management/reorder" },
    { prefixname: "RETURN", menucode: "RETURN", layout: DefaultLayout, component: lazy(() => import('../../routers/OrderListReturn.helper')), path: "order-management/return" },
    { prefixname: "RETURN", menucode: "RETURN", layout: DefaultLayout, component: lazy(() => import('../../routers/OrderListTrack.helper')), path: "order-management/track" },
    { prefixname: "MMBRPRM", menucode: "MMBRPRM", layout: DefaultLayout, component: lazy(() => import('../../routers/MemberPromo.router')), path: "member-promo" },
    { prefixname: "MMBRPROF", menucode: "MMBRPROF", layout: DefaultLayout, component: lazy(() => import('../../routers/EmailVerified.router')), path: "email-verified" },
    { prefixname: "VENDOR", menucode: "VENDOR", layout: DefaultLayout, component: lazy(() => import('../../routers/Vendor.router')), path: "vendor" },
    { prefixname: "VENREG", menucode: "VENREG", layout: DefaultLayout, component: lazy(() => import('../../routers/VendorRegion.router')), path: "vendor-region" },
    { prefixname: "PRMCT", menucode: "PRMCT", layout: DefaultLayout, component: lazy(() => import('../../routers/MailingProduct.router')), path: "mailing-product" },
    { prefixname: "LETTER", menucode: "LETTER", layout: DefaultLayout, component: lazy(() => import('../../routers/LetterManagement.router')), path: "letter-management" },
    { prefixname: "DSMON", menucode: "DSMON", layout: DefaultLayout, component: lazy(() => import('../../routers/DataSync.router')), path: "data-sync-monitoring" },
    { prefixname: "DSCHCK", menucode: "DSCHCK", layout: DefaultLayout, component: lazy(() => import('../../routers/DataSync.router')), path: "data-sync-checking" },
];


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            timeIdle: false, //seconds,
            isIdle: false
        }
        this.idleTimer = null;
        this.onIdle = this._onIdle.bind(this);
    }

    componentWillMount() {
        var pathname = this.props.location.pathname;
        var modulename = pathname.split("/")[1];
        let isBOD = (getProfile().rolename === 'BOD');

        if (isLoggedIn() && modulename !== 'activation' && (modulename !== 'mini-view' || modulename !== 'otp')) {
            this.setState({ isLoading: true });

            let response = getPermission();
            /* USER MENU MAPPING */
            var usermenu_final = {};
            var menucode = '';
            var functioncode = '';
            var grant = null;
            var responseusermenu = (response && response.usermenu) ? response.usermenu : [];
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
            var responseenrollmembershiplist = (response && response.enrollmentaccess) ? response.enrollmentaccess : [];
            for (const key in responseenrollmembershiplist) {
                membershipid = responseenrollmembershiplist[key]['membershipid'];
                grant = responseenrollmembershiplist[key]['grant'];
                enrollmentaccess["MEMBERSHIP_" + membershipid] = grant;
            }
            this.props.setPermission({ usermenu_final, enrollmentaccess });
            this.setState({ isLoading: false });
        }

        /* get data timeIdle from env.json */
        axios.get("/config/env.json").then((response) => {
            const { data } = response;
            if (data) {
                const { timeIdle } = data;
                this.setState({ timeIdle });
            }
        });
    }

    _onIdle(e) {
        this.notificationForceLogout();
    }

    notificationForceLogout() {
        let secondsToGo = 5;
        const modal = Modal.warning({
            title: 'You are idle',
            content: `Your application will log out in ${secondsToGo} seconds.`,
            closable: false
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `Your application will log out in ${secondsToGo} seconds.`,
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
            logout();
        }, secondsToGo * 1000);
    }

    render() {
        const { isLoading } = this.state;
        var pathname = this.props.location.pathname;
        var modulename = pathname.split("/")[1];

        let isBranch = (getProfile().branchcode && getProfile().tickoffid) ? true : false;
        let isBOD = (getProfile().rolename === 'BOD');

        let excludeRoute = ["activation", "announcement", "reset-password-member", "reset-password"];

        return (
            <CacheBuster {...this.props}>
                {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                    if (loading) return null;

                    //check latest version application
                    if (!loading && !isLatestVersion) {
                        refreshCacheAndReload();
                    }

                    if (modulename === 'merging') {
                        return <MergingConfirmationRouter />;
                    } else if (modulename === 'nominee') {
                        return <NomineeConfirmationRouter />;
                    } else if (isLoggedIn() && !excludeRoute.includes(modulename)) {
                        const { timeIdle } = this.state;
                        return (
                            <Spin spinning={isLoading}>
                                {
                                    (timeIdle) ?
                                        <IdleTimer
                                            ref={ref => { this.idleTimer = ref }}
                                            element={document}
                                            onIdle={this.onIdle}
                                            debounce={250}
                                            timeout={1000 * timeIdle} /> : null
                                }
                                <Layout>
                                    <Header />
                                    <Content className='homepage-container'>
                                        <Suspense fallback={
                                            <Row>
                                                <Content className='homepage-content'>
                                                    <Skeleton active />
                                                </Content>
                                            </Row>
                                        }>
                                            <Switch>
                                                {
                                                    (isBOD) ?
                                                        <PrivateRoute {...this.props} layout={null} component={lazy(() => import('../../routers/Member.router'))} path="/member" permission={this.props.permission.usermenu} prefixname="BMEMMGT" menucode="BMEMMGT" /> :
                                                        <Route exact path='/' render={() => <DashboardLayout><HomePage /></DashboardLayout>} />
                                                }
                                                <Route exact path='/profile' render={() => <DefaultLayout><ProfileComponent /></DefaultLayout>} />
                                                {/* {
                                                    (isPartner) ? <Route exact path='/voucher-verification' render={() => <DefaultLayout><VoucherVerification /></DefaultLayout>} /> : null
                                                } */}
                                                {
                                                    (isBranch) ?
                                                        (!isLoading) ? router.map((obj, key) => {
                                                            return (<PrivateRoute {...this.props} key={key} layout={obj.layout} component={obj.component} path={"/" + obj.path} permission={this.props.permission.usermenu} prefixname={obj.prefixname} menucode={obj.menucode} />)
                                                        }) : <Skeleton active /> : null
                                                }
                                                <Route component={Error404} />
                                            </Switch>
                                        </Suspense>
                                    </Content>
                                </Layout>
                                <Footer />
                            </Spin>
                        )
                    } else {
                        return ((modulename === 'mini-view') ? <MiniViewRouter /> : <LoginRouter />);
                    }
                }}
            </CacheBuster>
        )
    }
}

function PrivateRoute({ layout: ManagementLayout, layout: DefaultLayout, component: Component, ...props }) {
    let permission = props.permission;
    let menucode = props.menucode;
    let access = props.prefixname + "_ACCESS";
    return (
        <Route {...props} permission={permission}
            render={props =>
                (permission[menucode] !== undefined) ?
                    (permission[menucode][access]) ?
                        (ManagementLayout) ? <ManagementLayout {...props}><Component {...props} permission={permission} /></ManagementLayout> : <Component {...props} permission={permission} />
                        : <Error403 {...props} /> : null} />);
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
    setPermission: (data) => dispatch(setPermission(data))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
