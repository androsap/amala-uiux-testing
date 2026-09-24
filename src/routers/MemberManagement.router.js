import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import Error404 from '../pages/error/Error404';
import Error403 from '../pages/error/Error403';
import { Skeleton } from 'antd';
import { getProfile } from '../utilities/AuthService';

const MemberReceipt = lazy(() => import('../pages/member/receipt/Index'));
const MemberTransaction = lazy(() => import('../pages/member/transaction/Index'));
const MemberTransactionForm = lazy(() => import('../pages/member/transaction/Form'));
const MemberTransactionDetail = lazy(() => import('../pages/member/transaction/TrxDetail'));
const MemberTier = lazy(() => import('../pages/member/tier/Index'));
const MemberTierForm = lazy(() => import('../pages/member/tier/Form'));
const MemberCard = lazy(() => import('../pages/member/card/Index'));
const MemberCardChangeDate = lazy(() => import('../pages/member/card/Form/ChangeDate'));

const MemberProfile = lazy(() => import('../pages/member/profile/Form'));
const MemberAddressIndex = lazy(() => import('../pages/member/address/Index'));
const MemberContactIndex = lazy(() => import('../pages/member/contact/Index'));
const MemberIdentityIndex = lazy(() => import('../pages/member/identity/Index'));
const MemberHobbiesForm = lazy(() => import('../pages/member/hobbies/Form'));
const MemberActivity = lazy(() => import('../pages/member/activity/Index'));
const MemberActivityLimit = lazy(() => import('../pages/member/activity/limit/Index'));
const MemberActivityNonAir = lazy(() => import('../pages/member/activity/activity/non_air/Form'));
const MemberActivityAir = lazy(() => import('../pages/member/activity/activity/air/Form'));

const MemberCobrand = lazy(() => import('../pages/member/cobran/Index'));
const MemberCobrandForm = lazy(() => import('../pages/member/cobran/Form'));
const MemberCobrandApproval = lazy(() => import('../pages/member/cobran/Approval'));

/* REDEMPTION FREEFLIGHT */
const RedemptionIndex = lazy(() => import('../pages/member/redemption/Index'));
const RedemptionFreeflightSearchFlight = lazy(() => import('../pages/member/redemption/freeflight/SearchFlight'));
const RedemptionFreeflightForm = lazy(() => import('../pages/member/redemption/freeflight/Form'));
const RedemptionFreeflightCertificate = lazy(() => import('../pages/member/redemption/freeflight/Certificate'));

/* REDEMPTION UPGRADE */
const RedemptionUpgradeSearchFlight = lazy(() => import('../pages/member/redemption/upgrade/SearchFlight'));
const RedemptionUpgradeForm = lazy(() => import('../pages/member/redemption/upgrade/Form'));
const RedemptionUpgradeCertificate = lazy(() => import('../pages/member/redemption/upgrade/Certificate'));

/* REDEMPTION VOUCHER */
const RedemptionVoucherForm = lazy(() => import('../pages/member/redemption/voucher/Form'));
const RedemptionVoucherCertificate = lazy(() => import('../pages/member/redemption/voucher/Certificate'));

/* REDEMPTION TRANSFER */
const RedemptionTransferForm = lazy(() => import('../pages/member/redemption/transfer/Form'));
const RedemptionTransferCertificate = lazy(() => import('../pages/member/redemption/transfer/Certificate'));

/* REDEMPTION HOTELS */
const RedemptionHotelsForm = lazy(() => import('../pages/member/redemption/hotels/Form'));
const RedemptionHotelsCertificate = lazy(() => import('../pages/member/redemption/hotels/Certificate'));

// REDEMPTION OTP
/* REDEMPTION FREEFLIGHT */
const RedemptionIndexOTP = lazy(() => import('../pages/member/redemption_otp/Index'));
const RedemptionFreeflightSearchFlightOTP = lazy(() => import('../pages/member/redemption_otp/freeflight/SearchFlight'));
const RedemptionFreeflightFormOTP = lazy(() => import('../pages/member/redemption_otp/freeflight/Form'));
const RedemptionFreeflightCertificateOTP = lazy(() => import('../pages/member/redemption_otp/freeflight/Certificate'));

/* REDEMPTION UPGRADE */
const RedemptionUpgradeSearchFlightOTP = lazy(() => import('../pages/member/redemption_otp/upgrade/SearchFlight'));
const RedemptionUpgradeFormOTP = lazy(() => import('../pages/member/redemption_otp/upgrade/Form'));
const RedemptionUpgradeCertificateOTP = lazy(() => import('../pages/member/redemption_otp/upgrade/Certificate'));

/* REDEMPTION VOUCHER */
const RedemptionVoucherFormOTP = lazy(() => import('../pages/member/redemption_otp/voucher/Form'));
const RedemptionVoucherCertificateOTP = lazy(() => import('../pages/member/redemption_otp/voucher/Certificate'));

