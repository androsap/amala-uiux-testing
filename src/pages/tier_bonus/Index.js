import React from 'react';
import { Link } from 'react-router-dom';
import RequestService from '../../utilities/RequestService';
import Services from '../../config/Services';
import { toast } from 'react-toastify';
import Breadcrumb from '../../components/Breadcrumb';
import Pagination from '../../components/Pagination';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import ErrorGeneral from '../error/ErrorGeneral';

var getServices = new Services();
var request = new RequestService();
var permissionList = _getUserPermission();
var menuname = 'tierbonus';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalData: 0,
            page: 1,
            limitData: 10,
            criteria: {},
            sort: {
                programcode: 'asc'
            },
            setSorting: {
                type: {
                    tiername: 'desc',
                    membershipname: '',
                    programcode: '',
                    operatingairline: '',
                    marketingairline: '',
                    bookingclasscode: '',
                    factor: ''
                },
                icon: {
                    tiername: 'mdi-arrow-up-bold',
                    membershipname: '',
                    programcode: '',
                    operatingairline: '',
                    marketingairline: '',
                    bookingclasscode: '',
                    factor: ''
                }
            }
        };
    }

    //handle pagination page
    handlePageChange(pageNumber) {
        this.setState(
            { page: pageNumber, isLoaded: false },
            () => this.getList()
        );
    }

    //handle sorting page
    handleSorting(e, target, type) {
        e.preventDefault();
        this.setState(prevState => ({
            sort: {
                [target]: type
            },
            setSorting: {
                type: {
                    tierbonusid: target === 'tierbonusid' ? prevState.setSorting.type.tierbonusid === 'desc' ? 'asc' : 'desc' : '',
                    tiername: target === 'tiername' ? prevState.setSorting.type.tiername === 'desc' ? 'asc' : 'desc' : '',
                    membershipname: target === 'membershipname' ? prevState.setSorting.type.membershipname === 'desc' ? 'asc' : 'desc' : '',
                    programcode: target === 'programcode' ? prevState.setSorting.type.programcode === 'desc' ? 'asc' : 'desc' : '',
                    operatingairline: target === 'operatingairline' ? prevState.setSorting.type.operatingairline === 'desc' ? 'asc' : 'desc' : '',
                    marketingairline: target === 'marketingairline' ? prevState.setSorting.type.marketingairline === 'desc' ? 'asc' : 'desc' : '',
                    factor: target === 'factor' ? prevState.setSorting.type.factor === 'desc' ? 'asc' : 'desc' : '',
                    bookingclasscode: target === 'bookingclasscode' ? prevState.setSorting.type.bookingclasscode === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    tierbonusid: target === 'tierbonusid' ? prevState.setSorting.type.tierbonusid === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    tiername: target === 'tiername' ? prevState.setSorting.type.tiername === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    membershipname: target === 'membershipname' ? prevState.setSorting.type.membershipname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    programcode: target === 'programcode' ? prevState.setSorting.type.programcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    operatingairline: target === 'operatingairline' ? prevState.setSorting.type.operatingairline === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    marketingairline: target === 'marketingairline' ? prevState.setSorting.type.marketingairline === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    factor: target === 'factor' ? prevState.setSorting.type.factor === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    bookingclasscode: target === 'bookingclasscode' ? prevState.setSorting.type.bookingclasscode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        document.title = "Manage Tier Bonus | Loyalty Management System";
        if (!_checkPermission(permissionList, menuname, 'access')) this.getList();
    }

    getList() {
        let url = getServices.state.url.tierbonus.list;
        let column = ['tierbonusid', 'tiername', 'membershipname', 'programcode', 'operatingairline', 'marketingairline', 'bookingclasscode', 'factor'];
        var result = request.getDataList(url, this.state, column);
        result.then((response) => {
            if (response.status.responsecode.substring(0, 1) === '0') {
                this.setState({
                    dataList: response.result,
                    isLoaded: true,
                    totalData: response.paging.totalrecord
                });
            } else {
                toast.error(response.status.responsemessage);
            }
        });
    }

    searchAction = (e) => {
        e.preventDefault();
        let tiername = this.refs.tiername.value;
        let membershipname = this.refs.membershipname.value;
        let programcode = this.refs.programcode.value;
        let operatingairline = this.refs.operatingairline.value;
        let marketingairline = this.refs.marketingairline.value;
        let bookingclasscode = this.refs.bookingclasscode.value;
        let factor = Number.parseFloat(this.refs.factor.value, 0);

        this.setState(
            {
                criteria: {
                    tiername,
                    membershipname,
                    programcode,
                    operatingairline,
                    marketingairline,
                    bookingclasscode,
                    factor
                },
                totalData: 0,
                page: 1,
                isLoaded: false
            },
            () => this.getList()
        );
    }

    deleteData(id) {
        id = Number.parseInt(id, 0);
        let url = getServices.state.url.tierbonus.delete;
        let parameter = { tierbonusid: id };
        var deleteData = request.deleteData(url, parameter);
        if (deleteData) {
            deleteData.then((response) => {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    let message = 'Selected data has been deleted';
                    if (response.status.responsemessage) {
                        message = response.status.responsemessage;
                    }
                    toast.success(message);
                } else {
                    toast.error(response.status.responsemessage);
                }
                this.getList();
            })
        }
    }

    render() {
        const { dataList, isLoaded } = this.state;
        var number = (this.state.page - 1) * this.state.limitData;
        var body = '';
        if (!isLoaded) {
            body = <tbody>
                <tr>
                    <td colSpan="99" className="text-center">Loading . . .</td>
                </tr>
            </tbody>;
        } else {
            if (dataList.length) {
                var editLabel = !_checkPermission(permissionList, menuname, 'update') ? "Edit" : "View";
                var editIcon = !_checkPermission(permissionList, menuname, 'update') ? "mdi-lead-pencil" : "mdi-file";
                var statusDelete = _checkPermission(permissionList, menuname, 'delete');

                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{val.tiername}</td>
                            <td>{val.membershipname}</td>
                            <td>{val.programcode}</td>
                            <td>{val.operatingairline}</td>
                            <td>{val.marketingairline}</td>
                            <td>{val.factor}</td>
                            <td>{val.bookingclasscode}</td>
                            <td className="action-table inline two-btn">
                                <Link to={'/tier-bonus/form/' + val.tierbonusid} title="Edit" className="btn btn-outline-dark btn-sm"><i className={"mdi " + editIcon}></i> {editLabel}</Link>
                                <button type="button" title="Delete" className={"btn btn-outline-dark btn-sm " + statusDelete} onClick={() => this.deleteData(val.tierbonusid)}><i className="mdi mdi-delete"></i> Delete</button>
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
                <div className="container-fluid">
                    <Breadcrumb path="Data Management / Tier Management / Tier Bonus" />
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h1 className="title-has-control mt-2">Manage Tier Bonus</h1>
                            <Link to={'/tier-bonus/form/'} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'create')}>Add New</Link>
                        </div>
                        <div className="top-filter">
                            <form className="container-fluid form-filter inline">
                                <div className="row">
                                    <div className="col-md-2">
                                        <input type="text" ref="tiername" className="form-control" placeholder="Tier Name" title="Tier Name" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="text" ref="membershipname" className="form-control" placeholder="Membership Name" title="Membership Name" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="text" ref="programcode" className="form-control" placeholder="Program Code" title="Program Code" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="text" ref="operatingairline" className="form-control" placeholder="Operating Airline" title="Operating Airline" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="text" ref="marketingairline" className="form-control" placeholder="Marketing Airline" title="Marketing Airline" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="text" ref="factor" className="form-control" placeholder="Factor" title="Factor" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <input type="text" ref="bookingclasscode" className="form-control" placeholder="Booking Class Code" title="Booking Class Code" maxLength="50" />
                                    </div>
                                    <div className="col-md-2">
                                        <button type="submit" title="Search" className="btn btn-outline-dark normal" onClick={(e) => this.searchAction(e)}><i className="mdi mdi-magnify"></i> Search</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'tiername', this.state.setSorting.type.tiername); }}>Tier Name <i className={"mdi " + this.state.setSorting.icon.tiername} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'membershipname', this.state.setSorting.type.membershipname); }}>Membership Name <i className={"mdi " + this.state.setSorting.icon.membershipname} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'programcode', this.state.setSorting.type.programcode); }}>Program Code <i className={"mdi " + this.state.setSorting.icon.programcode} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'operatingairline', this.state.setSorting.type.operatingairline); }}>Operating Airline <i className={"mdi " + this.state.setSorting.icon.operatingairline} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'marketingairline', this.state.setSorting.type.marketingairline); }}>Marketing Airline <i className={"mdi " + this.state.setSorting.icon.marketingairline} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'factor', this.state.setSorting.type.factor); }}>Factor <i className={"mdi " + this.state.setSorting.icon.factor} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'bookingclasscode', this.state.setSorting.type.bookingclasscode); }}>Booking Class Code <i className={"mdi " + this.state.setSorting.icon.bookingclasscode} /> </a></th>
                                    <th></th>
                                </tr>
                            </thead>
                            {body}
                        </table>
                        <Pagination
                            activePage={this.state.page}
                            itemsCountPerPage={this.state.limitData}
                            totalItemsCount={this.state.totalData}
                            onChange={this.handlePageChange.bind(this)}
                            pageRangeDisplayed={5}

                        />
                    </div>
                </div>
            );
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

export default Layout;