import React from 'react';
import { Link } from 'react-router-dom';
import { RetrieveRequest } from '../../utilities/RequestService';
import { api } from '../../config/Services';
import Alert from '../../components/Alert';
import Breadcrumb from '../../components/Breadcrumb';
import Pagination from '../../components/Pagination';
import Datepicker from '../../components/Datepicker';
import moment from 'moment';
// import Select2 from '../../components/Select2';
import { _getUserPermission, _checkPermission } from '../../utilities/PermissionService';
import ErrorGeneral from '../error/ErrorGeneral';

var permissionList = _getUserPermission();
var menuname = 'citypair';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {},
            sort: {
                citypaircode: 'asc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    citypaircode: 'desc',
                    firstairportcode: '',
                    secondairportcode: '',
                    airlinecode: '',
                    route: '',
                    startdate: '',
                    enddate: '',
                    active: ''
                },
                icon: {
                    citypaircode: 'mdi-arrow-up-bold',
                    firstairportcode: '',
                    secondairportcode: '',
                    airlinecode: '',
                    route: '',
                    startdate: '',
                    enddate: '',
                    active: ''
                }
            },
            advancedSearch: false,
            dataSearch: {},
            route: null,
            optionsRoute: [
                { label: 'DOMESTIC', value: 'DOMESTIC' },
                { label: 'INTERNATIONAL', value: 'INTERNATIONAL' },
                { label: 'BOTH', value: 'BOTH' }
            ],
            startdate: null,
            enddate: null,
            status: null,
            optionsStatus: [
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" }
            ]
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
                    citypaircode: target === 'citypaircode' ? prevState.setSorting.type.citypaircode === 'desc' ? 'asc' : 'desc' : '',
                    firstairportcode: target === 'firstairportcode' ? prevState.setSorting.type.firstairportcode === 'desc' ? 'asc' : 'desc' : '',
                    secondairportcode: target === 'secondairportcode' ? prevState.setSorting.type.secondairportcode === 'desc' ? 'asc' : 'desc' : '',
                    airlinecode: target === 'airlinecode' ? prevState.setSorting.type.airlinecode === 'desc' ? 'asc' : 'desc' : '',
                    route: target === 'route' ? prevState.setSorting.type.route === 'desc' ? 'asc' : 'desc' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'asc' : 'desc' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'asc' : 'desc' : '',
                    active: target === 'active' ? prevState.setSorting.type.active === 'desc' ? 'asc' : 'desc' : ''
                },
                icon: {
                    citypaircode: target === 'citypaircode' ? prevState.setSorting.type.citypaircode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    firstairportcode: target === 'firstairportcode' ? prevState.setSorting.type.firstairportcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    secondairportcode: target === 'secondairportcode' ? prevState.setSorting.type.secondairportcode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    airlinecode: target === 'airlinecode' ? prevState.setSorting.type.airlinecode === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    route: target === 'route' ? prevState.setSorting.type.route === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    startdate: target === 'startdate' ? prevState.setSorting.type.startdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    enddate: target === 'enddate' ? prevState.setSorting.type.enddate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    active: target === 'active' ? prevState.setSorting.type.active === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : ''
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        document.title = "Manage City Pair | Loyalty Management System";
        if (!_checkPermission(permissionList, menuname, 'access')) this.getList();
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.citypair.list;
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
        let { firstairportcode, secondairportcode, airlinecode, route } = this.state.dataSearch;
        let { startdate, enddate } = this.state;

        firstairportcode = (firstairportcode !== undefined) ? "%" + firstairportcode + "%" : '';
        secondairportcode = (secondairportcode !== undefined) ? "%" + secondairportcode + "%" : '';
        airlinecode = (airlinecode !== undefined) ? "%" + airlinecode + "%" : '';
        route = (route !== undefined) ? "%" + route + "%" : '';
        startdate = startdate ? moment(startdate).format('YYYY-MM-DD') : null;
        enddate = enddate ? moment(enddate).format('YYYY-MM-DD') : null;

        this.setState(
            {
                criteria: {
                    firstairportcode,
                    secondairportcode,
                    airlinecode,
                    route,
                    startdate,
                    enddate
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

    handleRouteChange = (event) => {
        let route = event === null ? null : event.value;
        this.setState({ route });
    }

    handleStartDateChange = (event) => {
        let startdate = event === null ? null : event;
        this.setState({ startdate });
    }

    handleEndDateChange = (event) => {
        let enddate = event === null ? null : event;
        this.setState({ enddate });
    }

    handleStatusChange = (event) => {
        let status = event === null ? null : event.value;
        this.setState({ status });
    }

    changeSearchType = () => {
        this.setState(prevState => ({
            advancedSearch: (prevState.advancedSearch) ? false : true,
            dataSearch: {},
            startdate: null,
            enddate: null
        }))
    }

    handleInputChange(e) {
        let dataSearch = this.state.dataSearch;
        dataSearch[e.target.name] = e.target.value;
        this.setState({ dataSearch });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord } = this.state;
        const { startdate, enddate } = this.state;
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
                var editLabel = !_checkPermission(permissionList, menuname, 'update') ? "Edit" : "View";
                var editIcon = !_checkPermission(permissionList, menuname, 'update') ? "mdi-lead-pencil" : "mdi-file";

                body = <tbody>
                    {dataList.map((val, i) =>
                        <tr key={i}>
                            <td>{++number}</td>
                            <td>{val.citypaircode}</td>
                            <td>{val.firstairportcode}</td>
                            <td>{val.secondairportcode}</td>
                            <td>{val.airlinecode}</td>
                            <td>{val.route}</td>
                            <td>{moment(val.startdate).format("DD/MM/YYYY")}</td>
                            <td>{moment(val.enddate).format("DD/MM/YYYY")}</td>
                            <td className="text-center">{(val.active) ? "ACTIVE" : "INACTIVE"}</td>
                            <td className="action-table inline two-btn">
                                <Link to={'/city-pair/form/' + val.citypaircode} title="Edit" className="btn btn-outline-dark btn-sm"><i className={"mdi " + editIcon}></i> {editLabel}</Link>
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
                    <Breadcrumb path="Data Management / Partner Management / City Pair" />
                    <div className="main-panel">
                        <div className="content-title flex-hr mb-0 title-description">
                            <h1 className="title-has-control mt-2">Manage City Pair</h1>
                            <Link to={'/city-pair/form/'} title="Add New" className={"btn btn-default normal btn-sm " + _checkPermission(permissionList, menuname, 'create')}>Add New</Link>
                        </div>
                        <div className="top-filter d-block p-3">
                            <div className="row pt-2">
                                <div className="col-md-12">
                                    <form className="collapse multi-collapse show pb-2" id="generalSearch">
                                        <div className="row">
                                            <div className="col-sm-2 pt-1 pb-1">
                                                <input type="text" ref="firstairportcode" name="firstairportcode" className="form-control" placeholder="First Airport Code" title="First Airport Code" maxLength="50" onChange={this.handleInputChange} />
                                            </div>
                                            <div className="col-sm-2 pt-1 pb-1">
                                                <input type="text" ref="secondairportcode" name="secondairportcode" className="form-control" placeholder="Second Airport Code" title="Second Airport Code" maxLength="50" onChange={this.handleInputChange} />
                                            </div>
                                            <div className="col-sm-2 pt-1 pb-1">
                                                <input type="text" ref="airlinecode" name="airlinecode" className="form-control" placeholder="Airline Code" title="Airline Code" maxLength="50" onChange={this.handleInputChange} />
                                            </div>
                                            <div className="col-sm-2 pt-1 pb-1">
                                                <input type="text" ref="route" name="route" className="form-control" placeholder="Route" title="Route" maxLength="50" onChange={this.handleInputChange} />
                                            </div>
                                            {/* <div className="form-group col-md-2">
                                                <Datepicker className="form-control" selected={startdate} onChange={this.handleStartDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Start Date" />
                                            </div>
                                             <div className="form-group col-md-2">
                                                <Datepicker className="form-control" selected={enddate} onChange={this.handleEndDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="End Date" />
                                            </div> */}
                                            <div className="col-sm-2 pt-1 pb-1">
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
                                                            <label className="col-sm-4 col-form-label" htmlFor="firstairportcode-view">First Airport Code  </label>
                                                            <div className="col-sm-7">
                                                                <input type="text" ref="firstairportcode" name="firstairportcode" className="form-control" placeholder="First Airport Code" title="First Airport Code" maxLength="50" onChange={this.handleInputChange} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-sm-4 col-form-label" htmlFor="secondairportcode-view">Second Airport Code  </label>
                                                            <div className="col-sm-7">
                                                                <input type="text" ref="secondairportcode" name="secondairportcode" className="form-control" placeholder="Second Airport Code" title="Second Airport Code" maxLength="50" onChange={this.handleInputChange} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-sm-4 col-form-label" htmlFor="airlinecode-view">Airline Code  </label>
                                                            <div className="col-sm-7">
                                                                <input type="text" ref="airlinecode" name="airlinecode" className="form-control" placeholder="Airline Code" title="Airline Code" maxLength="50" onChange={this.handleInputChange} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <div className="form-group row">
                                                            <label className="col-sm-4 col-form-label" htmlFor="route-view">Route  </label>
                                                            <div className="col-sm-7">
                                                                <input type="text" ref="route" name="route" className="form-control" placeholder="Route" title="Route" maxLength="50" onChange={this.handleInputChange} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-sm-4 col-form-label" htmlFor="startdate-view">Start Date  </label>
                                                            <div className="col-sm-7">
                                                                <Datepicker className="form-control" selected={startdate} onChange={this.handleStartDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Start Date" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group row">
                                                            <label className="col-sm-4 col-form-label" htmlFor="enddate-view">End Date  </label>
                                                            <div className="col-sm-7">
                                                                <Datepicker className="form-control" selected={enddate} onChange={this.handleEndDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="End Date" />
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
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'citypaircode', this.state.setSorting.type.citypaircode); }}>City Pair Code <i className={"mdi " + this.state.setSorting.icon.citypaircode} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'firstairportcode', this.state.setSorting.type.firstairportcode); }}>First Airport Code <i className={"mdi " + this.state.setSorting.icon.firstairportcode} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'secondairportcode', this.state.setSorting.type.secondairportcode); }}>Second Airport Code <i className={"mdi " + this.state.setSorting.icon.secondairportcode} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'airlinecode', this.state.setSorting.type.airlinecode); }}>Airline Code <i className={"mdi " + this.state.setSorting.icon.airlinecode} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'route', this.state.setSorting.type.route); }}>Route <i className={"mdi " + this.state.setSorting.icon.route} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'startdate', this.state.setSorting.type.startdate); }}>Start Date <i className={"mdi " + this.state.setSorting.icon.startdate} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'enddate', this.state.setSorting.type.enddate); }}>End Date <i className={"mdi " + this.state.setSorting.icon.enddate} /> </a></th>
                                        <th><a href="" onClick={e => { this.handleSorting(e, 'active', this.state.setSorting.type.active); }}>Status <i className={"mdi " + this.state.setSorting.icon.active} /> </a></th>
                                        <th></th>
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
        } else {
            return (<ErrorGeneral message="Sorry, your role can't perform this action" />);
        }
    }
}

export default Layout;