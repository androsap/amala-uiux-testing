import React from 'react';
import { RetrieveRequest } from '../../../../utilities/RequestService';
import { api } from '../../../../config/Services';
import Alert from '../../../../components/Alert';
import Pagination from '../../../../components/Pagination';
import Datepicker from '../../../../components/Datepicker';
import moment from 'moment';

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityid: null,
            dataList: [],
            isLoaded: false,
            totalrecord: 0,
            criteria: {
                memberid: props.getStore().memberid
            },
            sort: {
                requestdate: 'desc'
            },
            paging: {
                page: 1,
                limit: 10
            },
            setSorting: {
                type: {
                    requestdate: 'asc',
                    departuredate: '',
                    operatingairline: '',
                    operatingfltnumber: '',
                    ticketname: '',
                    reqinfo: '',
                    tickoffid: ''
                },
                icon: {
                    requestdate: 'mdi-arrow-down-bold',
                    departuredate: '',
                    operatingairline: '',
                    operatingfltnumber: '',
                    ticketname: '',
                    reqinfo: '',
                    tickoffid: ''
                }
            },
            requestdate: null,
            departuredate: null,
            advancedSearch: false,
            dataSearch: {},
            memberid: props.getStore().memberid
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
                    requestdate: target === 'requestdate' ? prevState.setSorting.type.requestdate === 'desc' ? 'asc' : 'desc' : '',
                    departuredate: target === 'departuredate' ? prevState.setSorting.type.departuredate === 'desc' ? 'asc' : 'desc' : '',
                    operatingairline: target === 'operatingairline' ? prevState.setSorting.type.operatingairline === 'desc' ? 'asc' : 'desc' : '',
                    operatingfltnumber: target === 'operatingfltnumber' ? prevState.setSorting.type.operatingfltnumber === 'desc' ? 'asc' : 'desc' : '',
                    ticketname: target === 'ticketname' ? prevState.setSorting.type.ticketname === 'desc' ? 'asc' : 'desc' : '',
                    reqinfo: target === 'reqinfo' ? prevState.setSorting.type.reqinfo === 'desc' ? 'asc' : 'desc' : '',
                    tickoffid: target === 'tickoffid' ? prevState.setSorting.type.tickoffid === 'desc' ? 'asc' : 'desc' : '',
                },
                icon: {
                    requestdate: target === 'requestdate' ? prevState.setSorting.type.requestdate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    departuredate: target === 'departuredate' ? prevState.setSorting.type.departuredate === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    operatingairline: target === 'operatingairline' ? prevState.setSorting.type.operatingairline === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    operatingfltnumber: target === 'operatingfltnumber' ? prevState.setSorting.type.operatingfltnumber === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    ticketname: target === 'ticketname' ? prevState.setSorting.type.ticketname === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    reqinfo: target === 'reqinfo' ? prevState.setSorting.type.reqinfo === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                    tickoffid: target === 'tickoffid' ? prevState.setSorting.type.tickoffid === 'desc' ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold' : '',
                }
            }
        }),
            () => this.getList()
        )
    }

    componentDidMount() {
        this.getList();
    }

    searchAction = (e) => {
        e.preventDefault();
        let { tickoffid, reqinfo, ticketname, destination, origin, operatingfltnumber, operatingairline } = this.state.dataSearch;
        let { departuredate, requestdate, memberid } = this.state;

        tickoffid = tickoffid ? "%" + tickoffid + "%" : '';
        reqinfo = reqinfo ? "%" + reqinfo + "%" : '';
        ticketname = ticketname ? "%" + ticketname + "%" : '';
        destination = destination ? "%" + destination + "%" : '';
        origin = origin ? "%" + origin + "%" : '';
        operatingfltnumber = operatingfltnumber ? "%" + operatingfltnumber + "%" : '';
        operatingairline = operatingairline ? "%" + operatingairline + "%" : '';
        departuredate = departuredate ? moment(departuredate).format('YYYY-MM-DD') : null;
        requestdate = requestdate ? moment(requestdate).format('YYYY-MM-DD') : null;

        this.setState(
            {
                criteria: {
                    memberid,
                    tickoffid,
                    reqinfo,
                    ticketname,
                    destination,
                    origin,
                    operatingfltnumber,
                    operatingairline,
                    departuredate,
                    requestdate
                },
                totalrecord: 0,
                paging: {
                    page: 1,
                    limit: 10
                },
                isLoaded: false
            },
            () => this.getList()
        );
    }

    getList() {
        const { paging, criteria, sort } = this.state;
        let url = api.url.retroclaim.list;
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

    editData(id, targetpage) {
        this.props.updatePage({
            displayactivitypage: targetpage,
            activityid: id
        });
    }

    changeSearchType = () => {
        this.setState(prevState => ({
            advancedSearch: (prevState.advancedSearch) ? false : true,
            dataSearch: {},
            departuredate: null,
            requestdate: null
        }))
    }

    handleInputChange(e) {
        let dataSearch = this.state.dataSearch;
        dataSearch[e.target.name] = e.target.value;
        this.setState({ dataSearch });
    }

    handleDepartureDateChange = (event) => {
        let departuredate = event === null ? null : event;
        this.setState({ departuredate });
    }

    handleRequestDateChange = (event) => {
        let requestdate = event === null ? null : event;
        this.setState({ requestdate });
    }

    render() {
        const { dataList, isLoaded, paging, totalrecord, requestdate, departuredate } = this.state;
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
                            <td>{moment(val.requestdate).format('DD/MM/YYYY')}</td>
                            <td>{moment(val.departuredate).format('DD/MM/YYYY')}</td>
                            <td>{val.operatingairline}</td>
                            <td>{val.operatingfltnumber}</td>
                            <td>{val.origin} - {val.destination}</td>
                            <td>{val.ticketname}</td>
                            <td>{val.reqinfo}</td>
                            <td>{val.tickoffid}</td>
                            <td className="action-table inline two-btn">
                                <button type="button" title="View" className="btn btn-outline-dark btn-sm" onClick={() => this.editData(val.retroclaimid, 'retroclaimform')}><i className="mdi mdi-file"></i> View</button>
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
                <div className="member-section">
                    <div className="content-title flex-hr mb-0 title-description">
                        <h1 className="title-has-control mt-0">Retro Claim</h1>
                    </div>
                    <div className="top-filter d-block p-3">
                        <div className="row pt-2">
                            <div className="col-md-12">
                                <form className="collapse multi-collapse show pb-2" id="generalSearch">
                                    <div className="row">
                                        <div className="col-md-2 pt-1 pb-1">
                                            <Datepicker className="form-control" selected={requestdate} onChange={this.handleRequestDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Request Date" />
                                        </div>
                                        <div className="col-sm-2 pt-1 pb-1">
                                            <Datepicker className="form-control" selected={departuredate} onChange={this.handleDepartureDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Departure Date" />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <input type="text" ref="operatingairline" name="operatingairline" className="form-control" placeholder="Airline" title="Airline" maxLength="50" onChange={this.handleInputChange} />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <input type="text" ref="origin" name="origin" className="form-control" placeholder="Origin" title="Origin" maxLength="50" onChange={this.handleInputChange} />
                                        </div>
                                        <div className="col-md-2 pt-1 pb-1">
                                            <input type="text" ref="destination" name="destination" className="form-control" placeholder="Destination" title="Destination" maxLength="50" onChange={this.handleInputChange} />
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
                                                        <label className="col-sm-4 col-form-label" htmlFor="requestdate-view">Request Date  </label>
                                                        <div className="col-sm-7">
                                                            <Datepicker className="form-control" selected={requestdate} onChange={this.handleRequestDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Request Date" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="departuredate-view">Departure Date  </label>
                                                        <div className="col-sm-7">
                                                            <Datepicker className="form-control" selected={departuredate} onChange={this.handleDepartureDateChange} dateFormat={"DD/MM/YYYY"} placeholderText="Departure Date" />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="operatingairline-view">Airline  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="operatingairline" name="operatingairline" className="form-control" placeholder="Airline" title="Airline" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="operatingfltnumber-view">Flight Number  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="operatingfltnumber" name="operatingfltnumber" className="form-control" placeholder="Flight Number" title="Flight Number" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="origin-view">Origin  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="origin" name="origin" className="form-control" placeholder="Origin" title="Origin" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-sm-6">
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="destination-view">Destination  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="destination" name="destination" className="form-control" placeholder="Destination" title="Destination" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="ticketname-view">Name on Ticket  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="ticketname" name="ticketname" className="form-control" placeholder="Name on Ticket" title="Name on Ticket" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="reqinfo-view">Retro Info  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="reqinfo" name="reqinfo" className="form-control" placeholder="Retro Info" title="Retro Info" maxLength="50" onChange={this.handleInputChange} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-sm-4 col-form-label" htmlFor="tickoffid-view">Ticket Office  </label>
                                                        <div className="col-sm-7">
                                                            <input type="text" ref="tickoffid" name="tickoffid" className="form-control" placeholder="Ticket Office" title="Ticket Office" maxLength="50" onChange={this.handleInputChange} />
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
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'requestdate', this.state.setSorting.type.requestdate); }}>Request Date <i className={"mdi " + this.state.setSorting.icon.requestdate} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'departuredate', this.state.setSorting.type.departuredate); }}>Departure Date <i className={"mdi " + this.state.setSorting.icon.departuredate} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'operatingairline', this.state.setSorting.type.operatingairline); }}>Airline <i className={"mdi " + this.state.setSorting.icon.operatingairline} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'operatingfltnumber', this.state.setSorting.type.operatingfltnumber); }}>Flight Number <i className={"mdi " + this.state.setSorting.icon.operatingfltnumber} /> </a></th>
                                    <th>Route </th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'ticketname', this.state.setSorting.type.ticketname); }}>Name on Ticket <i className={"mdi " + this.state.setSorting.icon.ticketname} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'reqinfo', this.state.setSorting.type.reqinfo); }}>Retro Info <i className={"mdi " + this.state.setSorting.icon.reqinfo} /> </a></th>
                                    <th><a href="" onClick={e => { this.handleSorting(e, 'tickoffid', this.state.setSorting.type.tickoffid); }}>Ticket Office <i className={"mdi " + this.state.setSorting.icon.tickoffid} /> </a></th>
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
    }
}

export default Layout;