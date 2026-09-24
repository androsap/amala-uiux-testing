import React from 'react';
import { RetrieveRequest, DeleteRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Alert from '../../../../components/Alert';
import Pagination from '../../../../components/Pagination';
import ReactModal from 'react-responsive-modal';
import Datepicker from '../../../../components/Datepicker';
import Select2 from '../../../../components/Select2';
import { jsUcfirst } from '../../../../utilities/Helpers';
import moment from 'moment';
import HistoryActivity from './History';
import Button from '../../../../components/Button';

const prefixmenuname = 'MBRACT';
const menucode = 'MBRACT';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberid: props.getStore().memberid,
            activityid: null,
            showModal: false,
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                memberid: props.getStore().memberid
            },
            sort: {
                createddate: 'desc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    activitydate: '',
                    activitytype: '',
                    partnercode: '',
                    activityname: '',
                    createddate: 'asc',
                    createdby: '',
                    status: '',
                    activityinfo: ''
                },
                icon: {
                    activitydate: '',
                    activitytype: '',
                    partnercode: '',
                    activityname: '',
                    createddate: 'mdi-arrow-down-bold',
                    createdby: '',
                    status: '',
                    activityinfo: ''
                }
            },
            advancedSearch: false,
            dataSearch: {},
            optionsActivityType: [
                { label: "Air", value: "AIR" },
                { label: "Non Air", value: "NON_AIR" }
            ],
            activitytype: null,
            optionsStatus: [
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" }
            ],
            status: null,
            optionsActivityInfo: [
                { label: "Inserted", value: "INSERTED" },
                { label: "No Valid To Earn", value: "NO_VALID_TO_EARN" },
                { label: "Activity Rated", value: "ACTIVITY_RATED" },
                { label: "No Marketing Airline Found", value: "NO_MARKETING_AIRLINE_FOUND" },
                { label: "Rule No Exist", value: "RULE_NO_EXIST" },
                { label: "No Booking Class Found", value: "NO_BOOKING_CLASS_FOUND" },
                { label: "No Partner Found", value: "NO_PARTNER_FOUND" },
                { label: "No Partner Location Found", value: "NO_PARTNER_LOCATION_FOUND" },
                { label: "Invalid Name Check", value: "INVALID_NAME_CHECK" },
                { label: "No Operating Airiline For Air Activity", value: "NO_OPERATING_AIRLINE_FOR_AIR_ACTIVITY" },
                { label: "Activity Updated", value: "ACTIVITY_UPDATED" },
                { label: "Duplicate Activity", value: "DUPLICATE_ACTIVITY" },
                { label: "Customer Inactive", value: "CUSTOMER_INACTIVE" },
                { label: "Ready To Be Rated", value: "READY_TO_BE_RATED" },
                { label: "Member Tier Inactive", value: "MEMBER_TIER_INACTIVE" },
                { label: "Booking Class Not Eligible To Earn", value: "BOOKING_CLASS_NOT_ELIGIBLE_TO_EARN" },
                { label: "Invalid Flight Schedule", value: "INVALID_FLIGHT_SCHEDULE" },
                { label: "Invalid Frequent Flyer Designator", value: "INVALID_FREQUENT_FLYER_DESIGNATOR" },
                { label: "Card Number Is Inactive", value: "CARD_NUMBER_IS_INACTIVE" },
                { label: "Partner Not Eligible To Earn Mile", value: "PARTNER_NOT_ELIGIBLE_TO_EARN_MILE" },
                { label: "Activity Convert Incorrect", value: "ACTIVITY_CONVERT_INCORRECT" },
                { label: "Activity Volume Is Not Enough", value: "ACTIVITY_VOLUME_IS_NOT_ENOUGH" },
                { label: "No Activity Code", value: "NO_ACTIVITY_CODE" },
                { label: "Member Not Found", value: "MEMBER_NOT_FOUND" },
                { label: "Activity Date Empty", value: "ACTIVITY_DATE_EMPTY" },
                { label: "Firstname Invalid", value: "FIRSTNAME_INVALID" },
                { label: "Lastname Invalid", value: "LASTNAME_INVALID" },
                { label: "Future Transactions Not Allowed", value: "FUTURE_TRANSACTIONS_NOT_ALLOWED" },
                { label: "Empty Transaction ID", value: "EMPTY_TRANSACTION_ID" },
                { label: "Mileage More Then Allowed", value: "MILEAGE_MORE_THEN_ALLOWED" },
                { label: "Activity Miles Not Enough", value: "ACTIVITY_MILES_NOT_ENOUGH" }
            ],
            activityinfo: null,
            partnercode: null,
            optionsPartner: [],
            isLoadingSelect2: {
                partnercode: false
            },
        };
    }

    //handle pagination page
    handlePageChange(pageNumber) {
        const { paging } = this.state;
        this.setState(
            { paging: { page: pageNumber, limit: paging.limit }, isLoaded: false },
            () => this.getList()
        );
    }

    //handle sorting page
    handleSorting(e, target, type) {
        e.preventDefault();
        this.setState(prevState => ({
            sort: {
                [target]: (type === '') ? 'asc' : type
            },
            setSorting: {
                type: {
                    activitydate: target === 'activitydate' ? prevState.setSorting.type.activitydate === 'desc' ? 'asc' : 'desc' : '',
                    activitytype: target === 'activitytype' ? prevState.setSorting.type.activitytype === 'desc' ? 'asc' : 'desc' : '',
                    partnercode: target === 'partnercode' ? prevState.setSorting.type.partnercode === 'desc' ? 'asc' : 'desc' : '',
                    activityname: target === 'activityname' ? prevState.setSorting.type.activityname === 'desc' ? 'asc' : 'desc' : '',
                    activityinfo: target === 'activityinfo' ? prevState.setSorting.type.activityinfo === 'desc' ? 'asc' : 'desc' : '',
                    createddate: target === 'createddate' ? prevState.setSorting.type.createddate === 'desc' ? 'asc' : 'desc' : '',
                    createdby: target === 'createdby' ? prevState.setSorting.type.createdby === 'desc' ? 'asc' : 'desc' : '',
                    status: target === 'status' ? prevState.setSorting.type.status === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    activitydate: target === 'activitydate' ? prevState.setSorting.type.activitydate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    activitytype: target === 'activitytype' ? prevState.setSorting.type.activitytype === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    partnercode: target === 'partnercode' ? prevState.setSorting.type.partnercode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    activityname: target === 'activityname' ? prevState.setSorting.type.activityname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    activityinfo: target === 'activityinfo' ? prevState.setSorting.type.activityinfo === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    createddate: target === 'createddate' ? prevState.setSorting.type.createddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    createdby: target === 'createdby' ? prevState.setSorting.type.createdby === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    status: target === 'status' ? prevState.setSorting.type.status === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.getList();
        this.getOptionsPartner();
    }

    searchAction = (e) => {
        e.preventDefault();
        let { memberid, activitytype, activityinfo, status, partnercode } = this.state;
        let activitydate = this.state.activitydate ? moment(this.state.activitydate).format('YYYY-MM-DD') : null;


        this.setState(
            {
                criteria: {
                    memberid,
                    activitydate,
                    activitytype,
                    partnercode,
                    activityinfo,
                    status
                },
                paging: {
                    page: 1,
                    limit: 10
                },
                totalrecord: 0,
                isLoaded: false
            },
            () => this.getList()
        );
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.memberactivity.list;
        let column = [];
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    dataList: response.result,
                    isLoaded: true,
                    totalrecord: response.paging.totalrecord
                });
            } else {
                Alert.error(response.status.responsemessage);
            }
        });
    }

    getOptionsPartner() {
        let paging = {
            limit: -1,
            page: 1
        }
        let sort = {
            partnercode: 'asc'
        };
        let criteria = {};
        let url = api.url.partner.list;
        let column = [];
        /*loading select2 get data*/
        this.setState(prevState => ({ isLoadingSelect2: { ...prevState.isLoadingSelect2, partnercode: true } }));
        var result = RetrieveRequest(url, paging, column, criteria, sort);
        result.then((response) => {
            const { status, result } = response;
            if (status.responsecode.substring(0, 1) === '0') {
                //remapping for base option select2
                var optionsPartner = result.map(obj => {
                    var result2 = {};
                    result2['label'] = obj.partnercode;
                    result2['value'] = obj.partnercode;
                    return result2;
                })

                this.setState(prevState => ({
                    optionsPartner,
                    isLoadingSelect2: { ...prevState.isLoadingSelect2, partnercode: false }
                }));
            } else {
                Alert.error(status.responsemessage);
            }
        });
    }

    editData(id, targetpage) {
        this.props.updatePage({
            displayactivitypage: targetpage,
            activityid: id
        });
    }

    deleteData(activityid, type) {
        let url = (type === 'AIR') ? api.url.memberairactivity.cancelwithrating : api.url.membernonairactivity.cancelwithrating;
        let data = { activityid };
        var deleteData = DeleteRequest(url, data);
        if (deleteData) {
            deleteData.then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    let message = 'Selected data has been deleted';
                    if (response.status.responsemessage) {
                        message = response.status.responsemessage;
                    }
                    Alert.success(message);
                } else {
                    Alert.error(response.status.responsemessage);
                }
                this.getList();
                this.props.loadDataMemberHeader(this.state.memberid);
            })
        }
    }

    handleAddClick(targetPage) {
        this.props.updatePage({
            displayactivitypage: targetPage,
            activityid: null
        });
    }

    //handle open modal
    handleOpenModal = (id) => {
        this.setState({ showModal: true, activityid: id });
    }

    //handle close modal
    handleCloseModal = () => {
        this.setState({ showModal: false, activityid: null });
    }

    handleActivityDateChange = (event) => {
        let activitydate = event === null ? null : event;
        this.setState({ activitydate });
    }

    handleActivityTypeChange = (event) => {
        let activitytype = event === null ? null : event.value;
        this.setState({ activitytype });
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.value;
        this.setState({ status });
    }

    handleActivityInfoChange = (event) => {
        let activityinfo = event === null ? null : event.value;
        this.setState({ activityinfo });
    }

    changeSearchType = () => {
        this.setState(prevState => ({
            advancedSearch: (prevState.advancedSearch) ? false : true,
            dataSearch: {},
            activitydate: null,
            activitytype: null,
            activityinfo: null,
            status: null,
            partnercode: null
        }))
    }

    handlePartnerChange = (event) => {
        let partnercode = event === null ? null : event.value;
        this.setState({ partnercode });
    }

    render() {
        const { permission } = this.props;
        const { usermenu } = permission;
        const { dataList, isLoaded, paging, totalrecord, showModal, activitydate, isLoadingSelect2 } = this.state;
        const { optionsActivityType, optionsStatus, optionsActivityInfo, optionsPartner } = this.state;
        const { activitytype, status, activityinfo, partnercode } = this.state;
        var number = (paging.page - 1) * paging.limit;
        var body = '';
        if (!isLoaded) {
            body = <tbody>
                <tr>
                    <td colSpan="99" className="text-center">Loading . . .</td>
                </tr>
            </tbody>;
        } else {
            if (dataList.length) {
                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{(val.activitydate) ? moment(val.activitydate).format("DD/MM/YYYY") : ''}</td>
                            <td>{jsUcfirst(val.activitytype, "_")}</td>
                            <td>{(val.partnercode) ? val.partnercode : '-'}</td>
                            <td>{(val.activityname) ? val.activityname : '-'}</td>
                            <td>{jsUcfirst(val.activityinfo, "_")}</td>
                            <td>{moment(val.createdDate).format("DD/MM/YYYY")}</td>
                            <td>{val.createdBy}</td>
                            <td>{jsUcfirst(val.status)}</td>
                            <td className="action-table inline two-btn">
                                {/* <button type="button" title="History" className="btn btn-outline-dark btn-sm" onClick={() => this.handleOpenModal(val.activityid)}><i className="mdi mdi-book"></i> History</button> */}
                                {/* <button type="button" title="Edit" className="btn btn-outline-dark btn-sm" onClick={() => this.editData(val.activityid, val.activitytype)}>{!_checkPermission(permissionList, menuname, 'update') ? <i className="mdi mdi-lead-pencil"></i> : <i className="mdi mdi-file"></i>} {!_checkPermission(permissionList, menuname, 'update') ? "Edit" : "View"}</button> */}
                                <Button onClick={() => this.editData(val.activityid, val.activitytype)} type="button" label="Edit" icon='mdi mdi-lead-pencil' className="btn btn-outline-dark btn-sm" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="UPDATE"></Button>
                                <Button type="button" label="Delete" icon='mdi mdi-delete' className="btn btn-outline-dark btn-sm" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="DELETE" onClick={() => this.deleteData(val.activityid, val.activitytype)} />
                            </td>
                        </tr>
                    )}
                </tbody>;
            } else {
                body = <tbody>
                    <tr>
                        <td colSpan="99" className="text-center">No data to display</td>
                    </tr>
                </tbody>;
            }
        }

        return (
            <div>
                <ReactModal
                    open={showModal} onClose={this.handleCloseModal} center
                >
                    <div className="modal-lg">
                        <HistoryActivity activityid={this.state.activityid} />
                    </div>
                </ReactModal>
                <div className="member-section">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control mt-0">Member Activity</h1>
                        {
                            (usermenu[menucode][prefixmenuname + "_CREATE"]) ?
                                <div className="dropdown">
                                    <button className="btn btn-default normal btn-sm dropdown-toggle" id="create-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Create
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="create-menu">
                                        <Button onClick={() => this.handleAddClick('AIR')} type="button" label="Air" className="dropdown-item" menucode={menucode} prefixmenuname={prefixmenuname} actioncode="CREATE"></Button>
                                        <Button onClick={() => this.handleAddClick('NON_AIR')} type="button" label="Nonair" className="dropdown-item" menucode={menucode} prefixmenuname={menucode} actioncode="CREATE"></Button>
                                    </div>
                                </div> : ''
                        }
                    </div>
                    <div className="top-filter d-block p-3">
                        <div className="row pt-2">
                            <div className="col-md-12">
                                <form className="collapse multi-collapse show pb-2" id="generalSearch">
                                    <div className="row">
                                        <div className="col-md-2 pt-1 pb-1">
                                            <Datepicker className="form-control" selected={activitydate} onChange={this.handleActivityDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Activity Date" />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <Select2 reference="activitytype" className="reactSelect2" id="activitytype-view" options={optionsActivityType} onChange={this.handleActivityTypeChange} value={optionsActivityType.filter(({ value }) => value === activitytype)} placeholder="Type"></Select2>
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" placeholder="Partner" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)} isLoaded={isLoadingSelect2.partnercode}></Select2>
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <Select2 reference="activityinfo" className="reactSelect2" id="activityinfo-view" options={optionsActivityInfo} onChange={this.handleActivityInfoChange} value={optionsActivityInfo.filter(({ value }) => value === activityinfo)} placeholder="Activity Info"></Select2>
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                        </div>
                                    </div>
                                </form>
                                <a data-toggle="collapse" href="#search" role="button" data-target=".multi-collapse" aria-expanded="false" aria-controls="advancedSearch generalSearch" onClick={(e) => this.changeSearchType(e)}>Advanced Search <i className="more-less mdi mdi-menu-up"></i></a>
                                <div className="collapse multi-collapse" id="advancedSearch">
                                    <div className="card-body">
                                        <form className="clearfix position-relative" onSubmit={(e) => this.searchAction(e)} autoComplete="off">
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="activitydate-view">Activity Date  </label>
                                                        <div className="col-sm-7">
                                                            <Datepicker className="form-control" selected={activitydate} onChange={this.handleActivityDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Activity Date" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="activitytype-view">Activity Type  </label>
                                                        <div className="col-sm-7">
                                                            <Select2 reference="activitytype" className="reactSelect2" id="activitytype-view" options={optionsActivityType} onChange={this.handleActivityTypeChange} value={optionsActivityType.filter(({ value }) => value === activitytype)} placeholder="Type"></Select2>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="Partner-view">Partner  </label>
                                                        <div className="col-sm-7">
                                                            <Select2 reference="partnercode" className="reactSelect2" id="partnercode-view" placeholder="Partner" options={optionsPartner} onChange={this.handlePartnerChange} value={optionsPartner.filter(({ value }) => value === partnercode)} isLoaded={isLoadingSelect2.partnercode}></Select2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="activityinfo-view">Activity Info  </label>
                                                        <div className="col-sm-7">
                                                            <Select2 reference="activityinfo" className="reactSelect2" id="activityinfo-view" options={optionsActivityInfo} onChange={this.handleActivityInfoChange} value={optionsActivityInfo.filter(({ value }) => value === activityinfo)} placeholder="Activity Info"></Select2>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="status-view">Status  </label>
                                                        <div className="col-sm-7">
                                                            <Select2 reference="status" className="reactSelect2" id="status-view" options={optionsStatus} onChange={this.handleStatusChange} value={optionsStatus.filter(({ value }) => value === status)} placeholder="Status"></Select2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 text-right">
                                                    <button type="submit" className="btn btn-outline-dark normal"><i className="mdi mdi-magnify"></i> Search </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'activitydate', this.state.setSorting.type.activitydate); }}>Activity Date <i className={"mdi " + this.state.setSorting.icon.activitydate} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'activitytype', this.state.setSorting.type.activitytype); }}>Type <i className={"mdi " + this.state.setSorting.icon.activitytype} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'partnercode', this.state.setSorting.type.partnercode); }}>Partner <i className={"mdi " + this.state.setSorting.icon.partnercode} /> </a></th>
                                    <th>Activity Name</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'activityinfo', this.state.setSorting.type.activityinfo); }}>Activity Info <i className={"mdi " + this.state.setSorting.icon.activityinfo} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'createddate', this.state.setSorting.type.createddate); }}>Created Date <i className={"mdi " + this.state.setSorting.icon.createddate} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'createdby', this.state.setSorting.type.createdby); }}>Created By <i className={"mdi " + this.state.setSorting.icon.createdby} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'status', this.state.setSorting.type.status); }}>Status <i className={"mdi " + this.state.setSorting.icon.status} /> </a></th>
                                    <th style={{ width: "15%" }}></th>
                                </tr>
                            </thead>
                            {body}
                        </table>
                    </div>
                    <Pagination
                        activePage={paging.page}
                        itemsCountPerPage={paging.limit}
                        totalItemsCount={totalrecord}
                        onChange={this.handlePageChange.bind(this)}
                        pageRangeDisplayed={5}
                    />
                </div>
            </div>
        );
    }
}

export default Layout;