import React, { Component } from 'react';
import { RetrieveRequest } from '../../../utilities/RequestService';
import { api } from '../../../config/Services';
import Alert from '../../../components/Alert';
import Pagination from '../../../components/Pagination';
import moment from 'moment';
import Select2 from '../../../components/Select2';
import Datepicker from '../../../components/Datepicker';
import { _getUserPermission, _checkPermission } from '../../../utilities/PermissionService';
import ErrorGeneral from '../../error/ErrorGeneral';

var permissionList = _getUserPermission();
var menuname = 'membercertificates';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                memberid: props.memberid
            },
            sort: {
                issueddate: 'desc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    awardname: '',
                    partner: '',
                    certificateid: '',
                    certificateprice: '',
                    issueddate: 'asc',
                    validitydate: '',
                    ticketofficeuser: '',
                    status: ''
                },
                icon: {
                    awardname: '',
                    partner: '',
                    certificateid: '',
                    certificateprice: '',
                    issueddate: 'mdi-arrow-down-bold',
                    validitydate: '',
                    ticketofficeuser: '',
                    status: ''
                }
            },
            status: null,
            memberid: null,
            optionsStatus: [
                { value: 'VOUCHER_ISSUED', label: 'VOUCHER_ISSUED' },
                { value: 'VOUCHER_VOID', label: 'VOUCHER_VOID' }
            ],
            issueddate: null,
            advancedSearch: false,
            dataSearch: {},
            validitydate: null,
            // membertierid: null,
            // memberid: (props.memberid) ? props.memberid : null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
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
                    awardname: target === 'awardname' ? prevState.setSorting.type.awardname === 'desc' ? 'asc' : 'desc' : '',
                    partner: target === 'partner' ? prevState.setSorting.type.partner === 'desc' ? 'asc' : 'desc' : '',
                    certificateid: target === 'certificateid' ? prevState.setSorting.type.certificateid === 'desc' ? 'asc' : 'desc' : '',
                    certificateprice: target === 'certificateprice' ? prevState.setSorting.type.certificateprice === 'desc' ? 'asc' : 'desc' : '',
                    issueddate: target === 'issueddate' ? prevState.setSorting.type.issueddate === 'desc' ? 'asc' : 'desc' : '',
                    validitydate: target === 'validitydate' ? prevState.setSorting.type.validitydate === 'desc' ? 'asc' : 'desc' : '',
                    ticketofficeuser: target === 'ticketofficeuser' ? prevState.setSorting.type.ticketofficeuser === 'desc' ? 'asc' : 'desc' : '',
                    status: target === 'status' ? prevState.setSorting.type.status === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    awardname: target === 'awardname' ? prevState.setSorting.type.awardname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    partner: target === 'partner' ? prevState.setSorting.type.partner === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    certificateid: target === 'certificateid' ? prevState.setSorting.type.certificateid === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    certificateprice: target === 'certificateprice' ? prevState.setSorting.type.certificateprice === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    issueddate: target === 'issueddate' ? prevState.setSorting.type.issueddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    validitydate: target === 'validitydate' ? prevState.setSorting.type.validitydate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    ticketofficeuser: target === 'ticketofficeuser' ? prevState.setSorting.type.ticketofficeuser === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    status: target === 'status' ? prevState.setSorting.type.status === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.setState({
            criteria: {
                memberid: this.props.memberid
            },
            memberid: this.props.memberid
        }, () => this.getList());
    }

    componentWillReceiveProps(props) {
        this.setState({
            criteria: {
                memberid: props.memberid
            },
            memberid: props.memberid
        }, () => this.getList());
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.redemptioncertificate.list;
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

    searchAction = (e) => {
        e.preventDefault();
        let { awardname, partner, certificateprice, certificateid, ticketofficeuser } = this.state.dataSearch;

        awardname = (awardname !== undefined) ? "%" + awardname + "%" : null;
        partner = (partner !== undefined) ? "%" + partner + "%" : null;
        certificateprice = (certificateprice !== undefined) ? "%" + certificateprice + "%" : null;
        certificateid = (certificateid !== undefined) ? "%" + certificateid + "%" : null;
        ticketofficeuser = (ticketofficeuser !== undefined) ? "%" + ticketofficeuser + "%" : null;
        let issueddate = this.state.issueddate ? moment(this.state.issueddate).format('YYYY-MM-DD') : null;
        let validitydate = this.state.validitydate ? moment(this.state.validitydate).format('YYYY-MM-DD') : null;
        let memberid = this.state.memberid;
        let status = this.state.status;

        this.setState(
            {
                criteria: {
                    memberid,
                    awardname,
                    partner,
                    certificateprice,
                    certificateid,
                    ticketofficeuser,
                    issueddate,
                    validitydate,
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

    handleIssueDateChange = (event) => {
        let issueddate = event === null ? null : event;
        this.setState({ issueddate });
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.value;
        this.setState({ status });
    }

    handleValidityDateChange = (event) => {
        let validitydate = event === null ? null : event;
        this.setState({ validitydate });
    }

    changeSearchType = () => {
        this.setState(prevState => ({
            advancedSearch: (prevState.advancedSearch) ? false : true,
            dataSearch: {},
            issueddate: null,
            status: null,
            validitydate: null
        }))
    }

    handleInputChange(e) {
        let dataSearch = this.state.dataSearch;
        dataSearch[e.target.name] = e.target.value;
        this.setState({ dataSearch });
    }

    handleAddClick(targetPage, certificateid, awardcategory) {
        this.props.updatePage({
            displayactivitypage: targetPage,
            certificateid,
            awardcategory
        });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord } = this.state;
        const { issueddate, status, optionsStatus, validitydate } = this.state;

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
                            <td>{val.awardname}</td>
                            <td>{val.partner ? val.partner : '-'}</td>
                            <td>{val.certificateprice ? val.certificateprice : '-'}</td>
                            <td>{(val.awardcategory === 'AIR' && val.departureorigin && val.departuredestination) ? val.departureorigin + ' - ' + val.departuredestination : '-'}</td>
                            <td>{(val.awardcategory === 'AIR' && val.returnorigin && val.returndestination) ? val.returnorigin + ' - ' + val.returndestination : '-'}</td>
                            <td>{val.certificateid ? val.certificateid.length > 45 ? val.certificateid.substring(0, 45) + '...' : val.certificateid : '-'}</td>
                            <td>{(val.issueddate) ? moment(val.issueddate).format('DD/MM/YYYY') : '-'}</td>
                            <td>{(val.validitydate) ? moment(val.validitydate).format('DD/MM/YYYY') : '-'}</td>
                            <td>{val.ticketofficeuser ? val.ticketofficeuser : '-'}</td>
                            <td>{val.status}</td>
                            <td className="action-table inline two-btn">
                                <button onClick={() => (this.handleAddClick('VIEW', val.certificateid))} title="View" className="btn btn-outline-dark btn-sm"><i className="mdi mdi-eye"></i></button>
                                {(val.canupdated && val.status === 'VOUCHER_ISSUED' && val.awardcategory === 'AIR') ? <button onClick={() => (this.handleAddClick('UPDATE', val.certificateid, val.awardcategory))} title="Update" className="btn btn-outline-dark btn-sm"><i className="mdi mdi-lead-pencil"></i></button> : ''}
                                {(val.cancanceled && val.status === 'VOUCHER_ISSUED') ? <button onClick={() => (this.handleAddClick('CANCEL', val.certificateid, val.awardcategory))} title="Cancel" className="btn btn-outline-dark btn-sm"><i className="mdi mdi-cancel"></i></button> : ''}
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

        if (!_checkPermission(permissionList, menuname, 'access')) {
            return (
                <div className="profile-detail">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="mt-2">Manage Redemption - Member Certificates</h1>
                        {/* <button onClick={() => { }} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'membercertificates')}>Add New</button> */}
                    </div>
                    <div className="top-filter d-block p-3">
                        <div className="row pt-2">
                            <div className="col-md-12">
                                <form className="collapse multi-collapse show pb-2" id="generalSearch">
                                    <div className="row">
                                        <div className="col-md-2 pt-1 pb-1">
                                            <input type="text" name="awardname" className="form-control" placeholder="Award Name" title="Award Name" maxLength="50" onChange={this.handleInputChange} />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <input type="text" name="partner" className="form-control" placeholder="Partner" title="Partner" maxLength="50" onChange={this.handleInputChange} />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <input type="text" name="certificateid" className="form-control" placeholder="Certificate ID" title="Certificate ID" maxLength="50" onChange={this.handleInputChange} />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <Datepicker className="form-control" selected={issueddate} onChange={this.handleIssueDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Issued Date" />
                                        </div>
                                        {/* <div className="col-md-2 pt-1 pb-1">
                                            <Select2 reference="status" className="reactSelect2" id="status-view" options={optionsStatus} onChange={this.handleStatusChange} value={optionsStatus.filter(({ value }) => value === status)} placeholder="Status"></Select2>
                                        </div> */}
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
                                                        <label className="col-sm-4 col-form-label" htmlFor="awardname-view">Award Name  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" name="awardname" className="form-control" placeholder="Award Name" title="Award Name" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="partner-view">Partner  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" name="partner" className="form-control" placeholder="Partner" title="Partner" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="certificateprice-view">Certificate Price  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" name="certificateprice" className="form-control" placeholder="Certificate Price" title="Certificate Price" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="certificateid-view">Certificate ID  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" name="certificateid" className="form-control" placeholder="Certificate ID" title="Certificate ID" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="issueddate-view">Issued Date  </label>
                                                        <div className="col-sm-7">
                                                            <Datepicker className="form-control" selected={issueddate} onChange={this.handleIssueDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Issued Date" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="validitydate-view">Validity Date  </label>
                                                        <div className="col-sm-7">
                                                            <Datepicker className="form-control" selected={validitydate} onChange={this.handleValidityDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Validity Date" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="ticketofficeuser-view">Ticket Office User  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" name="ticketofficeuser" className="form-control" placeholder="Ticket Office User" title="Ticket Office User" maxLength="50" onChange={this.handleInputChange} />
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
                                    <th rowSpan="2">No</th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'awardname', this.state.setSorting.type.awardname); }}>Award Name <i className={"mdi " + this.state.setSorting.icon.awardname} /> </a></th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'partner', this.state.setSorting.type.partner); }}>Partner <i className={"mdi " + this.state.setSorting.icon.partner} /> </a></th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'certificateprice', this.state.setSorting.type.certificateprice); }}>Certificate Price <i className={"mdi " + this.state.setSorting.icon.certificateprice} /> </a></th>
                                    <th colSpan="2" className="text-center">Route</th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'certificateid', this.state.setSorting.type.certificateid); }}>Certificate ID <i className={"mdi " + this.state.setSorting.icon.certificateid} /> </a></th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'issueddate', this.state.setSorting.type.issueddate); }}>Issued Date <i className={"mdi " + this.state.setSorting.icon.issueddate} /> </a></th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'validitydate', this.state.setSorting.type.validitydate); }}>Validity Date <i className={"mdi " + this.state.setSorting.icon.validitydate} /> </a></th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'ticketofficeuser', this.state.setSorting.type.ticketofficeuser); }}>Ticket Office User <i className={"mdi " + this.state.setSorting.icon.ticketofficeuser} /> </a></th>
                                    <th rowSpan="2"><a href="" onClick={e => { this.handleSorting(e, 'status', this.state.setSorting.type.status); }}>Status <i className={"mdi " + this.state.setSorting.icon.status} /> </a></th>
                                    <th rowSpan="2"></th>
                                </tr>
                                <tr>
                                    <th rowSpan="1">Departure </th>
                                    <th rowSpan="1" width="6%">Return </th>
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
            );
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

export default Layout;