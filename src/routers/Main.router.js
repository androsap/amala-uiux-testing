import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../pages/home/Index';
// import Error404 from '../pages/error/Error404';
// import CountryRouter from './Country.router';
// import TitleRouter from './Title.router';
// import SalutationRouter from './Salutation.router';
// import LanguageRouter from './Language.router';
// import StateRouter from './State.router';
// import CityRouter from './City.router';
// import AirportRouter from './Airport.router';
// import TicketOfficeRouter from './TicketOffice.router';
// import EnrollmentRouter from './Enrollment.router';
// import UserRouter from './User.router';
// import RoleRouter from './Role.router';
// import ReligionRouter from './Religion.router';
// import HobbiesRouter from './Hobbies.router';
import Profile from '../pages/profile/Index';
// import MembershipTypeRouter from './MembershipType.router';
// import MembershipRouter from './Membership.router';
// import TierReasonRouter from './TierReason.router';
// import TierRouter from './Tier.router';
// import MileageCriteriaRouter from './MileageCriteria.router';
// import AirlineRouter from './Airline.router';
// import PartnerRouter from './Partner.router';
// import PartnerGroupRouter from './PartnerGroup.router';
// import MemberRouter from './Member.router';
// import RegionRouter from './Region.router';
// import ProgramRouter from './Program.router';
// import TierBonusRouter from './TierBonus.router';
// import BranchRouter from './Branch.router';
// import EarningMilesRouter from './EarningMiles.router';
// import ActivityCodeRouter from './ActivityCode.router';
// import AccrualRuleOD from './AccrualRuleOD.router';
// import AccrualRuleBC from './AccrualRuleBC.router';
// import StatementRouter from './Statement.router';
// import NonAirRouter from './AccrualRuleNonAir.router';
// import MailingSetRouter from './MailingSet.router';
// import EnrollBonusRouter from './EnrollBonus.router';
// import ActivityBonusRouter from './ActivityBonus.router';
// import CardInventoryRouter from './CardInventory.router';
// import TierDurationRouter from './TierDuration.router';
// import CityPairRouter from './CityPair.router';
// import DistanceRangeRouter from './DistanceRange.router';
// import AwardTypeRouter from './AwardType.router';
// import AwardListRouter from './AwardList.router';
// import RedemptionRouter from './Redemption.router';
// import CurrencyRouter from './Currency.router';
// import ReceiptCatalogueRouter from './ReceiptCatalogue.router';
// import PeakSeasonRouter from './PeakSeason.router';
// import BlackoutRouter from './Blackout.router';
// import CustomTransactionRouter from './CustomTransaction.router';
// import GeneralConfigurationRouter from './GeneralConfiguration.router';
// import CommunicationRouter from './Communication.router';
// import ParkActivityRouter from './ParkActivity.router';
import NewsRouter from './News.router';
// import CodeShareListRouter from './CodeShareList.router';
import RetroClaimPartnerRouter from './RetroClaimPartner.router';
// import RetroClaimManagerRouter from './RetroClaimManager.router';
// import RetroClaimApprovalRouter from './RetroClaimApproval.router';
// import BillingRouter from './Billing.router';
// import RelationTypeRouter from './RelationType.router';
// import InvalidNameCheckRouter from './InvalidNameCheck.router';
// import MemberCorporateRouter from './MemberCorporate.router';
// import SuspectDuplicateRouter from './SuspectDuplicate.router';
// import EnrollmentCorporateRouter from './EnrollmentCorporate.router';

