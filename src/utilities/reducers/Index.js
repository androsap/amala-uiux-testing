import { combineReducers } from "redux";
import redemption from "./RedemptionReducer";
import enrollment from "./EnrollmentReducer";
import member from "./MemberReducer";
import updatecertificate from "./UpdateCertificateReducer";
import permission from "./PermissionReducer";
import enrollmentcorporate from "./EnrollmentCorporateReducers";
import dashboardReport from "./DashboardReducer";

export default combineReducers({ redemption, enrollment, member, updatecertificate, permission, enrollmentcorporate, dashboardReport });