/* REDEMPTION TRANSFER */
const RedemptionTransferFormOTP = lazy(() => import('../pages/member/redemption_otp/transfer/Form'));
const RedemptionTransferCertificateOTP = lazy(() => import('../pages/member/redemption_otp/transfer/Certificate'));

/* REDEMPTION HOTELS */
const RedemptionHotelsFormOTP = lazy(() => import('../pages/member/redemption_otp/hotels/Form'));
const RedemptionHotelsCertificateOTP = lazy(() => import('../pages/member/redemption_otp/hotels/Certificate'));


/* CERTIFICATE */
const CertificateIndex = lazy(() => import('../pages/member/certificate/Index'));
const CertificateView = lazy(() => import('../pages/member/certificate/View'));
const CertificateCancel = lazy(() => import('../pages/member/certificate/cancel/Index'));
const CertificateMyApprovalView = lazy(() => import('../pages/my_approval/View'));

/* UPDATE CERTIFICATE */
const CertificateAirUpdate = lazy(() => import('../pages/member/certificate/update/air/Index'));

/* UPDATE CERTIFICATE AIR FREEFLIGHT */
const CertificateFreeSearchUpdate = lazy(() => import('../pages/member/certificate/update/air/freeflight/SearchFlight'));
const CertificateFreeBuyUpdate = lazy(() => import('../pages/member/certificate/update/air/freeflight/Form'));

/* UPDATE CERTIFICATE AIR UPGRADE */
const CertificateUpgSearchUpdate = lazy(() => import('../pages/member/certificate/update/air/upgrade/SearchFlight'));
const CertificateUpgBuyUpdate = lazy(() => import('../pages/member/certificate/update/air/upgrade/Form'));

//CERTIFICATE OTP
/* CERTIFICATE */
const CertificateIndexOTP = lazy(() => import('../pages/member/certificate_otp/Index'));
const CertificateViewOTP = lazy(() => import('../pages/member/certificate_otp/View'));
const CertificateCancelOTP = lazy(() => import('../pages/member/certificate_otp/cancel/Index'));
const CertificateMyApprovalViewOTP = lazy(() => import('../pages/my_approval/View'));

/* UPDATE CERTIFICATE */
const CertificateAirUpdateOTP = lazy(() => import('../pages/member/certificate_otp/update/air/Index'));

/* UPDATE CERTIFICATE AIR FREEFLIGHT */
const CertificateFreeSearchUpdateOTP = lazy(() => import('../pages/member/certificate_otp/update/air/freeflight/SearchFlight'));
const CertificateFreeBuyUpdateOTP = lazy(() => import('../pages/member/certificate_otp/update/air/freeflight/Form'));

/* UPDATE CERTIFICATE AIR UPGRADE */
const CertificateUpgSearchUpdateOTP = lazy(() => import('../pages/member/certificate_otp/update/air/upgrade/SearchFlight'));
const CertificateUpgBuyUpdateOTP = lazy(() => import('../pages/member/certificate_otp/update/air/upgrade/Form'));

const MemberAlias = lazy(() => import('../pages/member/alias/Index'));
const MemberNotes = lazy(() => import('../pages/member/notes/Index'));
// const MemberAccount = lazy(() => import('../pages/member/account/Index'));
const ResetPassword = lazy(() => import('../pages/member/reset_password/Index'));
const TerminateReactivate = lazy(() => import('../pages/member/terminate_reactivate/Index'));

/* MEMBER RETRO CLAIM */
const MemberRetroClaim = lazy(() => import('../pages/member/retro_claim/Index'));
const MemberRetroClaimForm = lazy(() => import('../pages/member/retro_claim/Form'));

/* MEMBER MALING */
const MemberMailing = lazy(() => import('../pages/member/mailing/Index'));

/* MEMBER BUY MILEAGE */
const MemberBuyMileage = lazy(() => import('../pages/member/buy_mileage/Index'));
const MemberBuyMileageForm = lazy(() => import('../pages/member/buy_mileage/Form'));
const MemberBuyMileageExpiredForm = lazy(() => import('../pages/member/buy_mileage/expired/Form'));
const MemberBuyMileageExpiredFormBuy = lazy(() => import('../pages/member/buy_mileage/expired/FormBuy'));

/* MEMBER NOMINEE */
const MemberNominee = lazy(() => import('../pages/member/nominee/Index'));
const MemberNomineeForm = lazy(() => import('../pages/member/nominee/Form'));

/* MEMBER BUY PRODUCT */
const MemberBuyProduct = lazy(() => import('../pages/member/buy_product/Index'));
const MemberBuyProductForm = lazy(() => import('../pages/member/buy_product/Form'));
const MemberBuyProductCancel = lazy(() => import('../pages/member/buy_product/Cancel'));
const MemberBuyProductFormTrackOrder = lazy(() => import('../pages/member/buy_product/TrackOrder'));