const Router = () => (
	<Switch>
		<Route exact path='/' component={Home} />
		{/* <Route path='/country' component={CountryRouter} /> */}
		{/* <Route path='/title' component={TitleRouter} /> */}
		{/* <Route path='/salutation' component={SalutationRouter} /> */}
		{/* <Route path='/language' component={LanguageRouter} /> */}
		{/* <Route path='/state' component={StateRouter} /> */}
		{/* <Route path='/city' component={CityRouter} /> */}
		{/* <Route path='/airport' component={AirportRouter} /> */}
		{/* <Route path='/religion' component={ReligionRouter} /> */}
		{/* <Route path='/hobbies' component={HobbiesRouter} /> */}
		{/* <Route path='/ticket-office' component={TicketOfficeRouter} /> */}
		{/* <Route path='/enrollment' component={EnrollmentRouter} /> */}
		{/* <Route path='/user' component={UserRouter} /> */}
		<Route path='/profile' component={Profile} />
		{/* <Route path='/role' component={RoleRouter} /> */}
		{/* <Route path='/membership-type' component={MembershipTypeRouter} /> */}
		{/* <Route path='/membership' component={MembershipRouter} /> */}
		{/* <Route path='/tier-reason' component={TierReasonRouter} /> */}
		{/* <Route path='/tier' component={TierRouter} /> */}
		{/* <Route path='/mileage-criteria' component={MileageCriteriaRouter} /> */}
		{/* <Route path='/member' component={MemberRouter} /> */}
		{/* <Route path='/airline' component={AirlineRouter} /> */}
		{/* <Route path='/partner' component={PartnerRouter} /> */}
		{/* <Route path='/partner-group' component={PartnerGroupRouter} /> */}
		{/* <Route path='/region' component={RegionRouter} /> */}
		{/* <Route path='/program' component={ProgramRouter} /> */}
		{/* <Route path='/tier-bonus' component={TierBonusRouter} /> */}
		{/* <Route path='/branch' component={BranchRouter} /> */}
		{/* <Route path='/earning-miles' component={EarningMilesRouter} /> */}
		{/* <Route path='/activity-code' component={ActivityCodeRouter} /> */}
		{/* <Route path='/accrual-rule-od' component={AccrualRuleOD} /> */}
		{/* <Route path='/accrual-rule-bc' component={AccrualRuleBC} /> */}
		{/* <Route path='/statement' component={StatementRouter} />  */}
		{/* <Route path='/accrual-rule-non-air' component={NonAirRouter} /> */}
		{/* <Route path='/mailing-set' component={MailingSetRouter} /> */}
		{/* <Route path='/enroll-bonus' component={EnrollBonusRouter} /> */}
		{/* <Route path='/activity-bonus' component={ActivityBonusRouter} /> */}
		{/* <Route path='/card-inventory' component={CardInventoryRouter} /> */}
		{/* <Route path='/tier-duration' component={TierDurationRouter} /> */}
		{/* <Route path='/city-pair' component={CityPairRouter} /> */}
		{/* <Route path='/distance-range' component={DistanceRangeRouter} /> */}
		{/* <Route path='/award-type' component={AwardTypeRouter} />  */}
		{/* <Route path='/award-list' component={AwardListRouter} /> */}
		{/* <Route path='/redemption' component={RedemptionRouter} /> */}
		{/* <Route path='/currency' component={CurrencyRouter} /> */}
		{/* <Route path='/receipt-catalogue' component={ReceiptCatalogueRouter} /> */}
		{/* <Route path='/peak-season' component={PeakSeasonRouter} /> */}
		{/* <Route path='/blackout' component={BlackoutRouter} /> */}
		{/* <Route path='/custom-transaction' component={CustomTransactionRouter} /> */}
		{/* <Route path='/general-configuration' component={GeneralConfigurationRouter} /> */}
		{/* <Route path='/communication' component={CommunicationRouter} /> */}
		{/* <Route path='/park-activity' component={ParkActivityRouter} /> */}
		<Route path='/news' component={NewsRouter} />
		{/* <Route path='/codeshare-list' component={CodeShareListRouter} /> */}
		<Route path='/retro-claim-partner' component={RetroClaimPartnerRouter} />
		{/* <Route path='/retro-claim-manager' component={RetroClaimManagerRouter} /> */}
		{/* <Route path='/retro-claim-approval' component={RetroClaimApprovalRouter} /> */}
		{/* <Route path='/billing' component={BillingRouter} /> */}
		{/* <Route path='/relation-type' component={RelationTypeRouter} /> */}
		{/*<Route path='/invalid-name-check' component={InvalidNameCheckRouter} /> */}
		{/* <Route path='/member-corporate' component={MemberCorporateRouter} /> */}
		{/* <Route path='/suspect-duplicate' component={SuspectDuplicateRouter} /> */}
		{/* <Route path='/enrollment-corporate' component={EnrollmentCorporateRouter} /> */}
		{/* <Route component={Error404} /> */}
	</Switch>
);

export default Router;