/* MEMBER MILEAGE STATEMENT */
const MemberMileageStatement = lazy(() => import('../pages/member/mileage_statement/Index'));
const MemberMileageStatementDetail = lazy(() => import('../pages/member/mileage_statement/Detail'));

/* MEMBER CORPORATE */
const MemberCorporateProfile = lazy(() => import('../pages/member_corporate/profile/Form'));
const MemberTourCode = lazy(() => import('../pages/member_corporate/tour_code/Index'));
const MemberTourCodeForm = lazy(() => import('../pages/member_corporate/tour_code/Form'));
const MemberTravelCo = lazy(() => import('../pages/member_corporate/travel_coordinator/Index'));
const MemberTravelCoForm = lazy(() => import('../pages/member_corporate/travel_coordinator/Form'));

const MemberRelationIndex = lazy(() => import('../pages/member/member_relation/Index'));
const MemberRelationForm = lazy(() => import('../pages/member/member_relation/Form'));

const TravelCoordinatorIndex = lazy(() => import('../pages/member/travel_coordinator/Index'));

/* MEMBER SUBSCRIPTION*/
const MemberSubscription = lazy(() => import('../pages/member/subscription/Index'));

const isBOD = getProfile().rolename === 'BOD';
const Router = ({ match, permission, headerdata, refreshHeader, retrieveSession, retrieveTimeOTP, isLoading, responseSession, otpsessiontimelimit, dataOTP, handleLoading }) => (
	<Suspense fallback={<Skeleton />}>
		<Switch>
			{/* for user BOD */}
			{
				(isBOD) ?
					<span>
						<Route exact path='/member/form/:ID/personal-information' render={(props) => (permission !== undefined && permission['usermenu']["BMEMPRO"]["BMEMPRO_ACCESS"]) ? <MemberProfile menucode="BMEMPRO" prefixmenuname="BMEMPRO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/address' render={(props) => (permission !== undefined && permission['usermenu']["BMEMADD"]["BMEMADD_ACCESS"]) ? <MemberAddressIndex menucode="BMEMADD" prefixmenuname="BMEMADD" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/contact' render={(props) => (permission !== undefined && permission['usermenu']["BMEMCON"]["BMEMCON_ACCESS"]) ? <MemberContactIndex menucode="BMEMCON" prefixmenuname="BMEMCON" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/reset-password' render={(props) => (permission !== undefined && permission['usermenu']["BMEMRES"]["BMEMRES_ACCESS"]) ? <ResetPassword menucode="BMEMRES" prefixmenuname="BMEMRES" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/tier' render={(props) => (permission !== undefined && permission['usermenu']["BMEMTIE"]["BMEMTIE_ACCESS"]) ? <MemberTier menucode="BMEMTIE" prefixmenuname="BMEMTIE" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/transaction' render={(props) => (permission !== undefined && permission['usermenu']["BMEMTRX"]["BMEMTRX_ACCESS"]) ? <MemberTransaction menucode="BMEMTRX" prefixmenuname="BMEMTRX" {...props} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/transaction/form' render={(props) => (permission !== undefined && permission['usermenu']["BMEMTRX"]["BMEMTRX_ACCESS"] && permission['usermenu']["BMEMTRX"]["BMEMTRX_CREATE"]) ? <MemberTransactionForm menucode="BMEMTRX" prefixmenuname="BMEMTRX" refreshHeader={refreshHeader} {...props} /> : <Error403 {...props} />} />
						<Route exact path='/member/form/:ID/transaction/detail/:trxid' render={(props) => (permission !== undefined && permission['usermenu']["BMEMTRX"]["BMEMTRX_ACCESS"]) ? <MemberTransactionDetail menucode="BMEMTRX" prefixmenuname="BMEMTRX" {...props} /> : <Error403 {...props} />} />
					</span> : ''
			}

			<Route exact path='/member/form/:ID/address' render={(props) => (permission !== undefined && permission['usermenu']["MMBRADRS"]["MMBRADRS_ACCESS"]) ? <MemberAddressIndex menucode="MMBRADRS" prefixmenuname="MMBRADRS" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/receipt' render={(props) => <MemberReceipt menucode="MBRRECPT" prefixmenuname="MBRRECPT" {...props} />} />
			<Route exact path='/member/form/:ID/transaction' render={(props) => (permission !== undefined && permission['usermenu']["MBRTRANS"]["MBRTRANS_ACCESS"]) ? <MemberTransaction menucode="MBRTRANS" prefixmenuname="MBRTRANS" {...props} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/transaction/form' render={(props) => (permission !== undefined && permission['usermenu']["MBRTRANS"]["MBRTRANS_ACCESS"] && permission['usermenu']["MBRTRANS"]["MBRTRANS_CREATE"]) ? <MemberTransactionForm menucode="MBRTRANS" prefixmenuname="MBRTRANS" refreshHeader={refreshHeader} {...props} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/transaction/detail/:trxid' render={(props) => (permission !== undefined && permission['usermenu']["MBRTRANS"]["MBRTRANS_ACCESS"]) ? <MemberTransactionDetail menucode="MBRTRANS" prefixmenuname="MBRTRANS" {...props} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/tier' render={(props) => (permission !== undefined && permission['usermenu']["MBRTIER"]["MBRTIER_ACCESS"]) ? <MemberTier menucode="MBRTIER" prefixmenuname="MBRTIER" refreshHeader={refreshHeader} {...props} {...headerdata} permission={permission} /> : <Error403 {...props} />} />
			{/* <Route exact path='/member/form/:ID/tier/form' render={(props) => (permission !== undefined && permission['usermenu']["MBRTIER"]["MBRTIER_ACCESS"] && permission['usermenu']["MBRTIER"]["MBRTIER_UPDATE"]) ? <MemberTierForm menucode="MBRTIER" prefixmenuname="MBRTIER" refreshHeader={refreshHeader} {...props}  {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/tier/form/:membertierid' render={(props) => (permission !== undefined && permission['usermenu']["MBRTIER"]["MBRTIER_ACCESS"] && permission['usermenu']["MBRTIER"]["MBRTIER_UPDATE"]) ? <MemberTierForm menucode="MBRTIER" prefixmenuname="MBRTIER" refreshHeader={refreshHeader} {...props}  {...headerdata} /> : <Error403 {...props} />} /> */}

			<Route exact path='/member/form/:ID/card' render={(props) => (permission !== undefined && permission['usermenu']["MBRCRD"]["MBRCRD_ACCESS"]) ? <MemberCard menucode="MBRCRD" prefixmenuname="MBRCRD" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/card/changedate/:membercardid' render={(props) => (permission !== undefined && permission['usermenu']["MBRCRD"]["MBRCRD_ACCESS"] && permission['usermenu']["MBRCRD"]["MBRCRD_DATE"]) ? <MemberCardChangeDate menucode="MBRCRD" prefixmenuname="MBRCRD" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/personal-information' render={(props) => (permission !== undefined && permission['usermenu']["MMBRPROF"]["MMBRPROF_ACCESS"]) ? <MemberProfile menucode="MMBRPROF" prefixmenuname="MMBRPROF" refreshHeader={refreshHeader} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/contact' render={(props) => (permission !== undefined && permission['usermenu']["MMBRCNTC"]["MMBRCNTC_ACCESS"]) ? <MemberContactIndex menucode="MMBRCNTC" prefixmenuname="MMBRCNTC" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/identity' render={(props) => (permission !== undefined && permission['usermenu']["MMBRIDT"]["MMBRIDT_ACCESS"]) ? <MemberIdentityIndex menucode="MMBRIDT" prefixmenuname="MMBRIDT" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/hobbies' render={(props) => (permission !== undefined && permission['usermenu']["MMBRHOBI"]["MMBRHOBI_ACCESS"]) ? <MemberHobbiesForm menucode="MMBRHOBI" prefixmenuname="MMBRHOBI" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/activity' render={(props) => (permission !== undefined && permission['usermenu']["MBRACT"]["MBRACT_ACCESS"]) ? <MemberActivity menucode="MBRACT" prefixmenuname="MBRACT" permission={permission} refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/activity/nonair/form' render={(props) => (permission !== undefined && permission['usermenu']["MBRACT"]["MBRACT_ACCESS"]) ? <MemberActivityNonAir menucode="MBRACT" prefixmenuname="MBRACT" permission={permission} refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/activity/nonair/form/:activityid' render={(props) => (permission !== undefined && permission['usermenu']["MBRACT"]["MBRACT_ACCESS"] && permission['usermenu']["MBRACT"]["MBRACT_UPDATE"]) ? <MemberActivityNonAir menucode="MBRACT" prefixmenuname="MBRACT" permission={permission} refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/activity/air/form' render={(props) => (permission !== undefined && permission['usermenu']["MBRACT"]["MBRACT_ACCESS"]) ? <MemberActivityAir menucode="MBRACT" prefixmenuname="MBRACT" permission={permission} refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/activity/air/form/:activityid' render={(props) => (permission !== undefined && permission['usermenu']["MBRACT"]["MBRACT_ACCESS"] && permission['usermenu']["MBRACT"]["MBRACT_UPDATE"]) ? <MemberActivityAir menucode="MBRACT" prefixmenuname="MBRACT" permission={permission} refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/limit' render={(props) => (permission !== undefined && permission['usermenu']["MBRACT"]["MBRACT_ACCESS"]) ? <MemberActivityLimit menucode="MBRACT" prefixmenuname="MBRACT" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/cobrand' render={(props) => (permission !== undefined && permission['usermenu']["MBRCBRN"]["MBRCBRN_ACCESS"]) ? <MemberCobrand menucode="MBRCBRN" prefixmenuname="MBRCBRN" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/cobrand/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBRCBRN"]["MBRCBRN_ACCESS"] && permission['usermenu']["MBRCBRN"]["MBRCBRN_CREATE"]) ? <MemberCobrandForm menucode="MBRCBRN" prefixmenuname="MBRCBRN" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/cobrand/form/:membercobrandid' render={(props) => (permission !== undefined && permission['usermenu']["MBRCBRN"]["MBRCBRN_ACCESS"] && permission['usermenu']["MBRCBRN"]["MBRCBRN_UPDATE"]) ? <MemberCobrandForm menucode="MBRCBRN" prefixmenuname="MBRCBRN" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/cobrand/form/:membercobrandid/approval' render={(props) => (permission !== undefined && permission['usermenu']["MBRCBRN"]["MBRCBRN_ACCESS"] && permission['usermenu']["MBRCBRN"]["MBRCBRN_APPROVE"]) ? <MemberCobrandApproval menucode="MBRCBRN" prefixmenuname="MBRCBRN" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemption' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionIndex menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/freeflight/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionFreeflightSearchFlight menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/freeflight/:awardcode/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionFreeflightForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/freeflight/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionFreeflightCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemption/upgrade/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionUpgradeSearchFlight menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/upgrade/:awardcode/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionUpgradeForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/upgrade/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionUpgradeCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemption/voucher/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionVoucherForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/voucher/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionVoucherCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemption/transfer/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionTransferForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/transfer/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionTransferCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemption/hotel/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionHotelsForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemption/hotel/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionHotelsCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			{/* Redemption OTP */}
			<Route exact path='/member/form/:ID/redemptionotp' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionIndexOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/freeflight/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionFreeflightSearchFlightOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/freeflight/:awardcode/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionFreeflightFormOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/freeflight/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionFreeflightCertificateOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemptionotp/upgrade/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionUpgradeSearchFlightOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/upgrade/:awardcode/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionUpgradeFormOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/upgrade/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionUpgradeCertificateOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemptionotp/voucher/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionVoucherFormOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/voucher/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionVoucherCertificateOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemptionotp/transfer/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionTransferFormOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/transfer/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionTransferCertificateOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/redemptionotp/hotel/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionHotelsFormOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/redemptionotp/hotel/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEMOTP"]["REDOTP_ACCESS"]) ? <RedemptionHotelsCertificateOTP menucode="REDEEMOTP" prefixmenuname="REDOTP" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP} handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			{/* Redemption OTP */}

			<Route exact path='/member/form/:ID/certificate' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CERTIF_ACCESS"]) ? <CertificateIndex menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} {...permission} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificate/view/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CERTIF_ACCESS"]) ? <CertificateView menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificate/cancel/:certificateid' render={(props) => (permission !== undefined && (permission['usermenu']["CERTIF"]["CERTIF_CANCEL"] || (!permission['usermenu']["CERTIF"]["CERTIF_CANCEL"] && permission['usermenu']["CERTIF"]["CERTIF_REQCNCLE"]))) ? <CertificateCancel menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificate/update/:certificateid' render={(props) => (permission !== undefined && (permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"]))) ? <CertificateAirUpdate menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/certificate/update/:certificateid/freeflight' render={(props) => (permission !== undefined && (permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"]))) ? <CertificateFreeSearchUpdate menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificate/update/:certificateid/freeflight/buy' render={(props) => (permission !== undefined && (permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"]))) ? <CertificateFreeBuyUpdate menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/certificate/update/:certificateid/upgrade' render={(props) => (permission !== undefined && (permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"]))) ? <CertificateUpgSearchUpdate menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificate/update/:certificateid/upgrade/buy' render={(props) => (permission !== undefined && (permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"]))) ? <CertificateUpgBuyUpdate menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/certificate/my-approval/form/:requestid' render={(props) => (permission !== undefined && permission['usermenu']["MYAPPR"]["MYAPPR_UPDATE"]) ? <CertificateMyApprovalView menucode="MYAPPR" prefixmenuname="MYAPPR" refreshHeader={refreshHeader} fromCertif={true} {...props} {...headerdata} /> : <Error403 {...props} />} />

			{/* Certificate OTP */}
			{/* <Route exact path='/member/form/:ID/certificateotp' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"]) ? <CertificateIndexOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata}   dataOTP={dataOTP} {...permission}  isLoading={isLoading}  /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificateotp/view/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"]) ? <CertificateViewOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificateotp/cancel/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"] || (!permission['usermenu']["CERTIF"]["CERTIF_CANCEL"] && permission['usermenu']["CERTIF"]["CERTIF_REQCNCLE"])) ? <CertificateCancelOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit}  /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificateotp/update/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"])) ? <CertificateAirUpdateOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/certificateotp/update/:certificateid/freeflight' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"])) ? <CertificateFreeSearchUpdateOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificateotp/update/:certificateid/freeflight/buy' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"])) ? <CertificateFreeBuyUpdateOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/certificateotp/update/:certificateid/upgrade' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"])) ? <CertificateUpgSearchUpdateOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/certificateotp/update/:certificateid/upgrade/buy' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"] || (!permission['usermenu']["CERTIF"]["CERTIF_UPDATE"] && permission['usermenu']["CERTIF"]["CERTIF_REQUPDTE"])) ? <CertificateUpgBuyUpdateOTP menucode="CERTIF" prefixmenuname="CERTIF" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/certificateotp/my-approval/form/:requestid' render={(props) => (permission !== undefined && permission['usermenu']["CERTIF"]["CER_ACCESSOTP"]) ? <CertificateMyApprovalViewOTP menucode="MYAPPR" prefixmenuname="MYAPPR" refreshHeader={refreshHeader} retrieveSession={retrieveSession} retrieveTimeOTP={retrieveTimeOTP}  handleLoading={handleLoading}  fromCertif={true} {...props} {...headerdata} dataOTP={dataOTP} isLoading={isLoading} responseSession={responseSession} otpsessiontimelimit={otpsessiontimelimit} /> : <Error403 {...props} />} /> */}
			{/* Certificate OTP */}

			<Route exact path='/member/form/:ID/alias' render={(props) => (permission !== undefined && permission['usermenu']["MBALIAS"]["MBALIAS_ACCESS"]) ? <MemberAlias menucode="MBALIAS" prefixmenuname="MBALIAS" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/notes' render={(props) => (permission !== undefined && permission['usermenu']["MBNOTES"]["MBNOTES_ACCESS"]) ? <MemberNotes menucode="MBNOTES" prefixmenuname="MBNOTES" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			{/* <Route exact path='/member/form/:ID/account' render={(props) => (permission !== undefined && permission['usermenu']["MBRACC"]["MBRACC_ACCESS"]) ? <MemberAccount menucode="MBRACC" prefixmenuname="MBRACC" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} /> */}
			<Route exact path='/member/form/:ID/reset-password' render={(props) => (permission !== undefined && permission['usermenu']["MBRESET"]["MBRESET_ACCESS"]) ? <ResetPassword menucode="MBRESET" prefixmenuname="MBRESET" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/terminate-reactivate' render={(props) => (permission !== undefined && permission['usermenu']["MBTERM"]["MBTERM_ACCESS"]) ? <TerminateReactivate menucode="MBALIAS" prefixmenuname="MBALIAS" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/subscription' render={(props) => (permission !== undefined && permission['usermenu']["MBALIAS"]["MBALIAS_ACCESS"]) ? <MemberSubscription menucode="MBALIAS" prefixmenuname="MBALIAS" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/member-relation' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"]) ? <MemberRelationIndex menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/member-relation/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"] && permission['usermenu']["MBRRELA"]["MBRRELA_CREATE"]) ? <MemberRelationForm menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/member-relation/form/:memberrelationid' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"] && permission['usermenu']["MBRRELA"]["MBRRELA_UPDATE"]) ? <MemberRelationForm menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/travel-coordinator' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"]) ? <TravelCoordinatorIndex menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/retro-claim' render={(props) => (permission !== undefined && permission['usermenu']["MBRRETCL"]["MBRRETCL_ACCESS"]) ? <MemberRetroClaim menucode="MBRRETCL" prefixmenuname="MBRRETCL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/retro-claim/form/:retroclaimid' render={(props) => (permission !== undefined && permission['usermenu']["MBRRETCL"]["MBRRETCL_ACCESS"]) ? <MemberRetroClaimForm menucode="MBRRETCL" prefixmenuname="MBRRETCL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/mailing' render={(props) => (permission !== undefined && permission['usermenu']["MBRMAIL"]["MBRMAIL_ACCESS"]) ? <MemberMailing menucode="MBRMAIL" prefixmenuname="MBRMAIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/buy-mileage' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileage menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} permission={permission} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageForm menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form/:memberbuymileageid' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageForm menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form/:memberbuymileageid/confirmation' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageForm menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} showconfirmation={true} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/nominee' render={(props) => (permission !== undefined && permission['usermenu']["RDMNOMIN"]["RDMNOMIN_ACCESS"]) ? <MemberNominee menucode="RDMNOMIN" prefixmenuname="RDMNOMIN" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/nominee/form' render={(props) => (permission !== undefined && permission['usermenu']["RDMNOMIN"]["RDMNOMIN_ACCESS"]) ? <MemberNomineeForm menucode="RDMNOMIN" prefixmenuname="RDMNOMIN" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/buy-mileage/form-expired/' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredForm menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form-expired-buy/' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredFormBuy menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form-expired-buy/:memberbuymileageid' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredFormBuy menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form-expired-buy/:memberbuymileageid/confirmation' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredFormBuy menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} showconfirmation={true} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/mileage-statement' render={(props) => (permission !== undefined && permission['usermenu']["MMBRMILST"]["MBRMILST_ACCESS"]) ? <MemberMileageStatement menucode="MMBRMILST" prefixmenuname="MBRMILST" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/mileage-statement/detail/:mileagestatementid' render={(props) => (permission !== undefined && (permission['usermenu']["MMBRMILST"]["MBRMILST_ACCESS"])) ? <MemberMileageStatementDetail menucode="MMBRMILST" prefixmenuname="MBRMILST" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/buy-mileage/form-expired/' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredForm menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form-expired-buy/' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredFormBuy menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form-expired-buy/:memberbuymileageid' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredFormBuy menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-mileage/form-expired-buy/:memberbuymileageid/confirmation' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"] && permission['usermenu']["MBBUYMIL"]["MBBUYMIL_ACCESS"]) ? <MemberBuyMileageExpiredFormBuy menucode="MBBUYMIL" prefixmenuname="MBBUYMIL" refreshHeader={refreshHeader} {...props} {...headerdata} showconfirmation={true} /> : <Error403 {...props} />} />

			<Route exact path='/member/form/:ID/buy-product' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"]) ? <MemberBuyProduct menucode="MBBUYPRO" prefixmenuname="MBBUYPRO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-product/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"] && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"]) ? <MemberBuyProductForm menucode="MBBUYPRO" prefixmenuname="MBBUYPRO" refreshHeader={refreshHeader} permission={permission} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-product/form/:ordercode' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"] && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"]) ? <MemberBuyProductForm menucode="MBBUYPRO" prefixmenuname="MBBUYPRO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-product/form/:ordercode/cancel' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"] && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"]) ? <MemberBuyProductCancel menucode="MBBUYPRO" prefixmenuname="MBBUYPRO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-product/form/:ordercode/confirmation' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"] && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"]) ? <MemberBuyProductForm menucode="MBBUYPRO" prefixmenuname="MBBUYPRO" refreshHeader={refreshHeader} {...props} {...headerdata} showconfirmation={true} /> : <Error403 {...props} />} />
			<Route exact path='/member/form/:ID/buy-product/form/:ordercode/track-order' render={(props) => (permission !== undefined && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"] && permission['usermenu']["MBBUYPRO"]["MBBUYPRO_ACCESS"]) ? <MemberBuyProductFormTrackOrder menucode="MBBUYPRO" prefixmenuname="MBBUYPRO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			{/* <Route exact path='/member/form/:ID/merging-account/detail/:mileagestatementid' render={(props) => (permission !== undefined && (permission['usermenu']["MMBRMILST"]["MBRMILST_ACCESS"])) ? <MemberMileageStatementDetail menucode="MMBRMILST" prefixmenuname="MBRMILST" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} /> */}

			{/*==== MEMBER CORPORATE ROUTER ====*/}
			<Route exact path='/member-corporate/form/:ID/profile' render={(props) => (permission !== undefined && permission['usermenu']["MBERCORP"]["MBERCORP_ACCESS"]) ? <MemberCorporateProfile menucode="MBERCORP" prefixmenuname="MBERCORP" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			{/* <Route exact path='/member-corporate/form/:ID/account' render={(props) => (permission !== undefined && permission['usermenu']["MBRACC"]["MBRACC_ACCESS"]) ? <MemberAccount menucode="MBRACC" prefixmenuname="MBRACC" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} /> */}
			<Route exact path='/member-corporate/form/:ID/tier' render={(props) => (permission !== undefined && permission['usermenu']["MBRTIER"]["MBRTIER_ACCESS"]) ? <MemberTier menucode="MBRTIER" prefixmenuname="MBRTIER" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/tier/form' render={(props) => (permission !== undefined && permission['usermenu']["MBRTIER"]["MBRTIER_ACCESS"] && permission['usermenu']["MBRTIER"]["MBRTIER_UPDATE"]) ? <MemberTierForm menucode="MBRTIER" prefixmenuname="MBRTIER" refreshHeader={refreshHeader} {...props}  {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/tier/form/:membertierid' render={(props) => (permission !== undefined && permission['usermenu']["MBRTIER"]["MBRTIER_ACCESS"] && permission['usermenu']["MBRTIER"]["MBRTIER_UPDATE"]) ? <MemberTierForm menucode="MBRTIER" prefixmenuname="MBRTIER" refreshHeader={refreshHeader} {...props}  {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/receipt' render={(props) => <MemberReceipt menucode="MBRRECPT" prefixmenuname="MBRRECPT" {...props} />} />
			<Route exact path='/member-corporate/form/:ID/transaction' render={(props) => (permission !== undefined && permission['usermenu']["MBRTRANS"]["MBRTRANS_ACCESS"]) ? <MemberTransaction menucode="MBRTRANS" prefixmenuname="MBRTRANS" {...props} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/transaction/form' render={(props) => (permission !== undefined && permission['usermenu']["MBRTRANS"]["MBRTRANS_ACCESS"] && permission['usermenu']["MBRTRANS"]["MBRTRANS_CREATE"]) ? <MemberTransactionForm menucode="MBRTRANS" prefixmenuname="MBRTRANS" refreshHeader={refreshHeader} {...props} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/transaction/detail/:trxid' render={(props) => (permission !== undefined && permission['usermenu']["MBRTRANS"]["MBRTRANS_ACCESS"]) ? <MemberTransactionDetail menucode="MBRTRANS" prefixmenuname="MBRTRANS" {...props} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/alias' render={(props) => (permission !== undefined && permission['usermenu']["MBALIAS"]["MBALIAS_ACCESS"]) ? <MemberAlias menucode="MBALIAS" prefixmenuname="MBALIAS" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/notes' render={(props) => (permission !== undefined && permission['usermenu']["MBNOTES"]["MBNOTES_ACCESS"]) ? <MemberNotes menucode="MBNOTES" prefixmenuname="MBNOTES" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionIndex menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption/freeflight/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionFreeflightSearchFlight menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption/freeflight/:awardcode/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionFreeflightForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption/freeflight/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionFreeflightCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption/upgrade/:awardcode' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionUpgradeSearchFlight menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption/upgrade/:awardcode/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionUpgradeForm menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/redemption/upgrade/:awardcode/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <RedemptionUpgradeCertificate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/tour-code' render={(props) => (permission !== undefined && permission['usermenu']["MBCOTOUR"]["MBCOTOUR_ACCESS"]) ? <MemberTourCode menucode="MBCOTOUR" prefixmenuname="MBCOTOUR" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/tour-code/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBCOTOUR"]["MBCOTOUR_ACCESS"] && permission['usermenu']["MBCOTOUR"]["MBCOTOUR_CREATE"]) ? <MemberTourCodeForm menucode="MBCOTOUR" prefixmenuname="MBCOTOUR" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/travel-coordinator' render={(props) => (permission !== undefined && permission['usermenu']["MBCOTRCO"]["MBCOTRCO_ACCESS"]) ? <MemberTravelCo menucode="MBCOTRCO" prefixmenuname="MBCOTRCO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/travel-coordinator/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBCOTRCO"]["MBCOTRCO_ACCESS"] && permission['usermenu']["MBCOTRCO"]["MBCOTRCO_CREATE"]) ? <MemberTravelCoForm menucode="MBCOTRCO" prefixmenuname="MBCOTRCO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/travel-coordinator/form/:membercobrandid' render={(props) => (permission !== undefined && permission['usermenu']["MBCOTRCO"]["MBCOTRCO_ACCESS"] && permission['usermenu']["MBCOTRCO"]["MBCOTRCO_UPDATE"]) ? <MemberTravelCoForm menucode="MBCOTRCO" prefixmenuname="MBCOTRCO" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateIndex menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/view/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateView menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/cancel/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateCancel menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/update/:certificateid' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateAirUpdate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/update/:certificateid/freeflight' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateFreeSearchUpdate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/update/:certificateid/freeflight/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateFreeBuyUpdate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/update/:certificateid/upgrade' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateUpgSearchUpdate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/certificate/update/:certificateid/upgrade/buy' render={(props) => (permission !== undefined && permission['usermenu']["REDEEM"]["REDEEM_ACCESS"]) ? <CertificateUpgBuyUpdate menucode="REDEEM" prefixmenuname="REDEEM" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/member-relation' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"]) ? <MemberRelationIndex menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/member-relation/form/' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"] && permission['usermenu']["MBRRELA"]["MBRRELA_CREATE"]) ? <MemberRelationForm menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/member-relation/form/:memberrelationid' render={(props) => (permission !== undefined && permission['usermenu']["MBRRELA"]["MBRRELA_ACCESS"] && permission['usermenu']["MBRRELA"]["MBRRELA_UPDATE"]) ? <MemberRelationForm menucode="MBRRELA" prefixmenuname="MBRRELA" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />
			<Route exact path='/member-corporate/form/:ID/mailing' render={(props) => (permission !== undefined && permission['usermenu']["MBRMAIL"]["MBRMAIL_ACCESS"]) ? <MemberMailing menucode="MBRMAIL" prefixmenuname="MBRMAIL" refreshHeader={refreshHeader} {...props} {...headerdata} /> : <Error403 {...props} />} />

			<Route component={Error404} />
		</Switch>
	</Suspense>
);

export default Router;